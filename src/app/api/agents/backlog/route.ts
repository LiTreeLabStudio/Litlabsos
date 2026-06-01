import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const dirPath = path.join(process.cwd(), "tasks/backlog");
  try {
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      return NextResponse.json(files.length);
    }
  } catch (e) {
    console.error("Error reading backlog:", e);
  }
  return NextResponse.json(0);
}
