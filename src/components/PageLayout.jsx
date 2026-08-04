import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs, vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const imageBorderClass = "border-2 border-gray-500 rounded-sm";

function useDarkMode() {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    const observer = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains("dark"))
    );
    observer.observe(document.documentElement, { attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

function PageLayout({ leftImage, rightImage, content, imageClass = "" }) {
  const isDark = useDarkMode();

  const mdComponents = {
    h1: ({ children }) => (
      <p className="font-heading text-[calc(1.875rem-2pt)] text-gray-900 sm:text-[calc(2.25rem-2pt)] md:text-[calc(3rem-2pt)] dark:text-white">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <p className="font-heading text-[calc(1.5rem-2pt)] font-bold text-gray-900 sm:text-[calc(1.875rem-2pt)] md:text-[calc(2.25rem-2pt)] dark:text-white">
        {children}
      </p>
    ),
    h3: ({ children }) => (
      <p className="font-heading text-[calc(1.25rem-2pt)] font-bold text-gray-900 sm:text-[calc(1.5rem-2pt)] md:text-[calc(1.875rem-2pt)] dark:text-white">
        {children}
      </p>
    ),
    h4: ({ children }) => (
      <p className="font-heading text-[calc(1.125rem-2pt)] font-bold text-gray-900 sm:text-[calc(1.25rem-2pt)] md:text-[calc(1.5rem-2pt)] dark:text-white">
        {children}
      </p>
    ),
    h5: ({ children }) => (
      <p className="font-heading text-[calc(1rem-2pt)] text-gray-900 sm:text-[calc(1.125rem-2pt)] md:text-[calc(21px-2pt)] dark:text-white">
        {children}
      </p>
    ),
    p: ({ children }) => <p className="font-light">{children}</p>,
    img: ({ src, alt }) => {
      const isSidePhoto = src?.includes("side.jpeg");
      if (isSidePhoto) {
        return (
          <div className={`group relative mx-auto w-full max-w-full overflow-hidden md:max-w-[90%] lg:max-w-[68%] aspect-[3090/1699.84] ${imageBorderClass}`}>
            <img
              src={src}
              alt={alt ?? ""}
              className="absolute bottom-0 left-0 w-full max-w-none h-auto transition-[filter] duration-300 group-hover:grayscale"
            />
          </div>
        );
      }
      return (
        <img
          src={src}
          alt={alt ?? ""}
          className={`mx-auto block w-full max-w-full md:max-w-[90%] lg:max-w-[68%] ${imageBorderClass}`}
        />
      );
    },
    pre: ({ children }) => (
      <pre className="w-full overflow-x-auto rounded border-0 bg-gray-50 p-4 font-mono text-[0.93em] leading-relaxed text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        {children}
      </pre>
    ),
    code({ inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      // Fenced / indented code blocks (not backtick inline)
      if (!inline && match) {
        return (
          <SyntaxHighlighter
            language={match[1]}
            style={isDark ? vscDarkPlus : vs}
            wrapLongLines={true}
            customStyle={{
              ...codeFont,
              fontSize: "inherit",
              lineHeight: "inherit",
              background: "transparent",
              padding: 0,
              margin: 0,
              border: "none",
            }}
            codeTagProps={{ style: { ...codeFont, fontSize: "inherit", lineHeight: "inherit" } }}
            PreTag="div"
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        );
      }
      if (!inline) {
        // Fence with no language tag — still monospace (highlighter only runs when language-* matches)
        return (
          <code
            className="block w-full whitespace-pre font-mono text-[0.93em] leading-relaxed [font-variant-ligatures:none]"
            style={codeFont}
            {...props}
          >
            {children}
          </code>
        );
      }
      // Inline `code` — match body size (column sets responsive text-[18px]…lg:text-[23px])
      return (
        <code
          className="rounded bg-gray-50 px-1 font-mono text-inherit leading-[inherit] dark:bg-gray-950"
          style={codeFont}
          {...props}
        >
          {children}
        </code>
      );
    },
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-sky-600 dark:text-sky-300 hover:text-sky-800 dark:hover:text-sky-200 transition duration-300"
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    ),
  };

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col lg:flex-row lg:items-stretch">
      {/* Left rail (Luffy): viewport-pinned to the bottom; the div only reserves
          the gutter that centers the 800px copy column. Offsets mirror that
          gutter so the art still hugs the inner edge toward the copy. */}
      <div className="hidden min-h-0 min-w-0 flex-1 lg:block">
        {leftImage ? (
          <img
            src={leftImage}
            alt=""
            className={`pointer-events-none fixed bottom-0 right-[calc(50%+400px)] h-manga-rail w-auto max-w-[calc(50%-400px)] object-contain object-bottom ${imageClass}`}
          />
        ) : null}
      </div>

      <div className="relative z-10 flex w-full min-w-0 max-w-[800px] flex-col justify-end px-4 pb-8 font-serif text-[18px] text-gray-900 sm:px-6 sm:pb-10 sm:text-[19px] md:px-10 md:text-[22px] lg:w-[800px] lg:flex-shrink-0 lg:px-[50px] lg:text-[23px] dark:text-gray-100">
        <div className="flex min-w-0 flex-col space-y-4">
          <ReactMarkdown components={mdComponents}>{content}</ReactMarkdown>
        </div>
      </div>

      {/* Right rail (Haise): same viewport pinning, flush to the right edge. */}
      <div className="hidden min-h-0 min-w-0 flex-1 lg:block">
        {rightImage ? (
          <img
            src={rightImage}
            alt=""
            className={`pointer-events-none fixed bottom-0 right-0 h-manga-rail w-auto max-w-[calc(50%-400px)] object-contain object-bottom ${imageClass}`}
          />
        ) : null}
      </div>
    </div>
  );
}

export default PageLayout;
