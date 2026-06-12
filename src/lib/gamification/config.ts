import gamification from "@content/gamification.json";

export type Rank = { id: string; name: string; minXp: number };
export type BadgeDef = { id: string; name: string; criteria: string };

export const POINTS = gamification.points as {
  lessonComplete: number;
  quizCorrectAnswer: number;
  quizPerfectBonus: number;
  miniProjectComplete: number;
  capstoneComplete: number;
  dailyStreakDailyBonus: number;
};

export const RANKS: Rank[] = gamification.ranks;
export const BADGE_DEFS: BadgeDef[] = gamification.badges;

export function rankForXp(xp: number): Rank {
  let current = RANKS[0];
  for (const r of RANKS) {
    if (xp >= r.minXp) current = r;
  }
  return current;
}

export function nextRank(xp: number): Rank | null {
  return RANKS.find((r) => r.minXp > xp) ?? null;
}

/** Progress (0-1) toward the next rank, for the profile ring. */
export function rankProgress(xp: number): number {
  const current = rankForXp(xp);
  const next = nextRank(xp);
  if (!next) return 1;
  const span = next.minXp - current.minXp;
  if (span <= 0) return 1;
  return Math.min(1, Math.max(0, (xp - current.minXp) / span));
}

/** XP awarded for a quiz given correct count + total. */
export function quizXp(correct: number, total: number): number {
  const base = correct * POINTS.quizCorrectAnswer;
  const perfect = total > 0 && correct === total ? POINTS.quizPerfectBonus : 0;
  return base + perfect;
}
