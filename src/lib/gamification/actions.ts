"use server";

import { createClient } from "@/lib/supabase/server";
import { getAllLessons, getLevelLessonIds, levels } from "@/lib/content/curriculum";
import { POINTS, quizXp } from "@/lib/gamification/config";

export type CompletionResult = {
  ok: boolean;
  awardedXp: number;
  newBadges: string[];
  alreadyCompleted: boolean;
};

type LocalRecord = {
  lessonId: string;
  completedAt?: string;
  quizScore?: number;
  quizTotal?: number;
};

const EMPTY: CompletionResult = {
  ok: false,
  awardedXp: 0,
  newBadges: [],
  alreadyCompleted: false,
};

function isMiniProject(lessonId: string) {
  return lessonId.endsWith(".project");
}

async function awardBadges(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  userId: string,
): Promise<string[]> {
  const earned: string[] = [];

  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("lesson_id, quiz_score, quiz_total")
    .eq("user_id", userId);
  const { data: streak } = await supabase
    .from("streaks")
    .select("current")
    .eq("user_id", userId)
    .maybeSingle();

  const rows: { lesson_id: string; quiz_score: number | null; quiz_total: number | null }[] =
    progress ?? [];
  const completedIds = new Set(rows.map((r) => r.lesson_id));

  const candidates: string[] = [];
  if (rows.length >= 1) candidates.push("first-lesson");
  if (rows.some((r) => r.quiz_total && r.quiz_score === r.quiz_total)) {
    candidates.push("perfect-quiz");
  }
  // level-complete: all published lessons + mini-project of any level done
  for (const level of levels) {
    const lessonIds = getLevelLessonIds(level.id).filter((id) => {
      const l = level.lessons.find((x) => x.id === id);
      return l?.status === "published";
    });
    if (lessonIds.length === 0) continue;
    const projectId = level.miniProject?.id;
    const allDone =
      lessonIds.every((id) => completedIds.has(id)) &&
      (!projectId || completedIds.has(projectId));
    if (allDone) candidates.push("level-complete");
  }
  if ((streak?.current ?? 0) >= 7) candidates.push("streak-7");
  if ((streak?.current ?? 0) >= 30) candidates.push("streak-30");

  if (candidates.length === 0) return earned;

  // Which do we already have?
  const { data: existing } = await supabase
    .from("user_badges")
    .select("badge_id")
    .eq("user_id", userId)
    .in("badge_id", candidates);
  const have = new Set((existing ?? []).map((b: { badge_id: string }) => b.badge_id));

  const toInsert = candidates.filter((c) => !have.has(c));
  if (toInsert.length > 0) {
    await supabase
      .from("user_badges")
      .insert(toInsert.map((badge_id) => ({ user_id: userId, badge_id })));
    earned.push(...toInsert);
  }
  return earned;
}

async function bumpStreak(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  userId: string,
): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);
  const { data: streak } = await supabase
    .from("streaks")
    .select("current, longest, last_active_date")
    .eq("user_id", userId)
    .maybeSingle();

  if (!streak) {
    await supabase
      .from("streaks")
      .upsert({ user_id: userId, current: 1, longest: 1, last_active_date: today });
    return POINTS.dailyStreakDailyBonus;
  }

  if (streak.last_active_date === today) return 0; // already counted today

  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  const current = streak.last_active_date === yesterday ? streak.current + 1 : 1;
  const longest = Math.max(streak.longest ?? 0, current);

  await supabase
    .from("streaks")
    .update({ current, longest, last_active_date: today, updated_at: new Date().toISOString() })
    .eq("user_id", userId);

  return POINTS.dailyStreakDailyBonus;
}

