"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  FlagIcon,
  LockIcon,
  SparklesIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { levels, getPhase, type Level } from "@/lib/content/curriculum";
import { pathways } from "@/lib/content/pathways";
import { levelHook, lessonBlurb, lessonImage } from "@/lib/content/level-meta";
import { lessonArt, type ArtSpec } from "@/lib/content/lesson-art-map";
import { LessonArt } from "@/components/lesson/lesson-art";
import { QuizDialog, hasQuiz } from "@/components/lesson/quiz-dialog";
import { LinkButton } from "@/components/link-button";
import { useProgressStore } from "@/lib/progress/store";
import { levelItemIds, countComplete, ALL_ITEM_IDS } from "@/lib/progress/helpers";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PHASE_GRADIENT: Record<string, string> = {
  foundations: "from-emerald-500 to-teal-500",
  adoption: "from-teal-500 to-green-500",
  quality: "from-green-500 to-lime-500",
  data: "from-lime-500 to-emerald-500",
  agents: "from-emerald-500 to-teal-600",
  deep: "from-teal-500 to-green-600",
};

type LessonCardData = {
  id: string;
  title: string;
  blurb?: string;
  image?: string;
  art: ArtSpec;
  difficulty?: string;
  minutes?: number;
  published: boolean;
  isProject?: boolean;
};

