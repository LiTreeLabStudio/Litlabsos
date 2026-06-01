import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

async function getAgentStatus(id: string, name: string) {
  const logDir = path.join(process.cwd(), "agents/logs");
  const logFiles = [
    path.join(logDir, `${id}.log`),
    path.join(logDir, `${id}.sh.log`),
    // Some agents might have dated logs, but for simplicity let's check basic ones
  ];

  let lastActive = new Date(0);
  let status = "idle";

  for (const logFile of logFiles) {
    try {
      if (fs.existsSync(logFile)) {
        const stats = fs.statSync(logFile);
        if (stats.mtime > lastActive) {
          lastActive = stats.mtime;
        }
      }
    } catch {}
  }

  // If active in the last 5 minutes, mark as running
  const now = new Date();
  if (lastActive.getTime() > now.getTime() - 5 * 60 * 1000) {
    status = "running";
  }

  return {
    id,
    name,
    status,
    lastActive: lastActive.getTime() > 0 ? lastActive.toISOString() : new Date().toISOString()
  };
}

export async function GET() {
  const agents = await Promise.all([
    getAgentStatus("brain", "System Brain"),
    getAgentStatus("monitor", "Monitor Agent"),
    getAgentStatus("deploy", "Deploy Agent"),
    getAgentStatus("build", "Build Agent"),
    getAgentStatus("bridge", "Bridge Agent"),
  ]);
  
  return NextResponse.json(agents);
}
