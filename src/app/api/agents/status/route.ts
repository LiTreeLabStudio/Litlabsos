import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

interface AgentStatus {
  id: string;
  name: string;
  status: string;
  lastActive: string;
}

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    // Fetch agents from Supabase
    const { data: agents, error } = await supabase
      .from("agents")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching agents:", error);
      return NextResponse.json(getDefaultAgents());
    }

    if (!agents || agents.length === 0) {
      return NextResponse.json(getDefaultAgents());
    }

    // Map to status format
    const statusList: AgentStatus[] = agents.map((agent) => ({
      id: agent.id,
      name: agent.name,
      status: agent.status || "idle",
      lastActive: agent.updated_at || agent.created_at || new Date().toISOString(),
    }));

    return NextResponse.json(statusList);
  } catch (e) {
    console.error("Agent status error:", e);
    return NextResponse.json(getDefaultAgents());
  }
}

function getDefaultAgents(): AgentStatus[] {
  const now = new Date().toISOString();
  return [
    { id: "jarvis", name: "Jarvis Master", status: "online", lastActive: now },
    { id: "nemoclaw", name: "NemoClaw Brain", status: "online", lastActive: now },
    { id: "gig-hunter", name: "Gig Hunter", status: "idle", lastActive: now },
    { id: "money-finder", name: "Money Finder", status: "idle", lastActive: now },
    { id: "health-monitor", name: "Health Monitor", status: "online", lastActive: now },
  ];
}
