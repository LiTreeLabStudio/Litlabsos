"use client";
import { useState, useRef, useEffect } from "react";

interface Message { role: "user" | "assistant"; content: string; ts: number; }

const AGENTS = [
  { id: "champion", name: "LitLabs Agent", avatar: "⚡", greeting: "Hey! I'm the LitLabs agent. What do you need help with?" },
  { id: "coder", name: "Code Champion", avatar: "👨‍💻", greeting: "Code Champion here. Hit me with a problem or an idea." },
  { id: "writer", name: "Writing Coach", avatar: "✍️", greeting: "Ready to make your words hit different. What are you working on?" },
];

export default function AgentChatPage() {
  const [messages, setMessages] = useState<Message[]>(() => [
    { role: "assistant", content: AGENTS[0].greeting, ts: 1735689600000 },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeAgent, setActiveAgent] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text, ts: Date.now() }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          agent: AGENTS[activeAgent].id,
          ts: Date.now(),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const reply = data?.reply || data?.response || data?.output || data?.message || JSON.stringify(data);
      setMessages((prev) => [...prev, { role: "assistant", content: String(reply), ts: Date.now() }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Backend unreachable. Make sure n8n is running and the /chat webhook is active.", ts: Date.now() },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const switchAgent = useCallback((idx: number) => {
    const now = Date.now();
    setActiveAgent(idx);
    setMessages([
      { role: "assistant", content: AGENTS[idx].greeting, ts: now },
    ]);
  }, []);

  const agent = AGENTS[activeAgent];

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-160px)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">AI Chat</h1>
          <p className="text-text-secondary text-sm">Talk to any agent below</p>
        </div>
      </div>

      {/* Agent tabs */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {AGENTS.map((a, i) => (
          <button
            key={a.id}
            onClick={() => switchAgent(i)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              i === activeAgent
                ? "bg-neon-cyan text-black shadow-lg shadow-neon-cyan/20"
                : "bg-white/5 border border-white/10 text-text-secondary hover:bg-white/10 hover:text-white"
            }`}
          >
            <span>{a.avatar}</span>
            {a.name}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto space-y-6 mb-6 pr-2">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-neon-cyan text-black"
                : "glass-panel"
            }`}>
              {msg.role === "assistant" && (
                <div className="text-[10px] text-neon-cyan mb-2 font-code tracking-wider uppercase font-bold">
                  {agent.avatar} {agent.name}
                </div>
              )}
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="glass-panel text-sm text-text-secondary">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="glass-panel p-2 flex gap-3 shrink-0 items-center">
        <input
          className="flex-1 bg-transparent border-none text-sm text-text-primary px-4 outline-none placeholder:text-text-muted"
          placeholder={`Message ${agent.name}...`}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          disabled={loading}
        />
        <button className="btn-primary" onClick={handleSend} disabled={loading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}
