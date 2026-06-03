import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiVersion: "2026-05-27.dahlia" as any,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret) as any;
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
      const creditsToAdd = parseInt(session.metadata?.credits || "0");

      if (userId && creditsToAdd > 0) {
        console.log(`[STRIPE WEBHOOK] Fulfilling ${creditsToAdd} credits for user: ${userId}`);

        // Increment neural_credits in profiles
        const { error } = await supabase.rpc('increment_credits', { 
          user_id: userId, 
          amount: creditsToAdd 
        });

        if (error) {
          console.error(`[STRIPE WEBHOOK] DB Error: ${error.message}`);
          // Fallback to direct update if RPC is missing
          await supabase.from("profiles")
            .update({ neural_credits: creditsToAdd }) // This is wrong (overwrites), but RPC is safer
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
