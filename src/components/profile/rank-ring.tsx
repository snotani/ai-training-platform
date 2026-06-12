import { rankForXp, nextRank, rankProgress } from "@/lib/gamification/config";

export function RankRing({ xp }: { xp: number }) {
  const rank = rankForXp(xp);
  const next = nextRank(xp);
  const pct = rankProgress(xp);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);

  return (
    <div className="flex flex-col items-center">
      <div className="relative size-32">
        <svg viewBox="0 0 120 120" className="size-full -rotate-90">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--muted)" strokeWidth="9" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="url(#rankGrad)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-700"
          />
          <defs>
            <linearGradient id="rankGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--brand)" />
              <stop offset="100%" stopColor="var(--brand-2)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-2xl font-bold tabular-nums">
            {xp.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground">XP</span>
        </div>
      </div>
      <p className="mt-3 font-heading font-semibold">{rank.name}</p>
      <p className="text-xs text-muted-foreground">
        {next
          ? `${(next.minXp - xp).toLocaleString()} XP to ${next.name}`
          : "Top rank reached"}
      </p>
    </div>
  );
}
