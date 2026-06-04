import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function GET() {
  try {
    const commits = execSync("git log --oneline -10 2>/dev/null").toString().trim().split("\n").filter(Boolean);
    return NextResponse.json(commits);
  } catch {
    return NextResponse.json([]);
  }
}
