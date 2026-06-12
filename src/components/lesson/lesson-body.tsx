"use client";

import * as React from "react";
import { toast } from "sonner";
import { CheckCircle2Icon, Loader2Icon, SparklesIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LESSON_CONTENT } from "@/content/lessons";
import { LessonContext } from "@/components/lesson/lesson-context";
import { useProgressStore } from "@/lib/progress/store";
import { useAuth } from "@/components/auth/auth-context";
import { recordLessonCompletion } from "@/lib/gamification/actions";
import { BADGE_DEFS } from "@/lib/gamification/config";
import { track } from "@/lib/analytics/track";

export function LessonBody({ lessonId }: { lessonId: string }) {
  const MDX = LESSON_CONTENT[lessonId];
  const { user, openAuth, refreshProfile } = useAuth();
  const markLessonComplete = useProgressStore((s) => s.markLessonComplete);
  const isComplete = useProgressStore((s) => Boolean(s.lessons[lessonId]));
  const hydrated = useProgressStore((s) => s.hydrated);

  const [quiz, setQuiz] = React.useState<{ score: number; total: number } | null>(null);
  const [saving, setSaving] = React.useState(false);

  const ctx = React.useMemo(
    () => ({
      lessonId,
      reportQuiz: (score: number, total: number) => {
        setQuiz({ score, total });
        track("quiz_checked", { lessonId, metadata: { score, total } });
      },
      reportInteractive: (interactiveId: string) =>
        track("interactive_complete", { lessonId, metadata: { interactiveId } }),
    }),
    [lessonId],
  );

  async function complete() {
    setSaving(true);
    markLessonComplete(lessonId, quiz ?? undefined);
    track("lesson_complete", { lessonId, metadata: { signedIn: Boolean(user) } });
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
        toast.success("Progress saved on this device", {
          description: "Sign in to earn XP and join the leaderboard.",
          action: { label: "Sign in", onClick: () => openAuth("Sign in to earn XP for this lesson.") },
        });
      }
    } finally {
      setSaving(false);
    }
  }

  if (!MDX) return null;
  const done = hydrated && isComplete;

  return (
    <LessonContext.Provider value={ctx}>
      <article className="lesson-rich">
        <MDX />
      </article>

      <div
        className={cn(
          "mt-10 flex flex-col items-center gap-3 rounded-2xl border p-6 text-center sm:flex-row sm:justify-between sm:text-left",
          done ? "border-emerald-500/30 bg-emerald-500/[0.06]" : "bg-muted/30",
        )}
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex size-10 items-center justify-center rounded-xl",
              done ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-brand-gradient text-white",
            )}
          >
            {done ? <CheckCircle2Icon className="size-5" /> : <SparklesIcon className="size-5" />}
          </span>
          <div>
            <p className="font-heading font-semibold">
              {done ? "Lesson complete" : "Finished the lesson?"}
            </p>
            <p className="text-sm text-muted-foreground">
              {done
                ? user
                  ? "Saved to your profile."
                  : "Saved on this device - sign in to earn XP."
                : user
                  ? "Mark it complete to earn XP and keep your streak."
                  : "Mark it complete to track your progress."}
            </p>
          </div>
        </div>
        {!done && (
          <Button size="lg" onClick={complete} disabled={saving} className="shrink-0">
            {saving ? <Loader2Icon className="animate-spin" /> : <CheckCircle2Icon />}
            Mark complete
          </Button>
        )}
        {done && !user && (
          <Button variant="outline" onClick={() => openAuth("Sign in to earn XP for completed lessons.")}>
            Sign in to earn XP
          </Button>
        )}
      </div>
    </LessonContext.Provider>
  );
}
