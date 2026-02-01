import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useGetCountriesQuery } from "@/api/countriesApi";
import type { Committer } from "@/types";
import { UserDialog } from "@/components/common";
import { Header } from "../components/common/Header";
import { CountryCard } from "@/components/common/CountryCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Search } from "lucide-react";

const COUNTRIES_PER_PAGE = 20;

const Home = () => {
  const { data: allCountries = [], isLoading } = useGetCountriesQuery();
  const [selectedUser, setSelectedUser] = useState<Committer | null>(null);
  const [visibleCount, setVisibleCount] = useState(COUNTRIES_PER_PAGE);
  const [search, setSearch] = useState("");

  const filteredCountries = useMemo(() => {
    if (!search.trim()) return allCountries;

    const query = search.toLowerCase().trim();
    return allCountries.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.slug.toLowerCase().includes(query),
    );
  }, [allCountries, search]);

  const visibleCountries = useMemo(() => {
    return filteredCountries.slice(0, visibleCount);
  }, [filteredCountries, visibleCount]);

  const hasMoreCountries = visibleCount < filteredCountries.length;

  const handleLoadMore = () => {
    if (!isLoading && hasMoreCountries) {
      setVisibleCount((prev) => prev + COUNTRIES_PER_PAGE);
    }
  };

  useInfiniteScroll({
    isLoading,
    hasMore: hasMoreCountries,
    onLoadMore: handleLoadMore,
    threshold: 200,
  });

  return (
    <div className="max-w-7xl mx-auto p-4">
      <Helmet>
        <title>GitHub Contributors by Country | Global Rankings</title>
        <meta
          name="description"
          content="Discover top GitHub contributors from countries worldwide. Explore rankings, stats, and connect with developers."
        />
      </Helmet>

      <div className="mb-[80px]">
        <Header />
      </div>

      <div className="mb-4">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(COUNTRIES_PER_PAGE);
            }}
            placeholder="Search countries..."
            className="w-full pl-12 pr-4 py-3 border rounded-2xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-300 dark:focus:border-blue-700 text-gray-800 dark:text-gray-200"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Clear
            </button>
          )}
        </div>
        {search && (
          <p className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
            Found {filteredCountries.length} countries
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {isLoading && visibleCountries.length === 0
          ? [...Array(12)].map((_, i) => (
              <div
                key={i}
                className="border rounded-2xl p-5 bg-white dark:bg-gray-900 animate-pulse"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-7 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div>
                      <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        <div>
                          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                      </div>
                      <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          : visibleCountries.map((country) => (
              <CountryCard
                key={country.slug}
                country={country}
                onUserClick={setSelectedUser}
              />
            ))}
      </div>

      {!isLoading && search && filteredCountries.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
            No countries found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try a different search term
          </p>
          <button
            onClick={() => setSearch("")}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Clear search
          </button>
        </div>
      )}

      {hasMoreCountries && (
        <div className="flex flex-col items-center my-8">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Loading more countries...
          </p>
        </div>
      )}

      {selectedUser && (
        <UserDialog
          user={selectedUser}
          open={true}
          onOpenChange={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default Home;
