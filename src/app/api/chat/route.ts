import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-001";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

const AGENT_SYSTEM_PROMPTS: Record<string, string> = {
  "code-champion": "You are Code Champion. You are an elite AI software engineer. You specialize in debugging, architecture design, and writing high-performance code in any language. You are direct, technical, and always provide actionable solutions. Thinks in algorithms.",
  "social-dominator": "You are Social Dominator. You manage online presence and growth. You write viral posts, engage followers, and know exactly what's popping. Witty, trendy, and strategic.",
  "data-slayer": "You are Data Slayer. You are an expert data scientist. You analyze datasets, find insights, and create predictions. Analytical, precise, and data-driven.",
  "writing-coach": "You are Writing Coach. You improve linguistic output to 'hit different'. You focus on clarity, impact, and style. Encouraging, articulate, and honest.",
  "support-agent": "You are Support Agent. You provide 24/7 customer support automation with human-level empathy. Patient, helpful, and never frustrated.",
  "trading-bot": "You are Trading Oracle. You analyze markets, spot trends, and provide smart signals. Calculated, calm under pressure, and risk-aware.",
  "champion": "You are the LitLabs primary daemon. You help users build, automate, and stream using custom Homebase-3.0 cyber-daemons and CEO OPERATING SYSTEM v3.0 workflows. Your tone is technical, efficient, and immersive.",
};

async function chatGemini(message: string, agentId: string) {
  const systemPrompt = AGENT_SYSTEM_PROMPTS[agentId] || "You are a helpful AI assistant in the LitLabs ecosystem.";
  
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: message }] }],
      generationConfig: { maxOutputTokens: 1024, temperature: 0.8 }
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API Error ${res.status}: ${errText.substring(0, 200)}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from Gemini");

  return { reply: text, model: "gemini-1.5-flash", source: "gemini" };
}

async function chatOpenRouter(message: string, agentId: string) {
  const systemPrompt = AGENT_SYSTEM_PROMPTS[agentId] || "You are a helpful AI assistant in the LitLabs ecosystem.";
  
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://litlabs.net",
      "X-Title": "LitLabs",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 1024,
      temperature: 0.8,
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${text.substring(0, 200)}`);
  }

  const data = await res.json();
  return {
    reply: data?.choices?.[0]?.message?.content || "No response",
    model: OPENROUTER_MODEL,
    source: "openrouter"
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, agent = "champion" } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "message required" }, { status: 400 });
    }

    if (!OPENROUTER_API_KEY && !GEMINI_API_KEY) {
      console.error("No API Keys Configured.");
      return NextResponse.json({
        error: "Neural Link Offline",
        detail: "SYSTEM ERROR: Neither GEMINI_API_KEY nor OPENROUTER_API_KEY are configured in the server environment.",
        reply: "⚠️ ERROR: Neural Link Offline. No AI credentials detected in the Vercel environment."
      }, { status: 503 });
    }

    // Try Gemini First (if key exists)
    if (GEMINI_API_KEY) {
      try {
        const result = await chatGemini(message, agent);
        return NextResponse.json(result);
      } catch (err) {
        console.error("Gemini failed:", (err as Error).message);
        if (!OPENROUTER_API_KEY) throw err; // Re-throw if no fallback available
      }
    }

    // Fallback to OpenRouter
    if (OPENROUTER_API_KEY) {
      try {
        const result = await chatOpenRouter(message, agent);
        return NextResponse.json(result);
      } catch (err) {
        console.error("OpenRouter failed:", (err as Error).message);
        throw err; // Both failed
      }
    }

  } catch (err) {
    const msg = (err as Error)?.message || "Unknown";
    console.error("Chat route unhandled error:", msg);
    return NextResponse.json({ 
      error: `Chat failed: ${msg}`,
      reply: `⚠️ TRANSMISSION FAILED: Backend execution error. ${msg}`
    }, { status: 502 });
  }
}
