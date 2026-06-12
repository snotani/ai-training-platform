"use client";

import * as React from "react";
import { CheckCircle2Icon, MousePointerClickIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function InteractiveShell({
  title,
  subtitle,
  complete,
  children,
}: {
  title: string;
  subtitle?: string;
  complete?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="not-prose my-8 overflow-hidden rounded-2xl border bg-card">
      <header className="flex items-start gap-3 border-b bg-muted/30 px-5 py-3.5">
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand-gradient text-white">
          <MousePointerClickIcon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[0.7rem] font-semibold tracking-wide text-primary uppercase">
              Interactive
            </span>
            {complete && (
              <span className="inline-flex items-center gap-1 text-[0.7rem] font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2Icon className="size-3.5" /> Done
              </span>
            )}
          </div>
          <h3 className="font-heading text-base font-semibold">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </header>
      <div className={cn("p-5")}>{children}</div>
    </section>
  );
}
