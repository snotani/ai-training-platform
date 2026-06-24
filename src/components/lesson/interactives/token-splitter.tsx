"use client";

import * as React from "react";
import { ArrowRightIcon, ScissorsIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { InteractiveShell } from "@/components/lesson/interactives/shell";
import { useLessonContext } from "@/components/lesson/lesson-context";

type Example = {
  text: string;
  tokens: string[];
};

const EXAMPLES: Example[] = [
  { text: "I'll grab coffee later", tokens: ["I", "'ll", " grab", " coffee", " later"] },
  { text: "ChatGPT is amazing!", tokens: ["Chat", "G", "PT", " is", " amazing", "!"] },
  { text: "tokenization", tokens: ["token", "ization"] },
  { text: "The price is 1999", tokens: ["The", " price", " is", " 1", "9", "9", "9"] },
];

const CHIP_COLORS = [
  "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  "bg-teal-500/15 text-teal-700 dark:text-teal-300",
  "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300",
  "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  "bg-amber-500/15 text-amber-700 dark:text-amber-300",
];

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function TokenSplitter() {
  const ctx = useLessonContext();
  const [index, setIndex] = React.useState(0);
  const [revealed, setRevealed] = React.useState(false);
  const reportedRef = React.useRef(false);

  const example = EXAMPLES[index];
  const words = wordCount(example.text);

  function split() {
    setRevealed(true);
    if (!reportedRef.current) {
      reportedRef.current = true;
      ctx?.reportInteractive("token-splitter");
    }
  }

  function nextExample() {
    setIndex((i) => (i + 1) % EXAMPLES.length);
    setRevealed(false);
  }

  return (
    <InteractiveShell
      title="Split it into tokens"
      subtitle="Tap to see how the model chops text into tokens - and why the count rarely matches the word count."
      complete={revealed}
    >
      <div className="rounded-xl bg-muted/40 px-4 py-6 text-center">
        {revealed ? (
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {example.tokens.map((tok, i) => (
              <span
                key={i}
                className={cn(
                  "rounded-md px-2.5 py-1 font-mono text-sm whitespace-pre",
                  CHIP_COLORS[i % CHIP_COLORS.length],
                )}
              >
                {tok}
              </span>
            ))}
          </div>
        ) : (
          <span className="font-mono text-lg text-foreground/90">{example.text}</span>
        )}
      </div>

      {revealed && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm">
          <span className="text-muted-foreground">
            {words} {words === 1 ? "word" : "words"}
          </span>
          <ArrowRightIcon className="size-4 text-muted-foreground" />
          <span className="font-semibold text-primary">
            {example.tokens.length} tokens
          </span>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {!revealed ? (
          <Button size="sm" onClick={split}>
            <ScissorsIcon /> Split into tokens
          </Button>
        ) : (
          <Button size="sm" variant="outline" onClick={nextExample}>
            Try another <ArrowRightIcon />
          </Button>
        )}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Common words are often one token, but longer or unusual words get chopped into pieces - and
        spaces and punctuation count too. That&rsquo;s why a long document is measured in tokens, not
        words, and why it can cost more or get cut off.
      </p>
    </InteractiveShell>
  );
}
