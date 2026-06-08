import { NextResponse } from "next/server";
import fs from "fs";

export async function GET() {
  try {
    const dir = "/data/data/com.termux/files/home/LiTTreeLabstudios/tasks/backlog";
    if (!fs.existsSync(dir)) return NextResponse.json(0);
    const count = fs.readdirSync(dir).filter(f => f.endsWith(".json")).length;
    return NextResponse.json(count);
  } catch {
    return NextResponse.json(0);
  }
}
