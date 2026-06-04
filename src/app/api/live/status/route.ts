import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const isVercel = process.env.VERCEL === "1" || process.env.NEXT_PUBLIC_VERCEL_ENV !== undefined;
  
  let activeMilestone = "Optimum Equilibrium";
  let systemStatus = "stable";

  // Only read local files when running on Termux (not Vercel)
  if (!isVercel) {
    try {
      const taskPath = path.join(process.cwd(), "tasks/active.json");
      if (fs.existsSync(taskPath)) {
        const task = JSON.parse(fs.readFileSync(taskPath, "utf8"));
        activeMilestone = task.milestone || activeMilestone;
        systemStatus = task.status || systemStatus;
      }
    } catch {}
  }

  return NextResponse.json({
    project: "LitLabs Hive Mind",
    version: "3.0.0-autonomic",
    status: systemStatus,
    activeMilestone,
    environment: isVercel ? "vercel" : "termux",
    agents: [
      { name: "Brain", status: "online" },
      { name: "Scanner", status: "online" },
      { name: "Monitor", status: "online" },
      { name: "Gig Hunter", status: "online" },
    ],
    timestamp: new Date().toISOString()
  });
}
