import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { verifyToken } from "@/lib/jwt";

export const dynamic = "force-dynamic";

// GET — fetch comments for a post
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const post_id = searchParams.get("post_id");
    if (!post_id) return NextResponse.json({ error: "post_id is required" }, { status: 400 });

    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("post_comments")
      .select("*")
      .eq("post_id", post_id)
      .order("created_at", { ascending: true })
      .limit(100);

    if (error) throw error;

    return NextResponse.json({ comments: data ?? [] });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Comments GET Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST — add a new comment
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    const userId = payload.id as string;

    const { post_id, content } = await req.json();
    if (!post_id) return NextResponse.json({ error: "post_id is required" }, { status: 400 });
    if (!content || !content.trim()) return NextResponse.json({ error: "Content is required" }, { status: 400 });

    const supabase = getSupabaseServerClient();

    // Get user name/email for denormalized display
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, email")
      .eq("id", userId)
      .single();

    const authorName = profile?.name || profile?.email?.split("@")[0] || "User";
    const authorAvatar = "👤";

    const { data, error } = await supabase
      .from("post_comments")
      .insert({
        post_id,
        author_id: userId,
        content: content.trim(),
      })
      .select()
      .single();

    if (error) throw error;

    // Return enriched comment with author info
    return NextResponse.json({
      comment: {
        ...data,
        author_name: authorName,
        author_avatar: authorAvatar,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Comments POST Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