function LessonCard({
  levelId,
  data,
  done,
  dimmed,
  index,
}: {
  levelId: number;
  data: LessonCardData;
  done: boolean;
  dimmed: boolean;
  index: number;
}) {
  const href = `/learn/${levelId}/${data.id}`;
  const quizAvailable = data.published && hasQuiz(data.id);

  return (
    <div
      style={{ animationDelay: `${index * 35}ms` }}
      className={cn(
        "animate-in-fade group flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-1 hover:shadow-lg",
        dimmed && "opacity-50",
      )}
    >
      <Link href={href} className="flex flex-1 flex-col">
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          {data.image ? (
            <Image
              src={data.image}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="size-full transition-transform duration-500 group-hover:scale-105">
              <LessonArt motif={data.art.motif} accent={data.art.accent} seed={data.id} />
            </div>
          )}
          {data.isProject && (
            <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-2 py-0.5 text-[0.7rem] font-medium text-white shadow">
              <FlagIcon className="size-3" /> Project
            </span>
          )}
          {done ? (
            <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[0.7rem] font-medium text-white shadow">
              <CheckCircle2Icon className="size-3" /> Done
            </span>
          ) : !data.published ? (
            <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 text-[0.7rem] font-medium text-muted-foreground backdrop-blur">
              <LockIcon className="size-3" /> Soon
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4 pb-3">
          {(data.isProject || data.difficulty) && (
            <div className="flex flex-wrap items-center gap-1.5">
              {data.isProject && (
                <Badge variant="secondary" className="text-[0.7rem]">
                  Mini-project
                </Badge>
              )}
              {data.difficulty && (
                <span className="text-[0.7rem] text-muted-foreground">{data.difficulty}</span>
              )}
            </div>
          )}
          <h3 className="font-heading text-sm leading-snug font-semibold">{data.title}</h3>
          {data.blurb && (
            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
              {data.blurb}
            </p>
          )}
        </div>
      </Link>

      <div className="px-4 pb-4">
        {quizAvailable ? (
          <QuizDialog lessonId={data.id} label={done ? "Review quiz" : "Take the quiz"} />
        ) : data.published ? (
          <LinkButton href={href} variant="secondary" className="h-10 w-full justify-center">
            {data.isProject ? "Start project" : "Open lesson"}
            <ArrowRightIcon className="size-3.5" />
          </LinkButton>
        ) : (
          <Button
            variant="secondary"
            disabled
            className="h-10 w-full justify-center text-muted-foreground"
          >
            Coming soon
          </Button>
        )}
      </div>
    </div>
  );
}

function LevelGroup({
  level,
  lessonsMap,
  hydrated,
  recommended,
}: {
  level: Level;
  lessonsMap: Record<string, unknown>;
  hydrated: boolean;
  recommended: Set<string> | null;
}) {
  const ids = levelItemIds(level);
  const done = hydrated ? countComplete(lessonsMap, ids) : 0;
  const pct = ids.length ? Math.round((done / ids.length) * 100) : 0;
  const complete = done === ids.length && ids.length > 0;
  const minutes = level.lessons.reduce((s, l) => s + (l.estMinutes ?? 0), 0);

  const onPath = recommended
    ? level.lessons.filter((l) => recommended.has(l.id)).length
    : null;
  const levelDimmed = recommended !== null && onPath === 0;

  const cards: LessonCardData[] = level.lessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    blurb: lessonBlurb(lesson.id),
    image: lessonImage(lesson.id),
    art: lessonArt(lesson.id, level.id),
    difficulty: lesson.difficulty,
    minutes: lesson.estMinutes,
    published: lesson.status === "published",
  }));
  if (level.miniProject) {
    cards.push({
      id: level.miniProject.id,
      title: level.miniProject.title,
      blurb: lessonBlurb(level.miniProject.id),
      image: lessonImage(level.miniProject.id),
      art: lessonArt(level.miniProject.id, level.id),
      minutes: level.miniProject.estMinutes,
      published: level.miniProject.status === "published",
      isProject: true,
    });
  }

  return (
    <section className={cn("scroll-mt-24 transition-opacity", levelDimmed && "opacity-60")} id={`level-${level.id}`}>
      {/* Level header */}
      <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-stretch gap-4">
          <span
            aria-hidden
            className={cn(
              "w-1 shrink-0 rounded-full bg-gradient-to-b",
              PHASE_GRADIENT[level.phase] ?? "from-primary to-primary",
            )}
          />
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium tracking-wide uppercase">
              <span className="text-primary">Level {level.id}</span>
              <span className="text-muted-foreground/50" aria-hidden>
                &middot;
              </span>
              <span className="text-muted-foreground">{getPhase(level.phase)?.name}</span>
              {complete && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 normal-case text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2Icon className="size-3" /> Complete
                </span>
              )}
            </div>
            <h2 className="font-heading mt-1 text-xl font-semibold tracking-tight">
              {level.title}
            </h2>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">{levelHook(level.id)}</p>
          </div>
        </div>

        <div className="shrink-0 sm:w-44 sm:text-right">
          <p className="text-xs text-muted-foreground">
            {level.lessons.length} lessons{level.miniProject ? " + project" : ""}
            {minutes > 0 ? ` · ~${minutes} min` : ""}
          </p>
          {hydrated && done > 0 ? (
            <div className="mt-2 flex items-center gap-2">
              <Progress value={pct} className="flex-1" />
              <span className="text-[0.7rem] tabular-nums text-muted-foreground">
                {done}/{ids.length}
              </span>
            </div>
          ) : onPath !== null && onPath > 0 ? (
            <Badge variant="secondary" className="mt-2">
              {onPath} on your path
            </Badge>
          ) : null}
        </div>
      </div>

      {/* Lesson cards */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((data, i) => (
          <LessonCard
            key={data.id}
            levelId={level.id}
            data={data}
            done={hydrated && Boolean(lessonsMap[data.id])}
            dimmed={recommended !== null && !data.isProject && !recommended.has(data.id)}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}

export function CurriculumExplorer() {
  const lessonsMap = useProgressStore((s) => s.lessons);
  const hydrated = useProgressStore((s) => s.hydrated);
  const [pathwayId, setPathwayId] = React.useState("all");

  const pathway = pathways.find((p) => p.id === pathwayId) ?? null;
  const recommended = pathway ? new Set(pathway.recommendedLessons) : null;

  const trackedIds = pathway ? pathway.recommendedLessons : ALL_ITEM_IDS;
  const totalDone = hydrated ? countComplete(lessonsMap, trackedIds) : 0;
  const overallPct = trackedIds.length ? Math.round((totalDone / trackedIds.length) * 100) : 0;

  return (
    <div className="space-y-12">
      {/* Progress + pathway controls */}
      <div className="flex flex-col gap-5 rounded-2xl border bg-card p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <SparklesIcon className="size-4 text-primary" />
            <p className="text-sm font-medium">
              {pathway ? `${pathway.name} path` : "Your overall progress"}
            </p>
          </div>
          <div className="mt-3 flex items-center gap-4">
            <Progress value={overallPct} className="max-w-md flex-1" />
            <span className="text-sm font-semibold tabular-nums">
              {totalDone}/{trackedIds.length}
            </span>
          </div>
          {pathway && <p className="mt-2 text-xs text-muted-foreground">{pathway.focus}</p>}
        </div>

        <div className="shrink-0">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            View by pathway
          </label>
          <Select value={pathwayId} onValueChange={(v) => setPathwayId((v as string) ?? "all")}>
            <SelectTrigger className="w-full min-w-56 lg:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All lessons</SelectItem>
              {pathways.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Levels as groups, lessons as cards */}
      <div className="space-y-14">
        {levels.map((level) => (
          <LevelGroup
            key={level.id}
            level={level}
            lessonsMap={lessonsMap}
            hydrated={hydrated}
            recommended={recommended}
          />
        ))}
      </div>
    </div>
  );
}
