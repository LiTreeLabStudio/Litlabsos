import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

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

    return NextResponse.json({ posts: data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Social API GET Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { content, author_name = "Litree-Ceo", author_avatar = "⚡", is_bot = false } = await req.json();
    
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    
    // Insert new post
    const { data, error } = await supabase
      .from("social_posts")
      .insert([
        {
          author_name,
          author_avatar,
          content,
          is_bot,
          likes: 0
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ post: data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Social API POST Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
