import { NextRequest, NextResponse } from "next/server";

const users: Map<string, { credits: number }> = new Map();

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const body = await req.json();
  const amount = Number(body.amount) || 0;

  if (!users.has(userId)) {
    users.set(userId, { credits: 50 });
  }

  const user = users.get(userId)!;
  user.credits += amount;

  return NextResponse.json({ ok: true, credits: user.credits });
}