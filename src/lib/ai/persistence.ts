import { getSupabaseServerClient } from "../supabaseServer";

export interface Message {
  id?: string;
  session_id: string;
  sender_id: string; // 'user', 'director', or agent-id
  content: string;
  created_at?: string;
  // Frontend-only helpers for UI rendering
  metadata?: {
    plan?: string;
    agent?: string;
    model?: string;
  };
}

export interface ChatSession {
  id: string;
  user_id: string;
  created_at: string;
  status: string;
  title?: string;
}

export async function createSession(): Promise<ChatSession | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("sessions")
    .insert([{ status: "active" }])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating session:", error);
    return null;
  }
  return data;
}

export async function getSessions(): Promise<ChatSession[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching sessions:", error);
    return [];
  }
  return data || [];
}

export async function saveMessage(msg: Message): Promise<Message | null> {
  const supabase = getSupabaseServerClient();
  // We only persist fields that exist in the DB schema
  const { data, error } = await supabase
    .from("messages")
    .insert([{
      session_id: msg.session_id,
      sender_id: msg.sender_id,
      content: msg.content
    }])
    .select()
    .single();

  if (error) {
    console.error("Error saving message:", error);
    return null;
  }
  return data;
}

export async function getMessages(sessionId: string): Promise<Message[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
  return data || [];
}

export async function logTelemetry(sessionId: string | null, agentId: string | null, level: string, message: string, payload: Record<string, unknown> = {}) {
  const supabase = getSupabaseServerClient();
  try {
    await supabase.from("logs").insert({
      session_id: sessionId,
      agent_id: agentId,
      level,
      message,
      payload
    });
  } catch (err) {
    console.error("Telemetry failure:", err);
  }
}
