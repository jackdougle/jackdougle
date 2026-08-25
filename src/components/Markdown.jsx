import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs, vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const imageBorderClass = "border-2 border-gray-500 rounded-sm";
const sidePhotoBorderClass = "border-2 border-black rounded-sm dark:border-gray-600";

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

function buildComponents(isDark) {
  return {
    h1: ({ children }) => (
      <p className="font-blog-heading text-[calc(1.875rem-2pt-1px)] text-gray-900 sm:text-[calc(2.25rem-2pt-1px)] md:text-[calc(3rem-2pt-1px)] dark:text-white">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <p className="font-blog-heading text-[calc(1.5rem-2pt-1px)] font-bold text-gray-900 sm:text-[calc(1.875rem-2pt-1px)] md:text-[calc(2.25rem-2pt-1px)] dark:text-white">
        {children}
      </p>
    ),
    h3: ({ children }) => (
      <p className="font-blog-heading text-[calc(1.25rem-2pt-1px)] font-bold text-gray-900 sm:text-[calc(1.5rem-2pt-1px)] md:text-[calc(1.875rem-2pt-1px)] dark:text-white">
        {children}
      </p>
    ),
    h4: ({ children }) => (
      <p className="font-blog-heading text-[calc(1.125rem-2pt-1px)] font-bold text-gray-900 sm:text-[calc(1.25rem-2pt-1px)] md:text-[calc(1.5rem-2pt-1px)] dark:text-white">
        {children}
      </p>
    ),
    h5: ({ children }) => (
      <p className="font-blog-heading text-[calc(1rem-2pt-1px)] text-gray-900 sm:text-[calc(1.125rem-2pt-1px)] md:text-[calc(21px-2pt-1px)] dark:text-white">
        {children}
      </p>
    ),
    p: ({ children }) => <p className="font-light">{children}</p>,
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
    hr: () => <hr className="my-8 border-gray-200 dark:border-slate-800" />,
    // remark-gfm renders footnote definitions inside <section class="footnotes">.
    section: ({ className, children, ...props }) =>
      className?.includes("footnotes") ? (
        <section
          className="mt-10 border-t border-gray-200 pt-6 text-[0.82em] leading-relaxed dark:border-slate-800"
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
        return (
          <div
            className={`group mx-auto w-[90%] overflow-hidden aspect-[3090/1249.28] ${sidePhotoBorderClass}`}
          >
            <img
              src={src}
              alt={alt ?? ""}
              className="h-full w-full object-cover object-bottom transition-[filter] duration-300 group-hover:grayscale"
            />
          </div>
        );
      }
      return (
        <img
          src={src}
          alt={alt ?? ""}
          className={`mx-auto block w-[90%] max-w-full ${imageBorderClass}`}
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

function Markdown({ children }) {
  const isDark = useDarkMode();
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={buildComponents(isDark)}>
      {children}
    </ReactMarkdown>
  );
}

export default Markdown;
