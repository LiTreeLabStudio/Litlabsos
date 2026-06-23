// API Route: Get single agent by slug (Supabase + static fallback)
import { NextRequest, NextResponse } from "next/server";
import { AGENTS as STATIC_AGENTS } from "@/lib/agents";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  // 1. Try Supabase first
  try {
    const { getSupabase } = await import("@/lib/supabase");
    const supabase = getSupabase();
    const { data: agent } = await supabase
      .from("agents")
      .select("*")
      .eq("slug", slug)
      .eq("is_public", true)
      .single();

    if (agent) {
      return NextResponse.json({
        agent: {
          id: agent.id,
          slug: agent.slug,
          name: agent.display_name || agent.name,
          description: agent.description || "",
          category: (agent.role || "general").toLowerCase(),
          avatar_url: agent.avatar_url || "",
          system_prompt: agent.system_prompt || "",
          personality: agent.personality || "",
          price_cents: agent.price_cents || 0,
          features: Array.isArray(agent.features) ? agent.features : [],
          is_public: agent.is_public !== false,
          is_featured: agent.is_core || agent.is_featured || false,
          model: agent.model || "gemini-2.5-flash",
          created_at: agent.created_at || new Date().toISOString(),
        },
      });
    }
  } catch {
    // Supabase unavailable — fall through to static agents
  }

  // 2. Fallback to static agents
  const staticAgent = STATIC_AGENTS[slug];
  if (!staticAgent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  return NextResponse.json({
    agent: {
      id: staticAgent.id,
      slug: staticAgent.id,
      name: staticAgent.name,
      description: staticAgent.personality,
      category: staticAgent.role.toLowerCase(),
      avatar_url: "",
      system_prompt: staticAgent.systemPrompt,
      personality: staticAgent.personality,
      price_cents: 0,
      features: [],
      is_public: true,
      is_featured: true,
      model: "gemini-2.5-flash",
      created_at: new Date().toISOString(),
    },
  });
}
