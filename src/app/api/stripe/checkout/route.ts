import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiVersion: "2026-05-27.dahlia" as any,
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://thelitlabs.net";

/**
 * POST /api/stripe/checkout
 * Creates a real Stripe Checkout Session for buying Neural Credits.
 */
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

    const body = await req.json();
    const amount = Number(body.amount) || 10;
    const credits = Number(body.credits) || 100;

    console.log(`[STRIPE] Initializing checkout for ${payload.email}: $${amount} for ${credits} credits`);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Neural Credits: ${credits} Bundle`,
              description: `High-performance compute credits for the Hive Mind.`,
            },
            unit_amount: amount * 100, // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${SITE_URL}/dashboard?checkout_success=true&credits=${credits}`,
      cancel_url: `${SITE_URL}/marketplace?checkout_cancel=true`,
      customer_email: payload.email,
      metadata: {
        user_id: String((payload as { id: string; email: string }).id),
        credits: String(credits),
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      message: "Checkout initialized"
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Checkout Session Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
