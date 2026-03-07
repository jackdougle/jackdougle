import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs, vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const codeFont = { fontFamily: "'Source Code Pro', Consolas, monospace" };

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
      <p className="text-4xl font-bold font-mono text-gray-900 dark:text-white">{children}</p>
    ),
    h2: ({ children }) => (
      <p className="text-4xl font-bold font-mono text-gray-900 dark:text-white">{children}</p>
    ),
    h3: ({ children }) => (
      <p className="text-3xl font-bold font-mono text-gray-900 dark:text-white">{children}</p>
    ),
    h4: ({ children }) => (
      <p className="text-2xl font-mono text-gray-900 dark:text-white">{children}</p>
    ),
    h5: ({ children }) => (
      <p className="text-xl font-mono text-gray-900 dark:text-white">{children}</p>
    ),
    p: ({ children }) => <p className="font-light">{children}</p>,
    img: ({ src, alt }) => (
      <img src={src} alt={alt} className="w-[66%] rounded-2xl mx-auto block border-2" />
    ),
    pre: ({ children }) => (
      <pre className="w-full overflow-x-auto rounded bg-gray-50 dark:bg-gray-950 p-4 border-0">
        {children}
      </pre>
    ),
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      if (match) {
        return (
          <SyntaxHighlighter
            language={match[1]}
            style={isDark ? vscDarkPlus : vs}
            wrapLongLines={true}
            customStyle={{
              ...codeFont,
              fontSize: "16px",
              background: "transparent",
              padding: 0,
              margin: 0,
              border: "none",
            }}
            codeTagProps={{ style: codeFont }}
            PreTag="div"
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        );
      }
      // Inline code — no font size override, just styled background
      return (
        <code className="bg-gray-50 dark:bg-gray-950 rounded px-1 font-mono" {...props}>
          {children}
        </code>
      );
    },
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-sky-500 dark:text-sky-400 hover:text-sky-400 dark:hover:text-sky-300 transition duration-300"
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    ),
  };

  const imgEl = (src, side) => (
    <img
      src={src}
      alt=""
      className={`absolute bottom-0 ${side === "left" ? "right-0" : "left-0"} h-[400px] w-auto max-w-none object-contain pointer-events-none ${imageClass}`}
    />
  );

  return (
    <div className="flex min-h-[calc(100vh-8rem)] w-full">
      {/* Left column */}
      <div className="flex-1 relative">
        {leftImage && imgEl(leftImage, "left")}
      </div>

      {/* Center column — markdown text */}
      <div className="flex-shrink-0 w-[800px] px-[50px] pb-5 font-sans flex flex-col justify-center text-[20px] relative z-10 text-gray-900 dark:text-gray-100">
        <div className="flex flex-col space-y-4">
          <ReactMarkdown components={mdComponents}>{content}</ReactMarkdown>
        </div>
      </div>

      {/* Right column */}
      <div className="flex-1 relative">
        {rightImage && imgEl(rightImage, "right")}
      </div>
    </div>
  );
}

export default PageLayout;
