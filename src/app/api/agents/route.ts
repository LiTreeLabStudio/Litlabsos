// API Route: List agents from static list + optional Supabase merge
import { NextRequest, NextResponse } from "next/server";
import { AGENTS as STATIC_AGENTS } from "@/lib/agents";

type AgentItem = {
  id: string;
  slug: string;
  name: string;
  description: string;
  role: string;
  category: string;
  avatar_url: string;
  system_prompt: string;
  status: "offline" | "online" | "busy";
  price_cents: number;
  is_public: boolean;
  is_featured: boolean;
  model: string;
  created_at: string;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roleFilter = searchParams.get("category");
  const coreOnly = searchParams.get("featured") === "true";

  // 1. Static agents always work even when Supabase is unavailable
  let agents: AgentItem[] = Object.values(STATIC_AGENTS).map((a) => ({
    id: a.id,
    slug: a.id,
    name: a.name,
    description: a.personality,
    role: a.role,
    category: a.role.toLowerCase(),
    avatar_url: "",
    system_prompt: a.systemPrompt,
    status: a.status,
    price_cents: 0,
    is_public: true,
    is_featured: true,
    model: "gemini-2.5-flash",
    created_at: new Date().toISOString(),
  }));

  // 2. Optionally merge Supabase agents when configured
  try {
    const { getSupabase } = await import("@/lib/supabase");
    const supabase = getSupabase();
    const { data: dbAgents } = await supabase
      .from("agents")
      .select("*")
      .order("created_at", { ascending: false });

    if (dbAgents && dbAgents.length > 0) {
      const mappedDb: AgentItem[] = dbAgents.map((a) => ({
        id: a.id,
        slug: a.slug,
        name: a.display_name || a.name,
        description: a.description || "",
        role: a.role || "Agent",
        category: (a.role || "general").toLowerCase(),
        avatar_url: a.avatar_url || "",
        system_prompt: a.system_prompt || "",
        status: "online",
        price_cents: a.price_cents || 0,
        is_public: a.is_public !== false,
        is_featured: a.is_core || a.is_featured || false,
        model: a.model || "gemini-2.5-flash",
        created_at: a.created_at || new Date().toISOString(),
      }));
      // Avoid duplicate slugs
      const seen = new Set(agents.map((x) => x.slug));
      agents = [
        ...agents,
        ...mappedDb.filter((x) => x.slug && !seen.has(x.slug)),
      ];
    }
  } catch {
    // Supabase not configured or table unavailable — static agents are sufficient
  }

  // Filters
  if (roleFilter && roleFilter !== "all") {
    agents = agents.filter((a) =>
      a.category.includes(roleFilter.toLowerCase()),
    );
  }
  if (coreOnly) {
    agents = agents.filter((a) => a.is_featured);
  }

  return NextResponse.json({
    agents,
    total: agents.length,
    categories: ["all", ...new Set(agents.map((a) => a.category))],
    timestamp: new Date().toISOString(),
  });
}
