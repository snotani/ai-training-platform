"use client";

import * as React from "react";
import { ArrowRightIcon, CheckIcon, ShieldAlertIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { InteractiveShell } from "@/components/lesson/interactives/shell";
import { useLessonContext } from "@/components/lesson/lesson-context";

type Action = "pub" | "approved" | "never";

type Snippet = {
  text: string;
  sensitive: boolean;
  type: string;
  action: Action;
  consequence: string;
};

const SNIPPETS: Snippet[] = [
  {
    text: "Customer account #4471-2093, current balance $12,300.",
    sensitive: true,
    type: "Customer PII + financial data",
    action: "approved",
    consequence: "It identifies a person and a public tool could retain it. Redact or use the approved tool.",
  },
  {
    text: "\u201CIntroducing our fastest laptop yet - pre-order today!\u201D (published press release)",
    sensitive: false,
    type: "Public marketing copy",
    action: "pub",
    consequence: "Already public, so pasting it into any AI tool is low-risk.",
  },
  {
    text: "2025 salary bands: L4 $145k, L5 $180k, L6 $220k.",
    sensitive: true,
    type: "Confidential business data",
    action: "approved",
    consequence: "Unreleased internal figures - keep them inside approved tools only.",
  },
  {
    text: "How do I write a polite meeting-reschedule email?",
    sensitive: false,
    type: "Generic question, no private data",
    action: "pub",
    consequence: "No sensitive data here - fine to use any AI tool.",
  },
];

const ACTIONS: { id: Action; label: string }[] = [
  { id: "pub", label: "Fine to paste into any AI tool" },
  { id: "approved", label: "Use an approved tool, or redact first" },
  { id: "never", label: "Don't paste it at all" },
];

export function PasteOrNot() {
  const ctx = useLessonContext();
  const [index, setIndex] = React.useState(0);
  const [sensitivePick, setSensitivePick] = React.useState<boolean | null>(null);
  const [actionPick, setActionPick] = React.useState<Action | null>(null);
  const s = SNIPPETS[index];
  const isLast = index === SNIPPETS.length - 1;
  const done = actionPick !== null;

  function next() {
    if (isLast) {
      ctx?.reportInteractive("paste-or-not");
      return;
    }
    setIndex((i) => i + 1);
    setSensitivePick(null);
    setActionPick(null);
  }

  return (
    <InteractiveShell
      title="Paste or don't paste?"
      subtitle={`Snippet ${index + 1} of ${SNIPPETS.length} - decide in two steps.`}
      complete={isLast && done}
    >
      <div className="rounded-xl border bg-muted/30 p-4 text-sm">
        <div className="mb-1.5 flex items-center gap-1.5 text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase">
          <ShieldAlertIcon className="size-3.5" /> Snippet
        </div>
        <p className="font-mono text-[0.85rem] leading-relaxed text-foreground/90">{s.text}</p>
      </div>

      {/* Step 1 */}
      <div className="mt-4">
        <p className="mb-2 text-sm font-medium">1. Does this contain sensitive data?</p>
        <div className="flex gap-2">
          {[
            { v: true, label: "Yes, sensitive" },
            { v: false, label: "No, it's fine" },
          ].map(({ v, label }) => {
            const chosen = sensitivePick === v;
            const reveal = sensitivePick !== null;
            const correct = v === s.sensitive;
            return (
              <button
                key={String(v)}
                type="button"
                disabled={reveal}
                onClick={() => setSensitivePick(v)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all",
                  !reveal && "hover:border-primary/40 hover:bg-muted/50",
                  reveal && correct && "border-emerald-500/50 bg-emerald-500/10",
                  reveal && chosen && !correct && "border-destructive/50 bg-destructive/10",
                  reveal && !correct && !chosen && "opacity-50",
                )}
              >
                {reveal && correct && <CheckIcon className="size-4 text-emerald-600" />}
                {reveal && chosen && !correct && <XIcon className="size-4 text-destructive" />}
                {label}
              </button>
            );
          })}
        </div>
        {sensitivePick !== null && (
          <p className="mt-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground/70">{s.type}.</span>{" "}
            {s.sensitive ? "Treat it carefully." : "Low risk."}
          </p>
        )}
      </div>

      {/* Step 2 */}
      {sensitivePick !== null && (
        <div className="animate-in-fade mt-4">
          <p className="mb-2 text-sm font-medium">2. What should you do?</p>
          <div className="grid gap-2">
            {ACTIONS.map((a) => {
              const chosen = actionPick === a.id;
              const reveal = actionPick !== null;
              const correct = a.id === s.action;
              return (
                <button
                  key={a.id}
                  type="button"
                  disabled={reveal}
                  onClick={() => setActionPick(a.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-left text-sm transition-all",
                    !reveal && "hover:border-primary/40 hover:bg-muted/50",
                    reveal && correct && "border-emerald-500/50 bg-emerald-500/10",
                    reveal && chosen && !correct && "border-destructive/50 bg-destructive/10",
                    reveal && !correct && !chosen && "opacity-50",
                  )}
                >
                  {reveal && correct && <CheckIcon className="size-4 shrink-0 text-emerald-600" />}
                  {reveal && chosen && !correct && <XIcon className="size-4 shrink-0 text-destructive" />}
                  <span className="flex-1">{a.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {done && (
        <div className="mt-4 flex items-center justify-between gap-4 border-t pt-4">
          <p className="text-xs text-muted-foreground">{s.consequence}</p>
          <Button size="sm" onClick={next} variant={isLast ? "default" : "outline"} className="shrink-0">
            {isLast ? "Finish" : "Next"}
            {!isLast && <ArrowRightIcon />}
          </Button>
        </div>
      )}
    </InteractiveShell>
  );
}
