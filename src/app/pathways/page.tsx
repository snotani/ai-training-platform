import { PathwaysExplorer } from "@/components/pathways/pathways-explorer";

export const metadata = { title: "Pathways" };

export default function PathwaysPage() {
  return (
    <div className="mx-auto max-w-8xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-primary">Pathways</p>
        <h1 className="font-heading mt-1.5 text-3xl font-bold tracking-tight sm:text-4xl">
          Pick a track that fits your role
        </h1>
        <p className="mt-3 text-muted-foreground text-pretty">
          Four recommended routes through the curriculum, each ending in a portfolio-ready capstone.
        </p>
      </header>
      <div className="mt-8">
        <PathwaysExplorer />
      </div>
    </div>
  );
}
