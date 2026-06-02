"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Message, ChatSession } from "@/lib/ai/persistence";
import { useRouter, useSearchParams } from "next/navigation";

export default function ChatCockpitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSessionId = searchParams.get("id");
  
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [telemetry, setTelemetry] = useState({ latency: 0, stability: 99.9 });
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Stable Loaders
  const loadSessions = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/sessions");
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (err) {
      console.error("Failed to load sessions:", err);
    }
  }, []);

  const loadMessages = useCallback(async (sid: string) => {
    try {
      const res = await fetch(`/api/chat/history?sessionId=${sid}`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    const timer = setTimeout(() => {
      loadSessions();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadSessions]);

  // Load Messages on Session Change
  useEffect(() => {
    if (currentSessionId) {
      const timer = setTimeout(() => {
        loadMessages(currentSessionId);
      }, 0);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setMessages([]);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentSessionId, loadMessages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function handleNewChat() {
    try {
      const res = await fetch("/api/chat/sessions", { method: "POST" });
      const data = await res.json();
      if (data.session) {
        setSessions(prev => [data.session, ...prev]);
        router.push(`/chat?id=${data.session.id}`);
      }
    } catch (err) {
      console.error("New chat error:", err);
    }
  }

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    
    let sid = currentSessionId;
    if (!sid) {
      const res = await fetch("/api/chat/sessions", { 
        method: "POST", 
        body: JSON.stringify({ title: text.substring(0, 30) }) 
      });
      const data = await res.json();
      sid = data.session.id;
      router.push(`/chat?id=${sid}`);
    }

    setInput("");
    const userMsg: Message = { role: "user", content: text, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    const startTime = Date.now();
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId: sid })
      });
      const data = await res.json();
      setTelemetry({ latency: Date.now() - startTime, stability: 99.8 + Math.random() * 0.2 });

      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.reply,
        metadata: { plan: data.plan, agent: data.agent, model: data.model },
        created_at: new Date().toISOString()
      }]);
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen bg-cyber-bg text-white font-mono overflow-hidden">
      {/* SIDEBAR: Session Control */}
      <aside className={`w-80 flex flex-col border-r border-white/5 bg-black/40 transition-all ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-white/5">
          <button 
            onClick={handleNewChat}
            className="w-full py-3 rounded-xl border border-orange-500/30 bg-orange-500/5 text-orange-400 font-black uppercase text-xs tracking-[0.2em] hover:bg-orange-500/10 transition-all flex items-center justify-center gap-2"
          >
            <span>+</span> NEW NEURAL LINK
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
          <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-2 mb-4">Neural Archives</div>
          {sessions.map(s => (
            <button
              key={s.id}
              onClick={() => router.push(`/chat?id=${s.id}`)}
              className={`w-full text-left p-4 rounded-xl transition-all group border ${currentSessionId === s.id ? 'border-orange-500/40 bg-orange-500/5' : 'border-white/5 hover:bg-white/5'}`}
            >
              <div className={`text-xs font-bold truncate ${currentSessionId === s.id ? 'text-white' : 'text-zinc-400'}`}>
                {s.title}
              </div>
              <div className="text-[9px] text-zinc-600 mt-1 flex justify-between items-center">
                <span>{new Date(s.created_at).toLocaleDateString()}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </div>
            </button>
          ))}
        </div>

        <div className="p-6 bg-black/60 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-500">
              ⚡
            </div>
            <div>
              <div className="text-[10px] font-black text-white uppercase">Hive Mind Status</div>
              <div className="text-[9px] text-emerald-500 font-bold uppercase animate-pulse">Optimum Equilibrium</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN COCKPIT */}
      <main className="flex-1 flex flex-col relative hud-scanlines">
        <header className="h-16 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-8 relative z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-zinc-500 hover:text-white transition-colors">
              {sidebarOpen ? '❮' : '❯'}
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Active Node</span>
              <span className="text-xs font-bold text-white uppercase">{currentSessionId ? sessions.find(s => s.id === currentSessionId)?.title : 'Standalone Interface'}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-right">
              <div className="text-[9px] text-zinc-500 uppercase">Latency</div>
              <div className="text-[10px] font-bold text-orange-400">{telemetry.latency}ms</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] text-zinc-500 uppercase">Link Stability</div>
              <div className="text-[10px] font-bold text-blue-400">{telemetry.stability.toFixed(2)}%</div>
            </div>
            <div className="w-px h-8 bg-white/5 mx-2" />
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316] animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase">Neural Link Live</span>
            </div>
          </div>
        </header>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 bg-[url('/grid.svg')] bg-center bg-fixed opacity-[0.9]"
        >
          {messages.length === 0 && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-3xl border-2 border-dashed border-orange-500/20 bg-orange-500/5 flex items-center justify-center text-3xl mb-6 animate-flicker">
                ⚡
              </div>
              <h2 className="text-2xl font-black text-white tracking-tighter mb-2 italic">NEURAL LINK READY</h2>
              <p className="text-zinc-500 text-sm max-w-sm font-medium">The Hive Mind Director is standing by. Initialize commands to begin agent orchestration.</p>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl group relative ${m.role === 'user' ? 'w-full max-w-xl' : 'w-full'}`}>
                <div className={`flex items-center gap-3 mb-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold border transition-all ${m.role === 'user' ? 'bg-blue-600/10 border-blue-500/40 text-blue-400' : 'bg-orange-600/10 border-orange-500/40 text-orange-400'}`}>
                    {m.role === 'user' ? 'LB' : (m.agent_id ? m.agent_id.charAt(0).toUpperCase() : '⚡')}
                  </div>
                  <div>
                    <div className={`text-[10px] font-black uppercase tracking-widest ${m.role === 'user' ? 'text-blue-500 text-right' : 'text-orange-500'}`}>
                      {m.role === 'user' ? 'Lead Architect' : (m.agent_id || 'System Brain')}
                    </div>
                    <div className="text-[9px] text-zinc-600">{m.created_at ? new Date(m.created_at).toLocaleTimeString() : 'REALTIME'}</div>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl border transition-all duration-500 ${m.role === 'user' ? 'bg-blue-500/5 border-blue-500/20 text-blue-50 group-hover:border-blue-500/40' : 'bg-white/[0.02] border-white/5 text-zinc-200 group-hover:border-orange-500/20'}`}>
                  <div className="leading-relaxed whitespace-pre-wrap text-sm">{m.content}</div>
                  
                  {!!m.metadata?.plan && (
                    <div className="mt-6 pt-6 border-t border-white/5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-px flex-1 bg-white/5" />
                        <span className="text-[8px] font-black text-orange-500/50 uppercase tracking-[0.3em]">Director Blueprint</span>
                        <div className="h-px flex-1 bg-white/5" />
                      </div>
                      <div className="bg-black/40 rounded-xl p-4 text-[11px] text-zinc-500 italic font-mono leading-relaxed border border-white/5">
                        {String(m.metadata.plan)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="w-full max-w-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-600/10 border border-orange-500/20 flex items-center justify-center text-sm animate-pulse">⚡</div>
                  <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest animate-pulse">Director Thinking...</div>
                </div>
                <div className="h-24 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-orange-500/5 to-transparent animate-[shimmer_2s_infinite]" />
                  <div className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest animate-flicker">Synthesizing Neural Response</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="p-8 border-t border-white/5 bg-black/40 backdrop-blur-md relative z-20">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto relative group">
            <div className="absolute -top-3 left-6 px-2 bg-cyber-bg text-[10px] font-black text-orange-500 uppercase tracking-widest z-10">Neural Command Input</div>
            
            <div className="flex items-center gap-4 bg-white/[0.03] border border-white/10 rounded-2xl p-2 pl-6 focus-within:border-orange-500/50 focus-within:bg-orange-500/[0.02] transition-all group-hover:border-white/20 shadow-2xl">
              <input
                className="flex-1 bg-transparent py-4 text-white text-sm outline-none placeholder:text-zinc-700"
                placeholder="Initialize command, execute refactor, or query system archives..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-14 h-14 rounded-xl bg-orange-500 text-black flex items-center justify-center hover:bg-orange-400 transition-all active:scale-95 disabled:opacity-30 shadow-[0_0_20px_rgba(249,115,22,0.3)]"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
              </button>
            </div>
            
            <div className="mt-4 flex items-center justify-between px-2">
              <div className="flex gap-6 text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
                <span className="hover:text-orange-500 transition-colors cursor-pointer">Attach Data</span>
                <span className="hover:text-orange-500 transition-colors cursor-pointer">Select Agent</span>
                <span className="hover:text-orange-500 transition-colors cursor-pointer">System Logs</span>
              </div>
              <div className="text-[9px] font-bold text-zinc-700">NODE: 127.0.0.1 // BRIDGE: STABLE</div>
            </div>
          </form>
        </footer>
      </main>
    </div>
  );
}
