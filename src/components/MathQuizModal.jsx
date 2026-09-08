import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const TOTAL = 10;
const SECONDS = 5;
const PASS = 7;
const REDIRECT = "https://www.jack.equipment";

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeProblem() {
  const kind = randomInt(0, 2);
  if (kind === 0) {
    const a = randomInt(2, 20);
    const b = randomInt(2, 20);
    return { prompt: `${a} + ${b}`, answer: a + b };
  }
  if (kind === 1) {
    const a = randomInt(10, 40);
    const b = randomInt(2, a);
    return { prompt: `${a} − ${b}`, answer: a - b };
  }
  const a = randomInt(2, 12);
  const b = randomInt(2, 12);
  return { prompt: `${a} × ${b}`, answer: a * b };
}

function MathQuizBox({ onClose, className = "" }) {
  const problems = useMemo(() => Array.from({ length: TOTAL }, makeProblem), []);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const answeredRef = useRef(false);

  const finishQuiz = useCallback(
    (finalScore) => {
      if (finalScore >= PASS) {
        window.location.assign(REDIRECT);
      } else {
        onClose();
      }
    },
    [onClose],
  );

  const submitAnswer = useCallback(
    (raw) => {
      if (answeredRef.current) return;
      answeredRef.current = true;

      const parsed = raw === null || raw === "" ? null : Number(raw);
      const correct =
        parsed !== null && !Number.isNaN(parsed) && parsed === problems[index].answer;
      const nextScore = score + (correct ? 1 : 0);

      if (index >= TOTAL - 1) {
        finishQuiz(nextScore);
        return;
      }

      setScore(nextScore);
      setIndex((i) => i + 1);
    },
    [finishQuiz, index, problems, score],
  );

  useEffect(() => {
    answeredRef.current = false;
    setInput("");
    inputRef.current?.focus();

    const timeout = setTimeout(() => submitAnswer(null), SECONDS * 1000);
    return () => clearTimeout(timeout);
  }, [index, submitAnswer]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Math quiz"
      className={`flex items-center justify-center bg-white/90 font-serif text-gray-900 backdrop-blur-sm dark:bg-black/80 dark:text-gray-100 ${className}`}
    >
      <div className="w-full max-w-[280px] px-5 py-4 sm:px-6">
        <p className="mb-4 font-heading text-[calc(1.25rem-2pt-2px)] font-light tabular-nums text-gray-900 sm:text-[calc(1.5rem-2pt-2px)] dark:text-white">
          {problems[index].prompt} = ?
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitAnswer(input.trim());
          }}
        >
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9-]*"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full border-0 border-b border-gray-300 bg-transparent py-2 font-heading text-[calc(1.125rem-2pt-2px)] font-light tabular-nums text-gray-900 shadow-none outline-none ring-0 focus:border-gray-300 focus:outline-none focus:ring-0 dark:border-slate-700 dark:text-white dark:focus:border-slate-700"
            aria-label="Your answer"
          />
        </form>
      </div>
    </div>
  );
}

export default MathQuizBox;
