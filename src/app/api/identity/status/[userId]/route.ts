import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { userId } = await params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        identityVerified: true,
        identityVerifiedAt: true,
        identityProvider: true,
        identityConfidenceScore: true,
      },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