async function completeOne(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  userId: string,
  rec: LocalRecord,
): Promise<{ awarded: number; isNew: boolean }> {
  const { data: existing } = await supabase
    .from("lesson_progress")
    .select("id, quiz_score")
    .eq("user_id", userId)
    .eq("lesson_id", rec.lessonId)
    .maybeSingle();

  if (existing) {
    // Update the quiz score if it improved; do not re-award XP.
    if (
      rec.quizScore !== undefined &&
      (existing.quiz_score === null || rec.quizScore > existing.quiz_score)
    ) {
      await supabase
        .from("lesson_progress")
        .update({ quiz_score: rec.quizScore, quiz_total: rec.quizTotal ?? null })
        .eq("id", existing.id);
    }
    return { awarded: 0, isNew: false };
  }

  await supabase.from("lesson_progress").insert({
    user_id: userId,
    lesson_id: rec.lessonId,
    status: "completed",
    quiz_score: rec.quizScore ?? null,
    quiz_total: rec.quizTotal ?? null,
    completed_at: rec.completedAt ?? new Date().toISOString(),
  });

  // XP: mini-project vs lesson, plus quiz points.
  const baseType = isMiniProject(rec.lessonId) ? "mini_project" : "lesson_complete";
  const basePoints = isMiniProject(rec.lessonId)
    ? POINTS.miniProjectComplete
    : POINTS.lessonComplete;

  const events: { user_id: string; type: string; points: number; ref: string }[] = [
    { user_id: userId, type: baseType, points: basePoints, ref: rec.lessonId },
  ];
  if (rec.quizScore !== undefined && rec.quizTotal) {
    const qxp = quizXp(rec.quizScore, rec.quizTotal);
    if (qxp > 0) {
      events.push({ user_id: userId, type: "quiz", points: qxp, ref: rec.lessonId });
    }
  }

  await supabase.from("xp_events").insert(events);
  const awarded = events.reduce((sum, e) => sum + e.points, 0);
  return { awarded, isNew: true };
}

export async function recordLessonCompletion(input: {
  lessonId: string;
  quizScore?: number;
  quizTotal?: number;
}): Promise<CompletionResult> {
  const supabase = await createClient();
  if (!supabase) return EMPTY;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return EMPTY;

  const known = new Set(getAllLessons().map((l) => l.id));
  const isProject = isMiniProject(input.lessonId);
  if (!known.has(input.lessonId) && !isProject) return EMPTY;

  const { awarded, isNew } = await completeOne(supabase, user.id, input);
  let total = awarded;
  if (isNew) {
    total += await bumpStreak(supabase, user.id);
  }
  const newBadges = await awardBadges(supabase, user.id);

  return {
    ok: true,
    awardedXp: total,
    newBadges,
    alreadyCompleted: !isNew,
  };
}

/** Merge anonymous (localStorage) progress into the signed-in account. */
export async function syncLocalProgress(
  records: LocalRecord[],
): Promise<{ ok: boolean; importedXp: number }> {
  const supabase = await createClient();
  if (!supabase) return { ok: false, importedXp: 0 };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, importedXp: 0 };

  let importedXp = 0;
  let anyNew = false;
  for (const rec of records) {
    const { awarded, isNew } = await completeOne(supabase, user.id, rec);
    importedXp += awarded;
    anyNew = anyNew || isNew;
  }
  if (anyNew) {
    importedXp += await bumpStreak(supabase, user.id);
    await awardBadges(supabase, user.id);
  }
  return { ok: true, importedXp };
}

/** Server progress for hydrating the local store after sign-in. */
export async function getMyProgress(): Promise<
  Record<string, { completedAt: string; quizScore?: number; quizTotal?: number }>
> {
  const supabase = await createClient();
  if (!supabase) return {};
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return {};

  const { data } = await supabase
    .from("lesson_progress")
    .select("lesson_id, quiz_score, quiz_total, completed_at")
    .eq("user_id", user.id);

  const out: Record<string, { completedAt: string; quizScore?: number; quizTotal?: number }> = {};
  for (const row of data ?? []) {
    out[row.lesson_id] = {
      completedAt: row.completed_at,
      quizScore: row.quiz_score ?? undefined,
      quizTotal: row.quiz_total ?? undefined,
    };
  }
  return out;
}
