import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const logPath = path.join(process.cwd(), "agents/logs/brain.log");
  try {
    if (fs.existsSync(logPath)) {
      const logs = fs.readFileSync(logPath, "utf8").split("\n").filter(Boolean).slice(-20);
      return NextResponse.json(logs.map(line => {
        // Try to parse "[timestamp] message"
        const match = line.match(/^\[(.*?)\] (.*)$/);
        if (match) {
          return { time: match[1], msg: match[2] };
        }
        return { time: new Date().toLocaleTimeString(), msg: line };
      }));
    }
  } catch (e) {
    console.error("Error reading logs:", e);
  }

  // Fallback to mock logs if file is empty or missing
  const mockLogs = [
    { time: new Date().toLocaleTimeString(), msg: "System initialization complete." },
    { time: new Date().toLocaleTimeString(), msg: "Brain agent connected." },
    { time: new Date().toLocaleTimeString(), msg: "Monitoring active." },
  ];
  
  return NextResponse.json(mockLogs);
}
