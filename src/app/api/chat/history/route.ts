import { NextRequest, NextResponse } from "next/server";
import { getMessages } from "@/lib/ai/persistence";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }

    const messages = await getMessages(sessionId);

    return NextResponse.json({ messages });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("History Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
