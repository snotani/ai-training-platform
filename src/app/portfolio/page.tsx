import Link from "next/link";
import Image from "next/image";
import { ArrowUpRightIcon, FolderGit2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import { owner, projects, type Project } from "@/content/projects";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Portfolio" };

const ACCENT_BAR: Record<string, string> = {
  blue: "from-blue-500 to-cyan-500",
  teal: "from-teal-500 to-emerald-500",
  cyan: "from-cyan-500 to-blue-500",
  emerald: "from-emerald-500 to-lime-500",
  amber: "from-amber-500 to-orange-500",
};

function isExternal(href: string) {
  return href.startsWith("http");
}

function ProjectLinks({ links }: { links?: Project["links"] }) {
  if (!links || links.length === 0) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-3 border-t pt-3">
      {links.map((l) => (
        <Link
          key={l.label + l.href}
          href={l.href}
          target={isExternal(l.href) ? "_blank" : undefined}
          rel={isExternal(l.href) ? "noreferrer" : undefined}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          {l.label}
          <ArrowUpRightIcon className="size-3" />
        </Link>
      ))}
    </div>
  );
}

function ProjectCard({ project, featured }: { project: Project; featured?: boolean }) {
  const accent = ACCENT_BAR[project.accent ?? "blue"];
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:shadow-lg",
        featured && "lg:flex-row",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-muted",
          featured ? "aspect-[16/10] lg:aspect-auto lg:w-1/2" : "aspect-[16/9]",
        )}
      >
        {project.image ? (
          <Image
            src={project.image}
            alt=""
            fill
            sizes={featured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 100vw, 33vw"}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className={cn("flex size-full items-center justify-center bg-gradient-to-br", accent)}>
            <FolderGit2Icon className="size-10 text-white/80" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {project.year && <span>{project.year}</span>}
          {project.role && (
            <>
              <span aria-hidden>&middot;</span>
              <span>{project.role}</span>
            </>
          )}
        </div>
        <h3 className="font-heading mt-1.5 text-lg font-semibold">{project.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.summary}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <Badge key={t} variant="secondary">
              {t}
            </Badge>
          ))}
        </div>
        <div className="mt-auto">
          <ProjectLinks links={project.links} />
        </div>
      </div>
    </article>
  );
}

export default function PortfolioPage() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-primary">Portfolio</p>
        <h1 className="font-heading mt-1.5 text-3xl font-bold tracking-tight sm:text-4xl">
          {owner.name}
        </h1>
        <p className="mt-1 text-lg text-muted-foreground">{owner.headline}</p>
        <p className="mt-3 text-muted-foreground text-pretty">{owner.bio}</p>
        {owner.links.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {owner.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                {l.label}
                <ArrowUpRightIcon className="size-3.5" />
              </Link>
            ))}
          </div>
        )}
      </header>

      {featured.length > 0 && (
        <section className="mt-10 space-y-5">
          <h2 className="font-heading text-lg font-semibold">Featured</h2>
          <div className="space-y-5">
            {featured.map((p) => (
              <ProjectCard key={p.slug} project={p} featured />
            ))}
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section className="mt-12 space-y-5">
          <h2 className="font-heading text-lg font-semibold">More projects</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
