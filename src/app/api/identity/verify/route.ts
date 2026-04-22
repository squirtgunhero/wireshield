import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createInquiry } from "@/lib/persona";

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const userId = body.userId || user.id;
    const result = await createInquiry(userId, body.templateId);
    return NextResponse.json(result);
  } catch (e) {
    console.error("Identity verify error:", e);
    return NextResponse.json({ error: "Failed to create verification" }, { status: 500 });
  }
}
