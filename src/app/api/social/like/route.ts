import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { verifyToken } from "@/lib/jwt";

export const dynamic = "force-dynamic";

// POST = like
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    const userId = payload.id as string;

    const { post_id } = await req.json();
    if (!post_id) return NextResponse.json({ error: "post_id is required" }, { status: 400 });

    const supabase = getSupabaseServerClient();

    // Check if already liked
    const { data: existing } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", post_id)
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      // Already liked — return current state
      const { data: post } = await supabase
        .from("social_posts")
        .select("likes_count")
        .eq("id", post_id)
        .single();
      return NextResponse.json({ liked: true, likes_count: post?.likes_count ?? 0 });
    }

    // Insert like
    const { error: insertError } = await supabase
      .from("post_likes")
      .insert({ post_id, user_id: userId });
    if (insertError && !insertError.message.includes("duplicate")) {
      throw insertError;
    }

    // Atomically increment likes_count using raw SQL
    const { data: updated, error: updateError } = await supabase.rpc("increment_likes_count", { p_post_id: post_id });

    // If RPC doesn't exist, fallback: fetch and update
    let likesCount = 0;
    if (updateError) {
      // Fallback: get current count, increment, update
      const { data: currentPost } = await supabase
        .from("social_posts")
        .select("likes_count")
        .eq("id", post_id)
        .single();
      const newCount = (currentPost?.likes_count ?? 0) + 1;
      await supabase
        .from("social_posts")
        .update({ likes_count: newCount })
        .eq("id", post_id);
      likesCount = newCount;
    } else {
      likesCount = updated ?? 0;
    }

    return NextResponse.json({ liked: true, likes_count: likesCount });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Like API Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE = unlike
export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    const userId = payload.id as string;

    const { searchParams } = new URL(req.url);
    const post_id = searchParams.get("post_id");
    if (!post_id) return NextResponse.json({ error: "post_id is required" }, { status: 400 });

    const supabase = getSupabaseServerClient();

    const { error: deleteError } = await supabase
      .from("post_likes")
      .delete()
      .eq("post_id", post_id)
      .eq("user_id", userId);
    if (deleteError) throw deleteError;

    // Fallback: decrement likesCount
    const { data: currentPost } = await supabase
      .from("social_posts")
      .select("likes_count")
      .eq("id", post_id)
      .single();
    const newCount = Math.max((currentPost?.likes_count ?? 0) - 1, 0);
    await supabase
      .from("social_posts")
      .update({ likes_count: newCount })
      .eq("id", post_id);

    return NextResponse.json({ liked: false, likes_count: newCount });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Unlike API Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// GET — check if current user liked this post + get count
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const post_id = searchParams.get("post_id");
    if (!post_id) return NextResponse.json({ error: "post_id is required" }, { status: 400 });

    const supabase = getSupabaseServerClient();

    const { data: post } = await supabase
      .from("social_posts")
      .select("likes_count")
      .eq("id", post_id)
      .single();

    // Check if user liked
    const token = req.cookies.get("auth-token")?.value;
    let liked = false;
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        const { data: likeRecord } = await supabase
          .from("post_likes")
          .select("id")
          .eq("post_id", post_id)
          .eq("user_id", payload.id as string)
          .maybeSingle();
        liked = !!likeRecord;
      }
    }

    return NextResponse.json({ liked, likes_count: post?.likes_count ?? 0 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Like GET API Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
