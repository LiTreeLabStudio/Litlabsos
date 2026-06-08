import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("completed_tasks")
      .select("*")
      .order("completed_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Completed tasks error:", error);
      return NextResponse.json([]);
    }

    return NextResponse.json(
      (data || []).map((t) => ({
        id: t.id,
        title: t.title || t.mealstone || "Completed task",
      }))
    );
  } catch {
    return NextResponse.json([]);
  }
}
