import { levels, type Level } from "@/lib/content/curriculum";

/** All trackable item ids for a level (lessons + mini-project). */
export function levelItemIds(level: Level): string[] {
  const ids = level.lessons.map((l) => l.id);
  if (level.miniProject) ids.push(level.miniProject.id);
  return ids;
}

export function countComplete(
  lessonsMap: Record<string, unknown>,
  ids: string[],
): number {
  return ids.filter((id) => lessonsMap[id]).length;
}

export const ALL_ITEM_IDS: string[] = levels.flatMap((l) => levelItemIds(l));
