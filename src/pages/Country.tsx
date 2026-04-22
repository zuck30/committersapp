import { useState, useEffect, useMemo } from "react";
import type { Committer, Mode, SortOption } from "@/types";
import { Helmet } from "react-helmet-async";
import {
  ErrorMessage,
  LoadingSpinner,
  UserTable,
  FilterBar,
  Header,
} from "@/components/common";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useGetCountryUsersQuery } from "@/api";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { ArrowLeft, Search, SearchX, X } from "lucide-react";
import GoToTop from "@/components/common/GoToTop";

const PAGE_SIZE = 20;

const Country = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const mode = (searchParams.get("mode") as Mode) || "commits";
  const sortBy = (searchParams.get("sort") as SortOption) || "commits-desc";
  const searchQuery = searchParams.get("search") || "";

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [localData, setLocalData] = useState<Committer[]>([]);

  const { data, error, isFetching, refetch } = useGetCountryUsersQuery(
    slug ? { country: slug, mode } : skipToken,
    { refetchOnMountOrArgChange: true, refetchOnFocus: false },
  );

  useEffect(() => {
    if (data?.users) setLocalData(data.users);
    else if (!isFetching) setLocalData([]);
  }, [data, isFetching]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [mode, searchQuery, sortBy]);

  const sortedAndFilteredUsers = useMemo(() => {
    let users = [...localData];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      users = users.filter((u) => u.username.toLowerCase().includes(q));
    }
    users.sort((a, b) => {
      switch (sortBy) {
        case "alphabetical-asc":
          return a.username.localeCompare(b.username);
        case "alphabetical-desc":
          return b.username.localeCompare(a.username);
        case "commits-asc":
          return a.commits - b.commits;
        case "commits-desc":
        default:
          return b.commits - a.commits;
      }
    });
    return users;
  }, [localData, searchQuery, sortBy]);

  const visibleUsers = useMemo(
    () => sortedAndFilteredUsers.slice(0, visibleCount),
    [sortedAndFilteredUsers, visibleCount],
  );
  const hasMoreUsers = visibleCount < sortedAndFilteredUsers.length;

  useInfiniteScroll({
    isLoading: isFetching,
    hasMore: hasMoreUsers,
    onLoadMore: () => setVisibleCount((prev) => prev + PAGE_SIZE),
    threshold: 400,
  });

  const handleSearchChange = (val: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (val) newParams.set("search", val);
    else newParams.delete("search");
    setSearchParams(newParams);
  };

  const formattedCountryName =
    slug
      ?.split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ") || "";

  if (!slug)
    return (
      <ErrorMessage
        title="Invalid country"
        message="Country slug is missing."
      />
    );

  const titleText = `Top GitHub Committers in ${formattedCountryName} (${new Date().getFullYear()})`;
  const descriptionText = `Discover the most active GitHub users and top contributors in ${formattedCountryName}. Ranking based on public commits and contributions in ${mode} mode.`;
  const pageUrl = `https://committers.app/${slug}`;

  return (
    <div className="relative min-h-screen p-4 mx-auto max-w-7xl">
      <Helmet>
        <title>{titleText}</title>
        <meta name="description" content={descriptionText} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={titleText} />
        <meta property="og:description" content={descriptionText} />
        <meta property="og:url" content={pageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={titleText} />
        <meta name="twitter:description" content={descriptionText} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `Top GitHub Users in ${formattedCountryName}`,
            description: descriptionText,
            url: pageUrl,
            numberOfItems: sortedAndFilteredUsers.length,
          })}
        </script>
      </Helmet>

      <h1 className="sr-only">
        Top GitHub Users and Committers in {formattedCountryName}
      </h1>

      <div className="mb-[60px] sm:mb-[65px]">
        <Header countryName={formattedCountryName} />
      </div>

      <div className="flex flex-col max-w-2xl gap-3 mx-auto">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center justify-center w-[46px] h-[46px] border rounded-2xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="relative flex-1">
            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={`Search in ${formattedCountryName}...`}
              className="w-full pl-12 pr-12 py-[11px] border rounded-2xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800 dark:text-gray-200 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute text-gray-400 transition-colors transform -translate-y-1/2 right-4 top-1/2 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <FilterBar
          mode={mode}
          sortBy={sortBy}
          isFetching={isFetching}
          refetch={refetch}
        />
      </div>

      <div className="w-full">
        {isFetching && localData.length === 0 ? (
          <div className="flex flex-col items-center py-32">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <ErrorMessage title="Update Failed" message="Could not reach API." />
        ) : sortedAndFilteredUsers.length === 0 ? (
          <div className="py-24 text-center border-2 border-gray-200 border-dashed bg-gray-50 dark:bg-gray-900/50 rounded-3xl dark:border-gray-800">
            <SearchX className="w-20 h-20 mx-auto mb-6 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              No results found
            </h3>
          </div>
        ) : (
          <>
            <div className="duration-700 animate-in fade-in slide-in-from-bottom-4">
              <UserTable
                users={visibleUsers}
                countryName={formattedCountryName}
              />
            </div>
            <section className="max-w-2xl mx-auto mt-5 mb-8 text-center duration-1000 animate-in fade-in">
              <h2 className="mb-4 text-3xl font-bold dark:text-white">
                GitHub Leaders in {formattedCountryName}
              </h2>
              <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                Explore the official ranking of developers from{" "}
                <strong>{formattedCountryName}</strong> based on their GitHub
                activity. This list showcases the top{" "}
                {sortedAndFilteredUsers.length} committers, helping you find the
                most influential open-source contributors in the region.
              </p>
            </section>
          </>
        )}
      </div>
      <GoToTop />
    </div>
  );
};

export default Country;
