import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex size-8 items-center justify-center rounded-lg bg-brand-gradient text-white shadow-sm",
        className,
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="size-5"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2.5 4 7v10l8 4.5 8-4.5V7l-8-4.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
          opacity="0.6"
        />
        <circle cx="12" cy="12" r="2.4" fill="currentColor" />
        <circle cx="12" cy="4.8" r="1.1" fill="currentColor" />
        <circle cx="18.4" cy="15.6" r="1.1" fill="currentColor" />
        <circle cx="5.6" cy="15.6" r="1.1" fill="currentColor" />
        <path
          d="M12 12 12 4.8M12 12l6.4 3.6M12 12l-6.4 3.6"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2 font-heading", className)}>
      <BrandMark />
      <span className="text-lg font-semibold tracking-tight">AI Training</span>
    </span>
  );
}
