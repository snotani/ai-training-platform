"use client";

import * as React from "react";
import { CheckIcon, RotateCcwIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { InteractiveShell } from "@/components/lesson/interactives/shell";
import { useLessonContext } from "@/components/lesson/lesson-context";

type Myth = {
  claim: string;
  /** Is the claim actually true? */
  truth: boolean;
  verdict: string;
};

const MYTHS: Myth[] = [
  {
    claim: "ChatGPT is a totally new kind of tech, unrelated to the AI that came before it.",
    truth: false,
    verdict:
      "Myth. It\u2019s generative AI, which is deep learning, which is machine learning - the same family, just one more layer in.",
  },
  {
    claim: "Netflix recommending shows and ChatGPT writing a reply are doing the same kind of job.",
    truth: false,
    verdict:
      "Myth. Netflix predicts a label from your history (Traditional ML). ChatGPT creates brand-new text (Generative AI).",
  },
  {
    claim: "Deep learning figures out the useful clues itself, without a human picking them.",
    truth: true,
    verdict:
      "True. Feed it raw pixels or audio and it learns the features on its own - that\u2019s the big leap over Traditional ML.",
  },
];

export function GenaiMythbuster() {
  const ctx = useLessonContext();
  const [answers, setAnswers] = React.useState<Record<number, boolean>>({});
  const reportedRef = React.useRef(false);

  const answeredCount = Object.keys(answers).length;
  const allDone = answeredCount === MYTHS.length;
  const score = MYTHS.filter((m, i) => answers[i] === m.truth).length;

  function answer(i: number, value: boolean) {
    if (i in answers) return;
    setAnswers((a) => ({ ...a, [i]: value }));
  }

  function reset() {
    setAnswers({});
    reportedRef.current = false;
  }

  React.useEffect(() => {
    if (allDone && !reportedRef.current) {
      reportedRef.current = true;
      ctx?.reportInteractive("genai-mythbuster");
    }
  }, [allDone, ctx]);

  return (
    <InteractiveShell
      title="Myth-buster: true or false?"
      subtitle="Tap your call on each claim, then see how it lands."
      complete={allDone}
    >
      <div className="space-y-3">
        {MYTHS.map((m, i) => {
          const picked = answers[i];
          const revealed = i in answers;
          const right = revealed && picked === m.truth;
          return (
            <div key={i} className="rounded-xl border bg-muted/20 p-4">
              <p className="text-sm font-medium leading-relaxed">{m.claim}</p>
              <div className="mt-3 flex items-center gap-2">
                {[true, false].map((v) => {
                  const isPicked = picked === v;
                  const isTruth = m.truth === v;
                  return (
                    <button
                      key={String(v)}
                      type="button"
                      disabled={revealed}
                      onClick={() => answer(i, v)}
                      className={cn(
                        "rounded-lg border px-4 py-1.5 text-sm font-medium transition-all",
                        !revealed && "hover:border-primary/40 hover:bg-muted/50",
                        revealed && isTruth && "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                        revealed && isPicked && !isTruth && "border-destructive/50 bg-destructive/10 text-destructive",
                        revealed && !isTruth && !isPicked && "opacity-60",
                      )}
                    >
                      {v ? "True" : "False"}
                    </button>
                  );
                })}
                {revealed && (
                  <span className="ml-1 flex items-center gap-1 text-xs font-medium">
                    {right ? (
                      <>
                        <CheckIcon className="size-3.5 text-emerald-600" />
                        <span className="text-emerald-700 dark:text-emerald-400">Right</span>
                      </>
                    ) : (
                      <>
                        <XIcon className="size-3.5 text-destructive" />
                        <span className="text-destructive">Not quite</span>
                      </>
                    )}
                  </span>
                )}
              </div>
              {revealed && (
                <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">{m.verdict}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {allDone ? `${score}/${MYTHS.length} busted correctly.` : `${answeredCount}/${MYTHS.length} answered`}
        </p>
        {answeredCount > 0 && (
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcwIcon /> Reset
          </Button>
        )}
      </div>
    </InteractiveShell>
  );
}
