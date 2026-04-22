import { scanPatterns, getOverallRisk, type PatternMatch } from "./patterns";
import {
  analyzeDomain,
  extractEmailsFromContent,
  type DomainAnalysis,
} from "./domain";

export interface AnalysisRequest {
  content: string;
  transactionId?: string;
  phase?: string;
  verifiedEmails?: string[];
  parties?: Array<{ name: string; email: string; type: string; verified: boolean }>;
}

export interface LocalScanResult {
  findings: PatternMatch[];
  risk: "CRITICAL" | "HIGH" | "MEDIUM" | "SAFE";
  totalFlags: number;
}

export interface DomainScanResult {
  domains: DomainAnalysis[];
  spoofDetected: boolean;
  details: string;
}

export interface AiAnalysisResult {
  riskLevel: string;
  summary: string;
  flags: Array<{ text: string; severity: string }>;
  recommendation: string;
  fraudType: string;
  senderVerified: boolean;
  senderNote: string;
}

export interface FullAnalysisResult {
  localScan: LocalScanResult;
  domainAnalysis: DomainScanResult;
  aiAnalysis?: AiAnalysisResult;
}

export function runLocalScan(content: string): LocalScanResult {
  const findings = scanPatterns(content);
  return {
    findings,
    risk: getOverallRisk(findings),
    totalFlags: findings.length,
  };
}

export function runDomainScan(
  content: string,
  verifiedEmails: string[] = []
): DomainScanResult {
  const emails = extractEmailsFromContent(content);
  const domains = emails.map((email) => analyzeDomain(email, verifiedEmails));
  const spoofDetected = domains.some((d) => d.spoofDetected);

  let details = "";
  if (spoofDetected) {
    const spoofed = domains.filter((d) => d.spoofDetected);
    details = spoofed.map((d) => d.details).join("; ");
  } else if (domains.length === 0) {
    details = "No email addresses found in content";
  } else {
    details = "No domain spoofing detected";
  }

  return { domains, spoofDetected, details };
}

export function buildAiPrompt(req: AnalysisRequest): string {
  let context = "";
  if (req.transactionId) {
    context += `\nTransaction context available.`;
  }
  if (req.phase) {
    context += ` Current phase: ${req.phase}.`;
  }
  if (req.parties && req.parties.length > 0) {
    context += `\nKnown parties:\n`;
    for (const p of req.parties) {
      context += `- ${p.name} (${p.type}, ${p.email})${p.verified ? " [VERIFIED]" : " [UNVERIFIED]"}\n`;
    }
  }

  return `You are a real estate cybercrime analyst. Analyze the following communication for fraud indicators.
${context}
Analyze this content and respond with valid JSON matching this exact structure:
{
  "riskLevel": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SAFE",
  "summary": "1-3 sentence summary of the analysis",
  "flags": [{"text": "description of the flag", "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"}],
  "recommendation": "specific action the recipient should take",
  "fraudType": "the type of fraud detected, or 'None' if clean",
  "senderVerified": true/false (whether sender matches a known verified party),
  "senderNote": "note about sender verification status"
}

Content to analyze:
---
${req.content}
---`;
}
