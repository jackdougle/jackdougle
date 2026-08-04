import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { resume } from "../constants/publicAssets";

const navHeadingClass =
  "font-heading text-[19px] md:text-[25px] text-gray-800 dark:text-gray-200 hover:scale-105 transition py-2 md:py-0";

function Navbar() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const [menuOpen, setMenuOpen] = useState(false);

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

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] min-w-0 bg-white/60 dark:bg-black/50 backdrop-blur-sm border-b border-gray-200 dark:border-slate-900 mb-6 sm:mb-12">
      <div className="relative mx-auto w-full max-w-7xl px-4 py-4 sm:px-8 sm:py-6">
        <div className="relative z-[3] flex w-full items-center justify-between gap-2 min-w-0">
          <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-4">
            <Link
              to="/"
              className="font-heading text-[calc(1.25rem-2pt)] font-bold leading-tight text-gray-900 transition hover:scale-[1.03] sm:text-[calc(1.5rem-2pt)] md:text-[calc(1.875rem-2pt)] dark:text-white"
              onClick={() => setMenuOpen(false)}
            >
              <span className="md:hidden">Home</span>
              <span className="hidden md:inline">Jack Douglass</span>
            </Link>
            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="inline-flex shrink-0 items-center justify-center font-serif leading-none text-stone-800 transition hover:scale-110 active:scale-95 dark:text-stone-200"
            >
              <span
                aria-hidden="true"
                className={
                  isDark
                    ? "inline-block -translate-x-0.5 translate-y-[0.3125rem] text-[2.2rem]"
                    : "inline-block translate-y-[0.1875rem] text-[3.094rem]"
                }
              >
                {isDark ? "☼" : "☽"}
              </span>
            </button>
          </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-900 hover:bg-gray-100 md:hidden dark:border-slate-800 dark:text-white dark:hover:bg-slate-900"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-panel"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? (
            <X className="h-6 w-6" aria-hidden />
          ) : (
            <Menu className="h-6 w-6" aria-hidden />
          )}
        </button>

        <div className="hidden md:flex md:items-center md:gap-6 lg:gap-8 shrink-0">
          <a
            href="https://jackdouglass.substack.com/"
            className={navHeadingClass}
            target="_blank"
            rel="noreferrer noopener"
          >
            Blog
          </a>
          <a
            href={resume}
            className={`${navHeadingClass} whitespace-nowrap`}
            target="_blank"
            rel="noreferrer noopener"
          >
            Resume
          </a>
          <a
            href="https://github.com/jackdougle"
            aria-label="GitHub"
            className="inline-flex shrink-0 text-gray-800 dark:text-gray-200 hover:scale-[1.08] transition py-2"
            target="_blank"
            rel="noreferrer noopener"
          >
            <svg className="h-7 w-7" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/jgdouglass"
            aria-label="LinkedIn"
            className="inline-flex shrink-0 text-gray-800 dark:text-gray-200 hover:scale-[1.08] transition py-2"
            target="_blank"
            rel="noreferrer noopener"
          >
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>
        </div>

        {menuOpen ? (
          <>
            <button
              type="button"
              className="fixed inset-0 z-[1] md:hidden bg-black/40 dark:bg-black/60"
              aria-label="Dismiss menu"
              onClick={() => setMenuOpen(false)}
            />
            <div
              id="mobile-nav-panel"
              className="absolute left-4 right-4 top-full z-[4] mt-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white p-5 shadow-xl dark:bg-black md:hidden"
            >
            <div className="flex flex-col gap-2">
              <a
                href="https://jackdouglass.substack.com/"
                className={navHeadingClass}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => setMenuOpen(false)}
              >
                Blog
              </a>
              <a
                href={resume}
                className={`${navHeadingClass} whitespace-nowrap`}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => setMenuOpen(false)}
              >
                Resume
              </a>
              <div className="flex items-center gap-6 border-t border-gray-100 pt-4 dark:border-slate-900">
                <a
                  href="https://github.com/jackdougle"
                  aria-label="GitHub"
                  className="inline-flex text-gray-800 dark:text-gray-200 hover:scale-[1.08] transition"
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg className="h-8 w-8" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com/in/jgdouglass"
                  aria-label="LinkedIn"
                  className="inline-flex text-gray-800 dark:text-gray-200 hover:scale-[1.08] transition"
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
            </div>
          </>
        ) : null}
      </div>
    </nav>
  );
}

export default Navbar;
