// API Route: Tavily web search for agents
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

async function handler(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await req.json();
    const { query, maxResults = 5, searchDepth = "basic" } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Missing required field: query (string)" },
        { status: 400 },
      );
    }

    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Tavily API key not configured" },
        { status: 500 },
      );
    }

    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        max_results: Math.min(Math.max(1, maxResults), 10),
        search_depth: searchDepth === "advanced" ? "advanced" : "basic",
        include_raw_content: false,
        include_images: false,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: `Tavily error ${response.status}: ${text.slice(0, 200)}` },
        { status: 502 },
      );
    }

    const data = await response.json();

    interface TavilyResult {
      title: string;
      url: string;
      content: string;
      score: number;
    }

    const results = (data.results || []).map((r: TavilyResult) => ({
      title: r.title,
      url: r.url,
      snippet: r.content,
      score: r.score,
    }));

    return NextResponse.json({
      query,
      results,
      answer: data.answer || null,
    });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

export const POST = handler;
