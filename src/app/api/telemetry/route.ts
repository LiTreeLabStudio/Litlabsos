import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

/**
 * GET /api/telemetry
 * Fetches the latest system telemetry for the D3 graph.
 */
export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("telemetry_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) throw error;

    return NextResponse.json({ telemetry: data.reverse() });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/**
 * POST /api/telemetry
 * Records a new telemetry point (CPU, RAM, Interactions).
 */
export async function POST(req: NextRequest) {
  try {
    const { cpu, ram, interactions, level = "info", message = "System Ping" } = await req.json();

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("telemetry_logs")
      .insert([
        {
          level,
          message,
          metadata: { cpu, ram, interactions },
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, point: data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
