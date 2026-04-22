const HOMOGRAPHS: Record<string, string[]> = {
  l: ["I", "1"],
  I: ["l", "1"],
  "0": ["O", "o"],
  O: ["0"],
  rn: ["m"],
  m: ["rn"],
  vv: ["w"],
  w: ["vv"],
};

export interface DomainAnalysis {
  domain: string;
  isVerified: boolean;
  spoofDetected: boolean;
  spoofType?: string;
  closestMatch?: string;
  distance?: number;
  details: string;
}

function extractDomain(email: string): string {
  const parts = email.split("@");
  return parts.length > 1 ? parts[1].toLowerCase() : "";
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[m][n];
}

function checkHomographs(domain: string, verifiedDomain: string): string | null {
  for (const [original, replacements] of Object.entries(HOMOGRAPHS)) {
    for (const replacement of replacements) {
      const spoofed = verifiedDomain.replace(
        new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        replacement
      );
      if (spoofed === domain && spoofed !== verifiedDomain) {
        return `Homograph substitution: "${original}" replaced with "${replacement}"`;
      }
    }
  }
  return null;
}

function checkTldVariation(domain: string, verifiedDomain: string): string | null {
  const domainBase = domain.split(".").slice(0, -1).join(".");
  const verifiedBase = verifiedDomain.split(".").slice(0, -1).join(".");
  const domainTld = domain.split(".").pop();
  const verifiedTld = verifiedDomain.split(".").pop();

  if (domainBase === verifiedBase && domainTld !== verifiedTld) {
    return `TLD mismatch: .${domainTld} vs expected .${verifiedTld}`;
  }
  return null;
}

export function analyzeDomain(
  senderEmail: string,
  verifiedEmails: string[]
): DomainAnalysis {
  const senderDomain = extractDomain(senderEmail);
  const verifiedDomains = [...new Set(verifiedEmails.map(extractDomain))];

  if (verifiedDomains.includes(senderDomain)) {
    return {
      domain: senderDomain,
      isVerified: true,
      spoofDetected: false,
      details: "Domain matches a verified party",
    };
  }

  for (const verified of verifiedDomains) {
    const homograph = checkHomographs(senderDomain, verified);
    if (homograph) {
      return {
        domain: senderDomain,
        isVerified: false,
        spoofDetected: true,
        spoofType: "homograph",
        closestMatch: verified,
        details: homograph,
      };
    }

    const tldIssue = checkTldVariation(senderDomain, verified);
    if (tldIssue) {
      return {
        domain: senderDomain,
        isVerified: false,
        spoofDetected: true,
        spoofType: "tld_mismatch",
        closestMatch: verified,
        details: tldIssue,
      };
    }

    const dist = levenshtein(senderDomain, verified);
    if (dist > 0 && dist <= 2) {
      return {
        domain: senderDomain,
        isVerified: false,
        spoofDetected: true,
        spoofType: "near_miss",
        closestMatch: verified,
        distance: dist,
        details: `Domain "${senderDomain}" is ${dist} character(s) away from verified domain "${verified}"`,
      };
    }
  }

  return {
    domain: senderDomain,
    isVerified: false,
    spoofDetected: false,
    details: verifiedDomains.length > 0
      ? "Domain not found among verified parties"
      : "No verified party domains to compare against",
  };
}

export function extractEmailsFromContent(content: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  return [...new Set(content.match(emailRegex) || [])];
}
