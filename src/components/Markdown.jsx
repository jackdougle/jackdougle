import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs, vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import SidePortrait from "./SidePortrait";

const imageBorderClass = "border-2 border-gray-500 rounded-sm";
const contentImageWidthClass = "mx-auto block w-[90%]";

const codeFont = {
  fontFamily: '"Source Code Pro", ui-monospace, SFMono-Regular, Menlo, monospace',
};

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

function buildComponents(isDark, { sectionHeadings = false } = {}) {
  const sectionFont = "font-heading";
  const pageSectionClass =
    `${sectionFont} mb-3 text-[calc(1.5rem-4pt-2px)] font-medium text-gray-900 sm:text-[calc(1.875rem-4pt-2px)] dark:text-white`;
  const h3Class = `${sectionFont} text-[calc(1.25rem-2pt-2px)] font-medium text-gray-900 sm:text-[calc(1.5rem-2pt-2px)] md:text-[calc(1.875rem-2pt-2px)] dark:text-white`;
  const blogH2SizeClass =
    `${sectionFont} text-[calc(1.5rem-2pt-2px)] text-gray-900 sm:text-[calc(1.875rem-2pt-2px)] md:text-[calc(2.25rem-2pt-2px)] dark:text-white`;
  const blogH2Class = `${blogH2SizeClass} font-medium`;

  return {
    h1: ({ children }) => (
      <p className={`${sectionFont} text-[calc(1.875rem-2pt-2px)] font-light text-gray-900 sm:text-[calc(2.25rem-2pt-2px)] md:text-[calc(3rem-2pt-2px)] dark:text-white`}>
        {children}
      </p>
    ),
    // remark-gfm emits its "Footnotes" label as an h2.
    h2: ({ children, id }) =>
      id === "footnote-label" ? (
        <p id={id} className={`${blogH2Class} mb-1`}>{children}</p>
      ) : sectionHeadings ? (
        <h2 className={pageSectionClass}>{children}</h2>
      ) : (
        <p className={blogH2Class}>{children}</p>
      ),
    h3: ({ children }) => <p className={h3Class}>{children}</p>,
    h4: ({ children }) => (
      <p className={`${sectionFont} text-[calc(1.125rem-2pt-2px)] font-medium text-gray-900 sm:text-[calc(1.25rem-2pt-2px)] md:text-[calc(1.5rem-2pt-2px)] dark:text-white`}>
        {children}
      </p>
    ),
    h5: ({ children }) => (
      <p className={`${sectionFont} text-[calc(1rem-2pt-2px)] font-light text-gray-900 sm:text-[calc(1.125rem-2pt-2px)] md:text-[calc(21px-2pt-2px)] dark:text-white`}>
        {children}
      </p>
    ),
    p: ({ children }) => (
      <p className="font-light [&>strong:only-child]:font-bold [&>strong:only-child]:text-gray-900 dark:[&>strong:only-child]:text-white">
        {children}
      </p>
    ),
    // These spread props so remark-gfm's footnote `id`s survive and ref links can jump.
    ul: ({ children, ...props }) => (
      <ul className="list-disc space-y-2 pl-6 font-light marker:text-gray-400 dark:marker:text-gray-500" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal space-y-2 pl-6 font-light marker:text-gray-400 dark:marker:text-gray-500" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="scroll-mt-32 [&>p]:inline [&>p+p]:mt-3 [&>p+p]:block" {...props}>
        {children}
      </li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-gray-300 pl-4 text-gray-700 dark:border-slate-700 dark:text-gray-300">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="mt-5 mb-4 border-gray-200 dark:border-slate-800" />,
    // remark-gfm renders footnote definitions inside <section class="footnotes">.
    section: ({ className, children, ...props }) =>
      className?.includes("footnotes") ? (
        <section
          className="mt-5 border-t border-gray-200 pt-4 font-light leading-relaxed dark:border-slate-800"
          {...props}
        >
          {children}
        </section>
      ) : (
        <section className={className} {...props}>{children}</section>
      ),
    sup: ({ children }) => <sup className="text-[0.75em]">{children}</sup>,
    img: ({ src, alt }) => {
      const isSidePhoto = src?.includes("side.jpeg");
      if (isSidePhoto) {
        return <SidePortrait src={src} alt={alt ?? ""} />;
      }
      return (
        <img
          src={src}
          alt={alt ?? ""}
          className={`${contentImageWidthClass} ${imageBorderClass}`}
        />
      );
    },
    pre: ({ children }) => (
      <pre className="w-full overflow-x-auto rounded border-0 bg-gray-50 p-4 font-mono text-[calc(0.93em-2px)] leading-relaxed text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        {children}
      </pre>
    ),
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const text = String(children).replace(/\n$/, "");
      // react-markdown v10 dropped `inline`; fenced blocks contain newlines.
      const isBlock = Boolean(match) || text.includes("\n");

      if (match) {
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
            {text}
          </SyntaxHighlighter>
        );
      }
      if (isBlock) {
        return (
          <code
            className="block w-full whitespace-pre font-mono text-[calc(0.93em-2px)] leading-relaxed [font-variant-ligatures:none]"
            style={codeFont}
            {...props}
          >
            {children}
          </code>
        );
      }
      return (
        <code className="inline-code" {...props}>
          {children}
        </code>
      );
    },
    a: ({ href, children, ...props }) => {
      // Footnote refs/backrefs are same-page hashes and must not open a new tab.
      const external = /^(https?:)?\/\//.test(href ?? "") || href?.startsWith("mailto:");
      return (
        <a
          href={href}
          className="scroll-mt-32 text-sky-600 dark:text-sky-300 hover:text-sky-800 dark:hover:text-sky-200 transition duration-300"
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
          {...props}
        >
          {children}
        </a>
      );
    },
  };
}

function Markdown({ children, sectionHeadings = false }) {
  const isDark = useDarkMode();
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={buildComponents(isDark, { sectionHeadings })}>
      {children}
    </ReactMarkdown>
  );
}

export default Markdown;
