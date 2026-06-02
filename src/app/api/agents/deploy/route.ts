import { NextRequest, NextResponse } from "next/server";
import { createAgent } from "@/lib/agents";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { agentId, config = {} } = await req.json();

    if (!agentId) return NextResponse.json({ error: "agentId required" }, { status: 400 });

    // In a real marketplace, we'd lookup the agent template here.
    // For now, we'll map the marketplace IDs to fleet definitions.
    const TEMPLATES: Record<string, { name: string; role: string }> = {
      "code-champion": { name: "Code Champion", role: "Expert developer, debugger, architect." },
      "social-dominator": { name: "Social Dominator", role: "Viral growth, engagement, strategy." },
      "data-slayer": { name: "Data Slayer", role: "Data analyst and visualization expert." },
      "writing-coach": { name: "Writing Coach", role: "High-impact linguistic engine." },
      "support-agent": { name: "Support Agent", role: "Customer empathy and resolution engine." },
      "trading-oracle": { name: "Trading Oracle", role: "Market trend and signal analyzer." },
    };

    const template = TEMPLATES[agentId];
    if (!template) return NextResponse.json({ error: "Agent template not found" }, { status: 404 });

    // Deploy to public.agents table
    const agent = await createAgent({
      name: template.name,
      role: template.role,
      config: { ...config, marketplaceId: agentId },
    });

    if (!agent) throw new Error("Failed to deploy agent to fleet.");

    return NextResponse.json({
      success: true,
      message: `Agent ${template.name} deployed to your fleet.`,
      agent
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Deployment Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
