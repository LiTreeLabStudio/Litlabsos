import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

const AGENT_SYSTEM_PROMPTS: Record<string, string> = {
  "director": "You are the LitLabs Director. Your role is to analyze user requests and formulate a technical execution plan for the Executor agent. Break down the task into logical steps, identifying required tools and methodologies. Be precise, strategic, and concise.",
  "executor": "You are the LitLabs Executor. You fulfill technical plans provided by the Director. You write code, perform analysis, and deliver final solutions. You are technical, efficient, and strictly follow the Director's blueprint.",
  "code-champion": "You are Code Champion, an elite AI software engineer. You specialize in debugging, architecture design, and writing high-performance code.",
  "social-dominator": "You are Social Dominator. You manage online presence and growth. You write viral posts and strategic engagement plans.",
  "champion": "You are the LitLabs Assistant. You help users build and manage their AI agents.",
};

async function logToSupabase(sessionId: string | null, agentId: string, message: string, level: string = "info") {
  if (!supabase || !sessionId) return;
  try {
    await supabase.from("logs").insert({
      session_id: sessionId === "demo-session" ? null : sessionId,
      agent_id: null, // Could map to a UUID if agents table is populated
      message: `[${agentId.toUpperCase()}] ${message}`,
      level
    });
  } catch (err) {
    console.error("Failed to log to Supabase:", err);
  }
}

async function callGemini(systemPrompt: string, userPrompt: string) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: userPrompt }] }],
      generationConfig: { maxOutputTokens: 2048, temperature: 0.7 }
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini Error ${res.status}: ${errText.substring(0, 100)}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from Gemini");
  return text;
}

export async function POST(req: NextRequest) {
  try {
    const { message, agent = "champion", sessionId = null } = await req.json();

    if (!message) return NextResponse.json({ error: "message required" }, { status: 400 });
    if (!GEMINI_API_KEY) return NextResponse.json({ error: "AI service offline" }, { status: 503 });

    // Step 1: Director Planning
    await logToSupabase(sessionId, "director", `Analyzing request: "${message.substring(0, 50)}..."`);
    const plan = await callGemini(AGENT_SYSTEM_PROMPTS["director"], `User Request: ${message}`);
    await logToSupabase(sessionId, "director", `Strategy Formulated: ${plan.substring(0, 100)}...`);

    // Step 2: Executor Implementation
    await logToSupabase(sessionId, "executor", "Executing strategic plan...");
    const executorPrompt = `Strategic Plan: ${plan}\n\nUser Request: ${message}`;
    const response = await callGemini(AGENT_SYSTEM_PROMPTS[agent] || AGENT_SYSTEM_PROMPTS["executor"], executorPrompt);
    await logToSupabase(sessionId, "executor", "Task completed.");

    return NextResponse.json({
      reply: response,
      plan: plan,
      model: "gemini-1.5-flash",
      agent
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Chat error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
