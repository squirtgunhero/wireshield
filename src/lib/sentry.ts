import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

export function initSentry() {
  if (!SENTRY_DSN) return;

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
  });
}

export function captureException(error: unknown, context?: Record<string, unknown>) {
  if (!SENTRY_DSN) {
    console.error("[Sentry disabled]", error);
    return;
  }
  Sentry.captureException(error, { extra: context });
}

export function captureMessage(message: string, level: "info" | "warning" | "error" = "info") {
  if (!SENTRY_DSN) {
    console.log(`[Sentry disabled][${level}]`, message);
    return;
  }
  Sentry.captureMessage(message, level);
}
