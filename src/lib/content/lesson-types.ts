// Optional MDX frontmatter exported as `export const meta = {...}` from each
// lesson. Authoritative lesson metadata (title, difficulty, minutes,
// objectives) lives in content/curriculum.json; this is for render hints.

export type LessonMeta = {
  id: string;
  summary?: string;
  interactiveIds?: string[];
};
