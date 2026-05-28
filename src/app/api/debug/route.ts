import { NextRequest, NextResponse } from "next/server";

/** Debug endpoint — remove after fixing */
export async function GET() {
  const key = process.env.OPENROUTER_API_KEY;
  return NextResponse.json({
    hasKey: !!key,
    keyPrefix: key ? key.substring(0, 6) + "..." : "EMPTY",
    keyLength: key?.length || 0,
    allEnvKeys: Object.keys(process.env).filter(k => k.includes("OPENROUTER") || k.includes("API")),
  });
}
