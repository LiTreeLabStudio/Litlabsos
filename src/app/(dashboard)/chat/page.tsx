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
    <div className="flex h-[calc(100vh-3.5rem)] bg-black text-white font-mono overflow-hidden">
      {/* ========== LEFT PANEL: SESSION ARCHIVES ========== */}
      <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} flex flex-col border-r border-orange-500/10 bg-zinc-950/40 transition-all overflow-hidden relative z-30`}>
        <div className="p-6 border-b border-orange-500/10">
          <button 
            onClick={handleNewChat}
            className="w-full py-3 rounded-none border border-orange-500/40 bg-orange-500/5 text-orange-500 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-orange-500/10 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(249,115,22,0.1)]"
          >
            <span>+</span> Initialize_Neural_Link
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-2 mb-4">Neural_Archives</div>
          {sessions.map(s => (
            <button
              key={s.id}
              onClick={() => router.push(`/chat?id=${s.id}`)}
              className={`w-full text-left p-4 rounded-none transition-all group border ${currentSessionId === s.id ? 'border-orange-500/40 bg-orange-500/10' : 'border-transparent hover:bg-white/5'}`}
            >
              <div className={`text-[11px] font-black uppercase truncate tracking-widest ${currentSessionId === s.id ? 'text-white' : 'text-zinc-500'}`}>
                {s.title || 'Untitled_Stream'}
              </div>
              <div className="text-[8px] text-zinc-700 mt-1 flex justify-between items-center font-bold">
                <span>{new Date(s.created_at).toLocaleDateString()}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-orange-500">LINK_ACTIVE</span>
              </div>
            </button>
          ))}
        </div>

        <div className="p-6 bg-orange-500/5 border-t border-orange-500/10">
          <div className="text-[9px] font-black text-orange-500 uppercase mb-2 animate-pulse">System_Status</div>
          <div className="text-[10px] text-white font-bold tracking-widest">OPTIMUM_EQUILIBRIUM</div>
        </div>
      </aside>

      {/* ========== RIGHT PANEL: TELEMETRY (FIXED) ========== */}
      <aside className="hidden xl:flex w-72 border-r border-orange-500/10 flex-col bg-zinc-950/20 order-last">
        <div className="p-6 border-b border-orange-500/10">
          <div className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-4">Core_Telemetry</div>
          <div className="space-y-4">
            <div>
              <div className="text-[8px] text-zinc-600 uppercase font-bold mb-1 flex justify-between">
                <span>System_Load</span>
                <span className="text-orange-500">{telemetry.cpu}</span>
              </div>
              <div className="h-1 w-full bg-zinc-900 rounded-none overflow-hidden">
                <div className="h-full bg-orange-600 shadow-[0_0_8px_#ea580c]" style={{ width: telemetry.cpu }} />
              </div>
            </div>
            <div>
              <div className="text-[8px] text-zinc-600 uppercase font-bold mb-1 flex justify-between">
                <span>Memory_Buffer</span>
                <span className="text-blue-500">{telemetry.ram}</span>
              </div>
              <div className="h-1 w-full bg-zinc-900 rounded-none overflow-hidden">
                <div className="h-full bg-blue-600 shadow-[0_0_8px_#2563eb]" style={{ width: telemetry.ram }} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-4">Neural_Nodes</div>
          <div className="space-y-3">
            {['code-champion', 'social-dominator', 'writing-coach', 'executor'].map(node => (
              <div key={node} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 group hover:border-orange-500/20 transition-all cursor-pointer">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">{node}</span>
                <span className="w-1.5 h-1.5 rounded-none bg-orange-500 shadow-[0_0_5px_#f97316] animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-zinc-900/40 border-t border-orange-500/10">
          <div className="text-[8px] font-black text-zinc-600 uppercase mb-2">Protocol_Manifest</div>
          <div className="text-[10px] text-zinc-400 font-bold tracking-widest">AES-256_ENCRYPTED</div>
        </div>
      </aside>

      {/* ========== MAIN COCKPIT ========== */}
      <main className="flex-1 flex flex-col relative min-w-0">
        <header className="h-14 border-b border-orange-500/10 bg-black/40 backdrop-blur-md flex items-center justify-between px-6 relative z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-zinc-600 hover:text-white transition-colors">
              {sidebarOpen ? '❮' : '❯'}
            </button>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-orange-500 uppercase tracking-[0.2em]">Active_Stream</span>
              <span className="text-[11px] font-bold text-white uppercase tracking-widest">{currentSessionId ? (sessions.find(s => s.id === currentSessionId)?.title || 'Neural_Transmission') : 'DIRECT_LINK'}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-6 border-r border-white/5 pr-6">
              <div className="text-right">
                <div className="text-[8px] text-zinc-600 uppercase font-bold">Latency</div>
                <div className="text-[10px] font-black text-orange-500 tabular-nums">{telemetry.latency}ms</div>
              </div>
              <div className="text-right">
                <div className="text-[8px] text-zinc-600 uppercase font-bold">Stability</div>
                <div className="text-[10px] font-black text-blue-500 tabular-nums">{telemetry.stability.toFixed(2)}%</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-none bg-orange-500 shadow-[0_0_8px_#f97316] animate-pulse" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest">Link_Live</span>
            </div>
          </div>
        </header>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 relative custom-scrollbar"
        >
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#f97316 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          {messages.length === 0 && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-none border-2 border-dashed border-orange-500/20 bg-orange-500/5 flex items-center justify-center text-3xl mb-6 animate-flicker shadow-[0_0_30px_rgba(249,115,22,0.1)]">
                ⚡
              </div>
              <h2 className="text-2xl font-black text-white tracking-tighter mb-2 italic uppercase">Neural_Link_Ready</h2>
              <p className="text-zinc-600 text-[10px] max-w-sm font-black uppercase tracking-[0.2em]">Standing by for orchestration directives. Initialize connection to begin.</p>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.sender_id === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl group relative ${m.sender_id === 'user' ? 'w-full max-w-xl' : 'w-full'}`}>
                <div className={`flex items-center gap-3 mb-3 ${m.sender_id === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-none flex items-center justify-center text-sm font-bold border transition-all shadow-md ${m.sender_id === 'user' ? 'bg-blue-600/10 border-blue-500/40 text-blue-400 shadow-blue-500/20' : 'bg-orange-600/10 border-orange-500/40 text-orange-400 shadow-orange-500/20'}`}>
                    {m.sender_id === 'user' ? 'CEO' : (m.sender_id ? m.sender_id.charAt(0).toUpperCase() : '⚡')}
                  </div>
                  <div>
                    <div className={`text-[10px] font-black uppercase tracking-widest ${m.sender_id === 'user' ? 'text-blue-500 text-right' : 'text-orange-500'}`}>
                      {m.sender_id === 'user' ? 'Litree-Ceo' : (m.sender_id === 'executor' ? 'System Architect' : m.sender_id || 'System Architect')}
                    </div>
                    <div className="text-[9px] text-zinc-700 font-bold uppercase">{m.created_at ? new Date(m.created_at).toLocaleTimeString() : 'REALTIME'}</div>
                  </div>
                </div>

                <div className={`p-6 rounded-none border leading-relaxed text-[13px] font-medium transition-all duration-500 ${m.sender_id === 'user' ? 'bg-blue-500/5 border-blue-500/20 text-blue-100 shadow-[inset_0_0_30px_rgba(59,130,246,0.05)] hover:border-blue-500/40' : 'bg-orange-500/5 border-orange-500/20 text-orange-50 text-glow-orange shadow-[inset_0_0_30px_rgba(249,115,22,0.05)] hover:border-orange-500/40'}`}>
                  <div className="whitespace-pre-wrap">{m.content}</div>
                  
                  {!!m.metadata?.plan && (
                    <div className="mt-8 pt-8 border-t border-white/5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-px flex-1 bg-white/5" />
                        <span className="text-[8px] font-black text-orange-500/40 uppercase tracking-[0.4em]">Director_Blueprint</span>
                        <div className="h-px flex-1 bg-white/5" />
                      </div>
                      <div className="bg-black/60 p-5 text-[11px] text-zinc-500 italic font-mono leading-relaxed border border-white/5 shadow-inner">
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
                <div className="flex items-center gap-3 mb-4 animate-pulse">
                  <div className="w-8 h-8 rounded-none bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-sm">⚡</div>
                  <div className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Director_Processing...</div>
                </div>
                <div className="h-24 bg-zinc-950/40 border border-white/5 flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-orange-500/5 to-transparent animate-[shimmer_2s_infinite]" />
                  <div className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.5em] animate-flicker">Synthesizing_Neural_Response</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="p-8 border-t border-orange-500/10 bg-zinc-950/60 backdrop-blur-md relative z-20">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto relative group">
            <input
              className="w-full bg-black border-2 border-orange-500/20 rounded-none px-6 py-5 text-white text-sm outline-none placeholder:text-zinc-800 focus:border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.05)] transition-all pr-40"
              placeholder="Inject orchestration directive into the neural stream..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-4">
               <div className="hidden lg:flex flex-col items-end pr-4 border-r border-white/10">
                <span className="text-[8px] font-black text-zinc-700 uppercase">Input_Mode</span>
                <span className="text-[9px] font-bold text-orange-500 uppercase italic">DIRECT_LINK</span>
              </div>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-orange-600 text-black font-black uppercase text-[11px] tracking-widest px-8 py-3 rounded-none hover:bg-orange-500 transition-all active:scale-95 disabled:opacity-30 shadow-[0_0_15px_rgba(249,115,22,0.2)]"
              >
                Execute
              </button>
            </div>
          </form>
          
          <div className="max-w-4xl mx-auto mt-6 flex justify-between items-center opacity-40 px-2">
            <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-widest text-zinc-600">
              <span className="hover:text-orange-500 transition-colors cursor-pointer">Attach_Data</span>
              <span className="hover:text-orange-500 transition-colors cursor-pointer">Select_Agent</span>
              <span className="hover:text-orange-500 transition-colors cursor-pointer flex items-center gap-2">
                <div className="w-1 h-1 bg-orange-500 animate-flicker" />
                System_Logs
              </span>
            </div>
            <div className="text-[9px] font-bold text-zinc-800 tracking-[0.2em]">NODE: 127.0.0.1 // BRIDGE: STABLE</div>
          </div>
        </footer>
      </main>
    </div>
  );
}
