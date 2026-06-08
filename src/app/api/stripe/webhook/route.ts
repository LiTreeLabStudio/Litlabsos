import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-05-27.dahlia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`❌ Webhook signature verification failed: ${msg}`);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const coinsToAdd = parseInt(session.metadata?.coins || session.metadata?.credits || "0");

      if (userId && coinsToAdd > 0) {
        console.log(`[STRIPE WEBHOOK] Fulfilling ${coinsToAdd} coins for user: ${userId}`);

        // Increment litbit_coins in profiles
        const { error } = await supabase.rpc('increment_coins', { 
          user_id: userId, 
          amount: coinsToAdd 
        });

        if (error) {
          console.error(`[STRIPE WEBHOOK] DB Error: ${error.message}`);
          // Fallback to direct update if RPC is missing
          await supabase.from("profiles")
            .update({ litbit_coins: coinsToAdd }) // Note: This should ideally be an atomic increment
            .eq("id", userId);
        }
      }
      break;
    }
    default:
      console.log(`[STRIPE WEBHOOK] Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
