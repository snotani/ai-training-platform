// Presentational metadata for levels: short, appealing hooks + cover images.
// Kept separate from the canonical curriculum.json content source.

export type LevelMeta = { hook: string; cover: string };

export const levelMeta: Record<number, LevelMeta> = {
  1: { hook: "Finally get what AI is really doing - and where it breaks.", cover: "/covers/level-1.png" },
  2: { hook: "Ask sharper questions, get dramatically better answers.", cover: "/covers/level-2.png" },
  3: { hook: "Spot the real opportunities - and the true cost of AI at work.", cover: "/covers/level-3.png" },
  4: { hook: "Reasoning, multimodal, open models: know which to reach for.", cover: "/covers/level-4.png" },
  5: { hook: "Wire AI into workflows that save hours every week.", cover: "/covers/level-5.png" },
  6: { hook: "Prove your AI works - and keep it working in production.", cover: "/covers/level-6.png" },
  7: { hook: "Steer AI with specs and tools, and master the economics.", cover: "/covers/level-7.png" },
  8: { hook: "Give AI your own knowledge so it stops guessing.", cover: "/covers/level-8.png" },
  9: { hook: "Make retrieval fast, precise, and trustworthy at scale.", cover: "/covers/level-9.png" },
  10: { hook: "Build agents that plan, use tools, and finish the job.", cover: "/covers/level-10.png" },
  11: { hook: "Coordinate many agents safely - and govern the risk.", cover: "/covers/level-11.png" },
  12: { hook: "Look under the hood: transformers, tuning, and infrastructure.", cover: "/covers/level-12.png" },
};

export const phaseMeta: Record<string, { tagline: string }> = {
  foundations: { tagline: "Build confident, safe, everyday AI use." },
  adoption: { tagline: "Turn AI into real workplace value." },
  quality: { tagline: "Make AI reliable and cost-aware." },
  data: { tagline: "Ground AI in your own knowledge." },
  agents: { tagline: "Ship and govern autonomous systems." },
  deep: { tagline: "Master the architecture underneath." },
};

// Topic-specific covers for authored lessons; others fall back to the level cover.
export const lessonCovers: Record<string, string> = {
  "1.1": "/covers/lesson-1-1.png",
  "1.2": "/covers/lesson-1-2.png",
  "1.3": "/covers/lesson-1-3.png",
  "1.4": "/covers/lesson-1-4.png",
  "1.project": "/covers/lesson-1-project.png",
};

