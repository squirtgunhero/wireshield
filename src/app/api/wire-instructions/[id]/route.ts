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

  const wire = await prisma.wireInstruction.findUnique({
    where: { id },
    include: {
      fromParty: { select: { id: true, name: true, role: true } },
      toParty: { select: { id: true, name: true, role: true } },
      submittedBy: { select: { id: true, fullName: true } },
      transaction: { select: { id: true, propertyAddress: true } },
    },
  });

  if (!wire) return NextResponse.json({ error: "Wire instruction not found" }, { status: 404 });

  return NextResponse.json({ wireInstruction: wire });
}
