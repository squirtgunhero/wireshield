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

  const events = await prisma.riskEvent.findMany({
    where: { transactionId },
    orderBy: { createdAt: "desc" },
    include: { resolvedBy: { select: { id: true, fullName: true } } },
  });

  return NextResponse.json({ events });
}
