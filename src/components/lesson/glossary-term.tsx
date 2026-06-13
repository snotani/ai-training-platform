"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { findTerm } from "@/lib/content/glossary";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

/**
 * Inline glossary term with a hover definition. Usage in MDX:
 *   <Term>token</Term>  or  <Term k="RLHF">human feedback</Term>
 */
export function Term({ k, children }: { k?: string; children: React.ReactNode }) {
  const key = k ?? (typeof children === "string" ? children : "");
  const term = findTerm(key);

  if (!term) return <>{children}</>;

  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <span className="cursor-help font-medium text-foreground underline decoration-primary/40 decoration-dotted underline-offset-4 transition-colors hover:decoration-primary" />
        }
      >
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        <p className="font-heading text-sm font-semibold">{term.term}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{term.short}</p>
        <Link
          href={`/learn/${term.introducedIn}`}
          className="mt-2.5 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Introduced in Lesson {term.introducedIn}
          <ArrowRightIcon className="size-3" />
        </Link>
      </HoverCardContent>
    </HoverCard>
  );
}
