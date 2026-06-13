"use client";

import * as React from "react";
import { CheckCircle2Icon, HelpCircleIcon, LightbulbIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Quiz } from "@/components/lesson/quiz";
import { quizzes } from "@/content/quizzes";

export function hasQuiz(lessonId: string): boolean {
  return Boolean(quizzes[lessonId]?.length);
}

/**
 * Horizontal, filled "Take the quiz" button that opens the lesson quiz in a
 * modal. Used both on lesson cards and at the end of a lesson. When rendered
 * inside a lesson (within LessonContext), scores still report through to
 * completion tracking via React context (which flows through the portal).
 */
export function QuizDialog({
  lessonId,
  label = "Take the quiz",
  completed = false,
  className,
}: {
  lessonId: string;
  label?: string;
  completed?: boolean;
  className?: string;
}) {
  if (!hasQuiz(lessonId)) return null;
  const count = quizzes[lessonId].length;

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            className={cn(
              "h-10 w-full justify-center gap-2",
              completed &&
                "bg-orange-500 text-white hover:bg-orange-500/90",
              className,
            )}
          />
        }
      >
        {completed ? <CheckCircle2Icon /> : <LightbulbIcon />}
        {label}
      </DialogTrigger>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HelpCircleIcon className="size-4" />
            </span>
            Check your understanding
          </DialogTitle>
          <DialogDescription>
            {count} quick question{count === 1 ? "" : "s"} with instant feedback. Pass to mark the
            lesson complete.
          </DialogDescription>
        </DialogHeader>
        <Quiz lessonId={lessonId} hideHeader bare />
      </DialogContent>
    </Dialog>
  );
}
