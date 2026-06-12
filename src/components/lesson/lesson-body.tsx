"use client";

import * as React from "react";
import { CheckCircle2Icon, Loader2Icon, SparklesIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LESSON_CONTENT } from "@/content/lessons";
import { LessonContext } from "@/components/lesson/lesson-context";
import { useAuth } from "@/components/auth/auth-context";
import { useLessonCompletion } from "@/lib/progress/use-lesson-completion";
import { track } from "@/lib/analytics/track";

export function LessonBody({ lessonId }: { lessonId: string }) {
  const MDX = LESSON_CONTENT[lessonId];
  const { user, openAuth } = useAuth();
  const { isComplete, hydrated, saving, complete } = useLessonCompletion(lessonId);

  const [quiz, setQuiz] = React.useState<{ score: number; total: number } | null>(null);

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
          <Button
            size="lg"
            onClick={() => void complete(quiz ?? undefined)}
            disabled={saving}
            className="shrink-0"
          >
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
