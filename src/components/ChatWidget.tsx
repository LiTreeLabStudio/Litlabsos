"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Message } from "@/lib/ai/persistence";

interface Agent {
  id: string;
  name: string;
  avatar: string;
  greeting: string;
}

const AGENTS: Agent[] = [
  { id: "champion", name: "LitLabs Agent", avatar: "⚡", greeting: "NEURAL LINK ESTABLISHED. I am the LitLabs Hub Agent. Systems standing by for orchestration." },
  { id: "code-champion", name: "Code Champion", avatar: "👨‍💻", greeting: "COMPILER READY. Code Champion active. Source analysis initialized." },
  { id: "social-dominator", name: "Social Dominator", avatar: "🎭", greeting: "ENGAGEMENT PROTOCOLS LOADED. Social Dominator online. What's the target?" },
  { id: "writing-coach", name: "Writing Coach", avatar: "✍️", greeting: "LINGUISTIC ENGINE ONLINE. Writing Coach ready to refine your data." },
  { id: "data-slayer", name: "Data Slayer", avatar: "📊", greeting: "PATTERN RECOGNITION ACTIVE. Data Slayer standing by for extraction." },
];

const AGENT_KEY = "litlabs_chat_agent_hud";
const SESSION_KEY = "litlabs_chat_session_id";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [activeAgent, setActiveAgent] = useState(0);
  const [latency, setLatency] = useState(42);
  const [linkStability, setLinkStability] = useState(99.8);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Initialize Session and History
  useEffect(() => {
    const initChat = async () => {
      // Load Agent Preference
      const savedAgent = localStorage.getItem(AGENT_KEY);
      if (savedAgent) setActiveAgent(parseInt(savedAgent, 10));

      // Load or Create Session
      let sid = localStorage.getItem(SESSION_KEY);
      if (!sid) {
        // We'll use a fixed 'default' session for the widget or create one on first message
        sid = "hud-default-session"; 
        localStorage.setItem(SESSION_KEY, sid);
      }
      setSessionId(sid);

      // Fetch History
      try {
        const res = await fetch(`/api/chat/history?sessionId=${sid}`);
        const data = await res.json();
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        } else {
          setMessages([{ role: "assistant", content: AGENTS[0].greeting, created_at: new Date().toISOString() }]);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
        setMessages([{ role: "assistant", content: AGENTS[0].greeting, created_at: new Date().toISOString() }]);
      }
    };

    if (open) initChat();
  }, [open]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(30 + Math.floor(Math.random() * 25));
      setLinkStability(98 + Math.random() * 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const switchAgent = useCallback((idx: number) => {
    setActiveAgent(idx);
    localStorage.setItem(AGENT_KEY, String(idx));
    // When switching agents in HUD, we keep the history but the next message uses the new agent
  }, []);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    
    const userMsg: Message = { role: "user", content: text, created_at: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    
    try {
      const startTime = Date.now();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: text, 
          sessionId: sessionId,
          agent: AGENTS[activeAgent].id 
        }),
      });
      const data = await res.json();
      setLatency(Date.now() - startTime);
      
      if (data.error) throw new Error(data.error);
      
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: data.reply, 
        metadata: { plan: data.plan },
        created_at: new Date().toISOString()
      }]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: `CRITICAL ERROR: ${message}. Link degraded.`, 
        created_at: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  }

  const agent = AGENTS[activeAgent];

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-lg bg-black border-2 border-orange-500/50 hud-glow-orange flex items-center justify-center text-2xl transition-all hover:scale-110 active:scale-95 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="relative z-10">{open ? "✖" : agent.avatar}</span>
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[400px] h-[600px] bg-[#050508]/95 border-2 border-orange-500/40 rounded-lg shadow-[0_0_30px_rgba(249,115,22,0.2)] flex flex-col font-mono text-xs overflow-hidden hud-scanlines">
          {/* HUD Header */}
          <div className="p-3 bg-orange-500/10 border-b border-orange-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded border border-orange-500/50 flex items-center justify-center text-lg bg-orange-500/5">
                {agent.avatar}
              </div>
              <div>
                <div className="text-[10px] text-orange-500/70 font-black uppercase tracking-tighter">System Node</div>
                <div className="text-white font-bold">{agent.name}</div>
              </div>
            </div>
            <div className="text-right space-y-0.5">
              <div className="text-[9px] text-orange-500/50 uppercase">Latency: <span className="text-orange-400">{latency}ms</span></div>
              <div className="text-[9px] text-orange-500/50 uppercase">Link: <span className="text-orange-400">{linkStability.toFixed(1)}%</span></div>
            </div>
          </div>

          {/* Telemetry Bar */}
          <div className="px-3 py-1.5 bg-black/40 border-b border-orange-500/10 flex gap-4 overflow-x-auto scrollbar-hide">
            {AGENTS.map((a, i) => (
              <button
                key={a.id}
                onClick={() => switchAgent(i)}
                className={`shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded border transition-all ${i === activeAgent ? "border-orange-500/60 bg-orange-500/10 text-orange-400" : "border-white/5 text-zinc-600 hover:text-zinc-400"}`}
              >
                <span>{a.avatar}</span>
                <span className="text-[9px] font-bold uppercase">{a.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>

          {/* HUD Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('/grid.svg')] bg-center bg-fixed opacity-[0.9]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`max-w-[90%] p-3 rounded border transition-all ${msg.role === "user" ? "bg-blue-500/10 border-blue-500/30 text-blue-100" : "bg-orange-500/5 border-orange-500/20 text-orange-100"}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[8px] font-black uppercase ${msg.role === "user" ? "text-blue-400" : "text-orange-400"}`}>
                      {msg.role === "user" ? "Local Terminal" : agent.name}
                    </span>
                    <span className="text-[8px] text-zinc-600">[{msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : 'NOW'}]</span>
                  </div>
                  <div className="leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                  
                  {!!msg.metadata?.plan && (
                    <details className="mt-2 pt-2 border-t border-orange-500/10">
                      <summary className="text-[8px] font-bold text-orange-500/50 uppercase cursor-pointer hover:text-orange-500 transition-colors">View Director Blueprint</summary>
                      <div className="mt-2 p-2 bg-black/40 rounded text-[9px] text-zinc-400 italic font-mono leading-tight">
                        {String(msg.metadata.plan)}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex flex-col items-start">
                <div className="bg-orange-500/5 border border-orange-500/20 rounded p-3 text-orange-400">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest italic animate-flicker">Processing Neural Intent...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* HUD Input */}
          <div className="p-4 bg-orange-500/5 border-t border-orange-500/30">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="relative"
            >
              <div className="absolute -top-3 left-2 px-1 bg-[#050508] text-[8px] font-black text-orange-500/50 uppercase">Command Input</div>
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-black border border-orange-500/30 rounded px-3 py-2 text-orange-100 outline-none focus:border-orange-500 transition-all placeholder:text-orange-500/20"
                  placeholder="Execute command..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="px-4 py-2 bg-orange-500 text-black font-black uppercase text-[10px] rounded hover:bg-orange-400 disabled:opacity-30 transition-all active:scale-90 shadow-[0_0_10px_rgba(249,115,22,0.4)]"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
          
          {/* Footer Telemetry */}
          <div className="px-3 py-1 bg-orange-500/10 text-[8px] text-orange-500/50 flex justify-between">
            <span>CORE NODE: 127.0.0.1:9876</span>
            <span>HIVE MIND LINK ACTIVE</span>
          </div>
        </div>
      )}
    </>
  );
}
