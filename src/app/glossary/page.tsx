import { GlossaryExplorer } from "@/components/glossary/glossary-explorer";

export const metadata = { title: "Glossary" };

export default function GlossaryPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-primary">Glossary</p>
        <h1 className="font-heading mt-1.5 text-3xl font-bold tracking-tight sm:text-4xl">
          Every term, in plain English
        </h1>
        <p className="mt-3 text-muted-foreground text-pretty">
          A living glossary - each term links to the lesson that introduces it. The same definitions
          pop up on hover throughout the lessons.
        </p>
      </header>
      <div className="mt-8">
        <GlossaryExplorer />
      </div>
    </div>
  );
}
