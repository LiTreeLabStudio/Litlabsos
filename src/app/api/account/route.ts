import { NextRequest, NextResponse } from "next/server";
import { getAuth, currentUser } from "@clerk/nextjs/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

/**
 * GET /api/account
 * Fetches or creates the user's profile in Supabase.
 */
export async function GET(req: NextRequest) {
  let userId: string | null = null;
  try {
    const auth = getAuth(req);
    userId = auth.userId;
  } catch (e) {
    console.warn("[ACCOUNT_GET] Clerk auth failed, checking dev fallback");
  }

  if (!userId) {
    userId = process.env.NEXT_PUBLIC_DEV_USER_ID || "dev_user_123";
  }

  try {
    const supabase = getSupabaseServerClient();
    
    // 1. Try to fetch the profile
    let { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    // 2. If profile doesn't exist or table is missing
    if (error && (error.code === "PGRST116" || error.message.includes("not found"))) {
      if (error.message.includes("table")) {
        console.warn("[ACCOUNT_GET] profiles table missing, returning simulated account");
        return NextResponse.json({ 
          user: { id: userId, name: "Simulation Mode", litbit_coins: 500 },
          warning: "Schema update required (profiles table missing)."
        });
      }
      
      let email = "dev@litlabs.net";
      let name = "Dev User";

      try {
        const user = await currentUser();
        if (user) {
          email = user.emailAddresses[0]?.emailAddress;
          name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
        }
      } catch (e) {
        console.warn("[ACCOUNT_GET] Failed to fetch Clerk user details");
      }

      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert([
          {
            id: userId,
            email: email,
            name: name,
            litbit_coins: 500 // Welcome bonus
          }
        ])
        .select()
        .single();

      if (createError) throw createError;
      profile = newProfile;
    } else if (error) {
      throw error;
    }

    return NextResponse.json({ user: profile });
  } catch (error: any) {
    console.error("[ACCOUNT_GET_ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to fetch account" }, { status: 500 });
  }
}

/**
 * DELETE /api/account
 * Deletes the current user's account and profile.
 */
export async function DELETE(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseServerClient();
    
    // Delete profile (cascades to agents, etc. if configured in schema)
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (error) throw error;

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error: any) {
    console.error("[ACCOUNT_DELETE_ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to delete account" }, { status: 500 });
  }
}
