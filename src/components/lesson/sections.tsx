import * as React from "react";
import {
  CheckCircle2Icon,
  CircleCheckIcon,
  CircleXIcon,
  CogIcon,
  InfoIcon,
  LightbulbIcon,
  SparklesIcon,
  TriangleAlertIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

export function Hook({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose my-6 flex items-center gap-4 rounded-2xl bg-brand-gradient/[0.04] p-5 ring-1 ring-primary/15">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-sm">
        <SparklesIcon className="size-4.5" />
      </div>
      <div className="text-pretty text-lg leading-relaxed font-medium text-foreground/90 [&>p]:m-0">
        {children}
      </div>
    </div>
  );
}

export function Example({
  title = "The simple idea",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="not-prose my-6 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-5">
      <div className="mb-2 flex items-center gap-2 text-amber-700 dark:text-amber-300">
        <LightbulbIcon className="size-4" />
        <span className="text-xs font-semibold tracking-wide uppercase">{title}</span>
      </div>
      <div className="lesson-rich text-[0.95rem] leading-relaxed text-foreground/90">
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({
  icon,
  children,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="not-prose mt-10 mb-4 flex items-center gap-2.5">
      {icon && (
        <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </span>
      )}
      <h2 className="font-heading text-xl font-semibold tracking-tight">{children}</h2>
    </div>
  );
}

export function HowItWorks({ children }: { children: React.ReactNode }) {
  return <SectionHeading icon={<CogIcon className="size-4" />}>{children}</SectionHeading>;
}

export function Visual({
  caption,
  children,
}: {
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="not-prose my-6 overflow-hidden rounded-2xl border bg-card">
      <div className="bg-dotted px-3 py-4 sm:px-6">{children}</div>
      {caption && (
        <figcaption className="border-t bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground">
          <span className="font-medium text-foreground/70">Visual.</span> {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function Recap({ items, children }: { items?: string[]; children?: React.ReactNode }) {
  return (
    <section className="not-prose my-8 rounded-2xl border border-primary/20 bg-primary/[0.04] p-5">
      <div className="mb-3 flex items-center gap-2 text-primary">
        <CheckCircle2Icon className="size-4.5" />
        <span className="font-heading text-sm font-semibold tracking-wide uppercase">Recap</span>
      </div>
      {items ? (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2.5 text-[0.95rem] leading-relaxed">
              <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-primary/70" />
              <span className="text-foreground/90">{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="lesson-rich">{children}</div>
      )}
    </section>
  );
}

export function ZoneBoard({
  greenTitle = "Green zone - use freely",
  green,
  redTitle = "Red zone - verify",
  red,
}: {
  greenTitle?: string;
  green: string[];
  redTitle?: string;
  red: string[];
}) {
  return (
    <div className="not-prose my-6 grid gap-3 sm:grid-cols-2">
      <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.05] p-4">
        <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
          <CircleCheckIcon className="size-4" /> {greenTitle}
        </p>
        <ul className="space-y-2">
          {green.map((g, i) => (
            <li key={i} className="flex gap-2 text-sm text-foreground/90">
              <CircleCheckIcon className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
              <span>{g}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-destructive/25 bg-destructive/[0.05] p-4">
        <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-destructive">
          <CircleXIcon className="size-4" /> {redTitle}
        </p>
        <ul className="space-y-2">
          {red.map((r, i) => (
            <li key={i} className="flex gap-2 text-sm text-foreground/90">
              <CircleXIcon className="mt-0.5 size-3.5 shrink-0 text-destructive" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const calloutStyles = {
  note: {
    icon: InfoIcon,
    cls: "border-teal-500/20 bg-teal-500/[0.06] text-teal-700 dark:text-teal-300",
  },
  tip: {
    icon: LightbulbIcon,
    cls: "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-700 dark:text-emerald-300",
  },
  warning: {
    icon: TriangleAlertIcon,
    cls: "border-amber-500/25 bg-amber-500/[0.07] text-amber-700 dark:text-amber-300",
  },
};

export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: keyof typeof calloutStyles;
  title?: string;
  children: React.ReactNode;
}) {
  const { icon: Icon, cls } = calloutStyles[type];
  return (
    <div className={cn("not-prose my-5 flex gap-3 rounded-xl border p-4", cls)}>
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div className="min-w-0 text-[0.9rem] leading-relaxed text-foreground/90">
        {title && <p className="mb-1 font-semibold text-foreground">{title}</p>}
        {children}
      </div>
    </div>
  );
}
