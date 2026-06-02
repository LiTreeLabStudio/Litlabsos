import { NextRequest, NextResponse } from "next/server";
import { orchestrate } from "@/lib/ai/orchestrator";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId = null } = await req.json();

    if (!message) return NextResponse.json({ error: "message required" }, { status: 400 });

    const result = await orchestrate(sessionId, message);

    return NextResponse.json(result);

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Hive Mind Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
