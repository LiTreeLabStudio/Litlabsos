import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, aspectRatio = "1:1" } = body;

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    if (!prompt || prompt.trim().length < 3) {
      return NextResponse.json({ error: "Prompt too short" }, { status: 400 });
    }

    // Use Gemini Imagen 4 directly
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt: prompt.trim() }],
          parameters: {
            sampleCount: 1,
            aspectRatio,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Imagen API error:", err);
      return NextResponse.json(
        { error: "Image generation failed", detail: err.slice(0, 500) },
        { status: 500 }
      );
    }

    const data = await response.json();
    const predictions = data?.predictions;

    if (!predictions || predictions.length === 0) {
      return NextResponse.json(
        { error: "No image generated" },
        { status: 500 }
      );
    }

    const imgBytes = predictions[0]?.bytesBase64Encoded;
    if (!imgBytes) {
      return NextResponse.json(
        { error: "No image data in response" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      fileUrl: `data:image/png;base64,${imgBytes}`,
      model: "imagen-4.0-generate",
    });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
