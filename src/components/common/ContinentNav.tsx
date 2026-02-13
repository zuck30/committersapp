import { useState } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { ArrowUp, LayoutGrid, Check } from "lucide-react";

interface ContinentNavProps {
  isContinentSort: boolean;
  setIsContinentSort: (val: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  grouped: Record<string, any> | null;
  activeContinent: string;
  scrollToContinent: (id: string) => void;
}

const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      onChange(!checked);
    }}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
      checked ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
    }`}
  >
    <span
      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
        checked ? "translate-x-5" : "translate-x-1"
      }`}
    />
  </button>
);

export const ContinentNav = ({
  isContinentSort,
  setIsContinentSort,
  grouped,
  activeContinent,
  scrollToContinent,
}: ContinentNavProps) => {
  const [visible, setVisible] = useState(false);

  const handleToggle = (val: boolean) => {
    setIsContinentSort(val);
    if (!val) {
      setVisible(false);
    }
  };

  return (
    <>
      <div className="block sm:hidden fixed left-6 top-1/2 transform -translate-y-1/2 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-4 border dark:border-gray-800 rounded-3xl shadow-2xl w-44 xl:left-2 lg:w-40">
        <div className="flex items-center justify-between mb-4 pb-2 border-b dark:border-gray-800">
          <span className="text-[10px] font-black dark:text-white uppercase tracking-widest">
            Grouping
          </span>
          <Toggle checked={isContinentSort} onChange={handleToggle} />
        </div>

        {isContinentSort && grouped && (
          <div className="flex flex-col gap-1 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
            {Object.keys(grouped).map((cont) => (
              <button
                key={cont}
                onClick={() => scrollToContinent(cont)}
                className={`text-left text-[10px] uppercase font-bold p-2 rounded-lg transition-all ${
                  activeContinent === cont
                    ? "bg-blue-600 text-white shadow-lg translate-x-1"
                    : "text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                }`}
              >
                {cont}
              </button>
            ))}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="mt-2 pt-2 border-t dark:border-gray-700 flex items-center justify-center gap-1 text-[9px] font-black text-blue-400 hover:text-blue-600 uppercase"
            >
              <ArrowUp className="w-3 h-3" /> Top
            </button>
          </div>
        )}
      </div>

      <div className="hidden sm:flex items-center">
        <Tippy
          interactive={true}
          visible={visible}
          onClickOutside={() => setVisible(false)}
          theme="custom"
          offset={[0, 12]}
          placement="bottom-end"
          content={
            <div className="bg-white dark:bg-gray-900 p-2 rounded-2xl border border-gray-100 dark:border-gray-800 w-60 shadow-2xl">
              <div className="flex items-center justify-between p-3 mb-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    Group by Region
                  </span>
                  <span className="text-[9px] text-gray-500 dark:text-gray-400 font-medium">
                    Sort by continent
                  </span>
                </div>
                <Toggle checked={isContinentSort} onChange={handleToggle} />
              </div>

              {isContinentSort && grouped ? (
                <div className="flex flex-col gap-0.5 max-h-[45vh] overflow-y-auto custom-scrollbar p-1">
                  {Object.keys(grouped).map((cont) => (
                    <button
                      key={cont}
                      onClick={() => {
                        scrollToContinent(cont);
                        setVisible(false);
                      }}
                      className={`text-left text-[11px] uppercase font-bold p-3 rounded-xl flex items-center justify-between transition-colors ${
                        activeContinent === cont
                          ? "text-blue-600 bg-blue-50 dark:bg-blue-900/40"
                          : "text-gray-500 active:bg-gray-100 dark:active:bg-gray-800"
                      }`}
                    >
                      {cont}
                      {activeContinent === cont && (
                        <Check className="w-3 h-3 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-6 px-4 text-center">
                  <div className="inline-flex p-3 bg-gray-100 dark:bg-gray-800 rounded-full mb-2">
                    <LayoutGrid className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tight">
                    Grouping is Disabled
                  </p>
                  <p className="text-[9px] text-gray-400 mt-1 px-4 leading-relaxed">
                    Turn on the switch above to navigate between continents
                  </p>
                </div>
              )}
            </div>
          }
        >
          <button
            onClick={() => setVisible(!visible)}
            className={`relative p-3 rounded-2xl border transition-all active:scale-95 shadow-lg ${
              isContinentSort
                ? "bg-blue-600 text-white border-blue-500"
                : "bg-white dark:bg-gray-900 text-gray-600 border-gray-200 dark:border-gray-700"
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            {isContinentSort && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 border-2 border-white dark:border-gray-900"></span>
              </span>
            )}
          </button>
        </Tippy>
      </div>
    </>
  );
};
