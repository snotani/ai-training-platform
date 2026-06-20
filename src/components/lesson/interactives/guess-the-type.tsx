"use client";

import * as React from "react";
import { ArrowRightIcon, CheckIcon, RotateCcwIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { InteractiveShell } from "@/components/lesson/interactives/shell";
import { useLessonContext } from "@/components/lesson/lesson-context";

type Type = "ml" | "dl" | "gen";

type Card = {
  scenario: string;
  answer: Type;
  why: string;
};

const CARDS: Card[] = [
  {
    scenario: "Netflix lining up \u201CTop picks for you\u201D from what you watched",
    answer: "ml",
    why: "It learns patterns from a table of your viewing history and predicts what you\u2019ll like.",
  },
  {
    scenario: "Snapchat sticking dog ears on your face and tracking it as you move",
    answer: "dl",
    why: "Raw camera pixels in, \u201Cthat\u2019s a face, here are the eyes\u201D out - classic deep learning vision.",
  },
  {
    scenario: "ChatGPT writing your whole reply from a one-line prompt",
    answer: "gen",
    why: "It creates brand-new text that never existed before - generative AI.",
  },
  {
    scenario: "Spotify building your Discover Weekly playlist",
    answer: "ml",
    why: "It predicts songs you\u2019ll like from listening patterns - learning from data, not creating it.",
  },
];

const OPTIONS: { id: Type; label: string }[] = [
  { id: "ml", label: "Traditional ML" },
  { id: "dl", label: "Deep Learning" },
  { id: "gen", label: "Generative AI" },
];

export function GuessTheType() {
  const ctx = useLessonContext();
  const [index, setIndex] = React.useState(0);
  const [picked, setPicked] = React.useState<Type | null>(null);
  const [correct, setCorrect] = React.useState(0);
  const reportedRef = React.useRef(false);

  const card = CARDS[index];
  const revealed = picked !== null;
  const isLast = index === CARDS.length - 1;
  const gotIt = revealed && picked === card.answer;

  function pick(id: Type) {
    if (revealed) return;
    setPicked(id);
    if (id === card.answer) setCorrect((c) => c + 1);
  }

  function next() {
    if (isLast) {
      if (!reportedRef.current) {
        reportedRef.current = true;
        ctx?.reportInteractive("guess-the-type");
      }
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  }

  function reset() {
    setIndex(0);
    setPicked(null);
    setCorrect(0);
    reportedRef.current = false;
  }

  const done = isLast && revealed;

  return (
    <InteractiveShell
      title="Guess the type"
      subtitle="Tap the kind of AI you think is behind each everyday moment."
      complete={done}
    >
      <div className="rounded-xl bg-muted/40 px-4 py-5 text-center text-base font-medium leading-relaxed">
        {card.scenario}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {OPTIONS.map((o) => {
          const isAnswer = o.id === card.answer;
          const isPicked = picked === o.id;
          return (
            <button
              key={o.id}
              type="button"
              disabled={revealed}
              onClick={() => pick(o.id)}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all",
                !revealed && "hover:border-primary/40 hover:bg-muted/50",
                revealed && isAnswer && "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                revealed && isPicked && !isAnswer && "border-destructive/50 bg-destructive/10 text-destructive",
                revealed && !isAnswer && !isPicked && "opacity-60",
              )}
            >
              {revealed && isAnswer && <CheckIcon className="size-4" />}
              {revealed && isPicked && !isAnswer && <XIcon className="size-4" />}
              {o.label}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="mt-4 rounded-xl border bg-muted/20 p-3.5">
          <p className="flex items-center gap-1.5 text-sm font-medium">
            {gotIt ? (
              <span className="text-emerald-700 dark:text-emerald-400">Nailed it.</span>
            ) : (
              <span className="text-foreground">
                It&rsquo;s {OPTIONS.find((o) => o.id === card.answer)?.label}.
              </span>
            )}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{card.why}</p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {done ? `You got ${correct}/${CARDS.length}.` : `Card ${index + 1} of ${CARDS.length}`}
        </p>
        <div className="flex items-center gap-2">
          {done && (
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcwIcon /> Replay
            </Button>
          )}
          {revealed && (
            <Button size="sm" onClick={next} variant={isLast ? "outline" : "default"} disabled={done}>
              {isLast ? "Done" : "Next card"}
              {!isLast && <ArrowRightIcon />}
            </Button>
          )}
        </div>
      </div>
    </InteractiveShell>
  );
}
