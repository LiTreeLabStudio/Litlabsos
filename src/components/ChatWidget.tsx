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
  {
    id: "champion",
    name: "LitLabs Agent",
    avatar: "⚡",
    greeting: "Initialization complete. I am the LitLabs primary daemon. How can I assist your workflow?",
  },
  {
    id: "code-champion",
    name: "Code Champion",
    avatar: "👨‍💻",
    greeting: "Code Champion online. Transmit your technical problem or architecture idea. How can I help you build today?",
  },
  {
    id: "social-dominator",
    name: "Social Dominator",
    avatar: "🎭",
    greeting: "What's the vibe? Give me a topic and I'll craft something worth sharing. Let's make you go viral.",
  },
  {
    id: "writing-coach",
    name: "Writing Coach",
    avatar: "✍️",
    greeting: "Neural link established. Ready to refine your linguistic output. What are we working on?",
  },
  {
    id: "data-slayer",
    name: "Data Slayer",
    avatar: "📊",
    greeting: "Data Slayer initialized. Transmit your dataset or analytical problem. I'll extract the insights you need.",
  },
  {
    id: "support-agent",
    name: "Support Agent",
    avatar: "🎧",
    greeting: "Support Node active. How can I assist you or your users today?",
  },
  {
    id: "trading-bot",
    name: "Trading Oracle",
    avatar: "📈",
    greeting: "Market analysis node online. Transmit the asset or sector you want me to evaluate.",
  },
];

const STORAGE_KEY = "litlabs_chat_messages";
const AGENT_KEY = "litlabs_chat_agent";
const N8N_WEBHOOK = "/api/chat";

function BouncingDots() {
  return (
    <span className="inline-flex gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: "300ms" }} />
    </span>
  );
}

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
    return [{
      role: "assistant",
      content: AGENTS[0].greeting,
      ts: 1735689600000,
    }];
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

  // Save messages
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-50)));
      } catch { /* ignore */ }
    }
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const switchAgent = useCallback((idx: number) => {
    setActiveAgent(idx);
    setShowPicker(false);
    localStorage.setItem(AGENT_KEY, String(idx));
    setMessages([
      { role: "assistant", content: AGENTS[idx].greeting, ts: Date.now() },
    ]);
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
        body: JSON.stringify({
          message: text,
          sessionId: "visitor_" + location.hostname,
          agent: AGENTS[activeAgent].id,
          ts: Date.now(),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const reply =
        data?.reply || data?.response || data?.output || data?.message || JSON.stringify(data);
      if (data?.error) throw new Error(data.detail || data.error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: String(reply), ts: Date.now() },
      ]);
    } catch {
      setError(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Chat temporarily unavailable. The AI service may be rate-limited or offline.",
          ts: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const agent = AGENTS[activeAgent];
  const unreadCount = 0; // Could track unread

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-neon-cyan hover:bg-cyan-300 text-black font-bold shadow-lg shadow-neon-cyan/30 hover:shadow-neon-cyan/50 transition-all flex items-center justify-center text-xl active:scale-95"
        aria-label="Toggle chat"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <span className="text-2xl">{agent.avatar}</span>
        )}
        {unreadCount > 0 && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[70vh] sm:h-[580px] max-h-[calc(100vh-140px)] glass-panel border-white/10 shadow-2xl flex flex-col overflow-hidden animate-slide-up selection:bg-neon-cyan/30">
          {/* Header */}
          <div className="px-5 py-4 bg-black/40 border-b border-white/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(0,242,254,0.1)]">
                  {agent.avatar}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-black animate-pulse" />
              </div>
              <button
                onClick={() => setShowPicker(!showPicker)}
                className="text-left group"
              >
                <div className="text-[10px] font-bold text-neon-cyan tracking-[0.2em] uppercase">Active_Link</div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-text-primary uppercase tracking-tight group-hover:text-neon-cyan transition-colors">{agent.name}</span>
                  <svg className={`w-3 h-3 transition-transform duration-300 ${showPicker ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => switchAgent(activeAgent)}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:text-neon-cyan hover:border-neon-cyan/30 transition-all"
                title="Clear transmission"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <div className="hidden sm:block text-right">
                <div className="text-[8px] font-bold text-text-muted tracking-widest uppercase">ENCRYPTED</div>
                <div className="text-[8px] font-bold text-green-400 tracking-widest uppercase opacity-60">STATUS: OK</div>
              </div>
            </div>
          </div>

          {/* Agent picker dropdown */}
          {showPicker && (
            <div className="border-b border-white/5 bg-black/60 backdrop-blur-xl p-3 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
              {AGENTS.map((a, i) => (
                <button
                  key={a.id}
                  onClick={() => switchAgent(i)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                    i === activeAgent
                      ? "bg-neon-cyan text-cyber-bg shadow-[0_0_15px_rgba(0,242,254,0.3)]"
                      : "bg-white/5 text-text-muted border border-white/5 hover:border-white/20 hover:text-text-secondary"
                  }`}
                >
                  <span className="text-lg">{a.avatar}</span>
                  <span className="truncate">{a.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-500`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap break-words transition-all ${
                    msg.role === "user"
                      ? "bg-neon-cyan text-cyber-bg rounded-br-sm font-bold shadow-[0_0_20px_rgba(0,242,254,0.15)]"
                      : "bg-white/[0.03] text-text-primary border border-white/10 rounded-bl-sm backdrop-blur-sm"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold text-neon-cyan tracking-[0.2em] uppercase">{agent.name}_v3.0</span>
                      <div className="h-px flex-1 bg-neon-cyan/20" />
                    </div>
                  )}
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl rounded-bl-sm p-4 min-w-[140px]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold text-neon-cyan tracking-[0.2em] uppercase">LINK_PENDING</span>
                    <div className="h-px flex-1 bg-neon-cyan/20" />
                  </div>
                  <div className="flex items-center gap-3 text-text-muted">
                    <BouncingDots />
                    <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">Processing...</span>
                  </div>
                </div>
              </div>
            )}
            {error && !loading && (
              <div className="flex justify-center py-2">
                <div className="px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-400 uppercase tracking-widest">
                  ⚠ Neural_Link_Interrupted
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-4 bg-black/40 border-t border-white/5 shrink-0"
          >
            <div className="flex gap-2 items-center bg-black/60 rounded-2xl border border-white/10 p-1.5 focus-within:border-neon-cyan/40 transition-all duration-300 shadow-inner">
              <input
                ref={inputRef}
                className="flex-1 bg-transparent border-none text-sm text-text-primary px-4 py-2.5 outline-none placeholder:text-text-muted font-medium"
                placeholder={`Transmit command to ${agent.name.split(" ")[0]}...`}
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="shrink-0 w-10 h-10 rounded-xl bg-neon-cyan text-cyber-bg flex items-center justify-center hover:bg-cyan-300 disabled:opacity-20 disabled:grayscale transition-all active:scale-90 shadow-[0_0_15px_rgba(0,242,254,0.2)]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
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
