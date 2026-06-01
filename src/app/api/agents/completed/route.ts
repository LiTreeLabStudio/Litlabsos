import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const dirPath = path.join(process.cwd(), "tasks/completed");
  try {
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      // For now just return names or basic info
      return NextResponse.json(files.map(f => ({ id: f, title: f.replace(".json", "") })));
    }
  } catch (e) {
    console.error("Error reading completed tasks:", e);
  }
  return NextResponse.json([]);
}
