import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { reason } = body;

  const wire = await prisma.wireInstruction.findUnique({ where: { id } });
  if (!wire) return NextResponse.json({ error: "Wire instruction not found" }, { status: 404 });

  const updated = await prisma.wireInstruction.update({
    where: { id },
    data: {
      status: "FLAGGED",
      flaggedAt: new Date(),
      flaggedBy: user.id,
      flagReason: reason || "Flagged for review",
    },
  });

  await prisma.riskEvent.create({
    data: {
      transactionId: wire.transactionId,
      eventType: "WIRE_FLAGGED",
      severity: "HIGH",
      title: `Wire instruction flagged: ${wire.bankName}`,
      description: reason || "Wire instruction flagged for manual review",
      metadata: { wireId: id, flaggedBy: user.email },
    },
  });

  await prisma.alert.create({
    data: {
      transactionId: wire.transactionId,
      severity: "HIGH",
      title: `Wire instruction flagged`,
      description: `Wire to ${wire.bankName} (${wire.accountHolderName}) has been flagged. Reason: ${reason || "Manual review required"}`,
      status: "ACTIVE",
    },
  });

  await prisma.auditLog.create({
    data: {
      transactionId: wire.transactionId,
      userId: user.id !== "admin-001" ? user.id : null,
      action: "WIRE_INSTRUCTION_FLAGGED",
      metadata: { wireId: id, reason },
    },
  });

  return NextResponse.json({ wireInstruction: updated });
}
