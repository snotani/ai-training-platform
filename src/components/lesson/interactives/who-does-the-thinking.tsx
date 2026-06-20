"use client";

import * as React from "react";
import { ArrowRightIcon, RotateCcwIcon, UserIcon, CpuIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { InteractiveShell } from "@/components/lesson/interactives/shell";
import { useLessonContext } from "@/components/lesson/lesson-context";

type Era = {
  label: string;
  year: string;
  /** 0 = all human, 100 = all machine. */
  machine: number;
  did: string;
};

const ERAS: Era[] = [
  {
    label: "Rule-based",
    year: "the old way",
    machine: 15,
    did: "A human wrote every rule by hand. The machine just followed orders - no learning at all.",
  },
  {
    label: "Traditional ML",
    year: "learns from data",
    machine: 45,
    did: "You still pick which clues matter, but the machine learns the patterns from examples instead of being told.",
  },
  {
    label: "Deep Learning",
    year: "finds its own clues",
    machine: 75,
    did: "Feed it raw pixels or audio and it figures out the useful features itself - no human picking clues.",
  },
  {
    label: "Generative AI",
    year: "creates new content",
    machine: 95,
    did: "It does the thinking and the creating - writing, drawing, coding things that never existed before.",
  },
];

export function WhoDoesTheThinking() {
  const ctx = useLessonContext();
  const [step, setStep] = React.useState(0);
  const reportedRef = React.useRef(false);
  const era = ERAS[step];
  const isLast = step === ERAS.length - 1;

  function next() {
    if (isLast) {
      if (!reportedRef.current) {
        reportedRef.current = true;
        ctx?.reportInteractive("who-does-the-thinking");
      }
      return;
    }
    setStep((s) => s + 1);
  }

  function reset() {
    setStep(0);
  }

  React.useEffect(() => {
    if (isLast && !reportedRef.current) {
      reportedRef.current = true;
      ctx?.reportInteractive("who-does-the-thinking");
    }
  }, [isLast, ctx]);

  return (
    <InteractiveShell
      title="Who's doing the thinking?"
      subtitle="Step through the eras and watch the work slide from human to machine."
      complete={isLast}
    >
      <div className="flex flex-wrap items-center gap-2">
        {ERAS.map((e, i) => (
          <button
            key={e.label}
            type="button"
            onClick={() => setStep(i)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              i === step
                ? "border-primary/50 bg-primary/10 text-foreground"
                : i < step
                  ? "border-border bg-muted/40 text-muted-foreground"
                  : "border-dashed text-muted-foreground hover:border-primary/40",
            )}
          >
            {e.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <UserIcon className="size-3.5" /> Human does the work
          </span>
          <span className="flex items-center gap-1.5">
            Machine does the work <CpuIcon className="size-3.5 text-primary" />
          </span>
        </div>
        <div className="relative h-6 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-brand-gradient transition-[width] duration-500 ease-out"
            style={{ width: `${era.machine}%` }}
          />
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-muted/40 p-4">
        <div className="flex items-baseline gap-2">
          <span className="font-heading text-base font-semibold">{era.label}</span>
          <span className="text-xs text-muted-foreground">{era.year}</span>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{era.did}</p>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Step {step + 1} of {ERAS.length}
        </p>
        <div className="flex items-center gap-2">
          {step > 0 && (
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcwIcon /> Restart
            </Button>
          )}
          <Button size="sm" onClick={next} disabled={isLast}>
            {isLast ? "That's the whole arc" : "Next era"}
            {!isLast && <ArrowRightIcon />}
          </Button>
        </div>
      </div>
    </InteractiveShell>
  );
}
