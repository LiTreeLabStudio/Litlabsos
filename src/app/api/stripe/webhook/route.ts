// Stripe webhook handler — credits wallet on coin pack purchases
import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase, isAdminSupabaseConfigured } from "@/lib/supabase-admin";

async function creditCoinPack(clerkId: string, coinAmount: number, sessionId: string) {
  if (!isAdminSupabaseConfigured()) {
    console.log("[Webhook] Supabase not configured — skipping wallet credit");
    return;
  }
  try {
    const sb = getAdminSupabase();
    // Find user
    const { data: user } = await sb.from("users").select("id").eq("clerk_id", clerkId).single();
    if (!user) {
      console.error("[Webhook] User not found for clerk_id:", clerkId);
      return;
    }
    // Get current wallet
    const { data: wallet } = await sb.from("wallets").select("balance").eq("user_id", user.id).single();
    const currentBalance = wallet?.balance || 0;
    const newBalance = currentBalance + coinAmount;
    // Update wallet
    await sb.from("wallets").update({ balance: newBalance, updated_at: new Date().toISOString() }).eq("user_id", user.id);
    // Record transaction
    await sb.from("transactions").insert({
      user_id: user.id,
      type: "purchase",
      amount: coinAmount,
      balance_after: newBalance,
      description: `Purchased ${coinAmount} LiTBit Coins via Stripe`,
      metadata: { stripe_session_id: sessionId },
    });
    console.log(`[Webhook] Credited ${coinAmount} coins to ${clerkId}. New balance: ${newBalance}`);
  } catch (err) {
    console.error("[Webhook] Failed to credit coin pack:", err);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const _sig = req.headers.get("stripe-signature") || void 0;
  void _sig;
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const key = process.env.STRIPE_SECRET_KEY;

  if (!key) {
    console.error("No STRIPE_SECRET_KEY configured");
    return NextResponse.json({ error: "No secret key" }, { status: 500 });
  }

  if (!signingSecret) {
    console.error("No STRIPE_WEBHOOK_SECRET configured");
    return NextResponse.json({ error: "No webhook secret" }, { status: 500 });
  }

  // Parse and verify event
  let event;
  try {
    event = JSON.parse(body);
  } catch (err) {
    console.error("Webhook parse error:", err);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const stripeResponse = await fetch(
      `https://api.stripe.com/v1/events/${event.id}`,
      { headers: { Authorization: `Bearer ${key}` } }
    );
    if (!stripeResponse.ok) {
      console.error("Event verification failed for:", event.id);
      return NextResponse.json({ error: "Event verification failed" }, { status: 400 });
    }
  } catch (err) {
    console.error("Event verification error:", err);
    return NextResponse.json({ error: "Verification error" }, { status: 500 });
  }

  // Process event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.log("Checkout completed:", session.id, "Email:", session.customer_email);
      const meta = session.metadata || {};
      const coinAmount = parseInt(meta.coin_amount || "0", 10);
      const clerkId = meta.clerk_id;
      if (coinAmount > 0 && clerkId) {
        await creditCoinPack(clerkId, coinAmount, session.id);
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object;
      console.log("Subscription:", sub.id, "Status:", sub.status);
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object;
      console.log("Subscription cancelled:", sub.id);
      break;
    }
    case "invoice.payment_succeeded": {
      const invoice = event.data.object;
      console.log("Payment succeeded:", invoice.id);
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object;
      console.log("Payment failed:", invoice.id);
      break;
    }
    default:
      console.log("Unhandled event:", event.type);
  }

  return NextResponse.json({ received: true });
}
