export interface RiskFactors {
  identityVerificationScore: number;
  bankAccountAge: number;
  emailDomainAge: number;
  emailDomainMatch: boolean;
  replyToMismatch: boolean;
  urgencyLanguage: boolean;
  wireChangeRequest: boolean;
  homoglyphDetected: boolean;
  typosquatDetected: boolean;
  firstTransactionForParty: boolean;
  deviceFingerprintMismatch: boolean;
  geoLocationAnomaly: boolean;
  toneShiftDetected: boolean;
  previousFraudAttempts: number;
}

const WEIGHTS: Record<keyof RiskFactors, number> = {
  identityVerificationScore: -15,
  bankAccountAge: -10,
  emailDomainAge: -5,
  emailDomainMatch: -10,
  replyToMismatch: 15,
  urgencyLanguage: 10,
  wireChangeRequest: 25,
  homoglyphDetected: 30,
  typosquatDetected: 25,
  firstTransactionForParty: 5,
  deviceFingerprintMismatch: 15,
  geoLocationAnomaly: 12,
  toneShiftDetected: 8,
  previousFraudAttempts: 20,
};

export function calculateRiskScore(factors: Partial<RiskFactors>): {
  score: number;
  level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  breakdown: Array<{ factor: string; impact: number; description: string }>;
} {
  let score = 30;
  const breakdown: Array<{ factor: string; impact: number; description: string }> = [];

  if (factors.identityVerificationScore !== undefined) {
    const impact = Math.round(WEIGHTS.identityVerificationScore * (factors.identityVerificationScore / 100));
    score += impact;
    breakdown.push({ factor: "Identity Verification", impact, description: `Score: ${factors.identityVerificationScore}%` });
  }

  if (factors.bankAccountAge !== undefined) {
    const ageScore = Math.min(factors.bankAccountAge / 365, 1);
    const impact = Math.round(WEIGHTS.bankAccountAge * ageScore);
    score += impact;
    breakdown.push({ factor: "Bank Account Age", impact, description: `${factors.bankAccountAge} days` });
  }

  if (factors.emailDomainAge !== undefined) {
    const ageScore = Math.min(factors.emailDomainAge / 365, 1);
    const impact = Math.round(WEIGHTS.emailDomainAge * ageScore);
    score += impact;
    breakdown.push({ factor: "Email Domain Age", impact, description: `${factors.emailDomainAge} days` });
  }

  const booleanFactors: Array<{ key: keyof RiskFactors; label: string }> = [
    { key: "emailDomainMatch", label: "Email Domain Match" },
    { key: "replyToMismatch", label: "Reply-To Mismatch" },
    { key: "urgencyLanguage", label: "Urgency Language" },
    { key: "wireChangeRequest", label: "Wire Change Request" },
    { key: "homoglyphDetected", label: "Homoglyph Attack" },
    { key: "typosquatDetected", label: "Typosquat Domain" },
    { key: "firstTransactionForParty", label: "First Transaction" },
    { key: "deviceFingerprintMismatch", label: "Device Mismatch" },
    { key: "geoLocationAnomaly", label: "Geo Anomaly" },
    { key: "toneShiftDetected", label: "Tone Shift" },
  ];

  for (const { key, label } of booleanFactors) {
    if (factors[key] !== undefined) {
      const active = factors[key] as boolean;
      if (active) {
        const impact = WEIGHTS[key];
        score += impact;
        breakdown.push({ factor: label, impact, description: active ? "Detected" : "Clear" });
      }
    }
  }

  if (factors.previousFraudAttempts !== undefined && factors.previousFraudAttempts > 0) {
    const impact = WEIGHTS.previousFraudAttempts * factors.previousFraudAttempts;
    score += impact;
    breakdown.push({ factor: "Previous Fraud Attempts", impact, description: `${factors.previousFraudAttempts} prior attempts` });
  }

  score = Math.max(0, Math.min(100, score));

  const level = score >= 80 ? "CRITICAL" : score >= 60 ? "HIGH" : score >= 35 ? "MEDIUM" : "LOW";

  return { score, level, breakdown };
}
