// Presentational metadata for levels: short, appealing hooks + cover images.
// Kept separate from the canonical curriculum.json content source.

export type LevelMeta = { hook: string; cover: string };

export const levelMeta: Record<number, LevelMeta> = {
  1: { hook: "Finally get what AI is really doing - and where it breaks.", cover: "/covers/level-1.png" },
  2: { hook: "Ask sharper questions, get dramatically better answers.", cover: "/covers/level-2.png" },
  3: { hook: "Spot the real opportunities - and the true cost of AI at work.", cover: "/covers/level-3.png" },
  4: { hook: "Reasoning, multimodal, open models: know which to reach for.", cover: "/covers/level-4.png" },
  5: { hook: "Wire AI into workflows that save hours every week.", cover: "/covers/level-5.png" },
  6: { hook: "Prove your AI works - and keep it working in production.", cover: "/covers/level-6.png" },
  7: { hook: "Steer AI with specs and tools, and master the economics.", cover: "/covers/level-7.png" },
  8: { hook: "Give AI your own knowledge so it stops guessing.", cover: "/covers/level-8.png" },
  9: { hook: "Make retrieval fast, precise, and trustworthy at scale.", cover: "/covers/level-9.png" },
  10: { hook: "Build agents that plan, use tools, and finish the job.", cover: "/covers/level-10.png" },
  11: { hook: "Coordinate many agents safely - and govern the risk.", cover: "/covers/level-11.png" },
  12: { hook: "Look under the hood: transformers, tuning, and infrastructure.", cover: "/covers/level-12.png" },
};

export const phaseMeta: Record<string, { tagline: string }> = {
  foundations: { tagline: "Build confident, safe, everyday AI use." },
  adoption: { tagline: "Turn AI into real workplace value." },
  quality: { tagline: "Make AI reliable and cost-aware." },
  data: { tagline: "Ground AI in your own knowledge." },
  agents: { tagline: "Ship and govern autonomous systems." },
  deep: { tagline: "Master the architecture underneath." },
};

// Topic-specific covers for authored lessons; others fall back to the level cover.
export const lessonCovers: Record<string, string> = {
  "1.1": "/covers/lesson-1-1.png",
  "1.2": "/covers/lesson-1-2.png",
  "1.3": "/covers/lesson-1-3.png",
  "1.4": "/covers/lesson-1-4.png",
  "1.project": "/covers/lesson-1-project.png",
};

export function levelHook(id: number): string {
  return levelMeta[id]?.hook ?? "";
}

export function levelCover(id: number): string {
  return levelMeta[id]?.cover ?? "/covers/level-1.png";
}

export function lessonCover(lessonId: string, levelId: number): string {
  return lessonCovers[lessonId] ?? levelCover(levelId);
}

export function phaseTagline(id: string): string {
  return phaseMeta[id]?.tagline ?? "";
}
