import { NextRequest, NextResponse } from "next/server";
import { createSession, getSessions } from "@/lib/ai/persistence";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sessions = await getSessions();
    return NextResponse.json({ sessions });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Sessions GET Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const title = body.title || `New Neural Link ${new Date().toLocaleTimeString()}`;
    
    const session = await createSession(title);
    
    if (!session) throw new Error("Failed to create session in Supabase.");

    return NextResponse.json({ session });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Sessions POST Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
