import { Github, Star } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="mt-auto w-full text-gray-700 dark:text-gray-300 py-6 border-t dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <section
          className="max-w-4xl mx-auto text-center mb-4"
          aria-labelledby="footer-analytics-title"
        >
          <h2
            id="footer-analytics-title"
            className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-4"
          >
            GitHub Contribution Analytics
          </h2>
          <p
            className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
            aria-label="Platform Description"
          >
            CommittersTop is an autonomous analytics engine tracking the global
            pulse of open-source development. By indexing public contribution
            data, we provide a transparent ranking of technical leadership
            across hundreds of regions. Data is synchronized every 120 hours.
          </p>
        </section>

        <div className="flex flex-col items-center gap-6 pt-2">
          <div className="flex flex-wrap justify-center items-center gap-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Support the project:
            </p>
            <a
              href="https://github.com/SuhrobKholmurodov/committerstop"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2 px-5 py-2 rounded-xl 
                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                 hover:bg-gray-100 dark:hover:bg-gray-700
                 transition-all duration-300 shadow-sm border dark:border-gray-700"
            >
              <Star
                size={16}
                className="text-yellow-500 group-hover:fill-yellow-500 transition-all"
              />
              <span className="text-sm font-semibold">Star on GitHub</span>
            </a>

            <a
              href="https://github.com/SuhrobKholmurodov/committerstop"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2 rounded-xl 
                 bg-gray-900 text-white dark:bg-blue-600
                 hover:opacity-90 transition-all shadow-md"
            >
              <Github size={16} />
              <span className="text-sm font-semibold">View Source</span>
            </a>
          </div>

          <div className="text-center space-y-2">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} CommittersTop. Engineered with
              precision by{" "}
              <a
                href="https://github.com/SuhrobKholmurodov"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                target="_blank"
                rel="noreferrer"
              >
                Suhrob Kholmurodov
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
