import { NextRequest, NextResponse } from "next/server";
import { withRateLimit } from "@/lib/rate-limiter";

export const runtime = "nodejs";
export const maxDuration = 60;

async function handler(req: NextRequest) {
  try {
    const { messages, systemPrompt, stream = true } = await req.json();

    const nemoclawUrl = process.env.NEMOCLAW_URL || "http://localhost:8081";

    // Flatten messages for NemoClaw's simplified interface
    const flattenedMessage = messages
      .map((m: { role: string; content: string }) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    const body = {
      system_prompt: systemPrompt,
      message: flattenedMessage,
      stream,
    };

    const nemoclawRes = await fetch(`${nemoclawUrl}/api/think`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!nemoclawRes.ok) {
      const err = await nemoclawRes.text();
      console.error("NemoClaw API error:", err);
      return NextResponse.json({ error: "Brain connection error", detail: err }, { status: 502 });
    }

    if (!stream) {
      const data = await nemoclawRes.json();
      return NextResponse.json({ text: data.reply || "No response." });
    }

    // Stream response back to client directly from NemoClaw's SSE stream
    return new Response(nemoclawRes.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("NemoClaw chat proxy error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const POST = withRateLimit(handler, 20, 60);
