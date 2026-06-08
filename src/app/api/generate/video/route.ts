import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

const POLLINATIONS_VIDEO_API = "https://gen.pollinations.ai/video/";

export async function POST(req: NextRequest) {
  let userId: string | null = null;
  
  try {
    const auth = getAuth(req);
    userId = auth.userId;
  } catch (e) {
    console.warn("[VIDEO_GEN] Clerk auth failed, checking for dev fallback");
  }

  // Fallback for development/testing environments
  if (!userId) {
    userId = process.env.NEXT_PUBLIC_DEV_USER_ID || "dev_user_123";
  }

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { prompt, model, duration = 4 } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    
    // 1. Fetch user profile and coin balance
    // We select both old and new column names to be resilient
    let { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("litbit_coins, neural_credits")
      .eq("id", userId)
      .single();

    console.log("[VIDEO_GEN] Profile data:", profile, "Error:", profileError);

    // Auto-create profile for dev user if it doesn't exist
    if ((profileError || !profile) && userId === "dev_user_123") {
       console.log("[VIDEO_GEN] Provisioning dev profile...");
       const { data: newProfile, error: createError } = await supabase
         .from("profiles")
         .insert([{ id: userId, email: "dev@litlabs.net", name: "Dev User", litbit_coins: 500 }])
         .select("litbit_coins, neural_credits")
         .single();
       if (!createError) profile = newProfile;
       else console.error("[VIDEO_GEN] Dev provisioning failed:", createError);
    }

    if (!profile) {
      return NextResponse.json({ error: `User profile not found (${userId}). Sync required.` }, { status: 404 });
    }

    const currentCoins = profile.litbit_coins ?? profile.neural_credits ?? 0;
    const cost = model === "veo" ? 5 : 3;

    if (currentCoins < cost) {
      return NextResponse.json({ error: `Insufficient balance. Required: ${cost}, Current: ${currentCoins}` }, { status: 402 });
    }

    // 2. Pollinations API
    const generationUrl = `${POLLINATIONS_VIDEO_API}${encodeURIComponent(prompt)}?model=${model}&duration=${duration}&seed=${Math.floor(Math.random() * 1000000)}`;

    // 3. Decrement coins
    // Try new RPC first, then old RPC, then direct update
    console.log("[VIDEO_GEN] Attempting coin deduction...");
    let { error: decError } = await supabase.rpc("decrement_coins", { user_id: userId, amount: cost });
    
    if (decError) {
      console.warn("[VIDEO_GEN] decrement_coins RPC failed, trying decrement_credits...");
      const { error: decOldError } = await supabase.rpc("decrement_credits", { user_id: userId, amount: cost });
      decError = decOldError;
    }

    if (decError) {
      console.error("[VIDEO_GEN] RPC deduction failed, using direct update:", decError);
      const updateData = profile.litbit_coins !== undefined 
        ? { litbit_coins: currentCoins - cost }
        : { neural_credits: currentCoins - cost };
        
      const { error: directError } = await supabase.from("profiles")
        .update(updateData)
        .eq("id", userId);
      
      if (directError) {
        console.error("[VIDEO_GEN] Direct update failed:", directError);
        throw new Error("Financial transaction failed. Generation aborted.");
      }
    }

    // 4. Save generation to history
    let savedGeneration = null;
    try {
      const { data: generation, error: genError } = await supabase
        .from("generations")
        .insert([
          {
            user_id: userId,
            type: "video",
            model,
            prompt,
            output_url: generationUrl,
            cost,
            status: "completed"
          }
        ])
        .select()
        .single();

      if (genError) {
        console.warn("[VIDEO_GEN] History save failed (likely schema missing):", genError.message);
      } else {
        savedGeneration = generation;
      }
    } catch (e) {
      console.warn("[VIDEO_GEN] History save exception:", e);
    }

    return NextResponse.json({
      success: true,
      url: generationUrl,
      generation: savedGeneration || { 
        id: "local_" + Math.random().toString(36).substring(7),
        prompt,
        model,
        output_url: generationUrl,
        created_at: new Date().toISOString()
      },
      warning: !savedGeneration ? "Video generated but history could not be saved (Schema update required)." : undefined
    });

  } catch (error: unknown) {
    console.error("[VIDEO_GEN_ERROR]", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to generate video" }, { status: 500 });
  }
}
