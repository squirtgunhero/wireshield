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

  const report = await prisma.finCENReport.findUnique({
    where: { id },
    include: { transaction: { select: { id: true, propertyAddress: true } } },
  });

  if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 });

  return NextResponse.json({ report });
}
