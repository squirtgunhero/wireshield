import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { verifyAccount } from "@/lib/plaid";

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { publicToken } = await request.json();
    if (!publicToken) {
      return NextResponse.json({ error: "Public token is required" }, { status: 400 });
    }

    const result = await verifyAccount(publicToken);
    return NextResponse.json(result);
  } catch (e) {
    console.error("Bank verify error:", e);
    return NextResponse.json({ error: "Failed to verify account" }, { status: 500 });
  }
}
