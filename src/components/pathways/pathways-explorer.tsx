"use client";

import * as React from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ArrowRightIcon, CheckIcon, CircleIcon } from "lucide-react";

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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ACCENT_BAR: Record<string, string> = {
  emerald: "bg-emerald-500",
  teal: "bg-teal-500",
  lime: "bg-lime-500",
  amber: "bg-amber-500",
};

const ACCENT_TEXT: Record<string, string> = {
  emerald: "text-emerald-600 dark:text-emerald-400",
  teal: "text-teal-600 dark:text-teal-400",
  lime: "text-lime-600 dark:text-lime-400",
  amber: "text-amber-600 dark:text-amber-400",
};

type LevelGroup = { levelId: number; levelTitle: string; lessons: { id: string; title: string }[] };

function groupLessonsByLevel(ids: string[]): LevelGroup[] {
  const groups: LevelGroup[] = [];
  const byLevel = new Map<number, LevelGroup>();
  for (const id of ids) {
    const found = getLesson(id);
    if (!found) continue;
    let group = byLevel.get(found.level.id);
    if (!group) {
      group = { levelId: found.level.id, levelTitle: found.level.title, lessons: [] };
      byLevel.set(found.level.id, group);
      groups.push(group);
    }
    group.lessons.push({ id, title: found.lesson.title });
  }
  return groups;
}

function firstLessonHref(p: Pathway): string {
  const first = p.recommendedLessons[0];
  const found = getLesson(first);
  return found ? `/learn/${first}` : "/#curriculum";
}

function PathwayCard({ p }: { p: Pathway }) {
  const lessonsMap = useProgressStore((s) => s.lessons);
  const hydrated = useProgressStore((s) => s.hydrated);
  const pathwayId = usePreferencesStore((s) => s.pathwayId);
  const setPathway = usePreferencesStore((s) => s.setPathway);
  const prefsHydrated = usePreferencesStore((s) => s.hydrated);

  const accent = pathwayAccent(p.id);
  const total = p.recommendedLessons.length;
  const done = hydrated ? countComplete(lessonsMap, p.recommendedLessons) : 0;
  const pct = Math.round((done / total) * 100);
  const isMine = prefsHydrated && pathwayId === p.id;
  const groups = React.useMemo(() => groupLessonsByLevel(p.recommendedLessons), [p.recommendedLessons]);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-md">
      {/* Cover image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={p.image}
          alt={p.name}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className={cn("absolute inset-x-0 top-0 h-1", ACCENT_BAR[accent])} />
        {isMine && (
          <Badge className="absolute right-3 top-3 shadow-sm">
            <CheckIcon /> Your path
          </Badge>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h2 className="font-heading truncate text-base font-semibold leading-tight">
          {p.name}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground text-pretty">
          {p.tagline}
        </p>

        {/* Progress */}
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
            <span>{hydrated ? `${done}/${total} lessons complete` : `${total} lessons`}</span>
            <span className="tabular-nums">{hydrated ? `${pct}%` : ""}</span>
          </div>
          <Progress value={hydrated ? pct : 0} />
        </div>

        {/* Collapsible lesson list */}
        <Accordion className="mt-3 border-t pt-1">
          <AccordionItem value="lessons">
            <AccordionTrigger className="hover:no-underline">
              View {total} lessons
            </AccordionTrigger>
            <AccordionContent>
              <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                {groups.map((g) => (
                  <div key={g.levelId}>
                    <p className={cn("text-xs font-semibold", ACCENT_TEXT[accent])}>
                      Level {g.levelId} &middot; {g.levelTitle}
                    </p>
                    <ul className="mt-1.5 space-y-1">
                      {g.lessons.map((ls) => {
                        const complete = hydrated && Boolean(lessonsMap[ls.id]);
                        return (
                          <li key={ls.id} className="flex items-center gap-2">
                            {complete ? (
                              <CheckIcon className={cn("size-3.5 shrink-0", ACCENT_TEXT[accent])} />
                            ) : (
                              <CircleIcon className="size-3 shrink-0 text-muted-foreground/40" />
                            )}
                            <span
                              className={cn(
                                "text-sm",
                                complete ? "text-foreground" : "text-muted-foreground",
                              )}
                            >
                              {ls.title}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Actions */}
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
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
    </div>
  );
}

export function PathwaysExplorer() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {pathways.map((p) => (
        <PathwayCard key={p.id} p={p} />
      ))}
    </div>
  );
}
