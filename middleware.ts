import { NextResponse } from "next/server";
import { verifyToken } from "./src/lib/jwt";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/api/auth",
  "/api/chat",
  "/api/settings",
  "/gallery",
];

const STATIC_EXTENSIONS = [
  ".svg",
  ".ico",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
  ".css",
  ".js",
];

export async function middleware(request: {
  nextUrl: { pathname: string; origin: string; href: string };
  cookies: { get: (name: string) => { value: string } | undefined };
}) {
  const { pathname } = request.nextUrl;

  // Public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return addSecurityHeaders(request, NextResponse.next());
  }

  // Static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    STATIC_EXTENSIONS.some((ext) => pathname.endsWith(ext))
  ) {
    return NextResponse.next();
  }

  // Auth check
  const token = request.cookies.get("auth-token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
  }

  const payload = await verifyToken(token);
  if (!payload) {
    const res = NextResponse.redirect(
      new URL("/login", request.nextUrl.origin)
    );
    res.cookies.delete("auth-token");
    return res;
  }

  return addSecurityHeaders(request, NextResponse.next());
}

function addSecurityHeaders(
  request: { nextUrl: { pathname: string } },
  response: NextResponse
) {
  // Generate nonce for CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  response.headers.set("x-nonce", nonce);

  // CSP — strict but functional for inline scripts/styles
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    `connect-src 'self' https://api.litlabs.net https://litlabs.net`,
    "font-src 'self' https://fonts.gstatic.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
  response.headers.set("Content-Security-Policy", csp);

  // HSTS (only in production via Vercel, but set anyway)
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  // MIME sniffing protection
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Clickjacking protection
  response.headers.set("X-Frame-Options", "DENY");

  // Referrer policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions policy
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );

  // Remove powered by
  response.headers.delete("X-Powered-By");

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
