"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LessonRecord = {
  completedAt: string;
  quizScore?: number;
  quizTotal?: number;
};

type ProgressState = {
  lessons: Record<string, LessonRecord>;
  hydrated: boolean;
  setHydrated: () => void;
  markLessonComplete: (
    lessonId: string,
    quiz?: { score: number; total: number },
  ) => void;
  isLessonComplete: (lessonId: string) => boolean;
  /** Merge external records (e.g. from Supabase) keeping the best quiz score. */
  importRecords: (records: Record<string, LessonRecord>) => void;
  reset: () => void;
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      lessons: {},
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      markLessonComplete: (lessonId, quiz) =>
        set((state) => {
          const prev = state.lessons[lessonId];
          const nextScore =
            quiz && (prev?.quizScore === undefined || quiz.score > prev.quizScore)
              ? quiz.score
              : prev?.quizScore;
          return {
            lessons: {
              ...state.lessons,
              [lessonId]: {
                completedAt: prev?.completedAt ?? new Date().toISOString(),
                quizScore: nextScore,
                quizTotal: quiz?.total ?? prev?.quizTotal,
              },
            },
          };
        }),
      isLessonComplete: (lessonId) => Boolean(get().lessons[lessonId]),
      importRecords: (records) =>
        set((state) => {
          const merged = { ...state.lessons };
          for (const [id, rec] of Object.entries(records)) {
            const prev = merged[id];
            merged[id] = {
              completedAt: prev?.completedAt ?? rec.completedAt,
              quizScore: Math.max(prev?.quizScore ?? 0, rec.quizScore ?? 0) || undefined,
              quizTotal: rec.quizTotal ?? prev?.quizTotal,
            };
          }
          return { lessons: merged };
        }),
      reset: () => set({ lessons: {} }),
    }),
    {
      name: "ai-training-progress",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
