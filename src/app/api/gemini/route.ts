import { NextRequest, NextResponse } from "next/server";
import { withRateLimit } from "@/lib/rate-limiter";

export const runtime = "nodejs";
export const maxDuration = 60;

// Simple single-turn wrapper — accepts { message, systemPrompt, agentId }
// Returns { response: string }
async function handler(req: NextRequest) {
  try {
    const { message, systemPrompt, agentId } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const jarvisUrl = process.env.JARVIS_URL || "http://localhost:8080";

    const body = {
      message,
      system_prompt: systemPrompt,
      agent_id: agentId || "champion",
      requirements: { tags: ["ui"] } // Default tag for generic chat requests
    };

    const jarvisRes = await fetch(`${jarvisUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!jarvisRes.ok) {
      const err = await jarvisRes.text();
      console.error("Jarvis API error:", err);
      // Fallback to error message
      return NextResponse.json({ response: "I'm currently unable to connect to the Hive Mind. Please try again later." });
    }

    const data = await jarvisRes.json();
    return NextResponse.json({ response: data.reply || "I'm thinking..." });
  } catch (err) {
    console.error("Jarvis proxy route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const POST = withRateLimit(handler, 30, 60);
