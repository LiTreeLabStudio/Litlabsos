import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { verifyToken } from "@/lib/jwt";

export const dynamic = "force-dynamic";

// GET — fetch all conversations for current user, with last message + other user info
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    const userId = payload.id as string;

    const supabase = getSupabaseServerClient();

    // Get all conversations where user is participant
    const { data, error } = await supabase
      .from("conversations")
      .select(`
        id,
        user_1_id,
        user_2_id,
        last_message,
        last_message_at,
        created_at,
        messages(id, content, sender_id, read, created_at)
      `)
      .or(`user_1_id.eq.${userId},user_2_id.eq.${userId}`)
      .order("last_message_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    // Enrich with other user info
    const conversations = await Promise.all(
      (data ?? []).map(async (conv: { id: string; user_1_id: string; user_2_id: string; last_message: string | null; last_message_at: string | null; messages?: Array<{ content: string; created_at: string }> }) => {
        const otherId = conv.user_1_id === userId ? conv.user_2_id : conv.user_1_id;
        const { data: profile } = await supabase
          .from("profiles")
          .select("name, email")
          .eq("id", otherId)
          .single();

        // Count unread messages
        const { count: unreadCount } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("conversation_id", conv.id)
          .eq("sender_id", otherId)
          .eq("read", false);

        const messages = conv.messages || [];
        const lastMsg = messages.length > 0
          ? messages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
          : null;

        return {
          id: conv.id,
          other_user: {
            id: otherId,
            name: profile?.name || profile?.email?.split("@")[0] || "User",
            avatar: (profile?.name?.charAt(0) || profile?.email?.charAt(0) || "U").toUpperCase(),
          },
          last_message: lastMsg?.content || conv.last_message || "",
          last_message_at: lastMsg?.created_at || conv.last_message_at,
          unread_count: unreadCount || 0,
        };
      })
    );

    return NextResponse.json({ conversations });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST — create a new conversation or find existing one
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    const userId = payload.id as string;

    const { other_user_id } = await req.json();
    if (!other_user_id) return NextResponse.json({ error: "other_user_id is required" }, { status: 400 });
    if (other_user_id === userId) return NextResponse.json({ error: "Cannot message yourself" }, { status: 400 });

    const supabase = getSupabaseServerClient();

    // Check if conversation already exists
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .or(`and(user_1_id.eq.${userId},user_2_id.eq.${other_user_id}),and(user_1_id.eq.${other_user_id},user_2_id.eq.${userId})`)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ conversation_id: existing.id });
    }

    // Create new conversation
    const { data, error } = await supabase
      .from("conversations")
      .insert({ user_1_id: userId, user_2_id: other_user_id })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({ conversation_id: data.id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
