import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function GET() {
  const services: Record<string, string> = {};
  const checks = [
    { name: "Frontend", service: "litlabs-frontend" },
    { name: "API Tunnel", service: "litlabs-api-tunnel" },
    { name: "n8n Tunnel", service: "n8n-tunnel" },
    { name: "Agent Monitor", service: "agent-monitor" },
    { name: "Agent Bridge", service: "agent-bridge" },
  ];

  for (const check of checks) {
    try {
      const status = execSync(`systemctl is-active ${check.service} 2>/dev/null`).toString().trim();
      services[check.name] = status === "active" ? "active" : "down";
    } catch {
      services[check.name] = "down";
    }
  }

  return NextResponse.json(services);
}
