import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL || "";
    const normalizedEmail = email.toLowerCase().trim();

    // Only process if the email matches the admin — but don't reveal this
    if (adminEmail && normalizedEmail === adminEmail.toLowerCase()) {
      // TODO: Generate a real reset token, store it, and send an email
      console.log(`[forgot-password] Reset requested for admin: ${normalizedEmail}`);
    }

    // Always return the same message regardless of whether the email exists
    return NextResponse.json({
      message: "If this email exists, a reset link has been sent.",
    });
  } catch (err) {
    const msg = (err as Error)?.message || "Unknown";
    console.error("[forgot-password] Error:", msg);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
