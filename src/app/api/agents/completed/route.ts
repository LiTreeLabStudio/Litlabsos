import { NextResponse } from "next/server";
import fs from "fs";

export async function GET() {
  try {
    const dir = "/home/litbit/LiTTreeLabstudios/tasks/completed";
    if (!fs.existsSync(dir)) return NextResponse.json([]);
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
    const tasks = files.map(f => {
      try {
        const data = JSON.parse(fs.readFileSync(`${dir}/${f}`, "utf-8"));
        return data.milestone || f;
      } catch {
        return f;
      }
    });
    return NextResponse.json(tasks.reverse());
  } catch {
    return NextResponse.json([]);
  }
}
