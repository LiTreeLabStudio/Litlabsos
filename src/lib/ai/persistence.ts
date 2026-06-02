import { getSupabaseServerClient } from "../supabaseServer";

export type MessageRole = "user" | "assistant" | "system" | "tool";

export interface Message {
  id?: string;
  role: MessageRole;
  content: string;
  agent_id?: string;
  session_id?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export async function createSession(title: string): Promise<ChatSession | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("sessions")
    .insert([{ title }])
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
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching sessions:", error);
    return [];
  }
  return data || [];
}

export async function saveMessage(msg: Message): Promise<Message | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("messages")
    .insert([msg])
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
