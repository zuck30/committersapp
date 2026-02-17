import { useState, useEffect } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RefreshCw } from "lucide-react";
import { Toast } from "@/components/common";
import type { Mode, SortOption } from "@/types";
import { useSearchParams } from "react-router-dom";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

interface FilterBarProps {
  mode: Mode;
  sortBy: SortOption;
  isFetching: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetch: () => Promise<any>;
}

export const FilterBar = ({
  mode,
  refetch,
  sortBy,
  isFetching,
}: FilterBarProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const [inputValue, setInputValue] = useState(urlSearch);
  const [internalLoading, setInternalLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);
      if (inputValue.trim()) {
        newParams.set("search", inputValue.trim());
      } else {
        newParams.delete("search");
      }
      setSearchParams(newParams, { replace: true });
    }, 400);

    return () => clearTimeout(handler);
  }, [inputValue, setSearchParams, searchParams]);

  useEffect(() => {
    setInputValue(urlSearch);
  }, [urlSearch]);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === "commits" && key === "mode") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleRefetch = async () => {
    setInternalLoading(true);
    try {
      const result = await refetch();
      if (result.error) {
        Toast("error", "Failed to refresh data");
      } else {
        Toast("success", "Ranking updated");
      }
    } catch {
      Toast("error", "Update failed");
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <div className="sticky top-[60px] z-30 mb-8 p-2 backdrop-blur-xl bg-white/10 dark:bg-gray-950/10 border-[1px] border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
      <div className="flex sm:flex-col flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-1 w-full sm:w-auto">
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(val) => val && updateParam("mode", val)}
            className="flex p-1 bg-gray-200/50 gap-2 dark:bg-gray-900/90 rounded-xl w-full sm:w-auto"
          >
            {["commits", "contributions", "all"].map((v) => (
              <ToggleGroupItem
                key={v}
                value={v}
                className="flex-1 sm:flex-none px-8 sm:px-4 py-2 rounded-lg capitalize text-sm font-medium transition-all
                  hover:bg-white/80 dark:hover:bg-gray-800/80 hover:text-blue-600
                  data-[state=on]:bg-white dark:data-[state=on]:bg-gray-800 
                  data-[state=on]:text-blue-600 dark:data-[state=on]:text-blue-400 
                  data-[state=on]:shadow-sm data-[state=on]:hover:bg-white dark:data-[state=on]:hover:bg-gray-800"
              >
                {v}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <Tippy content="Refresh database" placement="top">
            <button
              onClick={handleRefetch}
              disabled={isFetching || internalLoading}
              className="p-3 rounded-xl bg-gray-200/50 dark:bg-gray-900/90 text-gray-500 hover:text-blue-600 
                disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
            >
              <RefreshCw
                className={`w-5 h-5 ${isFetching || internalLoading ? "animate-spin" : ""}`}
              />
            </button>
          </Tippy>
        </div>

        <div className="flex sm:flex-col flex-row items-center gap-3 w-full">
          <Select
            value={sortBy}
            onValueChange={(val) => updateParam("sort", val)}
          >
            <SelectTrigger className="w-full sm:w-full md:w-[180px] h-11 rounded-xl bg-gray-200/50 dark:bg-gray-900/90 border-none focus:ring-2 focus:ring-blue-500/20 text-gray-800 dark:text-gray-200">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="backdrop-blur-xl bg-white/90 dark:bg-gray-950/90 border-gray-200 dark:border-gray-800">
              <SelectItem value="commits-desc">Most Commits</SelectItem>
              <SelectItem value="commits-asc">Least Commits</SelectItem>
              <SelectItem value="alphabetical-asc">Name (A-Z)</SelectItem>
              <SelectItem value="alphabetical-desc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
