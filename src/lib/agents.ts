import { supabase } from "./supabaseClient";

export interface Agent {
  id: string;
  name: string;
  description: string;
  personality: string;
  skills: string[];
  created_at?: string;
  owner_id?: string;
  type?: string;
  config?: Record<string, unknown>;
}

/**
 * Fetches all agents from the Supabase 'agents' table.
 */
export async function getAgents(): Promise<Agent[]> {
  if (!supabase) return [];
  
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
  if (!supabase) return null;

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
  if (!supabase) return false;

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
