import { Link } from "react-router-dom";
import AnimWrapper from "../Transition";

const doings = [
    { path: "/doings/nucleaze-intro", title: "03.01.2026 - Nucleaze: Sequence Filtration in Rust" },
];

function Section({ title, links }) {
    return (
        <section className="mb-10">
            <p className="font-mono font-bold text-2xl mb-4 text-gray-900 dark:text-white">{title}</p>
            {links.length > 0 ? (
                <ul className="space-y-2 translate-x-5">
                    {links.map(({ path, title }) => (
                        <li key={path}>
                            <Link
                                to={path}
                                className="text-[19px] font-light hover:text-sky-500 dark:hover:text-sky-400 transition duration-300"
                            >
                                {title}
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-[21px] font-light text-gray-400 dark:text-gray-500">Coming soon.</p>
            )}
        </section>
    );
}

function Blog() {
    return (
        <AnimWrapper>
            <div className="max-w-2xl mx-auto px-8 pb-10 font-mono text-gray-900 dark:text-gray-100">
                <Section title="Bioinformatics" links={doings} />
            </div>
        </AnimWrapper>
    );
}

export default Blog;
