import { getSupabaseServerClient } from "./supabaseServer";

export interface Agent {
  id: string;
  name: string;
  role: string; // Aligned with CEO-OS SQL 'role' column
  config: Record<string, unknown>;
  created_at?: string;
}

/**
 * Fetches all agents from the Supabase 'agents' table.
 */
export async function getAgents(): Promise<Agent[]> {
  const supabase = getSupabaseServerClient();
  
  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching agents:", error);
    return [];
  }

  return data || [];
}

/**
 * Creates a new agent in the Supabase 'agents' table.
 */
export async function createAgent(data: Partial<Agent>): Promise<Agent | null> {
  const supabase = getSupabaseServerClient();

  const { data: newAgent, error } = await supabase
    .from("agents")
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error("Error creating agent:", error);
    return null;
  }

  return newAgent;
}

/**
 * Deletes an agent by ID.
 */
export async function deleteAgent(id: string): Promise<boolean> {
  const supabase = getSupabaseServerClient();

  const { error } = await supabase
    .from("agents")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting agent:", error);
    return false;
  }

  return true;
}
