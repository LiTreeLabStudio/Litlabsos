import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  let userId: string | null = null;
  try {
    const auth = getAuth(req);
    userId = auth.userId;
  } catch (e) {
    console.warn("[CLAIM_BONUS] Clerk auth failed, checking dev fallback");
  }

  if (!userId) {
    userId = process.env.NEXT_PUBLIC_DEV_USER_ID || "dev_user_123";
  }

  try {
    const supabase = getSupabaseServerClient();
    
    // Call the RPC function we defined in the schema
    const { data, error } = await supabase.rpc("claim_daily_bonus", {
      user_id: userId
    });

    if (error) throw error;

    if (!data.success) {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      amount: data.amount,
      message: `Successfully claimed ${data.amount} LiTBit Coins!`
    });

  } catch (error: any) {
    console.error("[CLAIM_BONUS_ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to claim bonus" }, { status: 500 });
  }
}