// One-line "what you'll learn" blurbs for each lesson/mini-project card.
export const lessonBlurbs: Record<string, string> = {
  // L1 - Generative AI Literacy
  "1.1": "How modern AI differs from traditional software.",
  "1.2": "How language models actually predict text.",
  "1.3": "What today's AI can and can't do.",
  "1.4": "Simple rules for safe AI use at work.",
  "1.project": "Map where AI fits in your own role.",
  // L2 - Applied Prompt Engineering & Interaction
  "2.1": "How prompts are read, token by token.",
  "2.2": "The building blocks of an effective prompt.",
  "2.3": "Chain-of-thought, few-shot, and persona techniques.",
  "2.4": "Working within the model's context window.",
  "2.5": "Avoid data leakage and prompt injection.",
  "2.6": "Fact-check AI output before you trust it.",
  "2.project": "Build and test a reusable prompt.",
  // L3 - The AI Economy & Workplace
  "3.1": "Fit AI smoothly into your daily work.",
  "3.2": "What generative AI really costs to run.",
  "3.3": "Find high-value places to apply AI.",
  "3.4": "Roll out AI and tame shadow usage.",
  "3.project": "Pitch an AI use case with its ROI.",
  // L4 - Next-Gen Model Paradigms
  "4.1": "How reasoning models think before answering.",
  "4.2": "Working with image, audio, and text together.",
  "4.3": "Choosing between open, API, and small models.",
  "4.4": "Build vs buy, and evaluating vendors.",
  "4.project": "Recommend the right model for a use case.",
  // L5 - AI Automation Workflows
  "5.1": "Design automations that actually hold up.",
  "5.2": "Automate work with Zapier and Make.",
  "5.3": "Connect tools using APIs and webhooks.",
  "5.4": "Add human checkpoints to AI workflows.",
  "5.5": "Agents that operate your desktop apps.",
  "5.6": "Measure the hours your workflows save.",
  "5.project": "Ship an automation that saves real time.",
  // L6 - AI Evaluation & Reliability
  "6.1": "What benchmarks do and don't tell you.",
  "6.2": "Recognise how and why AI breaks.",
  "6.3": "The metrics that measure AI quality.",
  "6.4": "Use a model to grade model output.",
  "6.5": "Catch drift with ongoing evaluation.",
  "6.project": "Build an eval suite for an AI feature.",
  // L7 - Spec-Driven Dev & Deep Economics
  "7.1": "Steer AI with specs and rules files.",
  "7.2": "Let models call tools and functions.",
  "7.3": "Connect AI to tools via MCP.",
  "7.4": "Optimise cost, latency, and throughput.",
  "7.project": "Wire a model up to real tools.",
  // L8 - Data Foundations & Basic RAG
  "8.1": "How embeddings turn meaning into numbers.",
  "8.2": "Ground AI answers in your own documents.",
  "8.3": "Chunk and clean data for retrieval.",
  "8.4": "Keep retrieval data secure and compliant.",
  "8.project": "Build a basic RAG over your docs.",
  // L9 - Advanced Retrieval & Search Optimisation
  "9.1": "Make retrieval faster and more precise.",
  "9.2": "Hybrid and re-ranked search strategies.",
  "9.3": "Multi-query, HyDE, and feedback retrieval.",
  "9.4": "Measure retrieval relevance and faithfulness.",
  "9.project": "Tune a RAG pipeline for accuracy.",
  // L10 - Autonomous Single-Agent Systems
  "10.1": "Design agents that reason, then act.",
  "10.2": "Give agents short- and long-term memory.",
  "10.3": "Orchestrate agent state with LangGraph.",
  "10.4": "Trace and observe agents in production.",
  "10.5": "Keep agents inside safe boundaries.",
  "10.6": "Test whether your agent actually works.",
  "10.project": "Build an agent that finishes a task.",
  // L11 - Multi-Agent Swarms & Corporate Governance
  "11.1": "Coordinate supervisor and worker agents.",
  "11.2": "Patterns from real enterprise AI apps.",
  "11.3": "Who's accountable when agents act.",
  "11.4": "Enterprise-grade controls for AI systems.",
  "11.5": "Defend against the top LLM threats.",
  "11.project": "Design a governed multi-agent system.",
  // L12 - Model Adaptation & Deep Architecture
  "12.1": "Inside transformers and the attention mechanism.",
  "12.2": "Diffusion and world models, explained.",
  "12.3": "Quantisation and LoRA fine-tuning.",
  "12.4": "Run models on GPU, edge, and on-prem.",
  "12.project": "Plan the infrastructure for a deployment.",
};

export function lessonBlurb(id: string): string {
  return lessonBlurbs[id] ?? "";
}

