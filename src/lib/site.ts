export const siteConfig = {
  name: "AI Training",
  tagline: "AI fluency, built for the whole company.",
  description:
    "An interactive, visual-first AI training platform. Go from everyday AI literacy to shipping autonomous agents - simple on the surface, genuinely deep underneath.",
  url: "https://ai-training.example.com",
};

export type NavItem = {
  title: string;
  href: string;
  description?: string;
};

export const mainNav: NavItem[] = [
  { title: "Learn", href: "/learn", description: "The 12-level curriculum map." },
  { title: "Pathways", href: "/pathways", description: "Role-based recommended tracks." },
  { title: "Portfolio", href: "/portfolio", description: "Projects I've designed and shipped." },
  { title: "Glossary", href: "/glossary", description: "Every term, in plain English." },
  { title: "Leaderboard", href: "/leaderboard", description: "Team and individual rankings." },
];
