import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    const { data: task } = await supabase
      .from("active_tasks")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (task) {
      return NextResponse.json({
        milestone: task.milestone || task.title || "No active milestone",
        director_instructions: task.description || task.goal || "System running normally",
        status: task.status || "in_progress",
      });
    }

    return NextResponse.json({
      milestone: "System Equilibrium",
      director_instructions: "All agents operational. Awaiting directives.",
      status: "stable",
    });
  } catch {
    return NextResponse.json({
      milestone: "System Equilibrium",
      director_instructions: "All agents operational. Awaiting directives.",
      status: "stable",
    });
  }
}
