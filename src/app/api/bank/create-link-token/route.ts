import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createLinkToken } from "@/lib/plaid";

export async function POST() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const result = await createLinkToken(user.id);
    return NextResponse.json(result);
  } catch (e) {
    console.error("Plaid link error:", e);
    return NextResponse.json({ error: "Failed to create link token" }, { status: 500 });
  }
}
