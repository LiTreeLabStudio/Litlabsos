import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET() {
  const isVercel = process.env.VERCEL === "1";
  let activeMilestone = "System Equilibrium";
  let systemStatus = "stable";
  let agentCount = 5;

  try {
    const supabase = getSupabaseServerClient();

    // Get active task
    const { data: task } = await supabase
      .from("active_tasks")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (task) {
      activeMilestone = task.milestone || activeMilestone;
      systemStatus = task.status || systemStatus;
    }

    // Count agents
    const { count } = await supabase
      .from("agents")
      .select("id", { count: "exact", head: true });

    agentCount = count || agentCount;
  } catch (e) {
    console.error("Live status error:", e);
  }

  return NextResponse.json({
    project: "LitLabs Hive Mind",
    version: "3.0.0",
    status: systemStatus,
    activeMilestone,
    environment: isVercel ? "vercel" : "termux",
    agents: [
      { name: "Jarvis", status: "online" },
      { name: "NemoClaw", status: "online" },
      { name: "Gig Hunter", status: "idle" },
      { name: "Money Finder", status: "idle" },
      { name: "Health Monitor", status: "online" },
    ],
    agentCount,
    timestamp: new Date().toISOString(),
  });
}
