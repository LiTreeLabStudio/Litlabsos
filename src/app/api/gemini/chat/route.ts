import { NextRequest, NextResponse } from "next/server";
import { getModel } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { messages, systemPrompt, stream = false } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }

    const model = getModel("flash", "chat");
    
    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({
      history,
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
    });

    const lastMessage = messages[messages.length - 1].content;
    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${lastMessage}` : lastMessage;

    if (stream) {
      const result = await chat.sendMessageStream(fullPrompt);
      const encoder = new TextEncoder();
      
      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of result.stream) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk.text() })}\n\n`));
            }
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          } catch (e) {
            controller.error(e);
          }
        },
      });

      return new Response(readableStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    const result = await chat.sendMessage(fullPrompt);
    const reply = result.response.text();
    
    return NextResponse.json({ reply, model: "gemini-2.0-flash", source: "gemini" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Gemini chat error:", msg);
    return NextResponse.json(
      { error: `Gemini error: ${msg}`, reply: "⚠️ Neural Link Error. Please try again." },
      { status: 502 }
    );
  }
}
