import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/db";

const SECRET = new TextEncoder().encode(
  process.env.ENCRYPTION_KEY ?? "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
);

const COOKIE_NAME = "ws_session";

const isSupabaseConfigured =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId?: string | null;
}

const ADMIN_ACCOUNT = {
  email: "admin@wireshield.io",
  password: "admin123",
  fullName: "Michael Ehrlich",
  role: "ADMIN" as const,
};

export function validateCredentials(
  email: string,
  password: string
): SessionUser | null {
  if (
    email.toLowerCase() === ADMIN_ACCOUNT.email &&
    password === ADMIN_ACCOUNT.password
  ) {
    return {
      id: "admin-001",
      email: ADMIN_ACCOUNT.email,
      name: ADMIN_ACCOUNT.fullName,
      role: ADMIN_ACCOUNT.role,
    };
  }
  return null;
}

export async function createSession(user: SessionUser): Promise<string> {
  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
  return token;
}

export async function getSession(): Promise<SessionUser | null> {
  if (isSupabaseConfigured) {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const profile = await prisma.user.findUnique({
          where: { id: user.id },
          select: { id: true, email: true, fullName: true, role: true, organizationId: true },
        });
        if (profile) {
          return {
            id: profile.id,
            email: profile.email,
            name: profile.fullName,
            role: profile.role,
            organizationId: profile.organizationId,
          };
        }
      }
    } catch {
      // fall through to JWT
    }
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return (payload as { user: SessionUser }).user;
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export { COOKIE_NAME, SECRET, isSupabaseConfigured };
