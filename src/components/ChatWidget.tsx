"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  ts: number;
}

interface Agent {
  id: string;
  name: string;
  avatar: string;
  greeting: string;
}

const AGENTS: Agent[] = [
  { id: "champion", name: "LitLabs Agent", avatar: "⚡", greeting: "Hey! I'm the LitLabs agent. I can help you build, chat, and explore AI. What do you need?" },
  { id: "code-champion", name: "Code Champion", avatar: "👨‍💻", greeting: "Code Champion here. Send me your coding problem or project idea. How can I help you build today?" },
  { id: "social-dominator", name: "Social Dominator", avatar: "🎭", greeting: "What's the vibe? Give me a topic and I'll craft something worth sharing." },
  { id: "writing-coach", name: "Writing Coach", avatar: "✍️", greeting: "Ready to refine your writing. What are we working on?" },
  { id: "data-slayer", name: "Data Slayer", avatar: "📊", greeting: "Send me your dataset or analytical question. I'll extract the insights you need." },
  { id: "support-agent", name: "Support Agent", avatar: "🎧", greeting: "Support Agent here. How can I help you or your users today?" },
  { id: "trading-bot", name: "Trading Oracle", avatar: "📈", greeting: "Market analysis ready. What asset or sector do you want me to evaluate?" },
];

const STORAGE_KEY = "litlabs_chat_messages";
const AGENT_KEY = "litlabs_chat_agent";
const N8N_WEBHOOK = "/api/chat";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch { /* ignore */ }
    return [{ role: "assistant", content: AGENTS[0].greeting, ts: Date.now() }];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [activeAgent, setActiveAgent] = useState(() => {
    if (typeof window === "undefined") return 0;
    try {
      const savedAgent = localStorage.getItem(AGENT_KEY);
      if (savedAgent) {
        const idx = parseInt(savedAgent, 10);
        if (idx >= 0 && idx < AGENTS.length) return idx;
      }
    } catch { /* ignore */ }
    return 0;
  });
  const [showPicker, setShowPicker] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-50))); } catch { /* ignore */ }
    }
  }, [messages]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  const switchAgent = useCallback((idx: number) => {
    setActiveAgent(idx);
    setShowPicker(false);
    localStorage.setItem(AGENT_KEY, String(idx));
    setMessages([{ role: "assistant", content: AGENTS[idx].greeting, ts: Date.now() }]);
  }, []);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setError(false);
    setMessages((prev) => [...prev, { role: "user", content: text, ts: Date.now() }]);
    setLoading(true);
    try {
      const res = await fetch(N8N_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId: "visitor_" + location.hostname, agent: AGENTS[activeAgent].id, ts: Date.now() }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const reply = data?.reply || data?.response || data?.output || data?.message || JSON.stringify(data);
      if (data?.error) throw new Error(data.detail || data.error);
      setMessages((prev) => [...prev, { role: "assistant", content: String(reply), ts: Date.now() }]);
    } catch {
      setError(true);
      setMessages((prev) => [...prev, { role: "assistant", content: "Chat temporarily unavailable. The AI service may be rate-limited or offline.", ts: Date.now() }]);
    } finally {
      setLoading(false);
    }
  }

  const agent = AGENTS[activeAgent];

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all flex items-center justify-center text-xl active:scale-95"
        aria-label="Toggle chat"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <span className="text-2xl">{agent.avatar}</span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[70vh] sm:h-[580px] max-h-[calc(100vh-140px)] rounded-2xl border border-white/10 bg-[#0d0d14] shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-black/40 border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-lg">
                  {agent.avatar}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-black" />
              </div>
              <button onClick={() => setShowPicker(!showPicker)} className="text-left group">
                <div className="text-xs font-medium text-blue-400">Active</div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">{agent.name}</span>
                </div>
              </button>
            </div>
            <button
              onClick={() => switchAgent(activeAgent)}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
              title="Clear chat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Agent picker */}
          {showPicker && (
            <div className="border-b border-white/10 bg-black/60 p-3 grid grid-cols-2 gap-2">
              {AGENTS.map((a, i) => (
                <button
                  key={a.id}
                  onClick={() => switchAgent(i)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${i === activeAgent ? "bg-blue-600 text-white" : "bg-white/5 text-zinc-400 border border-white/5 hover:border-white/20 hover:text-white"}`}
                >
                  <span className="text-base">{a.avatar}</span>
                  <span className="truncate">{a.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words ${msg.role === "user" ? "bg-blue-600 text-white rounded-br-sm" : "bg-white/5 text-zinc-200 border border-white/10 rounded-bl-sm"}`}>
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold text-blue-400">{agent.name}</span>
                    </div>
                  )}
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    <span className="text-xs text-zinc-500 ml-1">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            {error && !loading && (
              <div className="flex justify-center py-2">
                <div className="px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-medium text-red-400">
                  ⚠ Connection error
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 bg-black/40 border-t border-white/10 shrink-0"
          >
            <div className="flex gap-2 items-center bg-white/5 rounded-xl border border-white/10 p-1.5 focus-within:border-blue-500/40 transition-colors">
              <input
                ref={inputRef}
                className="flex-1 bg-transparent border-none text-sm text-white px-3 py-2 outline-none placeholder:text-zinc-600"
                placeholder={`Message ${agent.name.split(" ")[0]}...`}
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="shrink-0 w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 disabled:opacity-30 transition-colors active:scale-90"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
