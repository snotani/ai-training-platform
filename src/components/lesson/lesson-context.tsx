"use client";

import * as React from "react";

export type LessonContextValue = {
  lessonId: string;
  /** Called when the learner checks a quiz, with their score. */
  reportQuiz: (score: number, total: number) => void;
  /** Called when the learner finishes an interactive widget. */
  reportInteractive: (interactiveId: string) => void;
};

export const LessonContext = React.createContext<LessonContextValue | null>(null);

export function useLessonContext() {
  return React.useContext(LessonContext);
}
