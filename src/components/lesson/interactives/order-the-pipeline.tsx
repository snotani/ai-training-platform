"use client";

import * as React from "react";
import { CheckIcon, RotateCcwIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { InteractiveShell } from "@/components/lesson/interactives/shell";
import { useLessonContext } from "@/components/lesson/lesson-context";

type Stage = {
  id: string;
  label: string;
  hint: string;
};

/** Correct chronological order of how a chat model is built. */
const STAGES: Stage[] = [
  { id: "text", label: "Internet-scale text", hint: "The raw reading material - most of the public web." },
  { id: "pretrain", label: "Pre-training", hint: "Predict the next token, over and over, no labels needed." },
  { id: "base", label: "Base model", hint: "Fluent but unfiltered - a know-it-all with no manners." },
  { id: "finetune", label: "Fine-tuning", hint: "Shown good question and answer examples to follow." },
  { id: "rlhf", label: "RLHF", hint: "Humans rank answers; it learns what people prefer." },
  { id: "assistant", label: "Helpful assistant", hint: "The polished chatbot you actually talk to." },
];

/** A fixed, deterministic shuffle so render stays hydration-safe. */
const SCRAMBLED_IDS = ["base", "text", "rlhf", "pretrain", "assistant", "finetune"];
const POOL: Stage[] = SCRAMBLED_IDS.map((id) => STAGES.find((s) => s.id === id)!);

export function OrderThePipeline() {
  const ctx = useLessonContext();
  const [placed, setPlaced] = React.useState<string[]>([]);
  const reportedRef = React.useRef(false);

  const remaining = POOL.filter((s) => !placed.includes(s.id));
  const allPlaced = placed.length === STAGES.length;

  function place(id: string) {
    if (placed.includes(id)) return;
    setPlaced((p) => [...p, id]);
  }

  function reset() {
    setPlaced([]);
  }

  React.useEffect(() => {
    if (allPlaced && !reportedRef.current) {
      reportedRef.current = true;
      ctx?.reportInteractive("order-the-pipeline");
    }
  }, [allPlaced, ctx]);

  const correctCount = placed.filter((id, i) => STAGES[i].id === id).length;
  const allCorrect = allPlaced && correctCount === STAGES.length;

  return (
    <InteractiveShell
      title="Order the training pipeline"
      subtitle="Tap the stages in the order a chatbot is actually built, from raw text to helpful assistant."
      complete={allPlaced}
    >
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Tap to add in order
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {remaining.length > 0 ? (
          remaining.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => place(s.id)}
              className="rounded-xl border border-dashed px-3 py-1.5 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-muted/50"
            >
              {s.label}
            </button>
          ))
        ) : (
          <span className="text-xs text-muted-foreground">All stages placed.</span>
        )}
      </div>

      <div className="mt-5 space-y-2">
        {placed.map((id, i) => {
          const stage = STAGES.find((s) => s.id === id)!;
          const isRight = STAGES[i].id === id;
          return (
            <div
              key={id}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3",
                allPlaced
                  ? isRight
                    ? "border-emerald-500/40 bg-emerald-500/[0.07]"
                    : "border-destructive/40 bg-destructive/[0.07]"
                  : "bg-muted/20",
              )}
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-brand-gradient text-xs font-semibold text-white">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium">{stage.label}</span>
                {allPlaced && (
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{stage.hint}</p>
                )}
              </div>
              {allPlaced &&
                (isRight ? (
                  <CheckIcon className="size-4 shrink-0 text-emerald-600" />
                ) : (
                  <XIcon className="size-4 shrink-0 text-destructive" />
                ))}
            </div>
          );
        })}
        {placed.length === 0 && (
          <p className="text-xs text-muted-foreground">Your order will build here.</p>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {allPlaced
            ? allCorrect
              ? "Perfect order - that's exactly how it's built."
              : `${correctCount}/${STAGES.length} in the right spot. Reset and retry?`
            : `${placed.length}/${STAGES.length} placed`}
        </p>
        {placed.length > 0 && (
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcwIcon /> Reset
          </Button>
        )}
      </div>
    </InteractiveShell>
  );
}
