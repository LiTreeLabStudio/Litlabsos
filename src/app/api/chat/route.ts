import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/chat — proxy chat messages to the n8n webhook on the PC.
 *
 * n8n webhook URL is set via N8N_WEBHOOK_URL env var.
 * Falls back to api.litlabs.net/chat via cloudflared tunnel.
 */

const N8N_WEBHOOK =
  process.env.N8N_WEBHOOK_URL || "https://api.litlabs.net/chat";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, sessionId } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "message required" },
        { status: 400 }
      );
    }

    const upstream = await fetch(N8N_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        sessionId: sessionId || "web_visitor",
        ts: Date.now(),
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${upstream.status}` },
        { status: 502 }
      );
    }

    const data = await upstream.json();
    return NextResponse.json(data);
  } catch (err) {
    const msg = (err as Error)?.message || "Unknown error";
    return NextResponse.json(
      { error: `Chat proxy failed: ${msg}` },
      { status: 502 }
    );
  }
}
