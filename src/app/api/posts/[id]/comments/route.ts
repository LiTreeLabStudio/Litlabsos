// Post Comments API — GET / POST
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getAdminSupabase, isAdminSupabaseConfigured } from "@/lib/supabase-admin";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: postId } = await params;
  if (!isAdminSupabaseConfigured()) {
    return NextResponse.json({ comments: [] });
  }
  try {
    const sb = getAdminSupabase();
    const { data, error } = await sb
      .from("post_comments")
      .select("id, content, created_at, users:user_id (name, username, avatar_url)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ comments: data || [] });
  } catch (err) {
    console.error("GET comments error:", err);
    return NextResponse.json({ comments: [] });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: postId } = await params;
  const body = await req.json().catch(() => null);
  if (!body || !body.content?.trim()) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  if (!isAdminSupabaseConfigured()) {
    return NextResponse.json({ success: true, comment: { id: "mock_c", content: body.content.trim(), created_at: new Date().toISOString(), users: { name: "You", username: "you", avatar_url: "🔥" } }, mock: true });
  }

  try {
    const sb = getAdminSupabase();
    const { data: user } = await sb.from("users").select("id").eq("clerk_id", userId).single();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { data: comment, error } = await sb
      .from("post_comments")
      .insert({ post_id: postId, user_id: user.id, content: body.content.trim() })
      .select("id, content, created_at, users:user_id (name, username, avatar_url)")
      .single();

    if (error) throw error;
    await sb.rpc("increment_post_comments", { post_id: postId });
    return NextResponse.json({ success: true, comment });
  } catch (err) {
    console.error("POST comment error:", err);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
