export type IndividualRow = {
  id: string;
  name: string;
  region: string | null;
  total: number;
  weekly: number;
  isSeed: boolean;
};

// Mirrors supabase/seed.sql so the leaderboard looks alive before Supabase is
// connected. Once configured, real data (seed_members + real users) is used.
// `region` holds the display name; the live path maps slugs via regionName().
// Scores stay realistic: only Level 1 is published (~550 XP max), so everyone
// is still in the AI Novice league.
export const mockIndividuals: IndividualRow[] = [
  { name: "Amara Okafor", region: "Africa", total: 520, weekly: 300 },
  { name: "Kenji Watanabe", region: "Asia", total: 290, weekly: 180 },
  { name: "Lucia Ferrari", region: "Europe", total: 110, weekly: 110 },
].map((m, i) => ({ id: `seed-${i}`, isSeed: true, ...m }));
