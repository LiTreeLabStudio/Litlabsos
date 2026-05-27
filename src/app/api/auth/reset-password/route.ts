import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createHash } from "crypto";

/**
 * Placeholder reset-password endpoint.
 *
 * Accepts { token, newPassword }.
 * Verifies the token against a hash of AUTH_SECRET (so only someone with
 * the server secret can generate valid tokens). Hashes the new password
 * and returns the hash — the admin must manually update ADMIN_PASSWORD_HASH
 * in Vercel env vars until a proper email-based flow is implemented.
 */
export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Verify token: must match SHA-256 of AUTH_SECRET
    const secret = process.env.AUTH_SECRET || "homebase-dev-secret-change-in-production";
    const expectedToken = createHash("sha256").update(secret).digest("hex");

    if (token !== expectedToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Hash the new password
    const newHash = await bcrypt.hash(newPassword, 12);

    return NextResponse.json({
      message: newHash,
      instruction:
        "Update ADMIN_PASSWORD_HASH in Vercel env vars with the value from 'message', then redeploy.",
    });
  } catch (err) {
    const msg = (err as Error)?.message || "Unknown";
    console.error("[reset-password] Error:", msg);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
