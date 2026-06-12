import Image from "next/image";

import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex size-8 items-center justify-center overflow-hidden rounded-lg shadow-sm ring-1 ring-black/5",
        className,
      )}
      aria-hidden
    >
      <Image
        src="/logo.webp"
        alt=""
        fill
        sizes="32px"
        className="object-cover"
        priority
      />
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
