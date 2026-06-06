"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Message } from "@/lib/ai/persistence";
import { useAuth } from "@/context/AuthContext";

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
  const { user } = useAuth();
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
      const savedAgent = localStorage.getItem(AGENT_KEY);
      if (savedAgent) setActiveAgent(parseInt(savedAgent, 10));

      let sid = localStorage.getItem(SESSION_KEY);
      if (!sid) {
        sid = "hud-default-session"; 
        localStorage.setItem(SESSION_KEY, sid);
      }
      setSessionId(sid);

      try {
        const res = await fetch(`/api/chat/history?sessionId=${sid}`);
        const data = await res.json();
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        } else {
          setMessages([{ 
            session_id: sid,
            sender_id: AGENTS[0].id, 
            content: AGENTS[0].greeting, 
            created_at: new Date().toISOString() 
          }]);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
        setMessages([{ 
          session_id: sid,
          sender_id: AGENTS[0].id, 
          content: AGENTS[0].greeting, 
          created_at: new Date().toISOString() 
        }]);
      }
    };

    if (open && user?.isAdmin) initChat();
  }, [open, user?.isAdmin]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(30 + Math.floor(Math.random() * 25));
      setLinkStability(98 + Math.random() * 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (open && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages, loading, open]);

  const switchAgent = useCallback((idx: number) => {
    setActiveAgent(idx);
    localStorage.setItem(AGENT_KEY, String(idx));
  }, []);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    
    const userMsg: Message = { 
      session_id: sessionId || "",
      sender_id: "user", 
      content: text, 
      created_at: new Date().toISOString() 
    };
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
        session_id: sessionId || "",
        sender_id: data.agent, 
        content: data.reply, 
        metadata: { plan: data.plan },
        created_at: new Date().toISOString()
      }]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setMessages((prev) => [...prev, { 
        session_id: sessionId || "",
        sender_id: "system",
        content: `CRITICAL ERROR: ${message}. Link degraded.`, 
        created_at: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  }

  const agent = AGENTS[activeAgent];

  if (!user?.isAdmin) return null;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-sm bg-ide-surface border border-ide-border flex items-center justify-center text-xl transition-all hover:bg-ide-surface-2 active:scale-95 group overflow-hidden"
      >
        <span className="relative z-10">{open ? "×" : agent.avatar}</span>
      </button>

      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-[380px] h-[580px] bg-ide-bg border border-ide-border rounded-sm shadow-2xl flex flex-col font-sans text-xs overflow-hidden">
          {/* Header */}
          <div className="p-3 bg-ide-surface border-b border-ide-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm border border-ide-border flex items-center justify-center text-lg bg-black/20">
                {agent.avatar}
              </div>
              <div>
                <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Neural_Node</div>
                <div className="text-white font-bold">{agent.name}</div>
              </div>
            </div>
            <div className="text-right font-code space-y-0.5">
              <div className="text-[9px] text-zinc-600 uppercase">LAT: <span className="text-syntax-string">{latency}ms</span></div>
              <div className="text-[9px] text-zinc-600 uppercase">LNK: <span className="text-syntax-function">{linkStability.toFixed(1)}%</span></div>
            </div>
          </div>

          {/* Telemetry Bar */}
          <div className="px-3 py-1.5 bg-black/20 border-b border-ide-border flex gap-4 overflow-x-auto scrollbar-hide">
            {AGENTS.map((a, i) => (
              <button
                key={a.id}
                onClick={() => switchAgent(i)}
                className={`shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded-sm border transition-all ${i === activeAgent ? "border-zinc-500 bg-zinc-800 text-white" : "border-transparent text-zinc-600 hover:text-zinc-400"}`}
              >
                <span>{a.avatar}</span>
                <span className="text-[9px] font-bold uppercase">{a.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-ide-bg">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.sender_id === "user" ? "items-end" : "items-start"}`}>
                <div className={`max-w-[90%] p-3 rounded-sm border transition-all ${msg.sender_id === "user" ? "bg-zinc-800/50 border-zinc-700 text-white" : "bg-ide-surface border-ide-border text-zinc-200"}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[8px] font-bold uppercase tracking-widest ${msg.sender_id === "user" ? "text-syntax-function" : "text-syntax-keyword"}`}>
                      {msg.sender_id === "user" ? "Local_Terminal" : (msg.sender_id || agent.name)}
                    </span>
                    <span className="text-[8px] text-zinc-600 font-code">[{msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : 'NOW'}]</span>
                  </div>
                  <div className="leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                  
                  {!!msg.metadata?.plan && (
                    <details className="mt-2 pt-2 border-t border-ide-border">
                      <summary className="text-[8px] font-bold text-zinc-500 uppercase cursor-pointer hover:text-white transition-colors tracking-widest">View_Blueprint</summary>
                      <div className="mt-2 p-2 bg-black/40 rounded-sm text-[9px] text-syntax-comment italic font-code leading-tight border border-ide-border">
                        {String(msg.metadata.plan)}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex flex-col items-start">
                <div className="bg-ide-surface border border-ide-border rounded-sm p-3 text-zinc-500">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-syntax-string" />
                    <span className="text-[9px] font-bold uppercase tracking-widest font-code">Processing_Neural_Intent...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-ide-surface border-t border-ide-border">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="relative"
            >
              <div className="absolute -top-3 left-2 px-1 bg-ide-surface text-[8px] font-bold text-zinc-600 uppercase tracking-tighter">Command_In</div>
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-black/40 border border-ide-border rounded-sm px-3 py-1.5 text-zinc-200 outline-none focus:border-zinc-500 transition-all placeholder:text-zinc-700 font-code text-xs"
                  placeholder="Execute..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="btn btn-primary px-4 py-1.5 h-7 text-[9px] font-black uppercase tracking-widest"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
          
          {/* Footer */}
          <div className="px-3 py-1 bg-ide-surface border-t border-ide-border text-[7px] text-zinc-700 flex justify-between font-code uppercase">
            <span>NODE_ADDR: 127.0.0.1:9876</span>
            <span>Link_Secure_Active</span>
          </div>
        </div>
      )}
    </>
  );
}
