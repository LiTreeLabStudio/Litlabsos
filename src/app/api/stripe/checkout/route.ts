import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

// This is a mock Stripe checkout route
// In production, use the 'stripe' library and your secret key
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

    const { agentId, priceId } = await req.json();

    if (!agentId || !priceId) {
      return NextResponse.json({ error: "Missing agent or price data" }, { status: 400 });
    }

    console.log(`[STRIPE MOCK] Initializing checkout for user ${payload.email} for agent ${agentId}`);

    // Mocking a successful session creation
    return NextResponse.json({
      sessionId: `mock_session_${Date.now()}`,
      url: `/dashboard/agents?success=true&acquired=${agentId}`, // Redirect back on success
      message: "Checkout initialized (Mock Mode)"
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
