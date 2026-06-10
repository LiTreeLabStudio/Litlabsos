import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function GET() {
  const agents = [];

  // Check systemd services
  const services = [
    { name: "System Brain", service: "agent-monitor" },
    { name: "Monitor Agent", service: "agent-monitor" },
    { name: "Deploy Agent", service: "agent-bridge" },
    { name: "Build Agent", service: "agent-bridge" },
    { name: "n8n Bridge", service: "agent-bridge" },
  ];

  for (const svc of services) {
    try {
      const status = execSync(`systemctl is-active ${svc.service} 2>/dev/null`).toString().trim();
      const uptime = execSync(`systemctl show ${svc.service} --property=ActiveEnterTimestamp --value 2>/dev/null`).toString().trim();
      agents.push({
        name: svc.name,
        status: status === "active" ? "running" : "idle",
        lastAction: status === "active" ? "Monitoring services" : "Waiting",
        uptime: uptime || "unknown",
        color: status === "active" ? "green" : "gray",
      });
    } catch {
      agents.push({ name: svc.name, status: "idle", lastAction: "Not detected", uptime: "N/A", color: "gray" });
    }
  }

  // Check n8n on Windows via gateway
  try {
    const gateway = execSync("ip route | awk '/default/ {print $3}'").toString().trim();
    const n8nStatus = execSync(`curl -s -o /dev/null -w "%{http_code}" --max-time 3 http://${gateway}:5678 2>/dev/null`).toString().trim();
    agents.push({
      name: "n8n (Windows)",
      status: n8nStatus === "200" ? "running" : "idle",
      lastAction: n8nStatus === "200" ? "Workflow engine active" : "Not responding",
      uptime: n8nStatus === "200" ? "Connected" : "Disconnected",
      color: n8nStatus === "200" ? "green" : "yellow",
    });
  } catch {
    agents.push({ name: "n8n (Windows)", status: "idle", lastAction: "Gateway unreachable", uptime: "N/A", color: "gray" });
  }

  // Ollama
  try {
    const ollamaStatus = execSync("curl -s -o /dev/null -w '%{http_code}' --max-time 3 http://localhost:11434/api/tags 2>/dev/null").toString().trim();
    agents.push({
      name: "Ollama",
      status: ollamaStatus === "200" ? "running" : "idle",
      lastAction: ollamaStatus === "200" ? "Models loaded" : "Not responding",
      uptime: ollamaStatus === "200" ? "Ready" : "Offline",
      color: ollamaStatus === "200" ? "green" : "yellow",
    });
  } catch {
    agents.push({ name: "Ollama", status: "idle", lastAction: "Not detected", uptime: "N/A", color: "gray" });
  }

  return NextResponse.json(agents);
}
