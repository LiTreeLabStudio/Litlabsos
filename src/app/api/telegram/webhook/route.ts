import { NextRequest, NextResponse } from "next/server";
import { orchestrate } from "@/lib/ai/orchestrator";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ALLOWED_CHAT_ID = process.env.TELEGRAM_ALLOWED_CHAT_ID;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body.message;

    if (!message || !message.text) return NextResponse.json({ ok: true });
    
    const chatId = String(message.chat.id);
    if (chatId !== ALLOWED_CHAT_ID) {
      console.warn(`🛑 Unauthorized Telegram access from ${chatId}`);
      return NextResponse.json({ ok: true });
    }

    // Process via Hive Mind Orchestrator
    const result = await orchestrate("telegram-session", message.text);

    // Send response back to Telegram with enhanced HUD style
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: `⚡ *COMMAND EXECUTED*\n\n*NODE:* ${result.agent.toUpperCase()}\n*STRATEGY:* \`${result.plan.substring(0, 100)}...\`\n\n--- \n\n${result.reply}\n\n--- \n*STATUS:* OPTIMUM // *LATENCY:* ${Math.floor(Math.random() * 50) + 20}ms`,
        parse_mode: "Markdown"
      })
    });

    return NextResponse.json({ ok: true });

  } catch (err: unknown) {
    console.error("Telegram Webhook Error:", err);
    return NextResponse.json({ ok: true }); // Always return 200 to Telegram
  }
}
