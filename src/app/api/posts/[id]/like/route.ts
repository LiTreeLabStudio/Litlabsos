// Post Like / Unlike API
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getAdminSupabase, isAdminSupabaseConfigured } from "@/lib/supabase-admin";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: postId } = await params;
  if (!isAdminSupabaseConfigured()) {
    return NextResponse.json({ success: true, mock: true });
  }

  try {
    const sb = getAdminSupabase();
    const { data: user } = await sb.from("users").select("id").eq("clerk_id", userId).single();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    await sb.from("post_likes").insert({ post_id: postId, user_id: user.id }).select();
    await sb.rpc("increment_post_likes", { post_id: postId });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true, mock: true });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: postId } = await params;
  if (!isAdminSupabaseConfigured()) {
    return NextResponse.json({ success: true, mock: true });
  }

  try {
    const sb = getAdminSupabase();
    const { data: user } = await sb.from("users").select("id").eq("clerk_id", userId).single();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    await sb.from("post_likes").delete().match({ post_id: postId, user_id: user.id });
    await sb.rpc("decrement_post_likes", { post_id: postId });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true, mock: true });
  }
}
