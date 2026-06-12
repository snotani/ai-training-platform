"use client";

import * as React from "react";
import { toast } from "sonner";

import { useProgressStore } from "@/lib/progress/store";
import { useAuth } from "@/components/auth/auth-context";
import { recordLessonCompletion } from "@/lib/gamification/actions";
import { BADGE_DEFS } from "@/lib/gamification/config";
import { track } from "@/lib/analytics/track";

/** A learner "passes" a quiz at two-thirds correct or better. */
export const QUIZ_PASS_RATIO = 2 / 3;

export function isQuizPassed(score: number, total: number): boolean {
  return total > 0 && score / total >= QUIZ_PASS_RATIO;
}

export type QuizResult = { score: number; total: number };

/**
 * Shared lesson-completion logic used by the lesson page and by quizzes.
 *
 * Progress is always written to the local (cached) progress store, which is
 * persisted to localStorage - so logged-out learners keep their progress on the
 * device. Signed-in learners additionally record completion server-side to earn
 * XP and badges. Calling `complete` again after a lesson is already done quietly
 * keeps the best quiz score without re-awarding XP or re-toasting.
 */
export function useLessonCompletion(lessonId: string) {
  const { user, openAuth, refreshProfile } = useAuth();
  const markLessonComplete = useProgressStore((s) => s.markLessonComplete);
  const isComplete = useProgressStore((s) => Boolean(s.lessons[lessonId]));
  const hydrated = useProgressStore((s) => s.hydrated);
  const [saving, setSaving] = React.useState(false);

  const complete = React.useCallback(
    async (quiz?: QuizResult) => {
      if (!lessonId) return;

      const alreadyComplete = Boolean(useProgressStore.getState().lessons[lessonId]);

      // Always update the local cache (keeps the best quiz score).
      markLessonComplete(lessonId, quiz);

      // Don't re-award XP or re-toast for a lesson that's already complete.
      if (alreadyComplete) return;

      setSaving(true);
      track("lesson_complete", {
        lessonId,
        metadata: { signedIn: Boolean(user), viaQuiz: Boolean(quiz) },
      });
      try {
        if (user) {
          const res = await recordLessonCompletion({
            lessonId,
            quizScore: quiz?.score,
            quizTotal: quiz?.total,
          });
          if (res.ok && !res.alreadyCompleted && res.awardedXp > 0) {
            toast.success(`+${res.awardedXp} XP earned`, { description: "Lesson complete." });
          } else {
            toast.success("Lesson complete.");
          }
          for (const b of res.newBadges) {
            const def = BADGE_DEFS.find((d) => d.id === b);
            toast("Badge unlocked", { description: def?.name ?? b, icon: "🏅" });
          }
          await refreshProfile();
        } else {
          toast.success("Lesson complete - saved on this device", {
            description: "Sign in to earn XP and join the leaderboard.",
            action: {
              label: "Sign in",
              onClick: () => openAuth("Sign in to earn XP for this lesson."),
            },
          });
        }
      } finally {
        setSaving(false);
      }
    },
    [lessonId, user, markLessonComplete, refreshProfile, openAuth],
  );

  return { isComplete, hydrated, saving, complete };
}
