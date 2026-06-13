import { FolderGit2Icon } from "lucide-react";

export const metadata = { title: "Portfolio" };

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-primary">Portfolio</p>
        <h1 className="font-heading mt-1.5 text-3xl font-bold tracking-tight sm:text-4xl">
          Portfolio
        </h1>
      </header>

      <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border bg-card px-6 py-20 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-gradient text-white">
          <FolderGit2Icon className="size-7" />
        </span>
        <h2 className="font-heading mt-5 text-xl font-semibold">Coming soon</h2>
        <p className="mt-2 max-w-sm text-pretty text-muted-foreground">
          This is where you&rsquo;ll showcase the projects and artifacts you build as you work
          through the curriculum. Check back soon.
        </p>
      </div>
    </div>
  );
}
