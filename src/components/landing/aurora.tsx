import { cn } from "@/lib/utils";

/** Decorative animated gradient background. Purely visual. */
export function Aurora({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
    >
      <div className="bg-grid mask-radial-fade absolute inset-0 opacity-40 dark:opacity-20" />
      <div
        className="animate-drift absolute top-[-12%] left-[10%] size-[34rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, var(--brand) 0%, transparent 65%)", opacity: 0.22 }}
      />
      <div
        className="animate-drift absolute top-[-6%] right-[6%] size-[30rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, var(--brand-2) 0%, transparent 65%)", opacity: 0.2, animationDelay: "-6s" }}
      />
      <div
        className="animate-drift absolute top-[20%] left-1/2 size-[28rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, var(--brand-3) 0%, transparent 65%)", opacity: 0.18, animationDelay: "-12s" }}
      />
    </div>
  );
}
