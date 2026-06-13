"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRightIcon, SearchIcon } from "lucide-react";

import { glossaryTerms } from "@/lib/content/glossary";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function GlossaryExplorer() {
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return glossaryTerms;
    return glossaryTerms.filter(
      (t) => t.term.toLowerCase().includes(q) || t.short.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div>
      <div className="relative max-w-md">
        <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search terms..."
          className="h-10 pl-9"
        />
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "term" : "terms"}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {filtered.map((t) => {
          return (
            <div key={t.term} className="rounded-2xl border bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-heading font-semibold">{t.term}</h3>
                {t.status === "forward-reference" && (
                  <Badge variant="outline" className="shrink-0">
                    Coming up
                  </Badge>
                )}
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t.short}</p>
              <Link
                href={`/learn/${t.introducedIn}`}
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Lesson {t.introducedIn}
                <ArrowUpRightIcon className="size-3" />
              </Link>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          No terms match &ldquo;{query}&rdquo;.
        </p>
      )}
    </div>
  );
}
