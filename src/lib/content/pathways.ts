import pathwaysData from "@content/pathways.json";

export type Pathway = {
  id: string;
  name: string;
  focus: string;
  recommendedLessons: string[];
  includesAllLessons?: boolean;
  capstone: { title: string; portfolioFormat: string };
};

export const pathways = pathwaysData.pathways as Pathway[];
export const pathwayModel = pathwaysData.model as {
  selectionOptional: boolean;
  allLessonsVisible: boolean;
  note: string;
  placementQuiz: { enabled: boolean; skippable: boolean; effect: string };
};

export function getPathway(id: string): Pathway | undefined {
  return pathways.find((p) => p.id === id);
}

const PATHWAY_ACCENT: Record<string, string> = {
  frontline: "emerald",
  "business-product": "teal",
  "technical-builders": "lime",
  "legal-risk": "amber",
};

export function pathwayAccent(id: string): string {
  return PATHWAY_ACCENT[id] ?? "emerald";
}
