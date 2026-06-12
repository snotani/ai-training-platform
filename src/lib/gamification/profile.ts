"use server";

import { createClient } from "@/lib/supabase/server";

export type ProfileSummary = {
  xp: number;
  displayName: string | null;
  departmentId: string | null;
  streak: { current: number; longest: number };
  badges: string[];
  certificates: { pathway_id: string; issued_at: string }[];
};

export async function getProfileSummary(): Promise<ProfileSummary | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [profileRes, streakRes, badgesRes, certsRes] = await Promise.all([
    supabase.from("profiles").select("xp, display_name, department_id").eq("id", user.id).maybeSingle(),
    supabase.from("streaks").select("current, longest").eq("user_id", user.id).maybeSingle(),
    supabase.from("user_badges").select("badge_id").eq("user_id", user.id),
    supabase.from("certificates").select("pathway_id, issued_at").eq("user_id", user.id),
  ]);

  return {
    xp: profileRes.data?.xp ?? 0,
    displayName: profileRes.data?.display_name ?? null,
    departmentId: profileRes.data?.department_id ?? null,
    streak: { current: streakRes.data?.current ?? 0, longest: streakRes.data?.longest ?? 0 },
    badges: (badgesRes.data ?? []).map((b) => b.badge_id),
    certificates: certsRes.data ?? [],
  };
}

export async function getDepartments(): Promise<{ id: string; name: string }[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase.from("departments").select("id, name").order("name");
  return data ?? [];
}

export async function updateMyDepartment(departmentId: string | null): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  if (!supabase) return { ok: false };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };
  await supabase
    .from("profiles")
    .update({ department_id: departmentId })
    .eq("id", user.id);
  return { ok: true };
}
