import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

/**
 * DELETE /api/account
 * Deletes the current user's account.
 * TODO: Implement actual account deletion when using a real database.
 * For now, this is a placeholder that requires manual env var removal.
 */
export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // Placeholder: In a real implementation, this would:
  // 1. Delete the user from the database
  // 2. Delete all associated data (agents, posts, messages)
  // 3. Invalidate all active sessions

  const res = NextResponse.json({
    message: "Account deletion requires manual env var removal. Contact support for full deletion.",
    placeholder: true,
  });
  res.cookies.delete("auth-token");
  return res;
}
