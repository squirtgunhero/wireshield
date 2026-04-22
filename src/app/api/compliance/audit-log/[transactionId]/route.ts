import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!["ADMIN", "TITLE_OFFICER", "ESCROW_OFFICER"].includes(user.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  const { transactionId } = await params;
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "50"));

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where: { transactionId },
      include: { user: { select: { id: true, fullName: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.auditLog.count({ where: { transactionId } }),
  ]);

  return NextResponse.json({
    logs,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
