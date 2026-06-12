"use client";

import { PickTheRightTool } from "@/components/lesson/interactives/pick-the-right-tool";
import { BeTheModel } from "@/components/lesson/interactives/be-the-model";
import { SpotTheHallucination } from "@/components/lesson/interactives/spot-the-hallucination";
import { PasteOrNot } from "@/components/lesson/interactives/paste-or-not";

const REGISTRY: Record<string, React.ComponentType> = {
  "pick-the-right-tool": PickTheRightTool,
  "be-the-model": BeTheModel,
  "spot-the-hallucination": SpotTheHallucination,
  "paste-or-not": PasteOrNot,
};

export function Interactive({ id }: { id: string }) {
  const Component = REGISTRY[id];
  if (!Component) return null;
  return <Component />;
}
