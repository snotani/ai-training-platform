import * as React from "react";

import { cn } from "@/lib/utils";

export type CompareItem = {
  name: string;
  highlight?: boolean;
  accent?: "blue" | "teal" | "cyan" | "emerald" | "amber";
  attributes: { label: string; value: string }[];
};

const accentMap: Record<NonNullable<CompareItem["accent"]>, string> = {
  blue: "before:bg-teal-500",
  teal: "before:bg-emerald-500",
  cyan: "before:bg-green-500",
  emerald: "before:bg-lime-500",
  amber: "before:bg-amber-500",
};

/**
 * Renders a comparison as a scannable card grid (not a dense table), per the
 * content design principles. One card per item, listing attribute -> value.
 */
export function CardTable({
  items,
  className,
}: {
  items: CompareItem[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "not-prose my-6 grid gap-4",
        items.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
        className,
      )}
    >
      {items.map((item) => (
        <div
          key={item.name}
          className={cn(
            "relative overflow-hidden rounded-2xl border bg-card p-4 pl-5 transition-shadow hover:shadow-sm",
            "before:absolute before:inset-y-0 before:left-0 before:w-1.5",
            item.accent ? accentMap[item.accent] : "before:bg-primary",
            item.highlight && "ring-1 ring-primary/30",
          )}
        >
          <h4 className="font-heading text-sm font-semibold">{item.name}</h4>
          <dl className="mt-3 space-y-2.5">
            {item.attributes.map((attr) => (
              <div key={attr.label} className="flex flex-col gap-0.5">
                <dt className="text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase">
                  {attr.label}
                </dt>
                <dd className="text-sm text-foreground/90">{attr.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
