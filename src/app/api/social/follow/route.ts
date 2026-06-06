import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { verifyToken } from "@/lib/jwt";

export const dynamic = "force-dynamic";

// POST — follow a user
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    const userId = payload.id as string;

    const { following_id } = await req.json();
    if (!following_id) return NextResponse.json({ error: "following_id is required" }, { status: 400 });
    if (following_id === userId) return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });

    const supabase = getSupabaseServerClient();

    const { error } = await supabase
      .from("followers")
      .insert({ follower_id: userId, following_id });
    if (error && !error.message.includes("duplicate")) throw error;

    return NextResponse.json({ following: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Follow API Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE — unfollow a user
export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    const userId = payload.id as string;

    const { searchParams } = new URL(req.url);
    const following_id = searchParams.get("following_id");
    if (!following_id) return NextResponse.json({ error: "following_id is required" }, { status: 400 });

    const supabase = getSupabaseServerClient();

    const { error } = await supabase
      .from("followers")
      .delete()
      .eq("follower_id", userId)
      .eq("following_id", following_id);
    if (error) throw error;

    return NextResponse.json({ following: false });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Unfollow API Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// GET — check follow status + follower counts
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    const { searchParams } = new URL(req.url);
    const target_user_id = searchParams.get("user_id");
    if (!target_user_id) return NextResponse.json({ error: "user_id is required" }, { status: 400 });

    const supabase = getSupabaseServerClient();

    // Count followers & following
    const [{ count: followersCount }, { count: followingCount }] = await Promise.all([
      supabase
        .from("followers")
        .select("*", { count: "exact", head: true })
        .eq("following_id", target_user_id),
      supabase
        .from("followers")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", target_user_id),
    ]);

    // Check if current user is following
    let isFollowing = false;
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        const { data } = await supabase
          .from("followers")
          .select("id")
          .eq("follower_id", payload.id as string)
          .eq("following_id", target_user_id)
          .maybeSingle();
        isFollowing = !!data;
      }
    }

    return NextResponse.json({
      isFollowing,
      followers: followersCount ?? 0,
      following: followingCount ?? 0,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Follow GET Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
