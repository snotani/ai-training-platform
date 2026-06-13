"use client";

import * as React from "react";
import { ListIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type TocItem = { id: string; text: string; level: number };

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 64) || "section"
  );
}

/**
 * Two-column lesson reader: a sticky left sidebar that tracks the lesson's
 * sections (scrollspy, built from the rendered h2/h3 headings) plus a thin
 * reading-progress bar pinned under the site header.
 */
export function LessonReader({ children }: { children: React.ReactNode }) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [items, setItems] = React.useState<TocItem[]>([]);
  const [activeId, setActiveId] = React.useState<string>("");
  const [progress, setProgress] = React.useState(0);

  // Always open a lesson at the top (ignore any restored scroll position).
  React.useEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0, left: 0 });
  }, []);

  // Build the table of contents from the rendered headings.
  React.useEffect(() => {
    const root = contentRef.current;
    if (!root) return;

    const heads = Array.from(root.querySelectorAll<HTMLElement>("h2, h3"));
    const seen = new Set<string>();
    const toc: TocItem[] = heads.map((el) => {
      const text = (el.textContent ?? "").trim();
      let id = el.id || slugify(text);
      while (seen.has(id)) id = `${id}-x`;
      seen.add(id);
      el.id = id;
      el.style.scrollMarginTop = "96px";
      return { id, text, level: el.tagName === "H2" ? 2 : 3 };
    });
    setItems(toc);
  }, []);

  // Scrollspy + reading progress.
  React.useEffect(() => {
    const root = contentRef.current;
    if (!root) return;

    const onScroll = () => {
      const total = root.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-root.getBoundingClientRect().top, 0), Math.max(total, 1));
      setProgress(total > 0 ? Math.min(100, Math.round((scrolled / total) * 100)) : 100);

      let current = "";
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= 120) current = it.id;
      }
      if (current) setActiveId(current);
      else if (items.length) setActiveId((prev) => prev || items[0].id);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  return (
    <>
      <div className="sticky top-16 z-40 -mx-4 h-1 bg-border/40 sm:-mx-6 lg:-mx-8">
        <div
          className="h-full bg-primary transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="pt-6 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
        <aside className="hidden lg:block">
          {items.length > 0 && (
            <nav className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto py-1 pr-2">
              <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <ListIcon className="size-3.5" />
                On this page
              </p>
              <ul className="border-l border-border">
                {items.map((it) => (
                  <li key={it.id}>
                    <a
                      href={`#${it.id}`}
                      className={cn(
                        "-ml-px block border-l-2 py-1.5 text-sm leading-snug transition-colors",
                        it.level === 3 ? "pl-6" : "pl-3",
                        activeId === it.id
                          ? "border-primary font-medium text-primary"
                          : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                      )}
                    >
                      {it.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </aside>

        <div ref={contentRef} className="min-w-0">
          {children}
        </div>
      </div>
    </>
  );
}
