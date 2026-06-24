"use client";

import * as React from "react";
import { ArrowRightIcon, CheckIcon, RotateCcwIcon, SparklesIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { InteractiveShell } from "@/components/lesson/interactives/shell";
import { useLessonContext } from "@/components/lesson/lesson-context";

type Candidate = { token: string; p: number };

type Round = {
  prompt: string;
  candidates: Candidate[];
};

/** Deterministic data - no randomness, so render stays hydration-safe. */
const ROUNDS: Round[] = [
  {
    prompt: "The capital of France is",
    candidates: [
      { token: "Paris", p: 0.92 },
      { token: "London", p: 0.04 },
      { token: "Rome", p: 0.03 },
      { token: "banana", p: 0.01 },
    ],
  },
  {
    prompt: "Once upon a",
    candidates: [
      { token: "time", p: 0.89 },
      { token: "dream", p: 0.06 },
      { token: "hill", p: 0.04 },
      { token: "planet", p: 0.01 },
    ],
  },
  {
    prompt: "Thanks so much for your",
    candidates: [
      { token: "help", p: 0.54 },
      { token: "time", p: 0.27 },
      { token: "support", p: 0.17 },
      { token: "elbow", p: 0.02 },
    ],
  },
];

function topToken(round: Round) {
  return round.candidates.reduce((a, b) => (b.p > a.p ? b : a));
}

export function PredictTheNextToken() {
  const ctx = useLessonContext();
  const [index, setIndex] = React.useState(0);
  const [picked, setPicked] = React.useState<string | null>(null);
  const [hits, setHits] = React.useState(0);
  const reportedRef = React.useRef(false);

  const round = ROUNDS[index];
  const revealed = picked !== null;
  const isLast = index === ROUNDS.length - 1;
  const top = topToken(round);
  const ranked = React.useMemo(
    () => round.candidates.slice().sort((a, b) => b.p - a.p),
    [round],
  );
  const gotIt = revealed && picked === top.token;
  const done = isLast && revealed;

  function pick(token: string) {
    if (revealed) return;
    setPicked(token);
    if (token === top.token) setHits((h) => h + 1);
  }

  function next() {
    if (isLast) {
      if (!reportedRef.current) {
        reportedRef.current = true;
        ctx?.reportInteractive("predict-the-next-token");
      }
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  }

  function reset() {
    setIndex(0);
    setPicked(null);
    setHits(0);
    reportedRef.current = false;
  }

  return (
    <InteractiveShell
      title="Predict the next token"
      subtitle="Guess what the model thinks comes next, then see how it actually ranks the options."
      complete={done}
    >
      <div className="rounded-xl bg-muted/40 px-4 py-5 text-center text-lg">
        <span className="text-foreground/90">{round.prompt}</span>{" "}
        <span
          className={cn(
            "font-mono font-semibold",
            revealed ? "text-primary" : "text-muted-foreground",
          )}
        >
          {revealed ? top.token : "___"}
        </span>
      </div>

      {!revealed && (
        <>
          <p className="mt-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Tap the token you&rsquo;d bet on
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {round.candidates.map((c) => (
              <button
                key={c.token}
                type="button"
                onClick={() => pick(c.token)}
                className="flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 font-mono text-sm font-medium transition-all hover:border-primary/40 hover:bg-muted/50"
              >
                {c.token}
              </button>
            ))}
          </div>
        </>
      )}

      {revealed && (
        <>
          <div className="mt-5 space-y-2">
            {ranked.map((c) => {
              const isTop = c.token === top.token;
              const isPicked = c.token === picked;
              return (
                <div key={c.token} className="flex items-center gap-3">
                  <span className="w-20 shrink-0 text-right font-mono text-xs text-muted-foreground">
                    {c.token}
                  </span>
                  <div className="relative h-5 flex-1 overflow-hidden rounded-md bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-md bg-brand-gradient transition-[width] duration-500",
                        isTop && "ring-2 ring-primary ring-offset-1 ring-offset-card",
                      )}
                      style={{ width: `${Math.max(c.p * 100, 1.5)}%` }}
                    />
                  </div>
                  <span className="flex w-14 shrink-0 items-center justify-end gap-1 text-right text-xs tabular-nums text-muted-foreground">
                    {isPicked && <CheckIcon className="size-3.5 text-primary" />}
                    {(c.p * 100).toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl border bg-muted/20 p-3.5">
            <p className="flex items-center gap-1.5 text-sm font-medium">
              {gotIt ? (
                <span className="text-emerald-700 dark:text-emerald-400">
                  Nice - that&rsquo;s the model&rsquo;s top pick too.
                </span>
              ) : (
                <span className="text-foreground">
                  The model would most likely say &ldquo;{top.token}.&rdquo;
                </span>
              )}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              It doesn&rsquo;t &ldquo;know&rdquo; the answer - it just scores every option and leans toward
              the likeliest one.
            </p>
          </div>
        </>
      )}

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {done ? (
            <span className="inline-flex items-center gap-1">
              <SparklesIcon className="size-3.5 text-primary" /> You matched the model {hits}/
              {ROUNDS.length} times.
            </span>
          ) : (
            `Prompt ${index + 1} of ${ROUNDS.length}`
          )}
        </p>
        <div className="flex items-center gap-2">
          {done && (
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcwIcon /> Replay
            </Button>
          )}
          {revealed && (
            <Button size="sm" onClick={next} variant={isLast ? "outline" : "default"} disabled={done}>
              {isLast ? "Done" : "Next prompt"}
              {!isLast && <ArrowRightIcon />}
            </Button>
          )}
        </div>
      </div>
    </InteractiveShell>
  );
}
