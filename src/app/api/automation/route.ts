import { NextRequest, NextResponse } from "next/server";
import { orchestrator } from "@/lib/agents";

// This secret must be configured in Vercel and sent in the 'Authorization' header by IFTTT
const IFTTT_SECRET = process.env.IFTTT_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  // 1. Security First: Verify the IFTTT Webhook Secret
  const authHeader = req.headers.get("authorization");
  
  if (!IFTTT_SECRET) {
    console.error("[AUTOMATION] IFTTT_WEBHOOK_SECRET is not configured on the server.");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  // Expecting header like: "Bearer <your_secret>"
  const token = authHeader?.split(" ")[1];
  
  if (!token || token !== IFTTT_SECRET) {
    console.warn(`[AUTOMATION] Unauthorized access attempt. IP: ${req.headers.get("x-forwarded-for") || req.ip}`);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, parameters } = body;

    if (!action) {
      return NextResponse.json({ error: "Missing 'action' in payload" }, { status: 400 });
    }

    console.log(`[AUTOMATION] Received authorized IFTTT action: ${action}`);

    switch (action) {
      case "runTask": {
        // Trigger the orchestrator (which routes to Jarvis/NemoClaw via Capability-Based Routing)
        // If 'parameters.message' exists, use it, otherwise use a generic trigger
        const message = parameters?.message || "Execute autonomous background sweep.";
        
        // We simulate a session ID for logging purposes, or use a dedicated system ID
        const taskResult = await orchestrator("ifttt-system-trigger", message);
        return NextResponse.json({ success: true, result: taskResult });
      }
      
      case "deployFrontend": {
        // Trigger Vercel deployment (if you have a Vercel Deploy Hook URL configured)
        const deployHook = process.env.VERCEL_DEPLOY_HOOK_URL;
        if (!deployHook) {
           return NextResponse.json({ error: "VERCEL_DEPLOY_HOOK_URL not configured" }, { status: 500 });
        }
        
        const deployRes = await fetch(deployHook, { method: "POST" });
        if (!deployRes.ok) {
          throw new Error(`Deploy hook failed: ${deployRes.statusText}`);
        }
        
        return NextResponse.json({ success: true, message: "Deployment triggered successfully" });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (error: unknown) {
    console.error("[AUTOMATION_ERROR]", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Internal Server Error" 
    }, { status: 500 });
  }
}
