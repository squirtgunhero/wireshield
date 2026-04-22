import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { transactionId } = await params;

  const [tx, riskEvents, alerts, analyses] = await Promise.all([
    prisma.transaction.findUnique({
      where: { id: transactionId },
      select: { riskScore: true, riskLevel: true },
    }),
    prisma.riskEvent.count({ where: { transactionId } }),
    prisma.alert.count({ where: { transactionId, status: { in: ["ACTIVE", "INVESTIGATING"] } } }),
    prisma.emailAnalysis.count({ where: { transactionId, verdict: { in: ["SUSPICIOUS", "FRAUDULENT"] } } }),
  ]);

  if (!tx) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

  return NextResponse.json({
    score: tx.riskScore,
    level: tx.riskLevel,
    riskEventCount: riskEvents,
    activeAlertCount: alerts,
    suspiciousEmailCount: analyses,
  });
}
