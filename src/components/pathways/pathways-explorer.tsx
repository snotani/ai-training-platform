"use client";

import * as React from "react";
import { toast } from "sonner";
import { ArrowRightIcon, CheckIcon, FlagIcon, RouteIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { pathways, pathwayAccent, type Pathway } from "@/lib/content/pathways";
import { getLesson } from "@/lib/content/curriculum";
import { useProgressStore } from "@/lib/progress/store";
import { usePreferencesStore } from "@/lib/progress/preferences";
import { countComplete } from "@/lib/progress/helpers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LinkButton } from "@/components/link-button";

const ACCENT_BAR: Record<string, string> = {
  emerald: "bg-emerald-500",
  teal: "bg-teal-500",
  lime: "bg-lime-500",
  amber: "bg-amber-500",
};

function firstLessonHref(p: Pathway): string {
  const first = p.recommendedLessons[0];
  const found = getLesson(first);
  return found ? `/learn/${found.level.id}/${first}` : "/learn";
}

function PathwayCard({ p }: { p: Pathway }) {
  const lessonsMap = useProgressStore((s) => s.lessons);
  const hydrated = useProgressStore((s) => s.hydrated);
  const pathwayId = usePreferencesStore((s) => s.pathwayId);
  const setPathway = usePreferencesStore((s) => s.setPathway);
  const prefsHydrated = usePreferencesStore((s) => s.hydrated);

  const done = hydrated ? countComplete(lessonsMap, p.recommendedLessons) : 0;
  const pct = Math.round((done / p.recommendedLessons.length) * 100);
  const isMine = prefsHydrated && pathwayId === p.id;

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border bg-card p-6 pl-7">
      <span className={cn("absolute inset-y-0 left-0 w-1.5", ACCENT_BAR[pathwayAccent(p.id)])} />
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-heading text-lg font-semibold">{p.name}</h2>
        {isMine && (
          <Badge className="shrink-0">
            <CheckIcon /> Your path
          </Badge>
        )}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{p.focus}</p>

      <div className="mt-4 rounded-xl bg-muted/40 p-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <FlagIcon className="size-4 text-primary" /> Capstone
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{p.capstone.title}</p>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
          <span>{hydrated ? `${done}/${p.recommendedLessons.length} lessons` : `${p.recommendedLessons.length} lessons`}</span>
          <span>{hydrated ? `${pct}%` : ""}</span>
        </div>
        <Progress value={hydrated ? pct : 0} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <LinkButton href={firstLessonHref(p)} size="sm">
          Start path
          <ArrowRightIcon />
        </LinkButton>
        <Button
          variant={isMine ? "secondary" : "outline"}
          size="sm"
          onClick={() => {
            if (isMine) {
              setPathway(null);
              toast("Path cleared");
            } else {
              setPathway(p.id);
              toast.success(`${p.name} set as your path`);
            }
          }}
        >
          {isMine ? "Clear my path" : "Set as my path"}
        </Button>
      </div>
    </div>
  );
}

export function PathwaysExplorer() {
  return (
    <div>
      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/[0.04] p-4">
        <RouteIcon className="mt-0.5 size-5 shrink-0 text-primary" />
        <p className="text-sm text-muted-foreground">
          Pathways are <span className="font-medium text-foreground">optional and skippable</span>.
          Each is a recommended track with its own capstone - but every level and lesson stays open
          to everyone, no gates.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {pathways.map((p) => (
          <PathwayCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}
