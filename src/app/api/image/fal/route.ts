import { NextRequest, NextResponse } from "next/server";

const FAL_API_KEY = process.env.FAL_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!FAL_API_KEY) {
      return NextResponse.json(
        { error: "FAL_API_KEY not configured. Add it to .env.local" },
        { status: 500 }
      );
    }

    if (!prompt || prompt.trim().length < 3) {
      return NextResponse.json({ error: "Prompt too short" }, { status: 400 });
    }

    // Submit generation request
    const submitRes = await fetch("https://fal.run/fal-ai/flux-pro/v1.1-ultra", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Key ${FAL_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: prompt.trim(),
        image_size: "landscape_16_9",
        num_inference_steps: 28,
        guidance_scale: 3.5,
      }),
    });

    if (!submitRes.ok) {
      const err = await submitRes.text();
      return NextResponse.json({ error: `FAL.ai error: ${err.slice(0, 200)}` }, { status: 500 });
    }

    const result = await submitRes.json();
    const imageUrl = result?.images?.[0]?.url;

    if (!imageUrl) {
      return NextResponse.json({ error: "No image in FAL.ai response" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      fileUrl: imageUrl,
      model: "fal-flux-ultra",
    });
  } catch (error) {
    console.error("FAL.ai error:", error);
    return NextResponse.json({ error: "FAL.ai generation failed" }, { status: 500 });
  }
}
