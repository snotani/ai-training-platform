// Your personal project showcase. Edit this file to feature your own work.
// Drop optional screenshots in /public/projects and set `image` to e.g. "/projects/my-app.png".

export type Project = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  year?: string;
  role?: string;
  links?: { label: string; href: string }[];
  image?: string;
  accent?: "blue" | "teal" | "cyan" | "emerald" | "amber";
  featured?: boolean;
};

export const owner = {
  name: "Your Name",
  headline: "AI engineer & builder",
  bio: "A showcase of things I've designed and shipped - from RAG systems and agents to internal tooling and this training platform itself.",
  links: [
    { label: "GitHub", href: "https://github.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
  ] as { label: string; href: string }[],
};

export const projects: Project[] = [
  {
    slug: "ai-training-platform",
    title: "AI Training Platform",
    summary:
      "This very platform - a visual-first, interactive curriculum that takes teams from AI literacy to building agents, with gamification and analytics.",
    tags: ["Next.js", "TypeScript", "Supabase", "MDX"],
    year: "2026",
    role: "Design + build",
    accent: "blue",
    featured: true,
    links: [{ label: "Live", href: "/" }],
  },
  {
    slug: "support-triage-agent",
    title: "Support Triage Agent",
    summary:
      "A supervisor/worker multi-agent system that classifies inbound tickets, retrieves relevant docs, and drafts grounded replies with human-in-the-loop approval.",
    tags: ["Agents", "LangGraph", "RAG", "HITL"],
    year: "2025",
    role: "AI engineer",
    accent: "teal",
    featured: true,
    links: [{ label: "Case study", href: "#" }],
  },
  {
    slug: "docs-rag-assistant",
    title: "Docs RAG Assistant",
    summary:
      "Retrieval-augmented assistant over an internal knowledge base, with hybrid search, re-ranking, and faithfulness evals to keep answers grounded.",
    tags: ["RAG", "Embeddings", "Vector DB"],
    year: "2025",
    role: "AI engineer",
    accent: "cyan",
    links: [{ label: "Source", href: "#" }],
  },
  {
    slug: "prompt-eval-harness",
    title: "Prompt Eval Harness",
    summary:
      "An LLM-as-judge evaluation pipeline with a golden dataset and regression testing, wired into CI to catch quality drift before it ships.",
    tags: ["Evals", "LLM-as-judge", "CI"],
    year: "2024",
    role: "AI engineer",
    accent: "emerald",
    links: [{ label: "Source", href: "#" }],
  },
  {
    slug: "automation-suite",
    title: "No-Code Automation Suite",
    summary:
      "A set of AI-powered workflow automations connecting CRM, email, and internal tools via webhooks - cutting hours of manual triage each week.",
    tags: ["Automation", "Webhooks", "Workflows"],
    year: "2024",
    role: "Builder",
    accent: "amber",
    links: [{ label: "Write-up", href: "#" }],
  },
];
