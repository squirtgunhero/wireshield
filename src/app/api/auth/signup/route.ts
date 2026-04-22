import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession, COOKIE_NAME, isSupabaseConfigured } from "@/lib/auth";
import type { UserRole } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, fullName, phone, role, company } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Email, password, and full name are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    let supabaseUserId: string | null = null;

    if (isSupabaseConfigured) {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
        options: { data: { full_name: fullName } },
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      supabaseUserId = data.user?.id ?? null;
    }

    const validRoles: UserRole[] = ["BUYER", "SELLER", "AGENT", "TITLE_OFFICER", "ESCROW_OFFICER", "LENDER", "ATTORNEY"];
    const userRole: UserRole = validRoles.includes(role) ? role : "AGENT";

    let org = null;
    if (company) {
      org = await prisma.organization.findFirst({ where: { name: company } });
    }

    const user = await prisma.user.create({
      data: {
        ...(supabaseUserId ? { id: supabaseUserId } : {}),
        email: email.toLowerCase(),
        fullName,
        phone: phone || null,
        role: userRole,
        organizationId: org?.id || null,
      },
    });

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.fullName,
      role: user.role,
      organizationId: user.organizationId,
    };

    const token = await createSession(sessionUser);

    const response = NextResponse.json({ user: sessionUser });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (e) {
    console.error("Signup error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
