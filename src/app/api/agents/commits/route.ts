import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function GET() {
  try {
    const logs = execSync('git log --oneline -5').toString().split('\n').filter(Boolean);
    return NextResponse.json(logs.map(l => ({ hash: l.split(' ')[0], message: l.split(' ').slice(1).join(' ') })));
  } catch {
    return NextResponse.json([]);
  }
}
