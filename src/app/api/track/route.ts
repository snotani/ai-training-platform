import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

// Ingests anonymous + signed-in analytics events. RLS allows anon inserts;
// no-op when Supabase isn't configured.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    if (supabase) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      await supabase.from("analytics_events").insert({
        anon_id: typeof body.anon_id === "string" ? body.anon_id : null,
        user_id: session?.user?.id ?? null,
        event_type: typeof body.event_type === "string" ? body.event_type : "unknown",
        path: typeof body.path === "string" ? body.path : null,
        lesson_id: typeof body.lesson_id === "string" ? body.lesson_id : null,
        metadata: body.metadata ?? {},
      });
    }
  } catch {
    // swallow - analytics should never error the client
  }
  return NextResponse.json({ ok: true });
}
