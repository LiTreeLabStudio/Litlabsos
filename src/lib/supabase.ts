// Supabase client setup
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseUrl || supabaseUrl.includes("your-project") || !supabaseKey || supabaseKey.includes("your-anon")) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }
  if (!_supabase) {
    _supabase = createClient(supabaseUrl, supabaseKey);
  }
  return _supabase;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// Types for database tables
export type Agent = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  avatar_url: string;
  system_prompt: string;
  personality: string;
  price_cents: number;
  is_public: boolean;
  features: string[];
  created_at: string;
};

export type UserAgent = {
  id: string;
  user_id: string;
  agent_id: string;
  installed_at: string;
  agent?: Agent;
};

export type Conversation = {
  id: string;
  user_id: string;
  agent_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  agent?: Agent;
};

export type Message = {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
};
