import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { verifyToken } from "@/lib/jwt";

export const dynamic = "force-dynamic";

// GET — fetch messages in a conversation
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    const userId = payload.id as string;

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversation_id");
    if (!conversationId) return NextResponse.json({ error: "conversation_id is required" }, { status: 400 });

    const supabase = getSupabaseServerClient();

    // Verify user is part of this conversation
    const { data: conv } = await supabase
      .from("conversations")
      .select("user_1_id, user_2_id")
      .eq("id", conversationId)
      .maybeSingle();

    if (!conv || (conv.user_1_id !== userId && conv.user_2_id !== userId)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Fetch messages
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(100);

    if (error) throw error;

    // Mark messages as read
    await supabase
      .from("messages")
      .update({ read: true })
      .eq("conversation_id", conversationId)
      .neq("sender_id", userId)
      .eq("read", false);

    return NextResponse.json({ messages: data ?? [] });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST — send a message
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    const userId = payload.id as string;

    const { conversation_id, content } = await req.json();
    if (!conversation_id) return NextResponse.json({ error: "conversation_id is required" }, { status: 400 });
    if (!content?.trim()) return NextResponse.json({ error: "Content is required" }, { status: 400 });

    const supabase = getSupabaseServerClient();

    // Verify user is part of this conversation
    const { data: conv } = await supabase
      .from("conversations")
      .select("user_1_id, user_2_id")
      .eq("id", conversation_id)
      .maybeSingle();

    if (!conv || (conv.user_1_id !== userId && conv.user_2_id !== userId)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Insert message
    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id,
        sender_id: userId,
        content: content.trim(),
      })
      .select()
      .single();

    if (error) throw error;

    // Update conversation last_message
    await supabase
      .from("conversations")
      .update({ last_message: content.trim(), last_message_at: new Date().toISOString() })
      .eq("id", conversation_id);

    return NextResponse.json({ message: data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PATCH — mark messages as read
export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    const userId = payload.id as string;

    const { conversation_id } = await req.json();
    if (!conversation_id) return NextResponse.json({ error: "conversation_id is required" }, { status: 400 });

    const supabase = getSupabaseServerClient();

    await supabase
      .from("messages")
      .update({ read: true })
      .eq("conversation_id", conversation_id)
      .neq("sender_id", userId)
      .eq("read", false);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
