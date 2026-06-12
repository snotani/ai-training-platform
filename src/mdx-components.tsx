import * as React from "react";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";

import { cn } from "@/lib/utils";
import { Mermaid } from "@/components/lesson/mermaid";
import {
  Callout,
  Example,
  Hook,
  HowItWorks,
  Recap,
  Visual,
  ZoneBoard,
} from "@/components/lesson/sections";
import { Expand } from "@/components/lesson/expand";
import { CardTable } from "@/components/lesson/card-table";
import { Term } from "@/components/lesson/glossary-term";
import { QuizDialog } from "@/components/lesson/quiz-dialog";
import { Interactive } from "@/components/lesson/interactives";

function CodeBlock({ children }: { children?: React.ReactNode }) {
  const child = React.Children.toArray(children)[0] as
    | React.ReactElement<{ className?: string; children?: string }>
    | undefined;
  const className = child?.props?.className ?? "";
  const raw = typeof child?.props?.children === "string" ? child.props.children : "";

  if (className.includes("language-mermaid")) {
    return <Mermaid chart={raw} />;
  }

  return (
    <pre className="not-prose my-5 overflow-x-auto rounded-xl border bg-muted/50 p-4 text-[0.82rem] leading-relaxed">
      <code className="font-mono">{raw || child?.props?.children}</code>
    </pre>
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ className, ...props }) => (
      <h1 className={cn("font-heading mt-8 mb-4 text-2xl font-semibold tracking-tight", className)} {...props} />
    ),
    h2: ({ className, ...props }) => (
      <h2 className={cn("font-heading mt-10 mb-3 text-xl font-semibold tracking-tight", className)} {...props} />
    ),
    h3: ({ className, ...props }) => (
      <h3 className={cn("font-heading mt-6 mb-2 text-lg font-semibold", className)} {...props} />
    ),
    p: ({ className, ...props }) => (
      <p className={cn("my-4 text-[0.95rem] leading-relaxed text-foreground/90", className)} {...props} />
    ),
    ul: ({ className, ...props }) => (
      <ul className={cn("my-4 space-y-1.5 pl-5 marker:text-primary/60 [&>li]:list-disc", className)} {...props} />
    ),
    ol: ({ className, ...props }) => (
      <ol className={cn("my-4 space-y-1.5 pl-5 marker:text-muted-foreground [&>li]:list-decimal", className)} {...props} />
    ),
    li: ({ className, ...props }) => (
      <li className={cn("pl-1 text-[0.95rem] leading-relaxed text-foreground/90", className)} {...props} />
    ),
    a: ({ className, href, ...props }) => (
      <Link
        href={(href as string) ?? "#"}
        className={cn("font-medium text-primary underline-offset-4 hover:underline", className)}
        {...props}
      />
    ),
    strong: ({ className, ...props }) => (
      <strong className={cn("font-semibold text-foreground", className)} {...props} />
    ),
    em: ({ className, ...props }) => <em className={cn("italic", className)} {...props} />,
    blockquote: ({ className, ...props }) => (
      <blockquote className={cn("my-5 border-l-2 border-primary/40 pl-4 text-muted-foreground italic", className)} {...props} />
    ),
    hr: ({ className, ...props }) => <hr className={cn("my-8 border-border", className)} {...props} />,
    code: ({ className, ...props }) => (
      <code
        className={cn(
          "rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.82em] text-foreground",
          className,
        )}
        {...props}
      />
    ),
    pre: CodeBlock,
    table: ({ className, ...props }) => (
      <div className="not-prose my-6 overflow-x-auto rounded-xl border">
        <table className={cn("w-full border-collapse text-sm", className)} {...props} />
      </div>
    ),
    thead: ({ className, ...props }) => <thead className={cn("bg-muted/50", className)} {...props} />,
    th: ({ className, ...props }) => (
      <th className={cn("border-b px-3 py-2 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase", className)} {...props} />
    ),
    td: ({ className, ...props }) => (
      <td className={cn("border-b px-3 py-2 align-top text-foreground/90 last:border-r-0", className)} {...props} />
    ),
    tr: ({ className, ...props }) => <tr className={cn("last:[&>td]:border-b-0", className)} {...props} />,
    // Custom lesson components
    Hook,
    Example,
    HowItWorks,
    Visual,
    Recap,
    Callout,
    ZoneBoard,
    Expand,
    CardTable,
    Term,
    Quiz: ({ lessonId }: { lessonId?: string }) =>
      lessonId ? (
        <div className="not-prose my-8">
          <QuizDialog lessonId={lessonId} />
        </div>
      ) : null,
    Interactive,
    Mermaid,
    ...components,
  };
}
