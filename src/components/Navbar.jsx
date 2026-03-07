import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";

function Navbar() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  function toggleDarkMode() {
    const root = document.documentElement;
    root.classList.toggle("dark");
    const nowDark = root.classList.contains("dark");
    setIsDark(nowDark);
    localStorage.setItem("theme", nowDark ? "dark" : "light");
  }

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  return (
    <nav className="w-full flex items-center justify-center py-6 px-8 border-b border-gray-200 dark:border-slate-900 mb-12 bg-white/60 dark:bg-black/50 backdrop-blur-sm fixed top-0 left-0 z-50">
      <div className="w-full sm:w-4/5 sm:max-w-7xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="font-mono text-3xl font-bold text-gray-900 dark:text-white hover:scale-103 transition"
          >
            <span className="md:hidden">Home</span>
            <span className="hidden md:inline">Jack Douglass</span>
          </Link>
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="inline-flex h-14 w-14 scale-110 items-center justify-center text-gray-700 dark:text-white hover:scale-120 transition active:scale-95"
          >
            {isDark ? (
              <Sun className="h-8 w-8" />
            ) : (
              <Moon className="h-8 w-8" />
            )}
          </button>
        </div>
        <div className="flex space-x-8">
          <Link
            to="/blog"
            className="font-mono text-2xl text-gray-800 dark:text-gray-200 hover:scale-105 transition"
          >
            Blog
          </Link>
          <Link
            to="https://drive.google.com/file/d/1PGkj8hirzJQR_tL8muBLxavG70eBoCBu/view?usp=sharing"
            className="font-mono text-2xl text-gray-800 dark:text-gray-200 hover:scale-108 transition"
          >
            CV
          </Link>
          <Link
            to="https://github.com/jackdougle"
            aria-label="GitHub"
            className="text-gray-800 dark:text-gray-200 hover:scale-108 transition"
          >
            <svg className="h-7 w-7" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </Link>
          <Link
            to="https://linkedin.com/in/jgdouglass"
            aria-label="LinkedIn"
            className="text-gray-800 dark:text-gray-200 hover:scale-108 transition"
          >
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
