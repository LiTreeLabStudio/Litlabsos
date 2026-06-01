import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { command } = await req.json();

    if (!command) {
      return NextResponse.json({ error: "Command required" }, { status: 400 });
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 503 });
    }

    // 1. Call Gemini to "Pre-process" the command into a task goal
    // This is the "Bridge" logicLarry provided, implemented in Node for the backend hub.
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { 
          parts: [{ text: "You are the Core Director for LiTTreeLabstudios. Convert user prompts into structured project goals for the Hive Mind. Focus on actionable coding or architecture tasks." }] 
        },
        contents: [{ parts: [{ text: command }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 512 }
      })
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini Hub Error: ${err}`);
    }

    const data = await res.json();
    const taskGoal = data?.candidates?.[0]?.content?.parts?.[0]?.text || command;

    // 2. Write to backlog
    const backlogDir = path.join(process.cwd(), "tasks/backlog");
    if (!fs.existsSync(backlogDir)) {
      fs.mkdirSync(backlogDir, { recursive: true });
    }

    const taskId = `cmd_${Date.now()}`;
    const taskPath = path.join(backlogDir, `${taskId}.json`);
    
    const taskData = {
      milestone: `User Command: ${command.substring(0, 30)}...`,
      goal: taskGoal,
      priority: "high",
      created_at: new Date().toISOString()
    };

    fs.writeFileSync(taskPath, JSON.stringify(taskData, null, 2));

    return NextResponse.json({ 
      success: true, 
      taskId, 
      goal: taskGoal,
      message: "Command processed and added to Hive Mind backlog." 
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Hub Command Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
