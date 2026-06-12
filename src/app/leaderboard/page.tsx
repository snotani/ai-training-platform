import { createClient } from "@/lib/supabase/server";
import {
  mockIndividuals,
  mockTeams,
  type IndividualRow,
  type TeamRow,
} from "@/lib/leaderboard/mock";
import { LeaderboardView } from "@/components/leaderboard/leaderboard-view";

export const metadata = { title: "Leaderboard" };

async function loadData(): Promise<{
  individuals: IndividualRow[];
  teams: TeamRow[];
  live: boolean;
}> {
  const supabase = await createClient();
  if (!supabase) return { individuals: mockIndividuals, teams: mockTeams, live: false };

  const [{ data: ind }, { data: team }, { data: depts }] = await Promise.all([
    supabase.from("leaderboard_individual").select("*"),
    supabase.from("leaderboard_team").select("*"),
    supabase.from("departments").select("id, name"),
  ]);

  if (!ind || ind.length === 0) {
    return { individuals: mockIndividuals, teams: mockTeams, live: false };
  }

  const deptMap = new Map((depts ?? []).map((d) => [d.id, d.name]));
  const individuals: IndividualRow[] = ind.map((r) => ({
    id: r.id ?? Math.random().toString(36),
    name: r.display_name ?? "Anonymous learner",
    departmentName: r.department_id ? (deptMap.get(r.department_id) ?? null) : null,
    total: r.total_xp ?? 0,
    weekly: r.weekly_xp ?? 0,
    isSeed: r.is_seed ?? false,
  }));
  const teams: TeamRow[] = (team ?? [])
    .filter((t) => (t.members ?? 0) > 0)
    .map((t) => ({
      id: t.department_id ?? "",
      name: t.department_name ?? "",
      total: t.total_xp ?? 0,
      weekly: t.weekly_xp ?? 0,
      members: t.members ?? 0,
    }));

  return { individuals, teams, live: true };
}

export default async function LeaderboardPage() {
  const { individuals, teams, live } = await loadData();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-primary">Leaderboard</p>
        <h1 className="font-heading mt-1.5 text-3xl font-bold tracking-tight sm:text-4xl">
          Friendly competition, by team
        </h1>
        <p className="mt-3 text-muted-foreground text-pretty">
          Department-vs-department keeps it collaborative. Sign in and pick your department to join.
          {!live && " (Showing sample data until Supabase is connected.)"}
        </p>
      </header>
      <div className="mt-8">
        <LeaderboardView individuals={individuals} teams={teams} />
      </div>
    </div>
  );
}
