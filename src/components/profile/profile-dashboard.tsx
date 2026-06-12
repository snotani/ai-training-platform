"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  AwardIcon,
  BookOpenIcon,
  FlameIcon,
  FootprintsIcon,
  LayersIcon,
  type LucideIcon,
  LockIcon,
  RouteIcon,
  SparklesIcon,
  TrophyIcon,
  ZapIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-context";
import { useProgressStore } from "@/lib/progress/store";
import { BADGE_DEFS } from "@/lib/gamification/config";
import { getPathway } from "@/lib/content/pathways";
import {
  getDepartments,
  getProfileSummary,
  updateMyDepartment,
  type ProfileSummary,
} from "@/lib/gamification/profile";
import { RankRing } from "@/components/profile/rank-ring";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BADGE_ICONS: Record<string, LucideIcon> = {
  "first-lesson": FootprintsIcon,
  "level-complete": LayersIcon,
  "perfect-quiz": SparklesIcon,
  "streak-7": FlameIcon,
  "streak-30": ZapIcon,
  "pathway-complete": RouteIcon,
  capstone: TrophyIcon,
};

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <Icon className="size-4 text-primary" />
      <p className="mt-2 font-heading text-xl font-bold tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function SignedOut({ completed }: { completed: number }) {
  const { openAuth } = useAuth();
  return (
    <div className="mx-auto max-w-md rounded-2xl border bg-card p-8 text-center">
      <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-brand-gradient text-white">
        <TrophyIcon className="size-6" />
      </span>
      <h2 className="font-heading mt-4 text-xl font-semibold">Unlock your profile</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        All lessons are free without an account. Sign in to turn your progress into XP, streaks,
        badges, and a spot on the leaderboard.
      </p>
      {completed > 0 && (
        <p className="mt-3 rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
          You&rsquo;ve completed <span className="font-semibold text-foreground">{completed}</span>{" "}
          {completed === 1 ? "item" : "items"} on this device - sign in to keep them.
        </p>
      )}
      <Button className="mt-5" onClick={() => openAuth("Sign in to unlock XP, streaks, and badges.")}>
        Sign in
      </Button>
    </div>
  );
}

export function ProfileDashboard() {
  const { user, profile, refreshProfile } = useAuth();
  const lessons = useProgressStore((s) => s.lessons);
  const hydrated = useProgressStore((s) => s.hydrated);
  const completed = hydrated ? Object.keys(lessons).length : 0;

  const [summary, setSummary] = React.useState<ProfileSummary | null>(null);
  const [departments, setDepartments] = React.useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([getProfileSummary(), getDepartments()]).then(([s, d]) => {
      if (cancelled) return;
      setSummary(s);
      setDepartments(d);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) return <SignedOut completed={completed} />;

  const name = summary?.displayName || profile?.display_name || user.email?.split("@")[0] || "You";
  const xp = summary?.xp ?? profile?.xp ?? 0;

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  async function onDepartmentChange(value: string | null) {
    const id = !value || value === "none" ? null : value;
    setSummary((s) => (s ? { ...s, departmentId: id } : s));
    const res = await updateMyDepartment(id);
    if (res.ok) {
      toast.success("Department updated");
      await refreshProfile();
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 rounded-2xl border bg-card p-6 sm:grid-cols-[auto_1fr] sm:items-center">
        <RankRing xp={xp} />
        <div>
          <h1 className="font-heading text-2xl font-bold">{name}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <div className="mt-4 max-w-xs">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Department (for the team leaderboard)
            </label>
            <Select value={summary?.departmentId ?? "none"} onValueChange={onDepartmentChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No department</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile icon={FlameIcon} label="Day streak" value={summary?.streak.current ?? 0} />
        <StatTile icon={ZapIcon} label="Longest streak" value={summary?.streak.longest ?? 0} />
        <StatTile icon={BookOpenIcon} label="Completed" value={completed} />
        <StatTile icon={AwardIcon} label="Badges" value={summary?.badges.length ?? 0} />
      </div>

      {/* Badges */}
      <section className="rounded-2xl border bg-card p-6">
        <h2 className="font-heading text-lg font-semibold">Badges</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BADGE_DEFS.map((b) => {
            const earned = summary?.badges.includes(b.id);
            const Icon = BADGE_ICONS[b.id] ?? AwardIcon;
            return (
              <div
                key={b.id}
                className={cn(
                  "flex gap-3 rounded-xl border p-3",
                  earned ? "border-primary/30 bg-primary/[0.04]" : "opacity-60",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg",
                    earned ? "bg-brand-gradient text-white" : "bg-muted text-muted-foreground",
                  )}
                >
                  {earned ? <Icon className="size-4.5" /> : <LockIcon className="size-4" />}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.criteria}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Certificates */}
      <section className="rounded-2xl border bg-card p-6">
        <h2 className="font-heading text-lg font-semibold">Certificates</h2>
        {summary && summary.certificates.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {summary.certificates.map((c) => (
              <div
                key={c.pathway_id}
                className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/[0.04] p-4"
              >
                <AwardIcon className="size-6 text-primary" />
                <div>
                  <p className="text-sm font-medium">
                    {getPathway(c.pathway_id)?.name ?? c.pathway_id}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Issued {new Date(c.issued_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Complete a pathway capstone to earn a shareable certificate.
          </p>
        )}
      </section>
    </div>
  );
}
