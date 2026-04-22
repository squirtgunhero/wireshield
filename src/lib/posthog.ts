import posthog from "posthog-js";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

let initialized = false;

export function initPostHog() {
  if (typeof window === "undefined" || initialized || !POSTHOG_KEY) return;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: "identified_only",
    capture_pageview: false,
    capture_pageleave: true,
  });

  initialized = true;
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (!POSTHOG_KEY) return;
  posthog.identify(userId, traits);
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (!POSTHOG_KEY) return;
  posthog.capture(event, properties);
}

export function resetUser() {
  if (!POSTHOG_KEY) return;
  posthog.reset();
}

export { posthog };
