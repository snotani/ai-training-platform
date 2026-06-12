"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ActivityIcon,
  AwardIcon,
  BookOpenCheckIcon,
  ConstructionIcon,
  TrendingUpIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

const METRICS: { icon: LucideIcon; label: string; value: string; delta: string }[] = [
  { icon: UsersIcon, label: "Total learners", value: "1,248", delta: "+8.2%" },
  { icon: BookOpenCheckIcon, label: "Lessons completed", value: "3,907", delta: "+12.4%" },
  { icon: ActivityIcon, label: "Active today", value: "86", delta: "+3.1%" },
  { icon: AwardIcon, label: "Avg quiz score", value: "82%", delta: "+1.6%" },
];

const ACTIVITY = [
  { day: "Mon", views: 420, completions: 110 },
  { day: "Tue", views: 510, completions: 145 },
  { day: "Wed", views: 480, completions: 130 },
  { day: "Thu", views: 620, completions: 180 },
  { day: "Fri", views: 700, completions: 210 },
  { day: "Sat", views: 320, completions: 70 },
  { day: "Sun", views: 290, completions: 60 },
];

const BY_LEVEL = Array.from({ length: 12 }, (_, i) => ({
  level: `L${i + 1}`,
  completions: i === 0 ? 1240 : Math.max(20, Math.round(900 / (i + 1) + (i % 3) * 40)),
}));

const tooltipStyle: React.CSSProperties = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "0.625rem",
  fontSize: "0.8rem",
  color: "var(--popover-foreground)",
};

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] p-4">
        <ConstructionIcon className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="text-sm">
          <p className="font-medium text-foreground">Preview - placeholder data</p>
          <p className="text-muted-foreground">
            Anonymous events (page views, lesson opens, quiz results) are already being collected to{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">analytics_events</code>. This
            dashboard will be wired to live data next.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((m) => (
          <div key={m.label} className="rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <m.icon className="size-4.5" />
              </span>
              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingUpIcon className="size-3" />
                {m.delta}
              </span>
            </div>
            <p className="mt-3 font-heading text-2xl font-bold tabular-nums">{m.value}</p>
            <p className="text-xs text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading font-semibold">Activity this week</h2>
            <Badge variant="secondary">Sample</Badge>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={ACTIVITY} margin={{ left: -20, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="aViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="aComp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="views" stroke="var(--chart-1)" strokeWidth={2} fill="url(#aViews)" />
              <Area type="monotone" dataKey="completions" stroke="var(--chart-2)" strokeWidth={2} fill="url(#aComp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading font-semibold">Completions by level</h2>
            <Badge variant="secondary">Sample</Badge>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={BY_LEVEL} margin={{ left: -20, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="level" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)", opacity: 0.4 }} />
              <Bar dataKey="completions" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
