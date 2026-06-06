"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

interface Conversation {
  id: string;
  other_user: {
    id: string;
    name: string;
    avatar: string;
  };
  last_message: string;
  last_message_at: string | null;
  unread_count: number;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

interface DMInboxProps {
  onClose?: () => void;
}

export default function DMInbox({ onClose }: DMInboxProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvo, setActiveConvo] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConvo);

  // Fetch conversations on mount
  useEffect(() => {
    if (!user) return;
    fetchConversations();
    // Poll for new messages every 10 seconds
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, [user]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (!activeConvo) return;
    fetchMessages(activeConvo);
  }, [activeConvo]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  async function fetchConversations() {
    try {
      const res = await fetch("/api/messages", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations ?? []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  async function fetchMessages(conversationId: string) {
    try {
      const res = await fetch(`/api/messages/${conversationId}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages ?? []);
      }
    } catch {
      // silently fail
    }
  }

  async function sendMessage() {
    if (!input.trim() || !activeConvo || sending) return;
    setSending(true);
    const text = input.trim();
    setInput("");

    // Optimistic add
    const tempMsg: Message = {
      id: `temp-${Date.now()}`,
      conversation_id: activeConvo,
      sender_id: user?.id || "",
      content: text,
      read: false,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      const res = await fetch(`/api/messages/${activeConvo}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ conversation_id: activeConvo, content: text }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev.filter(m => m.id !== tempMsg.id), data.message]);
        // Update conversation list
        fetchConversations();
      }
    } catch {
      // silently fail — message stays as optimistic
    } finally {
      setSending(false);
    }
  }

  function formatTime(dateStr: string | null) {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diff = now.getTime() - d.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (days === 0) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      if (days === 1) return "Yesterday";
      if (days < 7) return d.toLocaleDateString([], { weekday: "short" });
      return d.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] sm:w-[420px] h-[560px] bg-zinc-950 border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-zinc-900/80 border-b border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">💬</span>
          <h3 className="text-sm font-bold text-white">Messages</h3>
          {conversations.reduce((sum, c) => sum + c.unread_count, 0) > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
              {conversations.reduce((sum, c) => sum + c.unread_count, 0)}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors text-sm"
        >
          ✕
        </button>
      </div>

      {!activeConvo ? (
        /* Conversation List */
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-xs text-zinc-500 animate-pulse">Loading conversations...</div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <div className="text-3xl mb-3">💬</div>
              <div className="text-sm font-semibold text-white mb-1">No messages yet</div>
              <div className="text-xs text-zinc-500">
                Start a conversation by messaging someone from their profile.
              </div>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvo(conv.id)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
                >
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                      {conv.other_user.avatar}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white truncate">
                        {conv.other_user.name}
                      </span>
                      <span className="text-[10px] text-zinc-500 shrink-0 ml-2">
                        {formatTime(conv.last_message_at)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className={`text-xs truncate ${conv.unread_count > 0 ? "text-white font-medium" : "text-zinc-500"}`}>
                        {conv.last_message || "No messages yet"}
                      </span>
                      {conv.unread_count > 0 && (
                        <span className="ml-2 shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Active Conversation */
        <>
          {/* Chat Header */}
          <div className="px-4 py-2.5 bg-zinc-900/60 border-b border-white/5 flex items-center gap-3 shrink-0">
            <button
              onClick={() => { setActiveConvo(null); setMessages([]); }}
              className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors text-sm shrink-0"
            >
              ←
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {activeConversation?.other_user.avatar}
            </div>
            <span className="text-sm font-semibold text-white truncate">
              {activeConversation?.other_user.name || "User"}
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-xs text-zinc-500">No messages yet. Say hello!</div>
              </div>
            ) : (
              messages.map(msg => {
                const isMine = msg.sender_id === user?.id;
                return (
                  <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                      isMine
                        ? "bg-blue-600 text-white rounded-br-md"
                        : "bg-zinc-800 text-zinc-200 rounded-bl-md"
                    }`}>
                      <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                      <div className={`text-[9px] mt-1 ${isMine ? "text-blue-200" : "text-zinc-500"}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/5 shrink-0">
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                disabled={sending}
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-full px-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || sending}
                className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors shrink-0"
              >
                {sending ? "..." : "↑"}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
