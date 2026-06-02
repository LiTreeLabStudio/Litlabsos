import { NextRequest, NextResponse } from "next/server";
import { getAgents, createAgent } from "@/lib/agents";

export async function GET() {
  const agents = await getAgents();
  return NextResponse.json(agents);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, role, skills = [] } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const agent = await createAgent({
      name,
      role: role || "Generalist Executor",
      config: { skills },
    });

    return NextResponse.json(agent);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create agent";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
