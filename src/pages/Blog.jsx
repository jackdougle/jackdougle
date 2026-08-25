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
                                className="block overflow-hidden rounded-lg border border-gray-200 dark:border-slate-800"
                            >
                                <div className="aspect-[4/1] overflow-hidden">
                                    <img
                                        src={cover}
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="p-5">
                                    <p className="font-heading text-[20px] font-bold leading-snug">
                                        {title}
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="mt-1 shrink-0 font-light text-gray-500 dark:text-gray-400">
                                            {formatDate(date)}
                                        </p>
                                        {subtitle ? (
                                            <p className="mt-1 font-light text-black dark:text-white">
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
