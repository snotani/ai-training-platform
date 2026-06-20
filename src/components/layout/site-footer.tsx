import Link from "next/link";

import { siteConfig, mainNav } from "@/lib/site";
import { BrandWordmark } from "@/components/brand-mark";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/60">
      <div className="mx-auto max-w-8xl px-4 py-7 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <BrandWordmark />
          </div>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {[...mainNav, { title: "Profile", href: "/profile" }].map((l) => (
              <Link
                key={l.href + l.title}
                href={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-6 border-t border-border/60 pt-5 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. An interactive AI training platform.</p>
        </div>
      </div>
    </footer>
  );
}
