import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const notification = await prisma.notification.update({
      where: { id },
      data: { readAt: new Date() },
    });
    return NextResponse.json({ notification });
  } catch {
    return NextResponse.json({ error: "Notification not found" }, { status: 404 });
  }
}
