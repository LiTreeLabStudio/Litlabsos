"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  const [telemetry, setTelemetry] = useState({ latency: 14, stability: 99.9, cpu: '2.4%', ram: '58%' });
  
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
    (async () => {
      await loadSessions();
    })();
  }, [loadSessions]);

  // Load Messages on Session Change
  useEffect(() => {
    (async () => {
      if (currentSessionId) {
        await loadMessages(currentSessionId);
      } else {
        setMessages([]);
      }
    })();
  }, [currentSessionId, loadMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
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
      const res = await fetch("/api/chat/sessions", { method: "POST" });
      const data = await res.json();
      sid = data.session.id;
      router.push(`/chat?id=${sid}`);
    }

    setInput("");
    const userMsg: Message = { 
      session_id: sid || "",
      sender_id: "user", 
      content: text, 
      created_at: new Date().toISOString() 
    };
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
      setTelemetry(prev => ({ ...prev, latency: Date.now() - startTime, stability: 99.8 + Math.random() * 0.2 }));

      setMessages(prev => [...prev, {
        session_id: sid || "",
        sender_id: data.agent,
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
    <div className="flex h-[calc(100vh-3.5rem)] bg-black text-white font-mono overflow-hidden hud-scanlines">
      {/* ========== LEFT PANEL: SESSION ARCHIVES ========== */}
      <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} flex flex-col border-r border-orange-500/10 bg-zinc-950/40 transition-all overflow-hidden relative z-30`}>
        <div className="p-6 border-b border-orange-500/10">
          <button 
            onClick={handleNewChat}
            className="w-full btn-cyber btn-cyber-primary py-3 tracking-[0.1em]"
          >
            + NEW_NEURAL_LINK
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          <div className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em] px-2 mb-6">Neural_Archives</div>
          {sessions.map(s => (
            <button
              key={s.id}
              onClick={() => router.push(`/chat?id=${s.id}`)}
              className={`w-full text-left p-4 rounded-none transition-all group border ${currentSessionId === s.id ? 'border-orange-500/40 bg-orange-500/10' : 'border-transparent hover:bg-white/5'}`}
            >
              <div className={`text-[11px] font-black uppercase truncate tracking-[0.2em] ${currentSessionId === s.id ? 'text-white glow-text-orange' : 'text-zinc-500'}`}>
                {s.title || 'Untitled_Stream'}
              </div>
              <div className="text-[8px] text-zinc-700 mt-2 flex justify-between items-center font-bold">
                <span>{new Date(s.created_at).toLocaleDateString()}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-orange-500 tracking-widest">UPLINK_READY</span>
              </div>
            </button>
          ))}
        </div>

        <div className="p-6 bg-orange-500/5 border-t border-orange-500/10">
          <div className="text-[9px] font-black text-orange-500 uppercase mb-2 animate-pulse tracking-[0.4em]">Node_Status</div>
          <div className="text-[10px] text-white font-bold tracking-[0.2em]">OPTIMUM_EQUILIBRIUM</div>
        </div>
      </aside>

      {/* ========== RIGHT PANEL: TELEMETRY ========== */}
      <aside className="hidden xl:flex w-72 border-l border-orange-500/10 flex-col bg-zinc-950/20 order-last relative">
        <div className="absolute inset-0 hud-grid opacity-10 pointer-events-none" />
        <div className="p-6 border-b border-orange-500/10 relative z-10">
          <div className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-6">Core_Telemetry</div>
          <div className="space-y-6">
            <div>
              <div className="text-[8px] text-zinc-600 uppercase font-bold mb-2 flex justify-between tracking-widest">
                <span>System_Load</span>
                <span className="text-orange-500">{telemetry.cpu}</span>
              </div>
              <div className="h-1 w-full bg-zinc-900 rounded-none overflow-hidden border border-white/5">
                <div className="h-full bg-orange-600 shadow-[0_0_10px_#ea580c]" style={{ width: telemetry.cpu }} />
              </div>
            </div>
            <div>
              <div className="text-[8px] text-zinc-600 uppercase font-bold mb-2 flex justify-between tracking-widest">
                <span>Memory_Buffer</span>
                <span className="text-blue-500">{telemetry.ram}</span>
              </div>
              <div className="h-1 w-full bg-zinc-900 rounded-none overflow-hidden border border-white/5">
                <div className="h-full bg-blue-600 shadow-[0_0_10px_#2563eb]" style={{ width: telemetry.ram }} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar relative z-10">
          <div className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] mb-6">Neural_Nodes</div>
          <div className="space-y-4 mb-10">
            {['code-champion', 'social-dominator', 'writing-coach', 'executor'].map(node => (
              <div key={node} className="flex items-center justify-between p-3 bg-zinc-900/40 border border-white/5 group hover:border-orange-500/20 transition-all cursor-pointer">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-white transition-colors">{node}</span>
                <span className="w-1.5 h-1.5 rounded-none bg-orange-500 shadow-[0_0_8px_#f97316] animate-pulse" />
              </div>
            ))}
          </div>

          <div className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] mb-6">Live_Neural_Log</div>
          <div className="space-y-3 font-mono text-[8px] leading-tight">
            <div className="text-zinc-600 border-l border-zinc-800 pl-3 py-1">
              <span className="text-orange-900">[18:14:24]</span> DIRECTOR_INIT_OK
            </div>
            <div className="text-zinc-600 border-l border-zinc-800 pl-3 py-1">
              <span className="text-orange-900">[18:14:37]</span> AUTO_FIX_STRATEGY_GEN
            </div>
            <div className="text-zinc-500 border-l border-orange-500/40 pl-3 py-1 bg-orange-500/5">
              <span className="text-orange-500">[18:22:10]</span> GATEWAY_BRIDGE_ALIGNED
            </div>
            <div className="text-zinc-400 border-l border-blue-500 pl-3 py-1 animate-pulse">
              <span className="text-blue-500">[18:25:01]</span> UPLINK_STABLE_V3.5
            </div>
          </div>
        </div>

        <div className="p-6 bg-zinc-950 border-t border-orange-500/10 relative z-10">
          <div className="text-[8px] font-black text-zinc-700 uppercase mb-2 tracking-widest">Protocol_Manifest</div>
          <div className="text-[10px] text-zinc-500 font-bold tracking-[0.2em]">AES-256_STABLE</div>
        </div>
      </aside>

      {/* ========== MAIN COCKPIT ========== */}
      <main className="flex-1 flex flex-col relative min-w-0">
        <header className="h-14 border-b border-orange-500/10 bg-black/60 backdrop-blur-xl flex items-center justify-between px-6 relative z-20">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-zinc-600 hover:text-white transition-colors text-xs">
              {sidebarOpen ? '❮' : '❯'}
            </button>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-orange-500 uppercase tracking-[0.3em]">Neural_Stream</span>
              <span className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">{currentSessionId ? (sessions.find(s => s.id === currentSessionId)?.title || 'NODE_ACTIVE') : 'STANDALONE_UPLINK'}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden sm:flex items-center gap-8 border-r border-white/5 pr-8">
              <div className="text-right">
                <div className="text-[8px] text-zinc-700 uppercase font-black tracking-widest">Latency</div>
                <div className="text-[10px] font-black text-orange-500 tabular-nums">{telemetry.latency}ms</div>
              </div>
              <div className="text-right">
                <div className="text-[8px] text-zinc-700 uppercase font-black tracking-widest">Stability</div>
                <div className="text-[10px] font-black text-blue-500 tabular-nums">{telemetry.stability.toFixed(2)}%</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-none bg-orange-500 shadow-[0_0_10px_#f97316] animate-pulse" />
              <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">LINK_LIVE</span>
            </div>
          </div>
        </header>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 relative custom-scrollbar bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.02)_0%,transparent_70%)]"
        >
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 hud-grid opacity-[0.05] pointer-events-none" />

          {messages.length === 0 && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center pb-20">
              <div className="w-24 h-24 rounded-none border-2 border-dashed border-orange-500/20 bg-orange-500/5 flex items-center justify-center text-4xl mb-8 animate-flicker shadow-[0_0_40px_rgba(249,115,22,0.1)]">
                ⚡
              </div>
              <h2 className="text-3xl font-black text-white tracking-[0.2em] mb-4 italic uppercase glow-text-orange">Neural_Link_Ready</h2>
              <p className="text-zinc-700 text-[10px] max-w-sm font-black uppercase tracking-[0.4em] leading-loose">Awaiting director level orchestration directives. Initialize neural bridge to commence operation.</p>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.sender_id === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl group relative ${m.sender_id === 'user' ? 'w-full max-w-xl' : 'w-full'}`}>
                <div className={`flex items-center gap-4 mb-4 ${m.sender_id === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-none flex items-center justify-center text-base font-black border transition-all duration-500 shadow-2xl ${m.sender_id === 'user' ? 'bg-blue-600/10 border-blue-500/40 text-blue-400' : 'bg-orange-600/10 border-orange-500/40 text-orange-400'}`}>
                    {m.sender_id === 'user' ? 'CEO' : (m.sender_id ? m.sender_id.charAt(0).toUpperCase() : '⚡')}
                  </div>
                  <div>
                    <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${m.sender_id === 'user' ? 'text-blue-500 text-right' : 'text-orange-500 glow-text-orange'}`}>
                      {m.sender_id === 'user' ? 'Litree-Ceo' : (m.sender_id === 'executor' ? 'System Architect' : m.sender_id || 'System Architect')}
                    </div>
                    <div className="text-[8px] text-zinc-800 font-black uppercase mt-0.5 tracking-widest">[{m.created_at ? new Date(m.created_at).toLocaleTimeString() : 'REALTIME'}]</div>
                  </div>
                </div>

                <div className={`p-8 rounded-none border leading-relaxed text-[13px] font-medium transition-all duration-700 relative overflow-hidden ${m.sender_id === 'user' ? 'bg-blue-500/[0.02] border-blue-500/20 text-blue-100 hover:border-blue-500/40 shadow-[inset_0_0_40px_rgba(59,130,246,0.03)]' : 'bg-orange-500/[0.02] border-orange-500/20 text-orange-50 hover:border-orange-500/40 shadow-[inset_0_0_40px_rgba(249,115,22,0.03)]'}`}>
                  <div className="absolute top-0 left-0 w-1 h-full bg-current opacity-10" />
                  <div className="whitespace-pre-wrap font-mono">{m.content}</div>
                  
                  {!!m.metadata?.plan && (
                    <div className="mt-10 pt-10 border-t border-white/5">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-px flex-1 bg-white/5" />
                        <span className="text-[9px] font-black text-orange-500/30 uppercase tracking-[0.5em]">Director_Blueprint</span>
                        <div className="h-px flex-1 bg-white/5" />
                      </div>
                      <div className="bg-black/60 p-6 text-[11px] text-zinc-600 italic font-mono leading-loose border border-white/5 shadow-inner tracking-tight">
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
                <div className="flex items-center gap-4 mb-6 animate-pulse">
                  <div className="w-10 h-10 rounded-none bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(249,115,22,0.2)]">⚡</div>
                  <div className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em]">Director_Analyzing...</div>
                </div>
                <div className="h-28 bg-zinc-950/60 border border-white/5 flex flex-col items-center justify-center overflow-hidden relative shadow-2xl">
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-orange-500/[0.03] to-transparent animate-[shimmer_1.5s_infinite]" />
                  <div className="text-[10px] font-black text-zinc-800 uppercase tracking-[0.6em] animate-flicker">Synthesizing_Neural_Response</div>
                  <div className="mt-4 w-48 h-0.5 bg-zinc-900 rounded-none overflow-hidden">
                    <div className="h-full bg-orange-600 animate-[shimmer_2s_infinite] w-full shadow-[0_0_10px_#f97316]" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="p-10 border-t border-orange-500/10 bg-zinc-950/80 backdrop-blur-xl relative z-20">
          <form onSubmit={handleSend} className="max-w-5xl mx-auto relative group">
             <div className="absolute -top-3 left-8 px-3 bg-black text-[9px] font-black text-orange-500 uppercase tracking-[0.4em] z-10 border border-orange-500/20 shadow-lg">Input_Node</div>
            
            <input
              className="w-full bg-black border-2 border-orange-500/10 rounded-none px-8 py-6 text-white text-sm outline-none placeholder:text-zinc-900 focus:border-orange-500/40 shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all pr-48 font-mono tracking-tight"
              placeholder="Inject_Orchestration_Directive..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-6">
               <div className="hidden lg:flex flex-col items-end pr-6 border-r border-white/10">
                <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest">Protocol</span>
                <span className="text-[9px] font-bold text-orange-500 uppercase italic tracking-tighter">DIRECT_LINK_V3.5</span>
              </div>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="btn-cyber btn-cyber-primary py-3.5 px-10 tracking-[0.2em] shadow-2xl active:scale-95 disabled:opacity-30"
              >
                EXECUTE
              </button>
            </div>
          </form>
          
          <div className="max-w-5xl mx-auto mt-8 flex justify-between items-center opacity-40 px-4">
            <div className="flex items-center gap-10 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700">
              <span className="hover:text-orange-500 transition-colors cursor-pointer">Attach_Data</span>
              <span className="hover:text-orange-500 transition-colors cursor-pointer">Select_Agent</span>
              <span className="hover:text-orange-500 transition-colors cursor-pointer flex items-center gap-3">
                <div className="w-1 h-1 bg-orange-500 animate-flicker" />
                System_Logs
              </span>
            </div>
            <div className="text-[9px] font-black text-zinc-800 tracking-[0.4em] italic uppercase">Bridge: Stable // Buffer: 0%</div>
          </div>
        </footer>
      </main>
    </div>
  );
}
