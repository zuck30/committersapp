import { Github } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="mt-auto w-full text-gray-700 dark:text-gray-300 py-8 border-t dark:border-gray-800">
      <div className="container mx-auto px-4">
        <section
          className="max-w-3xl mx-auto text-center mb-4"
          aria-labelledby="footer-analytics-title"
        >
          <h2
            id="footer-analytics-title"
            className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3"
          >
            Global GitHub Analytics Platform
          </h2>
          <p
            className="text-[11px] leading-relaxed text-gray-400 dark:text-gray-500 italic"
            aria-label="Platform Description"
          >
            CommittersTop provides an automated ranking of developers based on
            GitHub contributions. We analyze commit frequency and open-source
            activity across various regions to highlight technical leadership.
            Rankings are refreshed every 5 days to ensure data accuracy.
          </p>
        </section>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm pt-2">
          <p>
            © {new Date().getFullYear()} CommittersTop. Built with ❤️ by{" "}
            <a
              href="https://github.com/SuhrobKholmurodov"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              target="_blank"
              rel="noreferrer"
            >
              Suhrob Kholmurodov
            </a>
          </p>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/SuhrobKholmurodov/committerstop"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-3 py-1 rounded-full 
                 bg-gradient-to-r from-blue-400 to-blue-600 text-white
                 hover:from-blue-500 hover:to-blue-700
                 duration-300 transform hover:scale-105 shadow-lg"
            >
              <Github size={18} className="animate-pulse" />
              <span className="font-medium">Source code</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
