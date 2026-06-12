import { CurriculumExplorer } from "@/components/curriculum/curriculum-explorer";

export const metadata = { title: "Curriculum" };

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-primary">The curriculum</p>
        <h1 className="font-heading mt-1.5 text-3xl font-bold tracking-tight sm:text-4xl">
          From AI literacy to autonomous agents
        </h1>
        <p className="mt-3 text-muted-foreground text-pretty">
          Twelve levels, each a focused set of lessons. Pick a pathway to get a recommended track,
          or wander freely - every lesson is open, no gates.
        </p>
      </header>
      <div className="mt-10">
        <CurriculumExplorer />
      </div>
    </div>
  );
}
