"use client";

import * as React from "react";
import type { User } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type AuthResult = { error?: string };

export type AuthContextValue = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isConfigured: boolean;
  openAuth: (reason?: string) => void;
  refreshProfile: () => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<AuthResult>;
  signUpWithPassword: (
    email: string,
    password: string,
    displayName?: string,
  ) => Promise<AuthResult>;
  signInWithMagicLink: (email: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

export const AuthContext = React.createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
