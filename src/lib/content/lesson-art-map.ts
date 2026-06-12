import type { Motif } from "@/components/lesson/lesson-art";

export type ArtSpec = { motif: Motif; accent: string };

// Per-lesson animated art: a motif that describes the topic + a vivid accent
// chosen to contrast with the green UI and to vary within each level.
const LESSON_ART: Record<string, ArtSpec> = {
  // Level 1 - Generative AI Literacy
  "1.1": { motif: "spark", accent: "violet" },
  "1.2": { motif: "tokens", accent: "indigo" },
  "1.3": { motif: "boundary", accent: "rose" },
  "1.4": { motif: "shield", accent: "amber" },
  "1.project": { motif: "rocket", accent: "teal" },

  // Level 2 - Prompt Engineering & Interaction
  "2.1": { motif: "chat", accent: "blue" },
  "2.2": { motif: "chat", accent: "cyan" },
  "2.3": { motif: "spark", accent: "violet" },
  "2.4": { motif: "boundary", accent: "orange" },
  "2.5": { motif: "shield", accent: "rose" },
  "2.6": { motif: "search", accent: "pink" },
  "2.project": { motif: "rocket", accent: "lime" },

  // Level 3 - The AI Economy & Workplace
  "3.1": { motif: "chat", accent: "amber" },
  "3.2": { motif: "coins", accent: "amber" },
  "3.3": { motif: "compass", accent: "teal" },
  "3.4": { motif: "compass", accent: "violet" },
  "3.project": { motif: "rocket", accent: "cyan" },

  // Level 4 - Next-Gen Model Paradigms
  "4.1": { motif: "spark", accent: "violet" },
  "4.2": { motif: "layers", accent: "fuchsia" },
  "4.3": { motif: "layers", accent: "indigo" },
  "4.4": { motif: "compass", accent: "blue" },
  "4.project": { motif: "rocket", accent: "emerald" },

  // Level 5 - AI Automation Workflows
  "5.1": { motif: "flow", accent: "blue" },
  "5.2": { motif: "flow", accent: "cyan" },
  "5.3": { motif: "network", accent: "teal" },
  "5.4": { motif: "flow", accent: "amber" },
  "5.5": { motif: "robot", accent: "orange" },
  "5.6": { motif: "coins", accent: "lime" },
  "5.project": { motif: "rocket", accent: "violet" },

  // Level 6 - Evaluation & Reliability
  "6.1": { motif: "gauge", accent: "blue" },
  "6.2": { motif: "boundary", accent: "rose" },
  "6.3": { motif: "gauge", accent: "cyan" },
  "6.4": { motif: "gauge", accent: "violet" },
  "6.5": { motif: "gauge", accent: "amber" },
  "6.project": { motif: "rocket", accent: "teal" },

  // Level 7 - Spec-Driven Dev & Deep Economics
  "7.1": { motif: "compass", accent: "indigo" },
  "7.2": { motif: "flow", accent: "blue" },
  "7.3": { motif: "network", accent: "cyan" },
  "7.4": { motif: "coins", accent: "amber" },
  "7.project": { motif: "rocket", accent: "fuchsia" },

  // Level 8 - Data Foundations & Basic RAG
  "8.1": { motif: "database", accent: "violet" },
  "8.2": { motif: "search", accent: "blue" },
  "8.3": { motif: "database", accent: "teal" },
  "8.4": { motif: "shield", accent: "amber" },
  "8.project": { motif: "rocket", accent: "indigo" },

  // Level 9 - Advanced Retrieval & Search
  "9.1": { motif: "search", accent: "cyan" },
  "9.2": { motif: "search", accent: "indigo" },
  "9.3": { motif: "search", accent: "fuchsia" },
  "9.4": { motif: "gauge", accent: "pink" },
  "9.project": { motif: "rocket", accent: "blue" },

  // Level 10 - Autonomous Single-Agent Systems
  "10.1": { motif: "robot", accent: "violet" },
  "10.2": { motif: "database", accent: "orange" },
  "10.3": { motif: "network", accent: "blue" },
  "10.4": { motif: "gauge", accent: "cyan" },
  "10.5": { motif: "shield", accent: "rose" },
  "10.6": { motif: "gauge", accent: "amber" },
  "10.project": { motif: "rocket", accent: "teal" },

  // Level 11 - Multi-Agent Swarms & Governance
  "11.1": { motif: "network", accent: "violet" },
  "11.2": { motif: "flow", accent: "blue" },
  "11.3": { motif: "shield", accent: "amber" },
  "11.4": { motif: "shield", accent: "orange" },
  "11.5": { motif: "shield", accent: "rose" },
  "11.project": { motif: "rocket", accent: "indigo" },

  // Level 12 - Model Adaptation & Deep Architecture
  "12.1": { motif: "chip", accent: "indigo" },
  "12.2": { motif: "spark", accent: "fuchsia" },
  "12.3": { motif: "chip", accent: "amber" },
  "12.4": { motif: "chip", accent: "blue" },
  "12.project": { motif: "rocket", accent: "violet" },
};

// Representative art for each level (used on level cards / banners).
const LEVEL_ART: Record<number, ArtSpec> = {
  1: { motif: "spark", accent: "violet" },
  2: { motif: "chat", accent: "blue" },
  3: { motif: "coins", accent: "amber" },
  4: { motif: "layers", accent: "indigo" },
  5: { motif: "flow", accent: "cyan" },
  6: { motif: "gauge", accent: "blue" },
  7: { motif: "network", accent: "indigo" },
  8: { motif: "search", accent: "blue" },
  9: { motif: "search", accent: "fuchsia" },
  10: { motif: "robot", accent: "violet" },
  11: { motif: "network", accent: "fuchsia" },
  12: { motif: "chip", accent: "indigo" },
};

export function lessonArt(lessonId: string, levelId?: number): ArtSpec {
  return (
    LESSON_ART[lessonId] ??
    (levelId != null ? LEVEL_ART[levelId] : undefined) ?? { motif: "spark", accent: "emerald" }
  );
}

export function levelArt(levelId: number): ArtSpec {
  return LEVEL_ART[levelId] ?? { motif: "spark", accent: "emerald" };
}
