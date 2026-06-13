import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY not configured" },
        { status: 500 }
      );
    }

    if (!prompt || prompt.trim().length < 3) {
      return NextResponse.json({ error: "Prompt too short" }, { status: 400 });
    }

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
    const message = choice?.message;

    if (!message) {
      return NextResponse.json(
        { error: "No response from model" },
        { status: 500 }
      );
    }

    // Handle content as array (multimodal response)
    const content = message.content;
    if (Array.isArray(content)) {
      for (const item of content) {
        if (item.type === "image_url" && item.image_url?.url) {
          return NextResponse.json({
            success: true,
            fileUrl: item.image_url.url,
            model: "gemini-2.5-flash-image",
          });
        }
        if (item.type === "text" && item.text?.startsWith("data:image")) {
          return NextResponse.json({
            success: true,
            fileUrl: item.text,
            model: "gemini-2.5-flash-image",
          });
        }
      }
    }

    // Handle content as string
    if (typeof content === "string") {
      if (content.startsWith("data:image") || content.startsWith("http")) {
        return NextResponse.json({
          success: true,
          fileUrl: content,
          model: "gemini-2.5-flash-image",
        });
      }
      // Text response — model didn't generate an image
      return NextResponse.json({
        success: false,
        error: "Model returned text instead of image. Try a more specific image prompt.",
        detail: content.slice(0, 200),
      });
    }

    // Handle images array (some models use this format)
    const images = message.images;
    if (images && images.length > 0) {
      const url = typeof images[0] === "string" ? images[0] : images[0]?.url;
      if (url) {
        return NextResponse.json({
          success: true,
          fileUrl: url,
          model: "gemini-2.5-flash-image",
        });
      }
    }

    return NextResponse.json({
      success: false,
      error: "No image in response",
      detail: JSON.stringify(message).slice(0, 300),
    });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
