"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initPostHog, posthog } from "@/lib/posthog";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    initPostHog();
  }, []);

  useEffect(() => {
    if (posthog.__loaded) {
      posthog.capture("$pageview", { $current_url: window.location.href });
    }
  }, [pathname]);

  return <>{children}</>;
}
