import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.ENCRYPTION_KEY ?? "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
);

const COOKIE_NAME = "ws_session";

const APP_ROUTES = [
  "/dashboard", "/transactions", "/scan", "/training", "/intel",
  "/settings", "/compliance", "/analytics", "/notifications",
];
const AUTH_ROUTES = ["/login", "/signup"];
const PUBLIC_ROUTES = ["/", "/check", "/verify", "/instructions"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"))) {
    if (pathname === "/") return NextResponse.next();
    if (["/check", "/verify", "/instructions"].some((r) => pathname === r || pathname.startsWith(r + "/"))) {
      return NextResponse.next();
    }
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  let isAuthenticated = false;
  if (token) {
    try {
      await jwtVerify(token, SECRET);
      isAuthenticated = true;
    } catch {
      // invalid/expired token
    }
  }

  if (!isAuthenticated) {
    const supabaseToken = request.cookies.getAll().find((c) => c.name.startsWith("sb-"));
    if (supabaseToken) {
      isAuthenticated = true;
    }
  }

  const isAppRoute = APP_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"));

  if (!isAuthenticated && isAppRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
