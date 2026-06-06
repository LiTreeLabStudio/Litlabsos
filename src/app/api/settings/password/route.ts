import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/jwt";

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "";

/**
 * POST /api/settings/password
 * Verifies the old password and returns the bcrypt hash of the new password.
 *
 * Since the admin password is stored in an env var (ADMIN_PASSWORD_HASH),
 * it cannot be updated at runtime. The client should display the returned
 * hash with instructions to update the Vercel environment variable.
 *
 * TODO: When using a real database, update the password hash directly
 * instead of returning it to the client.
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
  if (!body || typeof body.oldPassword !== "string" || typeof body.newPassword !== "string") {
    return NextResponse.json(
      { error: "oldPassword and newPassword are required" },
      { status: 400 }
    );
  }

  const { oldPassword, newPassword } = body;

  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters" },
      { status: 400 }
    );
  }

  // Verify old password against stored hash
  if (!ADMIN_PASSWORD_HASH) {
    return NextResponse.json(
      { error: "No admin password configured" },
      { status: 500 }
    );
  }

  const valid = await bcrypt.compare(oldPassword, ADMIN_PASSWORD_HASH);
  if (!valid) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
  }

  // Hash the new password
  const newHash = await bcrypt.hash(newPassword, 12);

  // TODO: Persist newHash to database.
  // For env-var setups, the admin must manually update ADMIN_PASSWORD_HASH
  // in Vercel (or their hosting provider) with the returned hash.
  return NextResponse.json({
    message: "Password hash generated. Update ADMIN_PASSWORD_HASH env var with the value below.",
    newHash,
    instructions:
      "Go to your Vercel dashboard → Settings → Environment Variables, and set ADMIN_PASSWORD_HASH to the newHash value above. Redeploy for changes to take effect.",
  });
}
