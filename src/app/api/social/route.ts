import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { verifyToken } from "@/lib/jwt";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("social_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    // Fetch comment counts for each post
    const postsWithCounts = await Promise.all(
      (data ?? []).map(async (post) => {
        const { count } = await supabase
          .from("post_comments")
          .select("*", { count: "exact", head: true })
          .eq("post_id", post.id);
        return {
          ...post,
          comments_count: count ?? 0,
        };
      })
    );

    return NextResponse.json({ posts: postsWithCounts });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Social API GET Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    const userId = payload.id as string;

    const { content, author_name, author_avatar, is_bot = false } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    // Get profile info if not provided
    let finalAuthorName = author_name;
    let finalAuthorAvatar = author_avatar;
    if (!finalAuthorName || !finalAuthorAvatar) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("name, email")
        .eq("id", userId)
        .single();
      finalAuthorName = finalAuthorName || profile?.name || profile?.email?.split("@")[0] || "User";
      finalAuthorAvatar = finalAuthorAvatar || "⚡";
    }

    // Insert new post
    const { data, error } = await supabase
      .from("social_posts")
      .insert([
        {
          author_id: userId,
          author_name: finalAuthorName,
          author_avatar: finalAuthorAvatar,
          content,
          is_bot,
          likes_count: 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ post: { ...data, comments_count: 0 } });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Social API POST Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
