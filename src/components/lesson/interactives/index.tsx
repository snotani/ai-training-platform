"use client";

import { PickTheRightTool } from "@/components/lesson/interactives/pick-the-right-tool";
import { BeTheModel } from "@/components/lesson/interactives/be-the-model";
import { SpotTheHallucination } from "@/components/lesson/interactives/spot-the-hallucination";
import { PasteOrNot } from "@/components/lesson/interactives/paste-or-not";
import { WhoDoesTheThinking } from "@/components/lesson/interactives/who-does-the-thinking";
import { GuessTheType } from "@/components/lesson/interactives/guess-the-type";
import { GenaiMythbuster } from "@/components/lesson/interactives/genai-mythbuster";
import { TokenSplitter } from "@/components/lesson/interactives/token-splitter";
import { OrderThePipeline } from "@/components/lesson/interactives/order-the-pipeline";
import { PredictTheNextToken } from "@/components/lesson/interactives/predict-the-next-token";

const REGISTRY: Record<string, React.ComponentType> = {
  "pick-the-right-tool": PickTheRightTool,
  "be-the-model": BeTheModel,
  "spot-the-hallucination": SpotTheHallucination,
  "paste-or-not": PasteOrNot,
  "who-does-the-thinking": WhoDoesTheThinking,
  "guess-the-type": GuessTheType,
  "genai-mythbuster": GenaiMythbuster,
  "token-splitter": TokenSplitter,
  "order-the-pipeline": OrderThePipeline,
  "predict-the-next-token": PredictTheNextToken,
};

export function Interactive({ id }: { id: string }) {
  const Component = REGISTRY[id];
  if (!Component) return null;
  return <Component />;
}
