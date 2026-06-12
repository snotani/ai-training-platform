"use client";

import * as React from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/types";
import { useProgressStore } from "@/lib/progress/store";
import { getMyProgress, syncLocalProgress } from "@/lib/gamification/actions";
import { AuthDialog } from "@/components/auth/auth-dialog";
import {
  AuthContext,
  type AuthContextValue,
  type Profile,
} from "@/components/auth/auth-context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = React.useState<SupabaseClient<Database> | null>(() =>
    isSupabaseConfigured ? createClient() : null,
  );

  const [user, setUser] = React.useState<User | null>(null);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [loading, setLoading] = React.useState(isSupabaseConfigured);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogReason, setDialogReason] = React.useState<string | undefined>();
  const syncedFor = React.useRef<string | null>(null);

  const importRecords = useProgressStore((s) => s.importRecords);

  const loadProfile = React.useCallback(
    async (uid: string) => {
      if (!supabase) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", uid).maybeSingle();
      setProfile(data ?? null);
    },
    [supabase],
  );

  const syncProgress = React.useCallback(
    async (uid: string) => {
      if (syncedFor.current === uid) return;
      syncedFor.current = uid;
      const local = useProgressStore.getState().lessons;
      const records = Object.entries(local).map(([lessonId, r]) => ({
        lessonId,
        completedAt: r.completedAt,
        quizScore: r.quizScore,
        quizTotal: r.quizTotal,
      }));
      try {
        if (records.length > 0) await syncLocalProgress(records);
        const server = await getMyProgress();
        importRecords(server);
        await loadProfile(uid);
      } catch {
        // best-effort sync; never block the UI
      }
    },
    [importRecords, loadProfile],
  );

  React.useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      setLoading(false);
      if (nextUser && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        void loadProfile(nextUser.id);
        void syncProgress(nextUser.id);
      }
      if (event === "SIGNED_OUT") {
        setProfile(null);
        syncedFor.current = null;
      }
    });
    return () => subscription.unsubscribe();
  }, [supabase, loadProfile, syncProgress]);

  const value: AuthContextValue = {
    user,
    profile,
    loading,
    isConfigured: isSupabaseConfigured,
    openAuth: (reason) => {
      setDialogReason(reason);
      setDialogOpen(true);
    },
    refreshProfile: async () => {
      if (user) await loadProfile(user.id);
    },
    signInWithPassword: async (email, password) => {
      if (!supabase) return { error: "Sign-in isn't configured yet." };
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message };
    },
    signUpWithPassword: async (email, password, displayName) => {
      if (!supabase) return { error: "Sign-in isn't configured yet." };
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: displayName ? { display_name: displayName } : undefined },
      });
      return { error: error?.message };
    },
    signInWithMagicLink: async (email) => {
      if (!supabase) return { error: "Sign-in isn't configured yet." };
      const emailRedirectTo =
        typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined;
      const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo } });
      return { error: error?.message };
    },
    signOut: async () => {
      if (!supabase) return;
      await supabase.auth.signOut();
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        reason={dialogReason}
      />
    </AuthContext.Provider>
  );
}
