import { useState } from "react";
import MathQuizBox from "./MathQuizBox.jsx";
import PixelateHoverImage from "./PixelateHoverImage.jsx";

const imageBorderClass = "border-2 border-black rounded-sm dark:border-gray-600";
const contentImageWidthClass = "mx-auto block w-[90%]";
const frameClass = `${contentImageWidthClass} aspect-[3090/1249.28] ${imageBorderClass}`;

function SidePortrait({ src, alt }) {
  const [quizOpen, setQuizOpen] = useState(false);

  if (quizOpen) {
    return <MathQuizBox className={frameClass} onClose={() => setQuizOpen(false)} />;
  }

  return (
    <PixelateHoverImage
      src={src}
      alt={alt ?? ""}
      frameClass={`${frameClass} cursor-pointer`}
      imgClass="h-full w-full object-cover object-bottom"
      onClick={() => setQuizOpen(true)}
    />
  );
}

export default SidePortrait;
