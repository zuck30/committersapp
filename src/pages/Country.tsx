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
import { ArrowLeft, Users, SearchX } from "lucide-react";

const PAGE_SIZE = 20;

const Country = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();

  const mode = (searchParams.get("mode") as Mode) || "commits";
  const sortBy = (searchParams.get("sort") as SortOption) || "commits-desc";
  const search = searchParams.get("search") || "";

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [localData, setLocalData] = useState<Committer[]>([]);

  const { data, error, isFetching, refetch } = useGetCountryUsersQuery(
    slug ? { country: slug, mode } : skipToken,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: false,
    },
  );

  useEffect(() => {
    if (data?.users) {
      setLocalData(data.users);
    } else if (!isFetching) {
      setLocalData([]);
    }
  }, [data, isFetching]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [mode, search, sortBy]);

  const sortedAndFilteredUsers = useMemo(() => {
    let users = [...localData];

    if (search.trim()) {
      const query = search.toLowerCase();
      users = users.filter((u) => u.username.toLowerCase().includes(query));
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
  }, [localData, search, sortBy]);

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

  if (!slug) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <ErrorMessage
          title="Invalid country"
          message="Country slug is missing."
        />
      </div>
    );
  }

  const formattedCountryName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="max-w-7xl mx-auto min-h-screen pb-20">
      <Helmet>
        <title>Top GitHub Users in {formattedCountryName}</title>
      </Helmet>

      <Header countryName={formattedCountryName} />

      <div className="pt-20 px-4">
        <div className="mb-6 sm:mb-5 flex items-center justify-between gap-2">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 px-3 py-1.5 sm:px-2 sm:py-1 
      text-sm sm:text-[11px] font-semibold
      text-gray-600 dark:text-gray-400 
      hover:text-blue-600 dark:hover:text-blue-400 
      bg-white dark:bg-gray-900 
      hover:bg-blue-50 dark:hover:bg-blue-900/20 
      border border-gray-200 dark:border-gray-800 
      hover:border-blue-200 dark:hover:border-blue-800/50
      rounded-xl sm:rounded-lg shadow-sm transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 sm:w-3 sm:h-3 transition-transform group-hover:-translate-x-1" />
            <span>Back to Rankings</span>
          </Link>

          {data?.generatedAt && (
            <div
              className="px-3 py-1.5 sm:px-2 sm:py-1 bg-gray-100/50 dark:bg-gray-800/40 
      rounded-full border border-gray-200 dark:border-gray-800 shadow-sm"
            >
              <p className="text-[10px] sm:text-[9px] uppercase tracking-widest flex items-center justify-center font-bold text-gray-500 dark:text-gray-500">
                <span className="sm:hidden">Last updated:</span>
                <span className="hidden sm:inline">Updated:</span>
                <span className="text-gray-900 dark:text-gray-200 ml-1 font-mono">
                  {data.generatedAt.split(" ")[0]}
                </span>
              </p>
            </div>
          )}
        </div>

        <FilterBar
          mode={mode}
          refetch={refetch}
          sortBy={sortBy}
          isFetching={isFetching}
        />

        {isFetching && localData.length === 0 ? (
          <div className="py-32 flex flex-col items-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-500 animate-pulse">
              Fetching contributors...
            </p>
          </div>
        ) : error ? (
          <ErrorMessage
            title="Update Failed"
            message="We couldn't reach the API. Please check your internet."
            className="mt-10"
          />
        ) : sortedAndFilteredUsers.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
            <div className="w-20 h-20 mx-auto mb-6 text-gray-300 dark:text-gray-700">
              {search ? (
                <SearchX className="w-full h-full" />
              ) : (
                <Users className="w-full h-full" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {search
                ? `No results for "${search}"`
                : `No users found in ${formattedCountryName}`}
            </h3>
            <p className="text-gray-500">
              {search
                ? "Try checking for typos or use a different keyword."
                : "GitHub location data for this country is currently empty."}
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <UserTable users={visibleUsers} />

            {hasMoreUsers && (
              <div className="flex justify-center mt-12 mb-8">
                {isFetching ? (
                  <div className="flex items-center gap-3 text-blue-600 font-medium">
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Loading more...
                  </div>
                ) : (
                  <div className="h-4 w-full bg-transparent" />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Country;
