import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./types";
import { SUPABASE_URL } from "./env";

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isServiceConfigured = Boolean(SUPABASE_URL && SERVICE_ROLE_KEY);

/**
 * Service-role client. SERVER ONLY - bypasses RLS. Used for analytics ingest
 * and admin analytics reads. Never import this from client components.
 */
export function createAdminClient() {
  if (!isServiceConfigured) return null;
  return createSupabaseClient<Database>(SUPABASE_URL!, SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
