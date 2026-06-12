"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { track } from "@/lib/analytics/track";

/** Always-on page-view tracking. Anonymous; no sign-in required. */
export function AnalyticsTracker() {
  const pathname = usePathname();

  React.useEffect(() => {
    track("page_view", { path: pathname });
  }, [pathname]);

  return null;
}
