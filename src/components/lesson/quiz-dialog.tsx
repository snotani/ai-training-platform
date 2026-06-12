"use client";

import * as React from "react";
import { HelpCircleIcon } from "lucide-react";

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
  className,
}: {
  lessonId: string;
  label?: string;
  className?: string;
}) {
  if (!hasQuiz(lessonId)) return null;
  const count = quizzes[lessonId].length;

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button className={cn("h-10 w-full justify-center gap-2", className)} />
        }
      >
        <HelpCircleIcon />
        {label}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HelpCircleIcon className="size-4" />
            </span>
            Check your understanding
          </DialogTitle>
          <DialogDescription>
            {count} quick question{count === 1 ? "" : "s"} with instant feedback.
          </DialogDescription>
        </DialogHeader>
        <Quiz lessonId={lessonId} hideHeader bare />
      </DialogContent>
    </Dialog>
  );
}
