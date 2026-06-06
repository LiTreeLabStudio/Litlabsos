import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  // Pages requiring login
  "/builder(.*)",
  "/marketplace(.*)",
  "/settings(.*)",
  "/profile(.*)",
  "/agent-chat(.*)",
  "/gallery/(.*)", // specific gallery items
  
  // API routes requiring auth
  "/api/user-agents(.*)",
  "/api/conversations(.*)",
  "/api/settings/(.*)",
  "/api/wallet(.*)",
  "/api/users/(.*)",
  "/api/account",
  "/api/orchestrate",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Add cache headers for performance
  const response = NextResponse.next();

  // Cache static pages for 30 minutes
  if (["/about", "/contact", "/docs", "/pricing"].includes(req.nextUrl.pathname)) {
    response.headers.set("Cache-Control", "public, max-age=1800, stale-while-revalidate=3600");
  }

  // No cache for auth pages
  if (req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/signup")) {
    response.headers.set("Cache-Control", "no-store, must-revalidate");
  }

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseHost = supabaseUrl ? new URL(supabaseUrl).host : "";
  response.headers.set(
    "Content-Security-Policy",
    `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.com https://*.clerk.accounts.dev https://*.stripe.com https://js.stripe.com; style-src 'self' 'unsafe-inline' https://*.clerk.com; connect-src 'self' https://*.clerk.com https://*.clerk.accounts.dev https://api.stripe.com${supabaseHost ? ` https://${supabaseHost}` : ""}; img-src 'self' data: blob: https://*.unsplash.com https://*.clerk.com; font-src 'self' https://*.clerk.com; frame-src 'self' https://*.stripe.com https://js.stripe.com;`
  );
  response.headers.set("Vary", "Accept-Encoding");

  // Protect private routes
  if (isProtectedRoute(req) && !userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return response;
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/__clerk/:path*",
  ],
};
