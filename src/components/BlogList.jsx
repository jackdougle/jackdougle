import { Link } from "react-router-dom";
import { formatDate, posts } from "../content/blog/index.js";

function BlogList() {
  return (
    <section
      id="blog"
      aria-labelledby="blog-heading"
      className="mx-auto mt-7 w-full max-w-[800px] scroll-mt-28 px-4 font-heading text-gray-900 sm:px-6 md:px-10 lg:px-[50px] dark:text-gray-100"
    >
      <h2
        id="blog-heading"
        className="mb-3 text-[calc(1.875rem-4pt-2px)] font-medium sm:text-[calc(2.25rem-4pt-2px)]"
      >
        Blog
      </h2>
      <ul className="space-y-4">
        {posts.map(({ slug, title, date }) => (
          <li key={slug}>
            <Link
              to={`/blog/${slug}`}
              className="group flex flex-wrap items-baseline gap-x-3 gap-y-1"
            >
              <span className="shrink-0 font-heading text-[13px] font-light text-gray-500 dark:text-gray-400">
                {formatDate(date)}
              </span>
              <span className="font-blog-heading text-[18px] font-medium leading-snug transition duration-300 group-hover:text-sky-600 dark:group-hover:text-sky-300">
                {title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default BlogList;
