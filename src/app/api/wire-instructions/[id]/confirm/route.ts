import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const wire = await prisma.wireInstruction.findUnique({ where: { id } });
  if (!wire) return NextResponse.json({ error: "Wire instruction not found" }, { status: 404 });

  if (wire.status !== "DELIVERED") {
    return NextResponse.json({ error: "Wire must be delivered before confirmation" }, { status: 400 });
  }

  const updated = await prisma.wireInstruction.update({
    where: { id },
    data: { status: "CONFIRMED", confirmedAt: new Date() },
  });

  await prisma.auditLog.create({
    data: {
      transactionId: wire.transactionId,
      userId: user.id !== "admin-001" ? user.id : null,
      action: "WIRE_INSTRUCTION_CONFIRMED",
      metadata: { wireId: id },
    },
  });

  return NextResponse.json({ wireInstruction: updated });
}
