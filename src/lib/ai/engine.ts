const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const JARVIS_URL = process.env.JARVIS_URL || "http://localhost:8080";

export interface AIResponse {
  text: string;
  model: string;
  provider: "gemini" | "openai" | "jarvis";
}

/**
 * Call the unified Jarvis Master Agent
 */
export interface TaskRequirements {
  tags?: string[];
  ram_gb?: number;
}

export async function callJarvis(systemPrompt: string, userPrompt: string, requirements: TaskRequirements = {}): Promise<AIResponse> {
  const res = await fetch(`${JARVIS_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: userPrompt,
      system_prompt: systemPrompt,
      requirements
    })
  });

  if (!res.ok) throw new Error(`Jarvis Error: ${res.status}`);
  const data = await res.json();
  
  return {
    text: data.reply || "",
    model: data.model || "jarvis-hybrid",
    provider: "jarvis"
  };
}

export async function callGemini(systemPrompt: string, userPrompt: string, model = "gemini-1.5-flash"): Promise<AIResponse> {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set");

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: userPrompt }] }],
      generationConfig: { maxOutputTokens: 4096, temperature: 0.7 }
    })
  });

  if (!res.ok) throw new Error(`Gemini Error: ${res.status}`);
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty Gemini response");

  return { text, model, provider: "gemini" };
}

export async function callOpenAI(systemPrompt: string, userPrompt: string, model = "gpt-4o"): Promise<AIResponse> {
  if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not set");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7
    })
  });

  if (!res.ok) throw new Error(`OpenAI Error: ${res.status}`);
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty OpenAI response");

  return { text, model, provider: "openai" };
}

/**
 * Universal Dual-Core Engine with Auto-Fallback
 */
export async function callAI(systemPrompt: string, userPrompt: string, requirements: TaskRequirements = {}): Promise<AIResponse> {
  // 1. Primary Node: Jarvis (Hive Mind Orchestrator)
  try {
    return await callJarvis(systemPrompt, userPrompt, requirements);
  } catch (err) {
    console.warn("Jarvis Node Offline, falling back to direct cloud cores:", err);
  }

  try {
    // Secondary: Gemini Direct
    return await callGemini(systemPrompt, userPrompt, "gemini-2.5-flash");
  } catch (err) {
    console.warn("Gemini Primary Failed, falling back to OpenAI:", err);
    try {
      // Tertiary: OpenAI Direct
      return await callOpenAI(systemPrompt, userPrompt, "gpt-4o");
    } catch (err2) {
      console.error("All AI Cores Offline:", err2);
      throw new Error("Neural Link Failure: All models non-responsive.");
    }
  }
}
