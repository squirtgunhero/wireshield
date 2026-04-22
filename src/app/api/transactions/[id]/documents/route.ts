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

  const documents = await prisma.document.findMany({
    where: { transactionId: id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ documents });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { name, phase, fileUrl, fileType, fileSize } = body;

  if (!name) {
    return NextResponse.json({ error: "Document name is required" }, { status: 400 });
  }

  const tx = await prisma.transaction.findUnique({ where: { id } });
  if (!tx) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

  const doc = await prisma.document.create({
    data: {
      transactionId: id,
      name,
      phase: phase || tx.currentPhase,
      fileUrl: fileUrl || null,
      fileType: fileType || null,
      fileSize: fileSize || null,
    },
  });

  return NextResponse.json({ document: doc }, { status: 201 });
}
