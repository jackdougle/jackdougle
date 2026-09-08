import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const TOTAL = 10;
const SECONDS = 5;
const REDIRECT = "https://www.jack.equipment";

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeProblem() {
  const kind = randomInt(0, 2);
  if (kind === 0) {
    const a = randomInt(8, 35);
    const b = randomInt(8, 35);
    return { prompt: `${a} + ${b}`, answer: a + b };
  }
  if (kind === 1) {
    const a = randomInt(20, 55);
    const b = randomInt(5, a);
    return { prompt: `${a} − ${b}`, answer: a - b };
  }
  const a = randomInt(3, 14);
  const b = randomInt(3, 14);
  return { prompt: `${a} × ${b}`, answer: a * b };
}

function MathQuizBox({ onClose, className = "" }) {
  const problems = useMemo(() => Array.from({ length: TOTAL }, makeProblem), []);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(SECONDS);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const inputRef = useRef(null);
  const answeredRef = useRef(false);

  const submitAnswer = useCallback(
    (raw) => {
      if (answeredRef.current) return;
      answeredRef.current = true;

      const parsed = raw === null || raw === "" ? null : Number(raw);
      const correct =
        parsed !== null && !Number.isNaN(parsed) && parsed === problems[index].answer;

      if (!correct) {
        onClose();
        return;
      }

      if (index >= TOTAL - 1) {
        window.location.assign(REDIRECT);
        return;
      }

      setIndex((i) => i + 1);
    },
    [index, onClose, problems],
  );

  useEffect(() => {
    answeredRef.current = false;
    setInput("");
    inputRef.current?.focus();
    if (index > 0) setTimerEnabled(true);
  }, [index]);

  useEffect(() => {
    if (!timerEnabled) return;

    setSecondsLeft(SECONDS);

    const deadline = Date.now() + SECONDS * 1000;
    const tick = setInterval(() => {
      const left = Math.max(0, (deadline - Date.now()) / 1000);
      setSecondsLeft(left);
      if (left <= 0) submitAnswer(null);
    }, 50);

    return () => clearInterval(tick);
  }, [index, timerEnabled, submitAnswer]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const displaySeconds = Math.ceil(secondsLeft);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Math quiz"
      className={`relative flex items-center justify-center bg-white/90 font-serif text-gray-900 backdrop-blur-sm dark:bg-black/80 dark:text-gray-100 ${className}`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 left-3 font-heading text-[0.82em] font-light text-gray-500 transition duration-300 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white sm:top-4 sm:left-4"
      >
        Esc
      </button>

      <div className="w-full max-w-[320px] px-5 py-4 sm:px-6">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <p className="font-heading text-[calc(1.5rem-2pt-2px)] font-light tabular-nums text-gray-900 sm:text-[calc(1.75rem-2pt-2px)] dark:text-white">
            {problems[index].prompt} = ?
          </p>
          {timerEnabled ? (
            <p
              className="shrink-0 font-heading text-[calc(1.5rem-2pt-2px)] font-light tabular-nums text-gray-500 sm:text-[calc(1.75rem-2pt-2px)] dark:text-gray-400"
              aria-live="polite"
            >
              {displaySeconds}s
            </p>
          ) : null}
        </div>

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
            onChange={(e) => {
              const value = e.target.value;
              setInput(value);
              if (!timerEnabled && value.length > 0) setTimerEnabled(true);
            }}
            className="w-full border-0 border-b border-gray-300 bg-transparent py-2 font-heading text-[1.42rem] font-light tabular-nums text-gray-500 shadow-none outline-none ring-0 focus:border-gray-300 focus:outline-none focus:ring-0 dark:border-slate-700 dark:text-gray-400 dark:focus:border-slate-700"
            aria-label="Your answer"
          />
        </form>
      </div>
    </div>
  );
}

export default MathQuizBox;
