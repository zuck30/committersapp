import { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useGetCountriesQuery } from "@/api/countriesApi";
import { useGetFlagsQuery } from "@/api/flagsApi";
import type { Committer } from "@/types";
import { UserDialog } from "@/components/common";
import { Header } from "../components/common/Header";
import { CountryCard } from "@/components/common/CountryCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Search, Globe, ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { ContinentNav } from "@/components/common/ContinentNav";

const COUNTRIES_PER_PAGE = 20;

type SortDirection = "asc" | "desc";

const Home = () => {
  const { data: allCountries = [], isLoading: isLoadingCountries } =
    useGetCountriesQuery();
  const { data: flagsData = [] } = useGetFlagsQuery();

  const [selectedUser, setSelectedUser] = useState<Committer | null>(null);
  const [visibleCount, setVisibleCount] = useState(COUNTRIES_PER_PAGE);
  const [search, setSearch] = useState("");
  const [isContinentSort, setIsContinentSort] = useState(false);
  const [activeContinent, setActiveContinent] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<SortDirection>("asc");

  const countryToContinent = useMemo(() => {
    const map: Record<string, string> = {};
    flagsData.forEach((item) => {
      if (item.name && item.continent) map[item.name] = item.continent;
    });
    return map;
  }, [flagsData]);

  const filteredCountries = useMemo(() => {
    let filtered = [...allCountries];

    if (search.trim()) {
      const query = search.toLowerCase().trim();
      filtered = filtered.filter(
        (country) =>
          country.name.toLowerCase().includes(query) ||
          country.slug.toLowerCase().includes(query),
      );
    }

    filtered.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (sortOrder === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    return filtered;
  }, [allCountries, search, sortOrder]);

  const grouped = useMemo(() => {
    if (!isContinentSort) return null;
    const groups: Record<string, typeof allCountries> = {};
    filteredCountries.forEach((c) => {
      const cont = countryToContinent[c.name] || "Other";
      if (!groups[cont]) groups[cont] = [];
      groups[cont].push(c);
    });

    return Object.keys(groups)
      .sort()
      .reduce(
        (acc, key) => {
          acc[key] = groups[key];
          return acc;
        },
        {} as Record<string, typeof allCountries>,
      );
  }, [filteredCountries, isContinentSort, countryToContinent]);

  const visibleCountries = useMemo(() => {
    return filteredCountries.slice(0, visibleCount);
  }, [filteredCountries, visibleCount]);

  const hasMoreCountries = visibleCount < filteredCountries.length;

  useInfiniteScroll({
    isLoading: isLoadingCountries,
    hasMore: hasMoreCountries && !isContinentSort,
    onLoadMore: () => setVisibleCount((prev) => prev + COUNTRIES_PER_PAGE),
    threshold: 200,
  });

  useEffect(() => {
    if (!isContinentSort || !grouped) return;
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveContinent(entry.target.id);
      });
    };
    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );
    Object.keys(grouped).forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isContinentSort, grouped, search]);

  const scrollToContinent = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setVisibleCount(COUNTRIES_PER_PAGE);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 relative min-h-screen">
      <Helmet>
        <title>GitHub Contributors by Country | Global Rankings</title>
      </Helmet>

      <div className="mb-[60px] sm:mb-[65px]">
        <Header />
      </div>

      <div className="mb-5 flex items-center justify-center gap-3 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(COUNTRIES_PER_PAGE);
            }}
            placeholder="Search countries..."
            className="w-full pl-12 pr-4 py-[10px] border rounded-2xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800 dark:text-gray-200 shadow-sm "
          />
        </div>

        <button
          onClick={toggleSort}
          className="flex items-center justify-center p-[10px] w-[46px] h-[46px] border rounded-2xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-95 shadow-sm text-gray-600 dark:text-gray-400"
        >
          {sortOrder === "asc" ? (
            <ArrowDownAZ className="w-5 h-5 text-blue-500" />
          ) : (
            <ArrowUpAZ className="w-5 h-5 text-blue-500" />
          )}
        </button>

        <ContinentNav
          isContinentSort={isContinentSort}
          setIsContinentSort={setIsContinentSort}
          grouped={grouped}
          activeContinent={activeContinent}
          scrollToContinent={scrollToContinent}
        />
      </div>

      <div className="grid grid-cols-3 gap-6 md:grid-cols-1 lg:grid-cols-2 sm:grid-cols-1 ">
        {isContinentSort && grouped ? (
          Object.entries(grouped).map(([continent, countries]) => (
            <div
              key={continent}
              id={continent}
              className="col-span-3 scroll-mt-[100px] animate-fade-in-up"
            >
              <div className="flex items-center gap-4 mb-8 mt-4">
                <div
                  className={`p-2.5 rounded-xl transition-colors ${
                    activeContinent === continent
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 dark:bg-blue-900/20 text-blue-500"
                  }`}
                >
                  <Globe className="w-4 h-4" />
                </div>
                <h2 className="text-2xl font-black dark:text-white uppercase tracking-tight sm:text-lg">
                  {continent}
                </h2>
                <div className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-800"></div>
                <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full border dark:border-gray-700 whitespace-nowrap">
                  {countries.length}{" "}
                  <span className="sm:hidden">countries</span>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-6 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
                {countries.map((c) => (
                  <CountryCard
                    key={c.slug}
                    country={c}
                    onUserClick={setSelectedUser}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 grid grid-cols-3 gap-6 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
            {visibleCountries.map((country) => (
              <CountryCard
                key={country.slug}
                country={country}
                onUserClick={setSelectedUser}
              />
            ))}
          </div>
        )}
      </div>

      {!isContinentSort && hasMoreCountries && (
        <div className="flex flex-col items-center my-12">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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
