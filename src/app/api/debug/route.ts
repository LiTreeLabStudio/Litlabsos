import { NextResponse } from "next/server";

export async function GET() {
  const email = process.env.ADMIN_EMAIL || "NOT SET";
  const hash = process.env.ADMIN_PASSWORD_HASH || "NOT SET";
  const name = process.env.ADMIN_NAME || "NOT SET";
  
  return NextResponse.json({
    email_set: email !== "NOT SET",
    hash_set: hash !== "NOT SET",
    name_set: name !== "NOT SET",
    email_value: email === "NOT SET" ? null : email.substring(0, 5) + "...",
    hash_starts_with_bcrypt: hash.startsWith("$2b$"),
    hash_length: hash.length,
    name_value: name === "NOT SET" ? null : name,
  });
}
