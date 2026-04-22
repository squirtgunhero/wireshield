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

  const parties = await prisma.transactionParty.findMany({
    where: { transactionId: id },
    include: {
      user: {
        select: {
          id: true, fullName: true, email: true, phone: true,
          identityVerified: true, identityVerifiedAt: true, identityProvider: true,
          identityConfidenceScore: true,
        },
      },
    },
    orderBy: { invitedAt: "asc" },
  });

  return NextResponse.json({ parties });
}
