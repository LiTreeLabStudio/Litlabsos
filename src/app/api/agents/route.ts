// API Route: List marketplace agents from Supabase + create custom agents
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { withRateLimit } from "@/lib/rate-limiter";

async function getHandler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const includePrivate = searchParams.get("mine") === "true";

    let query = supabase
      .from("agents")
      .select("*")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (includePrivate) {
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const { data: user } = await supabase.from("users").select("id").eq("clerk_id", userId).single();
      if (!user) return NextResponse.json({ agents: [] });
      query = query.or(`is_public.eq.true,and(is_public.eq.false,created_by.eq.${user.id})`);
    } else {
      query = query.eq("is_public", true);
    }

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

async function postHandler(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, slug, description, category, system_prompt, personality, avatar_url } = body;

    if (!name || !slug || !system_prompt) {
      return NextResponse.json({ error: "name, slug, and system_prompt are required" }, { status: 400 });
    }

    const slugClean = String(slug).toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/--+/g, "-").replace(/^-|-$/g, "");
    if (!slugClean) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    const { data: user } = await supabase.from("users").select("id").eq("clerk_id", clerkId).single();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { data: existing } = await supabase.from("agents").select("id").eq("slug", slugClean).single();
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const { data: agent, error } = await supabase
      .from("agents")
      .insert({
        name: String(name).trim(),
        slug: slugClean,
        description: description ? String(description).trim() : null,
        category: category ? String(category).trim() : "general",
        system_prompt: String(system_prompt).trim(),
        personality: personality ? String(personality).trim() : null,
        avatar_url: avatar_url ? String(avatar_url).trim() : "🤖",
        is_public: false,
        is_featured: false,
        created_by: user.id,
        price_cents: 0,
        features: [],
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to create agent" }, { status: 500 });
    }

    return NextResponse.json({ success: true, agent }, { status: 201 });
  } catch (error) {
    console.error("Error creating agent:", error);
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 });
  }
}

export const GET = withRateLimit(getHandler, 100, 60);
export const POST = withRateLimit(postHandler, 20, 60);
