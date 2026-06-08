import { NextResponse } from "next/server";
import fs from "fs";

export async function GET() {
  try {
    const data = fs.readFileSync("/data/data/com.termux/files/home/LiTTreeLabstudios/tasks/active.json", "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json(null);
  }
}
