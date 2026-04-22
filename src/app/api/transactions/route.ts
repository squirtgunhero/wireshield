import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20"));
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { propertyAddress: { contains: search, mode: "insensitive" } },
      { propertyCity: { contains: search, mode: "insensitive" } },
    ];
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: {
        parties: { select: { id: true, name: true, role: true, status: true } },
        createdBy: { select: { id: true, fullName: true } },
        _count: { select: { alerts: true, wireInstructions: true, events: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return NextResponse.json({
    transactions,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const {
      propertyAddress, propertyCity, propertyState, propertyZip,
      purchasePrice, expectedCloseDate, transactionType,
    } = body;

    if (!propertyAddress) {
      return NextResponse.json({ error: "Property address is required" }, { status: 400 });
    }

    const tx = await prisma.transaction.create({
      data: {
        transactionType: transactionType || "PURCHASE",
        propertyAddress,
        propertyCity: propertyCity || null,
        propertyState: propertyState || null,
        propertyZip: propertyZip || null,
        purchasePrice: purchasePrice || null,
        expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
        createdById: user.id !== "admin-001" ? user.id : null,
        riskScore: 0,
        riskLevel: "PENDING",
      },
      include: {
        parties: true,
        createdBy: { select: { id: true, fullName: true } },
      },
    });

    await prisma.auditLog.create({
      data: {
        transactionId: tx.id,
        userId: user.id !== "admin-001" ? user.id : null,
        action: "TRANSACTION_CREATED",
        metadata: { propertyAddress, createdBy: user.email },
      },
    });

    return NextResponse.json({ transaction: tx }, { status: 201 });
  } catch (e) {
    console.error("Create transaction error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
