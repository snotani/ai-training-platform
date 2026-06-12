import Link from "next/link";
import { FlagIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { pathways, pathwayAccent } from "@/lib/content/pathways";
import { Reveal } from "@/components/landing/reveal";

const ACCENT_BAR: Record<string, string> = {
  emerald: "bg-emerald-500",
  teal: "bg-teal-500",
  lime: "bg-lime-500",
  amber: "bg-amber-500",
};

export function PathwaysPreview() {
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Find your path
          </h2>
          <p className="mt-3 text-muted-foreground">
            Role-based tracks, each ending in a hands-on capstone. Optional - every lesson stays open
            to everyone.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {pathways.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <Link
                href="/pathways"
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-5 pl-6 transition-all hover:-translate-y-0.5 hover:shadow-md",
                )}
              >
                <span
                  className={cn(
                    "absolute inset-y-0 left-0 w-1.5",
                    ACCENT_BAR[pathwayAccent(p.id)],
                  )}
                />
                <h3 className="font-heading font-semibold">{p.name}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.focus}</p>
                <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                  <span>{p.recommendedLessons.length} lessons</span>
                  <span className="inline-flex items-center gap-1">
                    <FlagIcon className="size-3" /> Capstone
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
