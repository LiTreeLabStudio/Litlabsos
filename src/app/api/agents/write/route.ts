import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { filePath, content } = await req.json();

    if (!filePath || !content) {
      return NextResponse.json({ error: "Missing filePath or content" }, { status: 400 });
    }

    // Security check: only allow writing to src/app or src/components
    if (!filePath.startsWith("src/app/") && !filePath.startsWith("src/components/")) {
      return NextResponse.json({ error: "Unauthorized path. Only src/app/ and src/components/ are allowed." }, { status: 403 });
    }

    const fullPath = path.join(process.cwd(), filePath);
    
    // Ensure directory exists
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, content, "utf8");

    return NextResponse.json({ success: true, message: `Successfully wrote to ${filePath}` });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Write error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
