import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import { getLevel, getPhase, levels } from "@/lib/content/curriculum";
import { levelHook } from "@/lib/content/level-meta";
import { levelArt } from "@/lib/content/lesson-art-map";
import { LessonArt } from "@/components/lesson/lesson-art";
import { Badge } from "@/components/ui/badge";
import { LevelLessonList } from "@/components/curriculum/level-lesson-list";

export function generateStaticParams() {
  return levels.map((l) => ({ level: String(l.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  const l = getLevel(level);
  return { title: l ? `Level ${l.id}: ${l.title}` : "Level" };
}

export default async function LevelPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  const l = getLevel(level);
  if (!l) notFound();

  const phase = getPhase(l.phase);
  const prev = getLevel(l.id - 1);
  const next = getLevel(l.id + 1);
  const published = l.lessons.some((x) => x.status === "published");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/#curriculum"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" /> All levels
      </Link>

      <div className="relative mt-4 aspect-[2/1] overflow-hidden rounded-2xl border sm:aspect-[5/2]">
        <LessonArt motif={levelArt(l.id).motif} accent={levelArt(l.id).accent} seed={`level-${l.id}`} />
      </div>

      <div className="mt-5 flex items-center gap-2">
        <Badge variant="secondary">Level {l.id}</Badge>
        {phase && <Badge variant="outline">{phase.name}</Badge>}
        {!published && <Badge variant="outline">In development</Badge>}
      </div>

      <h1 className="font-heading mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{l.title}</h1>
      <p className="mt-2 text-lg text-muted-foreground text-pretty">{levelHook(l.id)}</p>
      {l.audienceHint && (
        <p className="mt-1 text-sm text-muted-foreground">For: {l.audienceHint}</p>
      )}

      <div className="mt-8">
        <LevelLessonList levelId={l.id} />
      </div>

      <nav className="mt-10 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/learn/${prev.id}`}
            className="flex flex-col gap-1 rounded-2xl border p-4 transition-colors hover:border-primary/40 hover:bg-muted/40"
          >
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowLeftIcon className="size-3" /> Level {prev.id}
            </span>
            <span className="font-medium">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/learn/${next.id}`}
            className="flex flex-col gap-1 rounded-2xl border p-4 text-right transition-colors hover:border-primary/40 hover:bg-muted/40"
          >
            <span className="inline-flex items-center justify-end gap-1 text-xs text-muted-foreground">
              Level {next.id} <ArrowRightIcon className="size-3" />
            </span>
            <span className="font-medium">{next.title}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
