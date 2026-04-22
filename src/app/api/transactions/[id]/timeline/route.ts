import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const phase = searchParams.get("phase");
  const flaggedOnly = searchParams.get("flagged") === "true";

  const where: Record<string, unknown> = { transactionId: id };
  if (phase) where.phase = phase;
  if (flaggedOnly) where.flagged = true;

  const events = await prisma.event.findMany({
    where,
    include: {
      fromParty: { select: { id: true, name: true, role: true } },
      toParty: { select: { id: true, name: true, role: true } },
      alerts: { select: { id: true, severity: true, status: true } },
    },
    orderBy: { timestamp: "desc" },
  });

  return NextResponse.json({ events });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { phase, type, severity, subject, detail, fromPartyId, toPartyId } = body;

  if (!subject || !detail) {
    return NextResponse.json({ error: "Subject and detail are required" }, { status: 400 });
  }

  const tx = await prisma.transaction.findUnique({ where: { id } });
  if (!tx) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

  const event = await prisma.event.create({
    data: {
      transactionId: id,
      phase: phase || tx.currentPhase,
      type: type || "SYSTEM",
      severity: severity || "INFO",
      subject,
      detail,
      fromPartyId: fromPartyId || null,
      toPartyId: toPartyId || null,
    },
  });

  return NextResponse.json({ event }, { status: 201 });
}
