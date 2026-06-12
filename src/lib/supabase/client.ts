import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "./types";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";

/**
 * Browser Supabase client. Returns null when Supabase isn't configured so the
 * (public) app keeps working without a backend.
 */
export function createClient() {
  if (!isSupabaseConfigured) return null;
  return createBrowserClient<Database>(SUPABASE_URL!, SUPABASE_ANON_KEY!);
}
