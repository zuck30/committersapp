import { Switcher } from "@/components/common";
import { CircleQuestionMark } from "lucide-react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

interface HeaderProps {
  countryName?: string;
}

export const Header = ({ countryName }: HeaderProps) => {
  const isHomePage = !countryName;

  return (
    <div
      id="header-section"
      className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b dark:border-gray-800 h-[72px] sm:h-[64px] flex items-center"
    >
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {isHomePage ? (
              <div className="flex items-center gap-1.5">
                <h1 className="text-[26px] font-bold sm:text-[16px] dark:text-gray-50 truncate">
                  Top GitHub Contributors Worldwide
                </h1>
                <Tippy
                  interactive={true}
                  content={
                    <span className="text-sm text-gray-300 max-w-xs">
                      Explore the most active GitHub contributors by country.
                      Click on any country to see detailed rankings.
                    </span>
                  }
                  placement="bottom"
                >
                  <div className="shrink-0 cursor-help">
                    <CircleQuestionMark className="mt-1 text-gray-600 dark:text-gray-300 w-5 h-5 sm:w-4 sm:h-4" />
                  </div>
                </Tippy>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <h1 className="text-[26px] font-bold sm:text-[18px] dark:text-gray-50 truncate">
                  Active GitHub Users in {countryName}
                </h1>
                <Tippy
                  interactive={true}
                  content={
                    <span className="text-sm text-gray-300 max-w-xs">
                      Showing the most active GitHub users in {countryName}. If
                      you're not in the list, set your location to '
                      {countryName}' in your GitHub profile. Rankings update
                      approximately every 5 days.
                    </span>
                  }
                  placement="bottom"
                >
                  <div className="shrink-0 cursor-help">
                    <CircleQuestionMark className="mt-1 text-gray-600 dark:text-gray-300 w-5 h-5 sm:w-4 sm:h-4" />
                  </div>
                </Tippy>
              </div>
            )}
          </div>

          <div className="shrink-0">
            <Switcher />
          </div>
        </div>
      </div>
    </div>
  );
};
