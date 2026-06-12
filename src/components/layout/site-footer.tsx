import Link from "next/link";

import { siteConfig, mainNav } from "@/lib/site";
import { BrandWordmark } from "@/components/brand-mark";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div className="max-w-sm">
            <BrandWordmark />
            <p className="mt-3 text-sm text-muted-foreground">{siteConfig.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <FooterCol title="Platform" links={mainNav} />
            <FooterCol
              title="Your progress"
              links={[
                { title: "Profile", href: "/profile" },
                { title: "Leaderboard", href: "/leaderboard" },
              ]}
            />
            <FooterCol
              title="More"
              links={[
                { title: "Curriculum", href: "/learn" },
                { title: "Glossary", href: "/glossary" },
                { title: "Portfolio", href: "/portfolio" },
                { title: "Admin", href: "/admin" },
              ]}
            />
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. An interactive AI training platform.</p>
          <p>Built for teams. Visual-first. Genuinely deep.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { title: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-medium">{title}</h3>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.href + l.title}>
            <Link
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
