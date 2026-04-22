export interface ThreatPattern {
  keywords: string[];
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  category: string;
}

export const PATTERNS: ThreatPattern[] = [
  {
    keywords: ["wire instructions", "updated wiring", "new account", "changed bank", "routing number", "wire transfer", "account number changed"],
    severity: "CRITICAL",
    category: "Wire Fraud",
  },
  {
    keywords: ["venmo", "zelle", "cash app", "crypto", "bitcoin", "pay me directly", "alternative payment"],
    severity: "CRITICAL",
    category: "Payment Redirect",
  },
  {
    keywords: ["verify your identity", "confirm your account", "click here to", "log in to verify", "update your password", "reset your credentials"],
    severity: "CRITICAL",
    category: "Credential Phishing",
  },
  {
    keywords: ["social security", "ssn", "bank login", "passport number", "account credentials"],
    severity: "CRITICAL",
    category: "Identity Theft",
  },
  {
    keywords: ["immediately", "urgent", "asap", "right now", "time sensitive", "deadline today", "must act", "expires today"],
    severity: "HIGH",
    category: "Urgency Manipulation",
  },
  {
    keywords: ["on behalf of", "representing", "authorized agent", "acting as", "per attorney", "title company says"],
    severity: "HIGH",
    category: "Impersonation",
  },
  {
    keywords: ["don't tell anyone", "keep this confidential", "secret", "between us", "off the record"],
    severity: "HIGH",
    category: "Business Email Compromise",
  },
  {
    keywords: ["power of attorney", "poa", "on my behalf", "sign for me"],
    severity: "HIGH",
    category: "POA Fraud",
  },
  {
    keywords: ["deal will fall through", "lose the property", "buyer will walk", "closing delayed", "forfeit earnest"],
    severity: "MEDIUM",
    category: "Pressure Tactics",
  },
  {
    keywords: ["@gmail", "@yahoo", "@hotmail", "@outlook"],
    severity: "MEDIUM",
    category: "Free Email Provider",
  },
];

export interface PatternMatch {
  category: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  matchedKeyword: string;
}

export function scanPatterns(content: string): PatternMatch[] {
  const lower = content.toLowerCase();
  const matches: PatternMatch[] = [];
  const seen = new Set<string>();

  for (const pattern of PATTERNS) {
    for (const keyword of pattern.keywords) {
      if (lower.includes(keyword.toLowerCase()) && !seen.has(pattern.category)) {
        seen.add(pattern.category);
        matches.push({
          category: pattern.category,
          severity: pattern.severity,
          matchedKeyword: keyword,
        });
        break;
      }
    }
  }

  return matches.sort((a, b) => {
    const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2 };
    return order[a.severity] - order[b.severity];
  });
}

export function getOverallRisk(matches: PatternMatch[]): "CRITICAL" | "HIGH" | "MEDIUM" | "SAFE" {
  if (matches.some((m) => m.severity === "CRITICAL")) return "CRITICAL";
  if (matches.some((m) => m.severity === "HIGH")) return "HIGH";
  if (matches.some((m) => m.severity === "MEDIUM")) return "MEDIUM";
  return "SAFE";
}
