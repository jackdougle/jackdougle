import { Link, useParams } from "react-router-dom";
import AnimWrapper from "../Transition";
import Markdown from "../components/Markdown";
import { getPost } from "../content/blog/index.js";

const columnClass =
  "mx-auto w-full min-w-0 max-w-[960px] px-4 font-serif text-[18px] text-gray-900 sm:px-6 sm:text-[19px] md:px-10 md:text-[22px] lg:px-[50px] lg:text-[23px] dark:text-gray-100";

function BlogPost() {
  const { slug } = useParams();
  const post = getPost(slug);

  if (!post) {
    return (
      <AnimWrapper>
        <div className={columnClass}>
          <p className="font-heading text-[calc(1.5rem-2pt)] font-bold">Post not found.</p>
          <p className="mt-4 font-light">
            <Link to="/#blog" className="text-sky-600 transition duration-300 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200">
              Back to blog
            </Link>
          </p>
        </div>
      </AnimWrapper>
    );
  }

  return (
    <AnimWrapper>
      <article className={columnClass}>
        <header className="mb-8">
          <h1 className="font-blog-heading text-[calc(1.75rem+2pt-1px)] font-light leading-tight text-gray-900 md:text-[calc(2.25rem+2pt-1px)] dark:text-white">
            {post.title}
          </h1>
          {post.subtitle ? (
            <p className="mt-3 font-light text-black dark:text-white">{post.subtitle}</p>
          ) : null}
        </header>

        <div className="flex min-w-0 flex-col space-y-4">
          <Markdown>{post.content}</Markdown>
        </div>

        {post.substack ? (
          <>
            <hr className="mt-5 mb-4 border-gray-200 dark:border-slate-800" />

            <footer className="font-light italic text-gray-900 dark:text-gray-100">
              Available on{" "}
              <a
                href={post.substack}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sky-600 transition duration-300 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200"
              >
                Substack
              </a>
              .
            </footer>
          </>
        ) : null}
      </article>
    </AnimWrapper>
  );
}

export default BlogPost;
