"use client";

import * as React from "react";
import { AlertTriangleIcon, ArrowRightIcon, CheckIcon, FlagIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { InteractiveShell } from "@/components/lesson/interactives/shell";
import { useLessonContext } from "@/components/lesson/lesson-context";

type Answer = { text: string; fabricated: boolean; tell: string };
type Round = { question: string; answers: Answer[] };

const ROUNDS: Round[] = [
  {
    question: "Which answer about remote-work productivity is fabricated?",
    answers: [
      {
        text: "A 2013 Stanford study by Nicholas Bloom found remote call-center workers were ~13% more productive.",
        fabricated: false,
        tell: "Real and checkable - a specific, well-known study.",
      },
      {
        text: "A 2019 Harvard meta-analysis of 4,200 firms found a uniform 27.4% productivity gain from remote work.",
        fabricated: true,
        tell: "Oddly precise, sweeping, and unverifiable - classic confident fabrication.",
      },
      {
        text: "Evidence is mixed: some teams gain focus time while others lose spontaneous collaboration.",
        fabricated: false,
        tell: "Hedged and reasonable - the opposite of a fake.",
      },
    ],
  },
  {
    question: "Which answer about Australia's capital is fabricated?",
    answers: [
      {
        text: "Sydney is the capital and largest city of Australia.",
        fabricated: true,
        tell: "Confident but wrong - Sydney is the largest city, not the capital.",
      },
      {
        text: "Canberra is the capital of Australia.",
        fabricated: false,
        tell: "Correct and easy to verify.",
      },
      {
        text: "Canberra was chosen as a compromise between Sydney and Melbourne.",
        fabricated: false,
        tell: "Accurate historical detail.",
      },
    ],
  },
];

export function SpotTheHallucination() {
  const ctx = useLessonContext();
  const [round, setRound] = React.useState(0);
  const [picked, setPicked] = React.useState<number | null>(null);
  const data = ROUNDS[round];
  const revealed = picked !== null;
  const isLast = round === ROUNDS.length - 1;

  function next() {
    if (isLast) {
      ctx?.reportInteractive("spot-the-hallucination");
      return;
    }
    setRound((r) => r + 1);
    setPicked(null);
  }

  const gotIt = revealed && data.answers[picked!].fabricated;

  return (
    <InteractiveShell
      title="Spot the hallucination"
      subtitle={`Round ${round + 1} of ${ROUNDS.length} - flag the fabricated answer.`}
      complete={isLast && revealed}
    >
      <p className="mb-3 text-sm font-medium">{data.question}</p>
      <div className="space-y-2.5">
        {data.answers.map((a, i) => {
          const showFake = revealed && a.fabricated;
          const showPicked = revealed && picked === i;
          return (
            <div key={i}>
              <button
                type="button"
                disabled={revealed}
                onClick={() => setPicked(i)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left text-sm transition-all",
                  !revealed && "hover:border-primary/40 hover:bg-muted/50",
                  showFake && "border-destructive/50 bg-destructive/10",
                  showPicked && !a.fabricated && "border-amber-500/50 bg-amber-500/10",
                  revealed && !showFake && !showPicked && "opacity-60",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border",
                    showFake ? "border-destructive bg-destructive text-white" : "border-border text-muted-foreground",
                  )}
                >
                  {showFake ? <AlertTriangleIcon className="size-3" /> : <FlagIcon className="size-3" />}
                </span>
                <span className="flex-1">{a.text}</span>
              </button>
              {revealed && (
                <p className="mt-1 ml-8 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground/70">Tell:</span> {a.tell}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {revealed && (
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="flex items-center gap-1.5 text-sm">
            {gotIt ? (
              <>
                <CheckIcon className="size-4 text-emerald-600" />
                <span className="font-medium text-emerald-700 dark:text-emerald-400">Spotted it.</span>
              </>
            ) : (
              <span className="text-muted-foreground">
                The fabricated one is highlighted in red.
              </span>
            )}
          </p>
          <Button size="sm" onClick={next} variant={isLast ? "default" : "outline"}>
            {isLast ? "Finish" : "Next round"}
            {!isLast && <ArrowRightIcon />}
          </Button>
        </div>
      )}
    </InteractiveShell>
  );
}
