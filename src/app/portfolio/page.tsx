import {
  ArrowUpRightIcon,
  CodeIcon,
  TrophyIcon,
  SwordsIcon,
  DramaIcon,
  RouteIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/link-button";

export const metadata = { title: "Portfolio" };

type Highlight = { icon: React.ComponentType<{ className?: string }>; title: string; body: string };

type Project = {
  title: string;
  tagline: string;
  description: string;
  repo: string;
  status: string;
  stack: string[];
  highlights: Highlight[];
  lifecycle: string[];
};

const projects: Project[] = [
  {
    title: "The Oracle — World Cup 2026 prediction agent",
    tagline: "An explainable AI agent that predicts FIFA World Cup 2026 matches.",
    description:
      "One modular agent built to teach the full agent lifecycle on camera: problem → spec → spec-driven build → evals → results. Every module declares what it does and why, and every prediction emits a step-by-step run trace you can watch replay in the dashboard.",
    repo: "https://github.com/snotani/worldcup-oracle",
    status: "Live",
    stack: ["Python", "TypeScript", "Next.js", "Cursor Agent SDK", "FastAPI", "SQLite", "ESPN API"],
    highlights: [
      {
        icon: TrophyIcon,
        title: "Beat the bookies",
        body: "Backtests predictions against honest baselines to measure real accuracy.",
      },
      {
        icon: SwordsIcon,
        title: "Model battle",
        body: "Runs the same agent across GPT, Claude, Gemini, and Grok on one leaderboard.",
      },
      {
        icon: DramaIcon,
        title: "The persona",
        body: "Wraps identical predictions in a character voice for shareable cards.",
      },
    ],
    lifecycle: ["Problem", "Spec", "Spec-driven build", "Tools & data", "Evals", "Results", "Explainability"],
  },
];

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-md">
      <span className="h-1 w-full bg-brand-gradient" />

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-heading text-lg font-semibold leading-tight">{project.title}</h2>
          <Badge variant="secondary" className="shrink-0">
            {project.status}
          </Badge>
        </div>

        <p className="mt-2 text-sm font-medium text-primary text-pretty">{project.tagline}</p>
        <p className="mt-3 text-sm text-muted-foreground text-pretty">{project.description}</p>

        {/* Highlights */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {project.highlights.map((h) => {
            const Icon = h.icon;
            return (
              <div key={h.title} className="rounded-xl border bg-muted/40 p-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-brand-gradient text-white">
                  <Icon className="size-4" />
                </span>
                <p className="mt-2 text-sm font-semibold leading-tight">{h.title}</p>
                <p className="mt-1 text-xs text-muted-foreground text-pretty">{h.body}</p>
              </div>
            );
          })}
        </div>

        {/* Lifecycle */}
        <div className="mt-5">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <RouteIcon className="size-3.5" />
            Agent lifecycle
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {project.lifecycle.map((step, i) => (
              <span key={step} className="flex items-center gap-1.5">
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-foreground/80">
                  {step}
                </span>
                {i < project.lifecycle.length - 1 && (
                  <span className="text-muted-foreground/40">&rarr;</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Stack */}
        <div className="mt-5">
          <p className="text-xs font-medium text-muted-foreground">Built with</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          <LinkButton href={project.repo} target="_blank" rel="noopener noreferrer" size="sm">
            <CodeIcon />
            View on GitHub
            <ArrowUpRightIcon />
          </LinkButton>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-primary">Portfolio</p>
        <h1 className="font-heading mt-1.5 text-3xl font-bold tracking-tight sm:text-4xl">
          Portfolio
        </h1>
        <p className="mt-3 text-muted-foreground text-pretty">
          Projects and artifacts built while working through the curriculum.
        </p>
      </header>

      <div className={cn("mt-10 grid gap-6", projects.length > 1 && "lg:grid-cols-2")}>
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </div>
  );
}
