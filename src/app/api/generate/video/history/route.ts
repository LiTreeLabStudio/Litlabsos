import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  let userId: string | null = null;
  try {
    const auth = getAuth(req);
    userId = auth.userId;
  } catch (e) {
    console.warn("[VIDEO_HISTORY] Clerk auth failed, checking dev fallback");
  }

  if (!userId) {
    userId = process.env.NEXT_PUBLIC_DEV_USER_ID || "dev_user_123";
  }

  console.log(`[VIDEO_HISTORY] Fetching for user: ${userId}`);

  try {
    const supabase = getSupabaseServerClient();
    
    const { data: history, error } = await supabase
      .from("generations")
      .select("*")
      .eq("user_id", userId)
      .eq("type", "video")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("[VIDEO_HISTORY] Supabase error:", error);
      if (error.message.includes("not find the table")) {
        return NextResponse.json({ 
          history: [], 
          warning: "Schema update required. Please run the SQL in supabase_schema.sql to enable history tracking." 
        });
      }
      throw error;
    }

    console.log(`[VIDEO_HISTORY] Found ${history?.length || 0} records`);
    return NextResponse.json({ history: history || [] });
  } catch (error: unknown) {
    console.error("[VIDEO_HISTORY_GET_ERROR]", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to fetch video history" }, { status: 500 });
  }
}
