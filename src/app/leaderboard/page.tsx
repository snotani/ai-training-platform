import { createClient } from "@/lib/supabase/server";
import { mockIndividuals, type IndividualRow } from "@/lib/leaderboard/mock";
import { regionName } from "@/lib/gamification/regions";
import { LeaderboardView } from "@/components/leaderboard/leaderboard-view";

export const metadata = { title: "Leaderboard" };

async function loadData(): Promise<{ individuals: IndividualRow[]; live: boolean }> {
  const supabase = await createClient();
  if (!supabase) return { individuals: mockIndividuals, live: false };

  const { data: ind } = await supabase.from("leaderboard_individual").select("*");

  if (!ind || ind.length === 0) {
    return { individuals: mockIndividuals, live: false };
  }

  const individuals: IndividualRow[] = ind.map((r) => ({
    id: r.id ?? Math.random().toString(36),
    name: r.display_name ?? "Anonymous learner",
    region: regionName(r.region),
    total: r.total_xp ?? 0,
    weekly: r.weekly_xp ?? 0,
    isSeed: r.is_seed ?? false,
  }));

  return { individuals, live: true };
}

export default async function LeaderboardPage() {
  const { individuals, live } = await loadData();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-primary">Leaderboard</p>
        <h1 className="font-heading mt-1.5 text-3xl font-bold tracking-tight sm:text-4xl">
          Friendly competition
        </h1>
        <p className="mt-3 text-muted-foreground text-pretty">
          See where you stand, then filter by league or region to find your peers. Sign in and pick
          a region to join in.
          {!live && " (Showing sample data until Supabase is connected.)"}
        </p>
      </header>
      <div className="mt-8">
        <LeaderboardView individuals={individuals} />
      </div>
    </div>
  );
}
