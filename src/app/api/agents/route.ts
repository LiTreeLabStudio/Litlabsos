// API Route: List marketplace agents from Supabase
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withRateLimit } from "@/lib/rate-limiter";

async function handler(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    
    let query = supabase
      .from("agents")
      .select("*")
      .eq("is_public", true)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });
    
    if (category) {
      query = query.eq("category", category);
    }
    
    if (featured === "true") {
      query = query.eq("is_featured", true);
    }

    const { data: agents, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch agents from database" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      agents: agents || [],
      total: agents?.length || 0,
      categories: [...new Set(agents?.map(a => a.category) || [])],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}

export const GET = withRateLimit(handler, 100, 60);
