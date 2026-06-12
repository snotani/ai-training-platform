"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type PreferencesState = {
  pathwayId: string | null;
  hydrated: boolean;
  setHydrated: () => void;
  setPathway: (id: string | null) => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      pathwayId: null,
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      setPathway: (id) => set({ pathwayId: id }),
    }),
    {
      name: "ai-training-prefs",
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);
