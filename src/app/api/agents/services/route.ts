import { NextResponse } from "next/server";
import { execSync } from "child_process";

async function checkPort(port: number, host: string = "localhost"): Promise<boolean> {
  try {
    // Use curl to check if something is listening
    execSync(`curl -s -o /dev/null -w "%{http_code}" --max-time 1 http://${host}:${port}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function checkService(name: string): Promise<string> {
  try {
    const status = execSync(`systemctl is-active ${name}`, { encoding: 'utf8' }).trim();
    return status === "active" ? "active" : "inactive";
  } catch {
    return "unknown";
  }
}

export async function GET() {
  const [ollama, n8n, tunnel, bridge] = await Promise.all([
    checkPort(11434),
    checkPort(5678), // Default n8n port
    checkPort(8080), // Assuming tunnel or similar
    checkPort(9876), // agent-bridge port from previous logs
  ]);

  // Try to get real service status if systemctl is available
  const services = {
    frontend: "active", // The app is responding to this request
    api: "active",
    ollama: ollama ? "active" : await checkService("ollama"),
    n8n: n8n ? "active" : await checkService("n8n"),
    tunnel: tunnel ? "active" : await checkService("litlabs-api-tunnel"),
    bridge: bridge ? "active" : await checkService("agent-bridge"),
  };

  return NextResponse.json(services);
}
