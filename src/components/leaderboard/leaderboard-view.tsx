"use client";

import * as React from "react";
import { CrownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-context";
import { rankForXp, RANKS } from "@/lib/gamification/config";
import { REGIONS } from "@/lib/gamification/regions";
import type { IndividualRow } from "@/lib/leaderboard/mock";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Timeframe = "weekly" | "all";

function rankBadgeClass(rank: number) {
  if (rank === 1) return "bg-amber-400/20 text-amber-600 dark:text-amber-300 ring-1 ring-amber-400/40";
  if (rank === 2) return "bg-zinc-400/20 text-zinc-600 dark:text-zinc-300 ring-1 ring-zinc-400/40";
  if (rank === 3) return "bg-orange-500/20 text-orange-600 dark:text-orange-300 ring-1 ring-orange-500/40";
  return "text-muted-foreground";
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function LeaderboardView({ individuals }: { individuals: IndividualRow[] }) {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = React.useState<Timeframe>("weekly");
  const [league, setLeague] = React.useState("all");
  const [region, setRegion] = React.useState("all");

  const rows = React.useMemo(() => {
    return individuals
      .filter((r) => (league === "all" ? true : rankForXp(r.total).id === league))
      .filter((r) => (region === "all" ? true : r.region === region))
      .sort((a, b) => (timeframe === "weekly" ? b.weekly - a.weekly : b.total - a.total));
  }, [individuals, league, region, timeframe]);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={league} onValueChange={(v) => setLeague(v ?? "all")}>
            <SelectTrigger className="h-9 w-40 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All leagues</SelectItem>
              {RANKS.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={region} onValueChange={(v) => setRegion(v ?? "all")}>
            <SelectTrigger className="h-9 w-40 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All regions</SelectItem>
              {REGIONS.map((r) => (
                <SelectItem key={r.id} value={r.name}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="inline-flex shrink-0 rounded-lg border bg-muted/40 p-0.5">
          {(["weekly", "all"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                timeframe === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
              )}
            >
              {t === "weekly" ? "This week" : "All time"}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card">
        {rows.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            No learners match these filters yet.
          </p>
        ) : (
          rows.map((row, i) => {
            const rank = i + 1;
            const value = timeframe === "weekly" ? row.weekly : row.total;
            const isMe = user && row.id === user.id;
            const leagueName = rankForXp(row.total).name;
            const subtitle = [leagueName, row.region].filter(Boolean).join(" · ");
            return (
              <div
                key={row.id}
                className={cn(
                  "flex items-center gap-3 border-b px-4 py-3 last:border-b-0",
                  isMe && "bg-primary/[0.06]",
                )}
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-lg text-sm font-bold tabular-nums",
                    rankBadgeClass(rank),
                  )}
                >
                  {rank <= 3 ? <CrownIcon className="size-3.5" /> : rank}
                </span>
                <Avatar size="sm">
                  <AvatarFallback className="text-[0.65rem]">{initials(row.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {row.name} {isMe && <span className="text-xs text-primary">(you)</span>}
                  </p>
                  {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums">
                  {value.toLocaleString()}{" "}
                  <span className="text-xs font-normal text-muted-foreground">XP</span>
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
