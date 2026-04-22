import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const {
      transactionId, direction, bankName, routingNumber,
      accountNumberEncrypted, accountHolderName, bankAddress,
      swiftCode, amount, fromPartyId, toPartyId,
    } = body;

    if (!transactionId || !bankName || !routingNumber || !accountNumberEncrypted || !accountHolderName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const tx = await prisma.transaction.findUnique({ where: { id: transactionId } });
    if (!tx) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

    const wire = await prisma.wireInstruction.create({
      data: {
        transactionId,
        submittedById: user.id !== "admin-001" ? user.id : null,
        direction: direction || "INCOMING",
        bankName,
        routingNumber,
        accountNumberEncrypted,
        accountHolderName,
        bankAddress: bankAddress || null,
        swiftCode: swiftCode || null,
        amount: amount || null,
        fromPartyId: fromPartyId || null,
        toPartyId: toPartyId || null,
        status: "PENDING",
      },
    });

    await prisma.auditLog.create({
      data: {
        transactionId,
        userId: user.id !== "admin-001" ? user.id : null,
        action: "WIRE_INSTRUCTION_SUBMITTED",
        metadata: { wireId: wire.id, bankName, direction },
      },
    });

    return NextResponse.json({ wireInstruction: wire }, { status: 201 });
  } catch (e) {
    console.error("Wire submit error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
