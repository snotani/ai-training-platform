export const siteConfig = {
  name: "AI Training",
  tagline: "AI fluency, built for the whole company.",
  description:
    "An interactive, visual-first AI training platform. Go from everyday AI literacy to shipping autonomous agents - simple on the surface, genuinely deep underneath.",
  url: "https://ai.snotani.com",
};

/**
 * Canonical, absolute base URL for the app. Used for auth redirects (magic
 * links, OAuth) so emails never point at localhost. Prefers an explicit
 * NEXT_PUBLIC_SITE_URL, then the browser origin, then the configured URL.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return siteConfig.url;
}

export type NavItem = {
  title: string;
  href: string;
  description?: string;
};

export const mainNav: NavItem[] = [
  { title: "Pathways", href: "/pathways", description: "Role-based recommended tracks." },
  { title: "Portfolio", href: "/portfolio", description: "Projects I've designed and shipped." },
  { title: "Glossary", href: "/glossary", description: "Every term, in plain English." },
  { title: "Leaderboard", href: "/leaderboard", description: "Team and individual rankings." },
];
