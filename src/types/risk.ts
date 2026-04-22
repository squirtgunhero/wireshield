import type { RiskEvent, EmailAnalysis, Alert } from "@prisma/client";

export type RiskEventWithResolver = RiskEvent & {
  resolvedBy?: { id: string; fullName: string } | null;
};

export type AlertWithEvent = Alert & {
  event?: { id: string; subject: string; severity: string } | null;
};

export interface RiskScoreResponse {
  score: number | null;
  level: string;
  riskEventCount: number;
  activeAlertCount: number;
  suspiciousEmailCount: number;
}

export interface EmailAnalysisResult {
  id: string;
  score: number;
  level: string;
  verdict: string;
  breakdown: Array<{ factor: string; impact: number; description: string }>;
  senderDomain: string;
  replyToMismatch: boolean;
}

export type { RiskEvent, EmailAnalysis, Alert };
