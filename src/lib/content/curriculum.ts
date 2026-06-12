import curriculumData from "@content/curriculum.json";

export type LessonStatus = "published" | "placeholder";

export type Lesson = {
  id: string;
  title: string;
  status: LessonStatus;
  difficulty?: string;
  estMinutes?: number;
  prerequisites?: string[];
  objectives?: string[];
  interactive?: string[];
  quizCount?: number;
  portfolioArtifact?: string | null;
  contentRef?: string | null;
  changeFlag?: string;
};

export type MiniProject = {
  id: string;
  title: string;
  status: LessonStatus;
  estMinutes?: number;
  producesArtifact?: string;
  contentRef?: string | null;
};

export type Level = {
  id: number;
  title: string;
  audienceHint?: string;
  phase: string;
  lessons: Lesson[];
  miniProject?: MiniProject;
};

export type Phase = { id: string; name: string; levels: number[] };

export type Curriculum = {
  title: string;
  version: string;
  status: string;
  phases: Phase[];
  levels: Level[];
};

export const curriculum = curriculumData as unknown as Curriculum;

export const phases = curriculum.phases;
export const levels = curriculum.levels;

export function getLevel(id: number | string): Level | undefined {
  const n = typeof id === "string" ? parseInt(id, 10) : id;
  return levels.find((l) => l.id === n);
}

export function getPhase(id: string): Phase | undefined {
  return phases.find((p) => p.id === id);
}

export function getLevelsForPhase(phaseId: string): Level[] {
  return levels.filter((l) => l.phase === phaseId);
}

/** All lessons across all levels, in curriculum order. */
export function getAllLessons(): Lesson[] {
  return levels.flatMap((l) => l.lessons);
}

export function getLesson(lessonId: string): { lesson: Lesson; level: Level } | undefined {
  for (const level of levels) {
    const lesson = level.lessons.find((ls) => ls.id === lessonId);
    if (lesson) return { lesson, level };
  }
  return undefined;
}

/** Lesson ids for a level (lessons only, excludes mini-project). */
export function getLevelLessonIds(levelId: number): string[] {
  return getLevel(levelId)?.lessons.map((l) => l.id) ?? [];
}

/** Flat ordered list of "navigable" items (lessons + mini-projects) for prev/next. */
export type NavItem = { id: string; title: string; levelId: number; kind: "lesson" | "project" };

export function getFlatNav(): NavItem[] {
  const items: NavItem[] = [];
  for (const level of levels) {
    for (const lesson of level.lessons) {
      items.push({ id: lesson.id, title: lesson.title, levelId: level.id, kind: "lesson" });
    }
    if (level.miniProject) {
      items.push({
        id: level.miniProject.id,
        title: level.miniProject.title,
        levelId: level.id,
        kind: "project",
      });
    }
  }
  return items;
}

export function getAdjacent(itemId: string): { prev?: NavItem; next?: NavItem } {
  const flat = getFlatNav();
  const idx = flat.findIndex((i) => i.id === itemId);
  if (idx === -1) return {};
  return { prev: flat[idx - 1], next: flat[idx + 1] };
}

export const PUBLISHED_LESSON_IDS = getAllLessons()
  .filter((l) => l.status === "published")
  .map((l) => l.id);
