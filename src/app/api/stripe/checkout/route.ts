import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  // @ts-expect-error - Using a specialized or future API version for the Hive Mind
  apiVersion: "2026-05-27.dahlia",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://litlabs.net";

/**
 * POST /api/stripe/checkout
 * Creates a real Stripe Checkout Session for buying LiTBit Coins.
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const amount = Number(body.amount) || 10;
    const coins = Number(body.coins) || 100;

    console.log(`[STRIPE] Initializing checkout for ${userId}: $${amount} for ${coins} coins`);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `LiTBit Coins: ${coins} Bundle`,
              description: `High-performance compute coins for LiTTree Lab Studios.`,
            },
            unit_amount: amount * 100, // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${SITE_URL}/dashboard?checkout_success=true&coins=${coins}`,
      cancel_url: `${SITE_URL}/marketplace?checkout_cancel=true`,
      metadata: {
        user_id: String(userId),
        coins: String(coins),
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
