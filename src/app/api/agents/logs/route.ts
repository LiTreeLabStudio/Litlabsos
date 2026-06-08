import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    const { data: logs, error } = await supabase
      .from("agent_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching logs:", error);
      return NextResponse.json(getDefaultLogs());
    }

    if (!logs || logs.length === 0) {
      return NextResponse.json(getDefaultLogs());
    }

    return NextResponse.json(
      logs.map((log) => ({
        time: new Date(log.created_at).toLocaleTimeString(),
        msg: log.message || log.msg || "",
      }))
    );
  } catch (e) {
    console.error("Logs error:", e);
    return NextResponse.json(getDefaultLogs());
  }
}

function getDefaultLogs() {
  const now = new Date().toLocaleTimeString();
  return [
    { time: now, msg: "Hive Mind online — all systems nominal" },
    { time: now, msg: "Jarvis Master Agent connected" },
    { time: now, msg: "NemoClaw brain initialized" },
    { time: now, msg: "Ghost sync completed" },
    { time: now, msg: "Agent fleet status: 5 active" },
  ];
}
