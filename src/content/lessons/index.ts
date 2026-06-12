import type { ComponentType } from "react";

import Lesson11, { meta as meta11 } from "./1.1.mdx";
import Lesson12, { meta as meta12 } from "./1.2.mdx";
import Lesson13, { meta as meta13 } from "./1.3.mdx";
import Lesson14, { meta as meta14 } from "./1.4.mdx";
import LessonProject, { meta as metaProject } from "./1.project.mdx";

export type LessonMeta = {
  id: string;
  summary?: string;
  interactiveIds?: string[];
};

export const LESSON_CONTENT: Record<string, ComponentType> = {
  "1.1": Lesson11,
  "1.2": Lesson12,
  "1.3": Lesson13,
  "1.4": Lesson14,
  "1.project": LessonProject,
};

export const LESSON_META: Record<string, LessonMeta> = {
  "1.1": meta11,
  "1.2": meta12,
  "1.3": meta13,
  "1.4": meta14,
  "1.project": metaProject,
};

export function hasLessonContent(id: string): boolean {
  return id in LESSON_CONTENT;
}
