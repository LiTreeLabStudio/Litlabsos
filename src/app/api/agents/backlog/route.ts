import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    const { count, error } = await supabase
      .from("task_backlog")
      .select("id", { count: "exact", head: true });

    if (error) {
      console.error("Backlog count error:", error);
      return NextResponse.json(0);
    }

    return NextResponse.json(count || 0);
  } catch {
    return NextResponse.json(0);
  }
}
