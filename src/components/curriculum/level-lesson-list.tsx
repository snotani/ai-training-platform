"use client";

import Link from "next/link";
import { CheckIcon, ClockIcon, FlagIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { getLevel } from "@/lib/content/curriculum";
import { useProgressStore } from "@/lib/progress/store";
import { levelItemIds, countComplete } from "@/lib/progress/helpers";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

function Row({
  href,
  index,
  title,
  difficulty,
  minutes,
  status,
  done,
  isProject,
}: {
  href: string;
  index?: number;
  title: string;
  difficulty?: string;
  minutes?: number;
  status: string;
  done: boolean;
  isProject?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-xl border bg-card p-4 transition-all hover:border-primary/40 hover:bg-muted/30"
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold",
          done
            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
            : isProject
              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
              : "bg-muted text-muted-foreground",
        )}
      >
        {done ? <CheckIcon className="size-4" /> : isProject ? <FlagIcon className="size-4" /> : index}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-medium leading-tight">{title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {isProject && <Badge variant="secondary">Mini-project</Badge>}
          {difficulty && <span>{difficulty}</span>}
          {minutes ? (
            <span className="inline-flex items-center gap-1">
              <ClockIcon className="size-3" /> {minutes} min
            </span>
          ) : null}
          {status !== "published" && <Badge variant="outline">Coming soon</Badge>}
        </div>
      </div>
    </Link>
  );
}

export function LevelLessonList({ levelId }: { levelId: number }) {
  const level = getLevel(levelId);
  const lessonsMap = useProgressStore((s) => s.lessons);
  const hydrated = useProgressStore((s) => s.hydrated);

  if (!level) return null;

  const ids = levelItemIds(level);
  const done = hydrated ? countComplete(lessonsMap, ids) : 0;
  const pct = ids.length ? Math.round((done / ids.length) * 100) : 0;

  return (
    <div>
      <div className="mb-6 rounded-2xl border bg-card p-5">
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="font-medium">Level progress</span>
          <span className="text-muted-foreground">
            {hydrated ? `${done} of ${ids.length} complete` : `${ids.length} items`}
          </span>
        </div>
        <Progress value={pct} />
      </div>

      <div className="space-y-3">
        {level.lessons.map((lesson, i) => (
          <Row
            key={lesson.id}
            href={`/learn/${level.id}/${lesson.id}`}
            index={i + 1}
            title={lesson.title}
            difficulty={lesson.difficulty}
            minutes={lesson.estMinutes}
            status={lesson.status}
            done={hydrated && Boolean(lessonsMap[lesson.id])}
          />
        ))}
        {level.miniProject && (
          <Row
            href={`/learn/${level.id}/${level.miniProject.id}`}
            title={level.miniProject.title}
            minutes={level.miniProject.estMinutes}
            status={level.miniProject.status}
            done={hydrated && Boolean(lessonsMap[level.miniProject.id])}
            isProject
          />
        )}
      </div>
    </div>
  );
}
