export type IndividualRow = {
  id: string;
  name: string;
  departmentName: string | null;
  total: number;
  weekly: number;
  isSeed: boolean;
};

export type TeamRow = {
  id: string;
  name: string;
  total: number;
  weekly: number;
  members: number;
};

// Mirrors supabase/seed.sql so the leaderboard looks alive before Supabase is
// connected. Once configured, real data (seed_members + real users) is used.
export const mockIndividuals: IndividualRow[] = [
  { name: "Maya Chen", departmentName: "Engineering", total: 8420, weekly: 620 },
  { name: "Liam Okafor", departmentName: "Engineering", total: 7180, weekly: 410 },
  { name: "Priya Nair", departmentName: "Data & Analytics", total: 6890, weekly: 540 },
  { name: "Diego Alvarez", departmentName: "Product", total: 6240, weekly: 300 },
  { name: "Sofia Rossi", departmentName: "Design", total: 5910, weekly: 480 },
  { name: "Noah Williams", departmentName: "Engineering", total: 5480, weekly: 210 },
  { name: "Hana Kim", departmentName: "Data & Analytics", total: 5120, weekly: 360 },
  { name: "Omar Haddad", departmentName: "Product", total: 4870, weekly: 260 },
  { name: "Emma Thompson", departmentName: "Marketing", total: 4510, weekly: 320 },
  { name: "Yuki Tanaka", departmentName: "Design", total: 4180, weekly: 190 },
  { name: "Lucas Martin", departmentName: "Sales", total: 3920, weekly: 280 },
  { name: "Aisha Bello", departmentName: "Customer Success", total: 3640, weekly: 240 },
  { name: "Felix Braun", departmentName: "Operations", total: 3380, weekly: 150 },
  { name: "Grace Mwangi", departmentName: "Legal & Risk", total: 3120, weekly: 300 },
  { name: "Carlos Mendes", departmentName: "Engineering", total: 2980, weekly: 120 },
  { name: "Nina Petrova", departmentName: "Data & Analytics", total: 2740, weekly: 200 },
  { name: "Tom Becker", departmentName: "Product", total: 2510, weekly: 90 },
  { name: "Layla Hassan", departmentName: "Marketing", total: 2280, weekly: 160 },
  { name: "Ethan Park", departmentName: "Sales", total: 2040, weekly: 110 },
  { name: "Zoe Dubois", departmentName: "People & HR", total: 1870, weekly: 220 },
  { name: "Ravi Gupta", departmentName: "Customer Success", total: 1620, weekly: 130 },
  { name: "Mia Andersson", departmentName: "Legal & Risk", total: 1410, weekly: 180 },
  { name: "Jonas Vidic", departmentName: "Operations", total: 1180, weekly: 70 },
  { name: "Sara Lindgren", departmentName: "People & HR", total: 940, weekly: 140 },
].map((m, i) => ({ id: `seed-${i}`, isSeed: true, ...m }));

export function aggregateTeams(rows: IndividualRow[]): TeamRow[] {
  const map = new Map<string, TeamRow>();
  for (const r of rows) {
    const key = r.departmentName ?? "Unassigned";
    const existing = map.get(key) ?? { id: key, name: key, total: 0, weekly: 0, members: 0 };
    existing.total += r.total;
    existing.weekly += r.weekly;
    existing.members += 1;
    map.set(key, existing);
  }
  return [...map.values()];
}

export const mockTeams: TeamRow[] = aggregateTeams(mockIndividuals);
