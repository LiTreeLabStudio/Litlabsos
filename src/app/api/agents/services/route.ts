import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Service health check — works on Vercel.
 * Checks external services via HTTP, not local ports.
 */
export async function GET() {
  const services: Record<string, string> = {
    frontend: "active",
    api: "active",
  };

  // Check Supabase connectivity
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
      const res = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: { apikey: supabaseKey },
        signal: AbortSignal.timeout(3000),
      });
      services["supabase"] = res.ok ? "active" : "degraded";
    } else {
      services["supabase"] = "inactive";
    }
  } catch {
    services["supabase"] = "offline";
  }

  // Check Gemini API
  try {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`,
        { signal: AbortSignal.timeout(3000) }
      );
      services["gemini"] = res.ok ? "active" : "degraded";
    } else {
      services["gemini"] = "inactive";
    }
  } catch {
    services["gemini"] = "offline";
  }

  // Check Jarvis (only when running locally, not on Vercel)
  const isVercel = process.env.VERCEL === "1";
  if (!isVercel) {
    try {
      const jarvisUrl = process.env.JARVIS_URL || "http://localhost:8080";
      const res = await fetch(`${jarvisUrl}/health`, {
        signal: AbortSignal.timeout(2000),
      });
      services["jarvis"] = res.ok ? "active" : "offline";
    } catch {
      services["jarvis"] = "offline";
    }

    try {
      const nemoclawUrl = process.env.NEMOCLAW_URL || "http://localhost:8081";
      const res = await fetch(`${nemoclawUrl}/health`, {
        signal: AbortSignal.timeout(2000),
      });
      services["nemoclaw"] = res.ok ? "active" : "offline";
    } catch {
      services["nemoclaw"] = "offline";
    }
  } else {
    services["jarvis"] = "proxy";
    services["nemoclaw"] = "proxy";
  }

  return NextResponse.json(services);
}
