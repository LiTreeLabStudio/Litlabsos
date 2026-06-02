import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// Helper to check if a port is responding
async function checkPort(port: number, host: string = "localhost"): Promise<boolean> {
  try {
    execSync(`curl -s -o /dev/null -w "%{http_code}" --max-time 0.5 http://${host}:${port}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  const taskPath = path.join(process.cwd(), "tasks/active.json");
  // const logDir = path.join(process.cwd(), "agents/logs");
  
  let activeMilestone = "Optimum Equilibrium";
  let systemStatus = "stable";

  try {
    if (fs.existsSync(taskPath)) {
      const task = JSON.parse(fs.readFileSync(taskPath, "utf8"));
      activeMilestone = task.milestone;
      systemStatus = task.status;
    }
  } catch {}

  // Check critical service heartbeats
  const [ollama, bridge] = await Promise.all([
    checkPort(11434),
    checkPort(9876),
  ]);

  // Aggregate health status
  const agents = [
    { name: "Brain", status: "online" },
    { name: "Ollama", status: ollama ? "online" : "offline" },
    { name: "Bridge", status: bridge ? "online" : "offline" },
  ];

  return NextResponse.json({
    project: "LitLabs Hive Mind",
    version: "3.0.0-autonomic",
    status: systemStatus,
    activeMilestone,
    agents,
    timestamp: new Date().toISOString()
  });
}
