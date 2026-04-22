import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!["ADMIN", "TITLE_OFFICER"].includes(user.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { transactionId, reportType } = body;

    if (!transactionId || !reportType) {
      return NextResponse.json({ error: "Transaction ID and report type are required" }, { status: 400 });
    }

    const tx = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        parties: true,
        riskEvents: true,
        alerts: true,
        wireInstructions: { select: { id: true, bankName: true, amount: true, status: true, flaggedAt: true } },
      },
    });

    if (!tx) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

    const filingData = {
      reportType,
      transactionId: tx.id,
      propertyAddress: tx.propertyAddress,
      purchasePrice: tx.purchasePrice ? Number(tx.purchasePrice) : null,
      parties: tx.parties.map((p) => ({ name: p.name, role: p.role, email: p.email })),
      riskEvents: tx.riskEvents.map((e) => ({
        type: e.eventType, severity: e.severity, title: e.title, date: e.createdAt,
      })),
      alerts: tx.alerts.map((a) => ({
        severity: a.severity, title: a.title, status: a.status, date: a.createdAt,
      })),
      flaggedWires: tx.wireInstructions.filter((w) => w.flaggedAt).map((w) => ({
        bankName: w.bankName, amount: w.amount ? Number(w.amount) : null, flaggedAt: w.flaggedAt,
      })),
      generatedAt: new Date().toISOString(),
      generatedBy: user.email,
    };

    const report = await prisma.finCENReport.create({
      data: {
        transactionId,
        reportType,
        filingData,
        status: "DRAFT",
      },
    });

    await prisma.auditLog.create({
      data: {
        transactionId,
        userId: user.id !== "admin-001" ? user.id : null,
        action: "FINCEN_REPORT_GENERATED",
        metadata: { reportId: report.id, reportType },
      },
    });

    return NextResponse.json({ report }, { status: 201 });
  } catch (e) {
    console.error("FinCEN generate error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
