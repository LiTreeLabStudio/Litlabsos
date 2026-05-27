import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

const PREFERENCES_COOKIE = "user-preferences";

interface UserPreferences {
  theme: string;
  accentColor: string;
  notifications: boolean;
  language: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "dark",
  accentColor: "cyan",
  notifications: true,
  language: "en",
};

function parsePreferences(raw: string | undefined): UserPreferences {
  if (!raw) return DEFAULT_PREFERENCES;
  try {
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

/**
 * GET /api/settings/preferences
 * Returns the user's preferences from a cookie.
 * TODO: Load from database when user accounts are persisted.
 */
export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const preferences = parsePreferences(req.cookies.get(PREFERENCES_COOKIE)?.value);
  return NextResponse.json({ preferences });
}

/**
 * POST /api/settings/preferences
 * Updates user preferences and stores them in a cookie.
 * TODO: Persist to database alongside the user record.
 */
export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // Merge with existing preferences (from cookie or defaults)
  const current = parsePreferences(req.cookies.get(PREFERENCES_COOKIE)?.value);

  const updated: UserPreferences = {
    ...current,
    ...(typeof body.theme === "string" ? { theme: body.theme } : {}),
    ...(typeof body.accentColor === "string" ? { accentColor: body.accentColor } : {}),
    ...(typeof body.notifications === "boolean" ? { notifications: body.notifications } : {}),
    ...(typeof body.language === "string" ? { language: body.language } : {}),
  };

  const res = NextResponse.json({ preferences: updated });
  res.cookies.set(PREFERENCES_COOKIE, JSON.stringify(updated), {
    httpOnly: false, // readable by client JS for theme switching
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
  });

  return res;
}
