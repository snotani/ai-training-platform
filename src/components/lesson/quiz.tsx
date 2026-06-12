"use client";

import * as React from "react";
import {
  CheckCircle2Icon,
  CheckIcon,
  HelpCircleIcon,
  RotateCcwIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { quizzes, type QuizQuestion } from "@/content/quizzes";
import { useLessonContext } from "@/components/lesson/lesson-context";
import { isQuizPassed, useLessonCompletion } from "@/lib/progress/use-lesson-completion";

const LETTERS = ["A", "B", "C", "D", "E"];

function ScoreRing({
  score,
  total,
  passed,
}: {
  score: number;
  total: number;
  passed: boolean;
}) {
  const pct = total ? score / total : 0;
  const r = 26;
  const c = 2 * Math.PI * r;
  const dash = c * pct;
  return (
    <div className="relative size-16 shrink-0">
      <svg viewBox="0 0 64 64" className="size-16 -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" className="stroke-black/10 dark:stroke-white/10" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          className={cn(
            "transition-[stroke-dasharray] duration-700 ease-out",
            passed ? "stroke-emerald-500" : "stroke-amber-500",
          )}
        />
      </svg>
      <span className="font-heading absolute inset-0 flex items-center justify-center text-sm font-bold tabular-nums">
        {Math.round(pct * 100)}%
      </span>
    </div>
  );
}

export function Quiz({
  lessonId,
  questions: questionsProp,
  hideHeader = false,
  bare = false,
}: {
  lessonId?: string;
  questions?: QuizQuestion[];
  hideHeader?: boolean;
  bare?: boolean;
}) {
  const questions = questionsProp ?? (lessonId ? quizzes[lessonId] : undefined) ?? [];
  const ctx = useLessonContext();
  const targetLessonId = lessonId ?? ctx?.lessonId ?? "";
  const { complete } = useLessonCompletion(targetLessonId);
  const [answers, setAnswers] = React.useState<Record<number, number>>({});
  const [checked, setChecked] = React.useState(false);
  const topRef = React.useRef<HTMLDivElement>(null);

  if (questions.length === 0) return null;

  const score = questions.reduce(
    (sum, q, i) => sum + (answers[i] === q.answer ? 1 : 0),
    0,
  );
  const answeredCount = questions.filter((_, i) => answers[i] !== undefined).length;
  const allAnswered = answeredCount === questions.length;
  const perfect = score === questions.length;
  const passed = isQuizPassed(score, questions.length);

  function check() {
    setChecked(true);
    ctx?.reportQuiz(score, questions.length);
    if (targetLessonId && isQuizPassed(score, questions.length)) {
      void complete({ score, total: questions.length });
    }
    requestAnimationFrame(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  function reset() {
    setAnswers({});
    setChecked(false);
    requestAnimationFrame(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  return (
    <section
      id="quiz"
      className={cn(
        "not-prose scroll-mt-24",
        !bare && "my-8 rounded-2xl border bg-card p-5 sm:p-6",
      )}
    >
      <div ref={topRef} />

      {!hideHeader && (
        <div className="mb-5 flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <HelpCircleIcon className="size-4" />
          </span>
          <h3 className="font-heading text-lg font-semibold">Check your understanding</h3>
        </div>
      )}

      {/* Top status: progress while answering, score when checked */}
      {checked ? (
        <div
          className={cn(
            "animate-in-fade mb-6 flex items-center gap-4 rounded-2xl border p-4",
            passed
              ? "border-emerald-500/30 bg-emerald-500/[0.08]"
              : "border-amber-500/30 bg-amber-500/[0.08]",
          )}
        >
          <ScoreRing score={score} total={questions.length} passed={passed} />
          <div className="min-w-0 flex-1">
            <p className="font-heading flex items-center gap-1.5 text-base font-semibold">
              {perfect ? (
                <>
                  <SparklesIcon className="size-4 text-amber-500" /> Flawless!
                </>
              ) : passed ? (
                "Passed!"
              ) : (
                "Almost there"
              )}
              <span className="text-muted-foreground font-normal">
                &middot; {score}/{questions.length}
              </span>
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {passed
                ? "Lesson marked complete - progress saved."
                : "Review the explanations below, then retry."}
            </p>
          </div>
          {passed && (
            <CheckCircle2Icon className="hidden size-5 shrink-0 text-emerald-500 sm:block" />
          )}
        </div>
      ) : (
        <div className="mb-6">
          <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {answeredCount} of {questions.length} answered
            </span>
            <span className="tabular-nums">
              {Math.round((answeredCount / questions.length) * 100)}%
            </span>
          </div>
          <Progress value={(answeredCount / questions.length) * 100} />
        </div>
      )}

      <ol className="space-y-6">
        {questions.map((q, qi) => {
          const selected = answers[qi];
          return (
            <li key={qi}>
              <div className="mb-3 flex items-start gap-2.5">
                <span className="font-heading flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                  {qi + 1}
                </span>
                <div className="flex-1">
                  <p className="text-[0.95rem] font-medium">{q.q}</p>
                  {q.application && (
                    <Badge variant="secondary" className="mt-1.5">
                      Application
                    </Badge>
                  )}
                </div>
              </div>

              <div className="ml-[2.125rem] grid gap-2">
                {q.options.map((opt, oi) => {
                  const isSelected = selected === oi;
                  const isCorrect = oi === q.answer;
                  const showCorrect = checked && isCorrect;
                  const showWrong = checked && isSelected && !isCorrect;
                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={checked}
                      onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-all",
                        !checked && "cursor-pointer hover:border-primary/40 hover:bg-muted/50",
                        !checked && isSelected && "border-primary bg-primary/5 ring-1 ring-primary/30",
                        !checked && !isSelected && "border-border",
                        showCorrect && "border-emerald-500/40 bg-emerald-500/10",
                        showWrong && "border-destructive/40 bg-destructive/10",
                        checked && !showCorrect && !showWrong && "border-border opacity-60",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-md border text-xs font-semibold transition-colors",
                          !checked && isSelected && "border-primary bg-primary text-primary-foreground",
                          showCorrect && "border-emerald-500 bg-emerald-500 text-white",
                          showWrong && "border-destructive bg-destructive text-white",
                          ((!checked && !isSelected) || (checked && !showCorrect && !showWrong)) &&
                            "border-border text-muted-foreground",
                        )}
                      >
                        {showCorrect ? (
                          <CheckIcon className="size-3.5" />
                        ) : showWrong ? (
                          <XIcon className="size-3.5" />
                        ) : (
                          LETTERS[oi]
                        )}
                      </span>
                      <span className="flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {checked && (
                <div
                  className={cn(
                    "animate-in-fade mt-2.5 ml-[2.125rem] rounded-lg border-l-2 px-3 py-2 text-xs",
                    answers[qi] === q.answer
                      ? "border-emerald-500/50 bg-emerald-500/[0.06]"
                      : "border-amber-500/50 bg-amber-500/[0.06]",
                  )}
                >
                  <span className="font-medium text-foreground/90">
                    {answers[qi] === q.answer ? "Correct. " : "Not quite. "}
                  </span>
                  <span className="text-muted-foreground">{q.why}</span>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-6 flex items-center justify-between gap-4 border-t pt-4">
        {checked ? (
          <>
            <p className="text-sm text-muted-foreground">
              {perfect
                ? "A perfect run - you've got this."
                : passed
                  ? "Nicely done."
                  : "Review the explanations and try again."}
            </p>
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcwIcon /> Retry
            </Button>
          </>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">
              {allAnswered ? "All set - ready to check." : `${questions.length - answeredCount} left to answer.`}
            </p>
            <Button size="sm" onClick={check} disabled={!allAnswered}>
              <CheckIcon /> Check answers
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
