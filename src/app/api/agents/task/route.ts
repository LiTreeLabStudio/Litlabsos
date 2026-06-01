import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const taskPath = path.join(process.cwd(), "tasks/active.json");
  try {
    if (fs.existsSync(taskPath)) {
      const data = fs.readFileSync(taskPath, "utf8");
      return NextResponse.json(JSON.parse(data));
    }
  } catch (e) {
    console.error("Error reading active task:", e);
  }
  return NextResponse.json(null);
}
