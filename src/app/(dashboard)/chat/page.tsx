"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Message {
  session_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  metadata?: { plan?: string; agent?: string; model?: string };
}

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
}

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSessionId = searchParams.get("id");

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadSessions = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/sessions");
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (err) { console.error("Failed to load sessions:", err); }
  }, []);

  const loadMessages = useCallback(async (sid: string) => {
    try {
      const res = await fetch(`/api/chat/history?sessionId=${sid}`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) { console.error("Failed to load messages:", err); }
  }, []);

  useEffect(() => {
    const init = async () => {
      await loadSessions();
    };
    init();
  }, [loadSessions]);

  useEffect(() => {
    const init = async () => {
      if (currentSessionId) {
        await loadMessages(currentSessionId);
      } else {
        setMessages([]);
      }
    };
    init();
  }, [currentSessionId, loadMessages]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  async function handleNewChat() {
    try {
      const res = await fetch("/api/chat/sessions", { method: "POST" });
      const data = await res.json();
      if (data.session) {
        setSessions(prev => [data.session, ...prev]);
        router.push(`/chat?id=${data.session.id}`);
      }
    } catch (err) { console.error("New chat error:", err); }
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
    setMessages(prev => [...prev, { session_id: sid || "", sender_id: "user", content: text, created_at: new Date().toISOString() }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId: sid }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        session_id: sid || "",
        sender_id: data.agent || "assistant",
        content: data.reply || "No response",
        metadata: { plan: data.plan, agent: data.agent, model: data.model },
        created_at: new Date().toISOString(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        session_id: sid || "",
        sender_id: "system",
        content: "Sorry, something went wrong. Please try again.",
        created_at: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-ide-bg font-sans">
      {/* Sidebar — Sessions */}
      <aside className={`${sidebarOpen ? "w-72" : "w-0"} flex-shrink-0 border-r border-ide-border bg-ide-surface/40 transition-all overflow-hidden`}>
        <div className="p-4">
          <button onClick={handleNewChat} className="btn btn-primary w-full text-[10px] font-bold uppercase tracking-widest h-8">
            + New_Session
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-2 mb-2 font-code">Recent_Logs</div>
          {sessions.map(s => (
            <button
              key={s.id}
              onClick={() => router.push(`/chat?id=${s.id}`)}
              className={`w-full text-left p-3 rounded-sm text-sm mb-1 transition-colors border ${
                currentSessionId === s.id
                  ? "bg-zinc-800 border-zinc-600 text-white"
                  : "text-zinc-400 border-transparent hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="font-bold truncate text-[11px] font-code">{s.title || "Untitled_Session"}</div>
              <div className="text-[9px] text-zinc-600 mt-0.5 font-code tracking-tight">{new Date(s.created_at).toLocaleDateString()}</div>
            </button>
          ))}
          {sessions.length === 0 && (
            <div className="text-[10px] text-zinc-600 text-center py-8 font-code uppercase tracking-widest">No_Active_Sessions</div>
          )}
        </div>
      </aside>

      {/* Main Chat */}
      <main className="flex-1 flex flex-col min-w-0 bg-ide-bg">
        {/* Header */}
        <header className="h-14 border-b border-ide-border bg-ide-surface/80 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-zinc-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <span className="text-xs font-bold text-white uppercase tracking-widest font-code">
              {currentSessionId ? (sessions.find(s => s.id === currentSessionId)?.title || "Chat") : "New_Session"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-none bg-syntax-string" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-code">LNK_ACTIVE</span>
          </div>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          {messages.length === 0 && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-sm bg-ide-surface-2 border border-ide-border flex items-center justify-center text-2xl mb-4 shadow-sm">💬</div>
              <h2 className="text-sm font-bold text-white mb-2 uppercase tracking-widest font-code">Awaiting_Directives</h2>
              <p className="text-[10px] text-zinc-500 max-w-sm uppercase tracking-widest font-code">Input parameters for logic execution.</p>
            </div>
          )}

          {messages.map((m, i) => {
            const isUser = m.sender_id === "user";
            return (
              <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}>
                <div className={`max-w-2xl w-full ${isUser ? "order-2" : ""}`}>
                  <div className={`flex items-center gap-2 mb-2 ${isUser ? "justify-end" : ""}`}>
                    <span className={`text-[9px] font-bold uppercase tracking-widest font-code ${isUser ? "text-syntax-function" : "text-syntax-keyword"}`}>
                      {isUser ? "LOCAL_TERMINAL" : (m.sender_id === "system" ? "SYSTEM_NODE" : "ASSISTANT_NODE")}
                    </span>
                    <span className="text-[8px] text-zinc-600 font-code tracking-tighter">
                      [{m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "NOW"}]
                    </span>
                  </div>
                  <div className={`p-4 rounded-sm border ${
                    isUser
                      ? "bg-zinc-800/40 border-zinc-700 text-white"
                      : "bg-ide-surface border-ide-border text-zinc-200"
                  }`}>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</div>
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="max-w-2xl w-full">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-bold text-syntax-keyword uppercase tracking-widest font-code">ASSISTANT_NODE</span>
                </div>
                <div className="p-4 rounded-sm bg-ide-surface border border-ide-border">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-none bg-syntax-keyword animate-pulse" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-code">Processing_Neural_Intent...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <footer className="p-4 sm:px-8 sm:py-6 border-t border-ide-border bg-ide-surface/30 flex-shrink-0">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-3 relative">
            <div className="absolute -top-6 left-2 px-1 text-[8px] font-bold text-zinc-600 uppercase tracking-widest font-code bg-ide-surface border border-ide-border rounded-sm">COMMAND_IN</div>
            <input
              className="input flex-1 font-code text-sm py-3"
              placeholder="Execute command..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} className="btn btn-primary px-8 text-[10px] font-black uppercase tracking-[0.2em]">
              Send
            </button>
          </form>
        </footer>
      </main>
    </div>
  );
}
