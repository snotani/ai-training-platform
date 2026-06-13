import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ClockIcon,
  TargetIcon,
} from "lucide-react";

import {
  getAdjacent,
  getFlatNav,
  getLesson,
  levels,
  type Level,
  type Lesson,
  type MiniProject,
} from "@/lib/content/curriculum";
import { hasLessonContent, LESSON_META } from "@/content/lessons";
import { lessonArt } from "@/lib/content/lesson-art-map";
import { lessonImage } from "@/lib/content/level-meta";
import { LessonArt } from "@/components/lesson/lesson-art";
import { Badge } from "@/components/ui/badge";
import { LessonBody } from "@/components/lesson/lesson-body";
import { LessonPlaceholder } from "@/components/lesson/lesson-placeholder";
import { LessonReader } from "@/components/lesson/lesson-reader";

type Resolved = {
  id: string;
  title: string;
  level: Level;
  status: string;
  difficulty?: string;
  minutes?: number;
  objectives?: string[];
  prerequisites?: string[];
  isProject: boolean;
};

function resolve(id: string): Resolved | null {
  const reg = getLesson(id);
  if (reg) {
    const l: Lesson = reg.lesson;
    return {
      id,
      title: l.title,
      level: reg.level,
      status: l.status,
      difficulty: l.difficulty,
      minutes: l.estMinutes,
      objectives: l.objectives,
      prerequisites: l.prerequisites,
      isProject: false,
    };
  }
  const lvl = levels.find((l) => l.miniProject?.id === id);
  if (lvl?.miniProject) {
    const p: MiniProject = lvl.miniProject;
    return {
      id,
      title: p.title,
      level: lvl,
      status: p.status,
      minutes: p.estMinutes,
      isProject: true,
    };
  }
  return null;
}

export function generateStaticParams() {
  return getFlatNav().map((n) => ({ lesson: n.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lesson: string }>;
}) {
  const { lesson } = await params;
  const r = resolve(lesson);
  return { title: r ? `${r.title} - Lesson ${r.id}` : "Lesson" };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lesson: string }>;
}) {
  const { lesson } = await params;
  const r = resolve(lesson);
  if (!r) notFound();

  const { prev, next } = getAdjacent(lesson);
  const published = r.status === "published" && hasLessonContent(lesson);
  const summary = LESSON_META[lesson]?.summary;
  const art = lessonArt(lesson, r.level.id);
  const image = lessonImage(lesson);

  const content = (
    <>
      <Link
        href={`/#level-${r.level.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" />
        Level {r.level.id} &middot; {r.level.title}
      </Link>

      <div className="relative mt-4 aspect-[2/1] overflow-hidden rounded-2xl border sm:aspect-[5/2]">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
        ) : (
          <LessonArt motif={art.motif} accent={art.accent} seed={`lesson-${lesson}`} />
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{r.isProject ? "Mini-project" : `Lesson ${r.id}`}</Badge>
        {r.difficulty && <Badge variant="outline">{r.difficulty}</Badge>}
        {r.minutes && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <ClockIcon className="size-3.5" /> {r.minutes} min
          </span>
        )}
      </div>

      <h1 className="font-heading mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        {r.title}
      </h1>
      {summary && <p className="mt-3 text-lg text-muted-foreground text-pretty">{summary}</p>}

      {published && r.objectives && r.objectives.length > 0 && (
        <div className="mt-6 rounded-2xl border bg-card p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <TargetIcon className="size-4 text-primary" />
            What you&rsquo;ll be able to do
          </div>
          <ul className="space-y-2">
            {r.objectives.map((o, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-foreground/90">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                {o}
              </li>
            ))}
          </ul>
        </div>
      )}

      <hr className="my-8 border-border" />

      {published ? (
        <LessonBody lessonId={lesson} />
      ) : (
        <LessonPlaceholder title={r.title} prerequisites={r.prerequisites} />
      )}

      <nav className="mt-12 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/learn/${prev.id}`}
            className="group flex flex-col gap-1 rounded-2xl border p-4 transition-colors hover:border-primary/40 hover:bg-muted/40"
          >
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowLeftIcon className="size-3" /> Previous
            </span>
            <span className="font-medium">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/learn/${next.id}`}
            className="group flex flex-col gap-1 rounded-2xl border p-4 text-right transition-colors hover:border-primary/40 hover:bg-muted/40"
          >
            <span className="inline-flex items-center justify-end gap-1 text-xs text-muted-foreground">
              Next <ArrowRightIcon className="size-3" />
            </span>
            <span className="font-medium">{next.title}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </>
  );

  if (published) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <LessonReader>{content}</LessonReader>
      </div>
    );
  }

  return <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">{content}</div>;
}