// AI-generated, lesson-specific cover images (cartoon / 3D character style).
// Lessons not listed here fall back to the animated SVG LessonArt.
export const lessonImages: Record<string, string> = {
  // L1 - Generative AI Literacy
  "1.1": "/lessons/lesson-1-1.webp",
  "1.2": "/lessons/lesson-1-2.webp",
  "1.3": "/lessons/lesson-1-3.webp",
  "1.4": "/lessons/lesson-1-4.webp",
  "1.project": "/lessons/lesson-1-project.webp",
  // L2 - Applied Prompt Engineering & Interaction
  "2.1": "/lessons/lesson-2-1.webp",
  "2.2": "/lessons/lesson-2-2.webp",
  "2.3": "/lessons/lesson-2-3.webp",
  "2.4": "/lessons/lesson-2-4.webp",
  "2.5": "/lessons/lesson-2-5.webp",
  "2.6": "/lessons/lesson-2-6.webp",
  "2.project": "/lessons/lesson-2-project.webp",
  // L3 - The AI Economy & Workplace
  "3.1": "/lessons/lesson-3-1.webp",
  "3.2": "/lessons/lesson-3-2.webp",
  "3.3": "/lessons/lesson-3-3.webp",
  "3.4": "/lessons/lesson-3-4.webp",
  "3.project": "/lessons/lesson-3-project.webp",
  // L4 - Next-Gen Model Paradigms
  "4.1": "/lessons/lesson-4-1.webp",
  "4.2": "/lessons/lesson-4-2.webp",
  "4.3": "/lessons/lesson-4-3.webp",
  "4.4": "/lessons/lesson-4-4.webp",
  "4.project": "/lessons/lesson-4-project.webp",
  // L5 - AI Automation Workflows
  "5.1": "/lessons/lesson-5-1.webp",
  "5.2": "/lessons/lesson-5-2.webp",
  "5.3": "/lessons/lesson-5-3.webp",
  "5.4": "/lessons/lesson-5-4.webp",
  "5.5": "/lessons/lesson-5-5.webp",
  "5.6": "/lessons/lesson-5-6.webp",
  "5.project": "/lessons/lesson-5-project.webp",
  // L6 - AI Evaluation & Reliability
  "6.1": "/lessons/lesson-6-1.webp",
  "6.2": "/lessons/lesson-6-2.webp",
  "6.3": "/lessons/lesson-6-3.webp",
  "6.4": "/lessons/lesson-6-4.webp",
  "6.5": "/lessons/lesson-6-5.webp",
  "6.project": "/lessons/lesson-6-project.webp",
  // L7 - Spec-Driven Dev & Deep Economics
  "7.1": "/lessons/lesson-7-1.webp",
  "7.2": "/lessons/lesson-7-2.webp",
  "7.3": "/lessons/lesson-7-3.webp",
  "7.4": "/lessons/lesson-7-4.webp",
  "7.project": "/lessons/lesson-7-project.webp",
  // L8 - Data Foundations & Basic RAG
  "8.1": "/lessons/lesson-8-1.webp",
  "8.2": "/lessons/lesson-8-2.webp",
  "8.3": "/lessons/lesson-8-3.webp",
  "8.4": "/lessons/lesson-8-4.webp",
  "8.project": "/lessons/lesson-8-project.webp",
  // L9 - Advanced Retrieval & Search Optimisation
  "9.1": "/lessons/lesson-9-1.webp",
  "9.2": "/lessons/lesson-9-2.webp",
  "9.3": "/lessons/lesson-9-3.webp",
  "9.4": "/lessons/lesson-9-4.webp",
  "9.project": "/lessons/lesson-9-project.webp",
  // L10 - Autonomous Single-Agent Systems
  "10.1": "/lessons/lesson-10-1.webp",
  "10.2": "/lessons/lesson-10-2.webp",
  "10.3": "/lessons/lesson-10-3.webp",
  "10.4": "/lessons/lesson-10-4.webp",
  "10.5": "/lessons/lesson-10-5.webp",
  "10.6": "/lessons/lesson-10-6.webp",
  "10.project": "/lessons/lesson-10-project.webp",
  // L11 - Multi-Agent Swarms & Corporate Governance
  "11.1": "/lessons/lesson-11-1.webp",
  "11.2": "/lessons/lesson-11-2.webp",
  "11.3": "/lessons/lesson-11-3.webp",
  "11.4": "/lessons/lesson-11-4.webp",
  "11.5": "/lessons/lesson-11-5.webp",
  "11.project": "/lessons/lesson-11-project.webp",
  // L12 - Model Adaptation & Deep Architecture
  "12.1": "/lessons/lesson-12-1.webp",
  "12.2": "/lessons/lesson-12-2.webp",
  "12.3": "/lessons/lesson-12-3.webp",
  "12.4": "/lessons/lesson-12-4.webp",
  "12.project": "/lessons/lesson-12-project.webp",
};

export function lessonImage(id: string): string | undefined {
  return lessonImages[id];
}

export function levelHook(id: number): string {
  return levelMeta[id]?.hook ?? "";
}

export function levelCover(id: number): string {
  return levelMeta[id]?.cover ?? "/covers/level-1.png";
}

export function lessonCover(lessonId: string, levelId: number): string {
  return lessonCovers[lessonId] ?? levelCover(levelId);
}

export function phaseTagline(id: string): string {
  return phaseMeta[id]?.tagline ?? "";
}
