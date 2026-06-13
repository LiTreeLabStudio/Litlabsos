import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, aspectRatio = "1:1" } = body;
    void aspectRatio; // reserved for future use

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY not configured" },
        { status: 500 }
      );
    }

    if (!prompt || prompt.trim().length < 3) {
      return NextResponse.json(
        { error: "Prompt too short" },
        { status: 400 }
      );
    }

    // Use Gemini 2.5 Flash Image via OpenRouter
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://litlabs.net",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          messages: [
            {
              role: "user",
              content: prompt.trim(),
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenRouter image error:", err);
      return NextResponse.json(
        { error: "Image generation failed", detail: err.slice(0, 500) },
        { status: 500 }
      );
    }

    const data = await response.json();
    const choice = data?.choices?.[0];
    
    // Handle both text+image and image-only responses
    const content = choice?.message?.content;
    const images = choice?.message?.images;

    if (images && images.length > 0) {
      // Direct image URL from model
      return NextResponse.json({
        success: true,
        fileUrl: images[0].url || images[0],
        model: "gemini-2.5-flash-image",
      });
    }

    if (typeof content === "string" && content.startsWith("data:image")) {
      return NextResponse.json({
        success: true,
        fileUrl: content,
        model: "gemini-2.5-flash-image",
      });
    }

    if (typeof content === "string" && content.startsWith("http")) {
      return NextResponse.json({
        success: true,
        fileUrl: content,
        model: "gemini-2.5-flash-image",
      });
    }

    // If the response is text describing an image, return it
    return NextResponse.json({
      success: false,
      error: "Model returned text instead of image. Try a more specific image prompt.",
      detail: typeof content === "string" ? content.slice(0, 200) : "No image in response",
    });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
