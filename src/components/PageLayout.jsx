import Markdown from "./Markdown.jsx";

function PageLayout({ leftImage, rightImage, content, imageClass = "" }) {
  return (
    <div className="flex w-full flex-col lg:flex-row lg:items-stretch">
      {/* Left rail (Luffy): viewport-pinned to the bottom; the div only reserves
          the gutter that centers the 800px copy column. Offsets mirror that
          gutter so the art still hugs the inner edge toward the copy. */}
      <div className="hidden min-h-0 min-w-0 flex-1 lg:block">
        {leftImage ? (
          <img
            src={leftImage}
            alt=""
            className={`pointer-events-none fixed bottom-0 z-[1] right-[calc(50%+400px)] h-manga-rail w-auto max-w-[calc(50%-400px)] object-contain object-bottom ${imageClass}`}
          />
        ) : null}
      </div>

      <div className="relative z-10 flex w-full min-w-0 max-w-[800px] flex-col px-4 font-serif text-[18px] text-gray-900 sm:px-6 sm:text-[19px] md:px-10 md:text-[22px] lg:w-[800px] lg:flex-shrink-0 lg:px-[50px] lg:text-[23px] dark:text-gray-100">
        <div className="flex min-w-0 flex-col space-y-4">
          <Markdown>{content}</Markdown>
        </div>
      </div>

      {/* Right rail (Haise): viewport-pinned manga art. */}
      <div className="hidden min-h-0 min-w-0 flex-1 lg:block">
        {rightImage ? (
          <img
            src={rightImage}
            alt=""
            className={`pointer-events-none fixed bottom-0 z-[1] right-0 h-manga-rail w-auto max-w-[calc(50%-400px)] object-contain object-bottom ${imageClass}`}
          />
        ) : null}
      </div>
    </div>
  );
}

export default PageLayout;
