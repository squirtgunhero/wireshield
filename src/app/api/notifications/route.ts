import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const unreadOnly = searchParams.get("unread") === "true";

  const where: Record<string, unknown> = {};
  if (user.id !== "admin-001") where.userId = user.id;
  if (unreadOnly) where.readAt = null;

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { transaction: { select: { id: true, propertyAddress: true } } },
    }),
    prisma.notification.count({
      where: { ...where, readAt: null },
    }),
  ]);

  return NextResponse.json({ notifications, unreadCount });
}
