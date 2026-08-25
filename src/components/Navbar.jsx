import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Moon, Sun } from "lucide-react";
import {
  DESKTOP_SCALE,
  useLayoutViewport,
} from "../hooks/useLayoutViewport.js";

function Navbar({ onHeightChange }) {
  const { isSm, isMd, isLg, browserZoom } = useLayoutViewport();
  const navRef = useRef(null);
  const desktopFactor = isLg ? DESKTOP_SCALE : 1;
  const cssZoom = desktopFactor / browserZoom;
  const widthVw = (browserZoom / desktopFactor) * 100;
  const navHeadingClass = `font-heading ${isMd ? "text-[24px] py-0" : "text-[18px] py-2"} text-gray-800 dark:text-gray-200 hover:scale-105 transition`;
  const iconClass = isSm ? "h-8 w-8" : "h-7 w-7";
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

  useLayoutEffect(() => {
    const el = navRef.current;
    if (!el || !onHeightChange) return;

    function report() {
      onHeightChange(el.getBoundingClientRect().height);
    }

    report();
    const observer = new ResizeObserver(report);
    observer.observe(el);
    window.addEventListener("resize", report);
    window.visualViewport?.addEventListener("resize", report);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", report);
      window.visualViewport?.removeEventListener("resize", report);
    };
  }, [onHeightChange, cssZoom, isSm, isMd, isLg]);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 z-[100] min-w-0 bg-white/60 dark:bg-black/50 backdrop-blur-sm border-b border-gray-200 dark:border-slate-900 ${isSm ? "mb-12" : "mb-6"}`}
      style={{ zoom: cssZoom, width: `${widthVw}vw` }}
    >
      <div className={`relative mx-auto w-full max-w-7xl ${isSm ? "px-8 py-3" : "px-4 py-1"}`}>
        <div className={`relative z-[3] flex w-full items-center justify-between min-w-0 ${isSm ? "gap-4" : "gap-2"}`}>
          <div className={`flex min-w-0 shrink-0 items-center ${isSm ? "gap-4" : "gap-2"}`}>
            <Link
              to="/"
              className={`font-heading font-bold leading-tight text-gray-900 transition hover:scale-[1.03] dark:text-white ${
                isMd
                  ? "text-[calc(1.875rem-2pt-1px)]"
                  : isSm
                    ? "text-[calc(1.5rem-2pt-1px)]"
                    : "text-[calc(1.25rem-2pt-1px)]"
              }`}
            >
              {isMd ? (
                <span>Jack Douglass</span>
              ) : (
                <span>Home</span>
              )}
            </Link>
            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="inline-flex shrink-0 items-center justify-center text-stone-800 transition hover:scale-110 active:scale-95 dark:text-stone-200"
            >
              {isDark ? (
                <Sun className={iconClass} aria-hidden="true" />
              ) : (
                <Moon className={iconClass} aria-hidden="true" />
              )}
            </button>
          </div>

          <div className={`flex items-center shrink-0 ${isLg ? "gap-8" : isSm ? "gap-6" : "gap-4"}`}>
            <Link to="/blog" className={navHeadingClass}>
              Blog
            </Link>
            <a
              href="https://github.com/jackdougle"
              aria-label="GitHub"
              className="inline-flex shrink-0 text-gray-800 dark:text-gray-200 hover:scale-[1.08] transition py-2"
              target="_blank"
              rel="noreferrer noopener"
            >
              <Github className={iconClass} aria-hidden="true" />
            </a>
            <a
              href="https://linkedin.com/in/jgdouglass"
              aria-label="LinkedIn"
              className="inline-flex shrink-0 text-gray-800 dark:text-gray-200 hover:scale-[1.08] transition py-2"
              target="_blank"
              rel="noreferrer noopener"
            >
              <Linkedin className={iconClass} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
