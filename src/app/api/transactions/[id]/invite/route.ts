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
  const { name, email, phone, role, company } = body;

  if (!name || !email || !role) {
    return NextResponse.json(
      { error: "Name, email, and role are required" },
      { status: 400 }
    );
  }

  const tx = await prisma.transaction.findUnique({ where: { id } });
  if (!tx) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

  const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

  const party = await prisma.transactionParty.create({
    data: {
      transactionId: id,
      userId: existingUser?.id || null,
      role,
      name,
      email: email.toLowerCase(),
      phone: phone || null,
      company: company || null,
      status: "INVITED",
    },
  });

  await prisma.event.create({
    data: {
      transactionId: id,
      phase: tx.currentPhase,
      type: "SYSTEM",
      severity: "INFO",
      subject: `${name} invited as ${role.replace(/_/g, " ").toLowerCase()}`,
      detail: `${user.name} invited ${name} (${email}) to the transaction as ${role.replace(/_/g, " ").toLowerCase()}.`,
    },
  });

  await prisma.auditLog.create({
    data: {
      transactionId: id,
      userId: user.id !== "admin-001" ? user.id : null,
      action: "PARTY_INVITED",
      metadata: { partyId: party.id, name, email, role },
    },
  });

  return NextResponse.json({ party }, { status: 201 });
}
