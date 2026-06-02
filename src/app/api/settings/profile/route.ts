import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { findUserByEmail } from "@/lib/db";

/**
 * GET /api/settings/profile
 * Returns the current user's profile from the JWT token.
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

  const user = await findUserByEmail(payload.email as string);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name },
  });
}

/**
 * POST /api/settings/profile
 * Updates the user's display name.
 * TODO: Persist to database. Currently env-var based (ADMIN_NAME),
 * so changes are in-memory only until DB is wired up.
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
  if (!body || typeof body.name !== "string" || !body.name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const { name, avatarEmoji, bio } = body;
  console.log(`[SETTINGS] Update for ${payload.email}: Name=${name}, Avatar=${avatarEmoji}, Bio=${bio?.substring(0,20)}...`);

  // TODO: Update name, avatar, and bio in database (Supabase/Postgres).
  return NextResponse.json({
    message: "Identity updated in neural archives",
    user: {
      id: payload.id,
      email: payload.email,
      name: name.trim(),
    },
  });
}
