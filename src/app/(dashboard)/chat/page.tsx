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
        sender_id: "assistant",
        content: "Sorry, something went wrong. Please try again.",
        created_at: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-[#050505]">
      {/* Sidebar — Sessions */}
      <aside className={`${sidebarOpen ? "w-72" : "w-0"} flex-shrink-0 border-r border-[#1a1a1a] bg-[#0a0a0a] transition-all overflow-hidden`}>
        <div className="p-4">
          <button onClick={handleNewChat} className="btn btn-primary w-full text-sm">
            + New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <div className="text-xs font-medium text-[#555] uppercase tracking-wider px-2 mb-2">Recent</div>
          {sessions.map(s => (
            <button
              key={s.id}
              onClick={() => router.push(`/chat?id=${s.id}`)}
              className={`w-full text-left p-3 rounded-lg text-sm mb-1 transition-colors ${
                currentSessionId === s.id
                  ? "bg-[#f97316]/10 text-[#f97316]"
                  : "text-[#a1a1aa] hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="font-medium truncate">{s.title || "Untitled"}</div>
              <div className="text-xs text-[#555] mt-0.5">{new Date(s.created_at).toLocaleDateString()}</div>
            </button>
          ))}
          {sessions.length === 0 && (
            <div className="text-sm text-[#555] text-center py-8">No chats yet</div>
          )}
        </div>
      </aside>

      {/* Main Chat */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-[#1a1a1a] flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-[#71717a] hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <span className="text-sm font-medium text-white">
              {currentSessionId ? (sessions.find(s => s.id === currentSessionId)?.title || "Chat") : "New Chat"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="status-dot online" />
            <span className="text-xs text-[#71717a]">Online</span>
          </div>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.length === 0 && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#f97316]/10 flex items-center justify-center text-3xl mb-4">💬</div>
              <h2 className="text-xl font-bold text-white mb-2">Start a conversation</h2>
              <p className="text-sm text-[#71717a] max-w-sm">Ask me anything — I can help with coding, writing, analysis, and more.</p>
            </div>
          )}

          {messages.map((m, i) => {
            const isUser = m.sender_id === "user";
            return (
              <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}>
                <div className={`max-w-2xl ${isUser ? "order-2" : ""}`}>
                  <div className={`flex items-center gap-2 mb-2 ${isUser ? "justify-end" : ""}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isUser ? "bg-blue-500/20 text-blue-400" : "bg-[#f97316]/20 text-[#f97316]"
                    }`}>
                      {isUser ? "U" : "A"}
                    </div>
                    <span className={`text-xs font-medium ${isUser ? "text-blue-400" : "text-[#f97316]"}`}>
                      {isUser ? "You" : "Assistant"}
                    </span>
                    <span className="text-xs text-[#555]">
                      {m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                    </span>
                  </div>
                  <div className={`p-4 rounded-xl ${
                    isUser
                      ? "bg-[#f97316] text-black"
                      : "bg-[#111] text-[#e5e5e5] border border-[#1a1a1a]"
                  }`}>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</div>
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-[#f97316]/20 flex items-center justify-center text-xs font-bold text-[#f97316]">A</div>
                  <span className="text-xs font-medium text-[#f97316]">Assistant</span>
                </div>
                <div className="p-4 rounded-xl bg-[#111] border border-[#1a1a1a]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse-dot" />
                    <div className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse-dot" style={{ animationDelay: "0.2s" }} />
                    <div className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse-dot" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <footer className="p-4 border-t border-[#1a1a1a] flex-shrink-0">
          <form onSubmit={handleSend} className="max-w-3xl mx-auto flex gap-3">
            <input
              className="input flex-1"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} className="btn btn-primary px-5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </form>
        </footer>
      </main>
    </div>
  );
}
