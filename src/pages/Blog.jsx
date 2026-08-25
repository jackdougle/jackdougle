import { Link } from "react-router-dom";
import AnimWrapper from "../Transition";
import { posts, formatDate } from "../content/blog/index.js";

function Blog() {
    return (
        <AnimWrapper>
            <div className="max-w-2xl mx-auto px-8 font-serif text-gray-900 dark:text-gray-100">
                <ul className="space-y-2 translate-x-5">
                    {posts.map(({ slug, title, date }) => (
                        <li key={slug}>
                            <Link
                                to={`/blog/${slug}`}
                                className="text-[20px] font-light hover:text-sky-500 dark:hover:text-sky-400 transition duration-300"
                            >
                                {formatDate(date)} - {title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </AnimWrapper>
    );
}

export default Blog;
