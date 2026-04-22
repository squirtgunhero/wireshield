import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!["ADMIN", "TITLE_OFFICER"].includes(user.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  const { id } = await params;

  const report = await prisma.finCENReport.findUnique({ where: { id } });
  if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 });

  if (report.status !== "READY") {
    return NextResponse.json({ error: "Report must be in READY status to file" }, { status: 400 });
  }

  const updated = await prisma.finCENReport.update({
    where: { id },
    data: {
      status: "FILED",
      filedAt: new Date(),
      filingReference: `FCN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    },
  });

  await prisma.auditLog.create({
    data: {
      transactionId: report.transactionId,
      userId: user.id !== "admin-001" ? user.id : null,
      action: "FINCEN_REPORT_FILED",
      metadata: { reportId: id, filingReference: updated.filingReference },
    },
  });

  return NextResponse.json({ report: updated });
}
