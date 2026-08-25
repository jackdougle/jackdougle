import { Link } from "react-router-dom";
import AnimWrapper from "../Transition";
import { posts, formatDate } from "../content/blog/index.js";

function Blog() {
    return (
        <AnimWrapper>
            <div className="max-w-2xl mx-auto w-full px-4 sm:px-8 font-serif text-gray-900 dark:text-gray-100">
                <ul className="space-y-8">
                    {posts.map(({ slug, title, subtitle, date, cover }) => (
                        <li key={slug}>
                            <Link
                                to={`/blog/${slug}`}
                                className="group block overflow-hidden rounded-lg border border-gray-200 transition duration-300 hover:border-gray-400 hover:shadow-lg dark:border-slate-800 dark:hover:border-slate-600"
                            >
                                <div className="aspect-[2/1] overflow-hidden">
                                    <img
                                        src={cover}
                                        alt=""
                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                                    />
                                </div>
                                <div className="p-5">
                                    <p className="mt-1 font-heading text-[20px] font-medium leading-snug transition duration-300 group-hover:text-sky-600 dark:group-hover:text-sky-300">
                                        {title}
                                    </p>
                                    <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                        <p className="shrink-0 font-light text-gray-500 dark:text-gray-400">
                                            {formatDate(date)}
                                        </p>
                                        {subtitle ? (
                                            <p className="font-light text-black dark:text-white">
                                                {subtitle}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </AnimWrapper>
    );
}

export default Blog;
