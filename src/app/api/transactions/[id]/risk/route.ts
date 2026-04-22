import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const [tx, riskEvents, alerts] = await Promise.all([
    prisma.transaction.findUnique({
      where: { id },
      select: { id: true, riskScore: true, riskLevel: true },
    }),
    prisma.riskEvent.findMany({
      where: { transactionId: id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.alert.findMany({
      where: { transactionId: id },
      orderBy: { createdAt: "desc" },
      include: { event: { select: { id: true, subject: true, severity: true } } },
    }),
  ]);

  if (!tx) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

  return NextResponse.json({
    riskScore: tx.riskScore,
    riskLevel: tx.riskLevel,
    riskEvents,
    alerts,
  });
}
