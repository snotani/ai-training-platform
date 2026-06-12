"use client";

import * as React from "react";
import {
  CheckCircle2Icon,
  CheckIcon,
  HelpCircleIcon,
  RotateCcwIcon,
  TrophyIcon,
  XIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { quizzes, type QuizQuestion } from "@/content/quizzes";
import { useLessonContext } from "@/components/lesson/lesson-context";
import { isQuizPassed, useLessonCompletion } from "@/lib/progress/use-lesson-completion";

const LETTERS = ["A", "B", "C", "D", "E"];

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

  if (questions.length === 0) return null;

  const score = questions.reduce(
    (sum, q, i) => sum + (answers[i] === q.answer ? 1 : 0),
    0,
  );
  const allAnswered = questions.every((_, i) => answers[i] !== undefined);
  const perfect = score === questions.length;
  const passed = isQuizPassed(score, questions.length);

  function check() {
    setChecked(true);
    ctx?.reportQuiz(score, questions.length);
    // Passing the quiz marks the lesson complete and tracks progress
    // (cached locally for guests, recorded server-side when signed in).
    if (targetLessonId && isQuizPassed(score, questions.length)) {
      void complete({ score, total: questions.length });
    }
  }

  function reset() {
    setAnswers({});
    setChecked(false);
  }

  return (
    <section
      id="quiz"
      className={cn(
        "not-prose scroll-mt-24",
        !bare && "my-8 rounded-2xl border bg-card p-5 sm:p-6",
      )}
    >
      {!hideHeader && (
        <div className="mb-5 flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <HelpCircleIcon className="size-4" />
          </span>
          <h3 className="font-heading text-lg font-semibold">Check your understanding</h3>
        </div>
      )}

      <ol className="space-y-6">
        {questions.map((q, qi) => {
          const selected = answers[qi];
          return (
            <li key={qi}>
              <div className="mb-3 flex items-start gap-2">
                <span className="font-heading text-sm font-semibold text-muted-foreground">
                  {qi + 1}.
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

              <div className="ml-5 grid gap-2">
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
                        !checked && "hover:border-primary/40 hover:bg-muted/50",
                        !checked && isSelected && "border-primary bg-primary/5 ring-1 ring-primary/30",
                        !checked && !isSelected && "border-border",
                        showCorrect && "border-emerald-500/40 bg-emerald-500/10",
                        showWrong && "border-destructive/40 bg-destructive/10",
                        checked && !showCorrect && !showWrong && "border-border opacity-60",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-md border text-xs font-semibold",
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
                <div className="animate-in-fade ml-5 mt-2.5 rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground/80">
                    {answers[qi] === q.answer ? "Correct. " : "Not quite. "}
                  </span>
                  {q.why}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {checked && passed && (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.08] px-3.5 py-2.5 text-sm font-medium text-emerald-700 dark:text-emerald-400">
          <CheckCircle2Icon className="size-4 shrink-0" />
          Lesson marked complete - progress saved.
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-4 border-t pt-4">
        {checked ? (
          <>
            <div className="flex items-center gap-2.5">
              {perfect && <TrophyIcon className="size-5 text-amber-500" />}
              <p className="text-sm">
                <span className="font-semibold">
                  {score}/{questions.length}
                </span>{" "}
                <span className="text-muted-foreground">
                  {perfect
                    ? "- flawless! "
                    : passed
                      ? "- passed, nicely done."
                      : "- review and try again."}
                </span>
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcwIcon /> Retry
            </Button>
          </>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">
              {allAnswered ? "Ready to check." : `Answer all ${questions.length} questions.`}
            </p>
            <Button size="sm" onClick={check} disabled={!allAnswered}>
              Check answers
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
