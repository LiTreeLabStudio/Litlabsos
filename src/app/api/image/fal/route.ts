import { NextRequest, NextResponse } from "next/server";

const FAL_API_KEY = process.env.FAL_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, image_url, strength = 0.5 } = body;

    if (!FAL_API_KEY) {
      return NextResponse.json(
        { error: "FAL_API_KEY not configured. Add it to .env.local" },
        { status: 500 }
      );
    }

    if (!prompt || prompt.trim().length < 3) {
      return NextResponse.json({ error: "Prompt too short" }, { status: 400 });
    }

    const isImg2Img = !!image_url;
    const model = isImg2Img ? "fal-ai/flux/dev/image-to-image" : "fal-ai/flux-pro/v1.1-ultra";
    
    // Construct payload
    const payload: any = {
      prompt: prompt.trim(),
    };

    if (isImg2Img) {
      payload.image_url = image_url;
      payload.strength = strength;
      payload.num_inference_steps = 28;
    } else {
      payload.image_size = "landscape_16_9";
      payload.num_inference_steps = 28;
      payload.guidance_scale = 3.5;
    }

    // Submit generation request
    const submitRes = await fetch(`https://fal.run/${model}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Key ${FAL_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!submitRes.ok) {
      const err = await submitRes.text();
      console.error(`FAL.ai ${isImg2Img ? 'Img2Img' : 'T2I'} error:`, err);
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
      model: model,
    });
  } catch (error) {
    console.error("FAL.ai route error:", error);
    return NextResponse.json({ error: "FAL.ai generation failed" }, { status: 500 });
  }
}
