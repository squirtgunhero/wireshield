import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { calculateRiskScore } from "@/lib/risk-scoring";

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { rawEmail, senderAddress, transactionId } = body;

    if (!rawEmail) {
      return NextResponse.json({ error: "Email content is required" }, { status: 400 });
    }

    const senderDomain = senderAddress?.split("@")[1] ?? "";
    const urgencyWords = ["urgent", "immediately", "asap", "today", "now", "time sensitive"];
    const wireWords = ["wire", "routing", "account", "bank", "transfer", "instructions"];
    const hasUrgency = urgencyWords.some((w) => rawEmail.toLowerCase().includes(w));
    const hasWireChange = wireWords.filter((w) => rawEmail.toLowerCase().includes(w)).length >= 3;

    const homoglyphs: Record<string, string> = { "0": "o", "1": "l", "rn": "m" };
    const hasHomoglyph = Object.keys(homoglyphs).some((h) => senderDomain.includes(h));

    const replyToMatch = rawEmail.match(/reply-to:\s*<?([^>\s]+)/i);
    const replyToMismatch = replyToMatch ? replyToMatch[1] !== senderAddress : false;

    const { score, level, breakdown } = calculateRiskScore({
      urgencyLanguage: hasUrgency,
      wireChangeRequest: hasWireChange,
      homoglyphDetected: hasHomoglyph,
      replyToMismatch,
    });

    const verdict = score >= 60 ? "FRAUDULENT" : score >= 35 ? "SUSPICIOUS" : "VERIFIED";

    const analysis = await prisma.emailAnalysis.create({
      data: {
        transactionId: transactionId || null,
        submittedById: user.id !== "admin-001" ? user.id : null,
        rawEmailEncrypted: rawEmail,
        senderAddress,
        senderDomain,
        urgencyScore: hasUrgency ? 80 : 10,
        replyToMismatch,
        spoofingIndicators: { homoglyph: hasHomoglyph, urgency: hasUrgency, wireChange: hasWireChange },
        riskScore: score,
        aiAnalysis: JSON.stringify(breakdown),
        verdict: verdict as "VERIFIED" | "SUSPICIOUS" | "FRAUDULENT",
      },
    });

    if (transactionId && score >= 35) {
      await prisma.riskEvent.create({
        data: {
          transactionId,
          eventType: "EMAIL_ANALYSIS",
          severity: level === "CRITICAL" ? "CRITICAL" : level === "HIGH" ? "HIGH" : "MEDIUM",
          title: `Email analysis: ${verdict.toLowerCase()} (score: ${score})`,
          description: `Sender: ${senderAddress}. Risk factors: ${breakdown.map((b) => b.factor).join(", ")}`,
          metadata: { analysisId: analysis.id, score, level, breakdown },
        },
      });
    }

    return NextResponse.json({
      id: analysis.id,
      score,
      level,
      verdict,
      breakdown,
      senderDomain,
      replyToMismatch,
    });
  } catch (e) {
    console.error("Email analysis error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
