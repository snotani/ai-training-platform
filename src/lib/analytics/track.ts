const ANON_KEY = "ai-training-anon";

export function getAnonId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(ANON_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `anon-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(ANON_KEY, id);
  }
  return id;
}

/**
 * Fire-and-forget anonymous analytics event. Always-on, regardless of sign-in.
 * Safe no-op on the server or if the request fails.
 */
export function track(
  eventType: string,
  data?: { path?: string; lessonId?: string; metadata?: Record<string, unknown> },
) {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify({
      anon_id: getAnonId(),
      event_type: eventType,
      path: data?.path ?? window.location.pathname,
      lesson_id: data?.lessonId ?? null,
      metadata: data?.metadata ?? {},
    });

    if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    } else {
      void fetch("/api/track", {
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
        keepalive: true,
      });
    }
  } catch {
    // analytics must never break the app
  }
}
