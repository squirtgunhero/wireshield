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

  const tx = await prisma.transaction.findUnique({
    where: { id },
    include: {
      parties: {
        include: { user: { select: { id: true, fullName: true, email: true, identityVerified: true } } },
        orderBy: { invitedAt: "asc" },
      },
      wireInstructions: {
        orderBy: { createdAt: "desc" },
        include: {
          fromParty: { select: { id: true, name: true, role: true } },
          toParty: { select: { id: true, name: true, role: true } },
        },
      },
      alerts: { orderBy: { createdAt: "desc" }, take: 10 },
      riskEvents: { orderBy: { createdAt: "desc" }, take: 10 },
      createdBy: { select: { id: true, fullName: true, email: true } },
      _count: {
        select: { events: true, documents: true, alerts: true, wireInstructions: true },
      },
    },
  });

  if (!tx) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

  return NextResponse.json({ transaction: tx });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const allowedFields = [
    "status", "currentPhase", "purchasePrice", "expectedCloseDate",
    "propertyAddress", "propertyCity", "propertyState", "propertyZip",
    "transactionType", "insuranceTier",
  ];

  const data: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      if (field === "expectedCloseDate") {
        data[field] = new Date(body[field]);
      } else {
        data[field] = body[field];
      }
    }
  }

  try {
    const tx = await prisma.transaction.update({
      where: { id },
      data,
      include: { parties: true },
    });

    await prisma.auditLog.create({
      data: {
        transactionId: id,
        userId: user.id !== "admin-001" ? user.id : null,
        action: "TRANSACTION_UPDATED",
        metadata: { updatedFields: Object.keys(data), updatedBy: user.email },
      },
    });

    return NextResponse.json({ transaction: tx });
  } catch {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
  }
}
