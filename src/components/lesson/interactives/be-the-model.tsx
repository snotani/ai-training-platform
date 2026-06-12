"use client";

import * as React from "react";
import { DicesIcon, ThermometerIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { InteractiveShell } from "@/components/lesson/interactives/shell";
import { useLessonContext } from "@/components/lesson/lesson-context";

const TOKENS = [
  { t: "sunny", logit: 3.0 },
  { t: "cloudy", logit: 2.2 },
  { t: "rainy", logit: 1.8 },
  { t: "warm", logit: 1.4 },
  { t: "cold", logit: 0.9 },
  { t: "unpredictable", logit: 0.2 },
  { t: "banana", logit: -2.2 },
];

function softmax(temp: number) {
  const scaled = TOKENS.map((x) => x.logit / temp);
  const max = Math.max(...scaled);
  const exps = scaled.map((s) => Math.exp(s - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return TOKENS.map((x, i) => ({ token: x.t, p: exps[i] / sum }));
}

export function BeTheModel() {
  const ctx = useLessonContext();
  const [temp, setTemp] = React.useState(0.7);
  const [sampled, setSampled] = React.useState<string | null>(null);
  const [history, setHistory] = React.useState<string[]>([]);
  const reportedRef = React.useRef(false);

  const probs = React.useMemo(() => softmax(temp), [temp]);

  function sample() {
    const r = Math.random();
    let acc = 0;
    let chosen = probs[0].token;
    for (const { token, p } of probs) {
      acc += p;
      if (r <= acc) {
        chosen = token;
        break;
      }
    }
    setSampled(chosen);
    setHistory((h) => [chosen, ...h].slice(0, 8));
    if (!reportedRef.current) {
      reportedRef.current = true;
      ctx?.reportInteractive("be-the-model");
    }
  }

  return (
    <InteractiveShell
      title="Be the model"
      subtitle="Set the temperature, then sample the next token - just like an LLM."
      complete={history.length > 0}
    >
      <div className="rounded-xl bg-muted/40 px-4 py-3 text-center text-lg">
        The weather today is{" "}
        <span
          className={cn(
            "font-semibold",
            sampled ? "text-primary" : "text-muted-foreground",
          )}
        >
          {sampled ?? "___"}
        </span>
      </div>

      <div className="mt-5 space-y-2">
        {probs.map(({ token, p }) => (
          <div key={token} className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-right text-xs text-muted-foreground">{token}</span>
            <div className="relative h-5 flex-1 overflow-hidden rounded-md bg-muted">
              <div
                className={cn(
                  "h-full rounded-md bg-brand-gradient transition-[width] duration-300",
                  token === sampled && "ring-2 ring-primary ring-offset-1 ring-offset-card",
                )}
                style={{ width: `${Math.max(p * 100, 1.5)}%` }}
              />
            </div>
            <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
              {(p * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-medium">
            <ThermometerIcon className="size-3.5 text-primary" /> Temperature
          </span>
          <span className="tabular-nums text-muted-foreground">{temp.toFixed(2)}</span>
        </div>
        <Slider
          value={[temp]}
          min={0.1}
          max={1.5}
          step={0.05}
          onValueChange={(v) => setTemp(Array.isArray(v) ? v[0] : (v as number))}
        />
        <div className="mt-1.5 flex justify-between text-[0.7rem] text-muted-foreground">
          <span>Focused (consistent)</span>
          <span>Creative (riskier)</span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button size="sm" onClick={sample}>
          <DicesIcon /> Sample next token
        </Button>
        {history.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Recent:</span>
            {history.map((h, i) => (
              <span
                key={i}
                className={cn(
                  "rounded-md border px-1.5 py-0.5 text-xs",
                  i === 0 ? "border-primary/40 bg-primary/10 text-foreground" : "text-muted-foreground",
                )}
              >
                {h}
              </span>
            ))}
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Low temperature makes the bars peaky - it almost always picks &ldquo;sunny.&rdquo; Crank it up
        and the bars flatten, so even &ldquo;banana&rdquo; gets a turn.
      </p>
    </InteractiveShell>
  );
}
