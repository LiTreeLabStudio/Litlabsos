"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { Send, Sparkles, ChevronRight, Terminal } from "lucide-react";

export default function DemoPage() {
  const { resolvedColors: T } = useTheme();
  const [messages, setMessages] = useState([
    { role: "agent", text: "Neural Link Established. I am a Sandbox Node. Try a command below or type anything." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, agent: "champion", isDemo: true }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "agent", text: data.reply || data.message || "Command executed successfully." }]);
    } catch {
      setMessages(prev => [...prev, { role: "agent", text: "Error: Link Interrupted. This demo has usage limits." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: T.bgColor, minHeight: "100vh", color: T.textColor, fontFamily: "monospace" }}>
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
             <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
             Interactive Sandbox
          </div>
          <h1 className="font-display text-4xl font-black mb-4 uppercase">Try the Hive Mind</h1>
          <p className="text-white/50 text-sm leading-relaxed max-w-2xl">
            Test our core agent orchestration logic in this authenticated sandbox. No account required for trial commands.
          </p>
        </header>

        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col h-[500px] shadow-2xl">
          <div className="bg-white/5 border-b border-white/5 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="flex gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                 <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                 <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
               </div>
               <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">litlabs-node-v3.0.1</span>
            </div>
            <div className="text-[10px] text-cyan-400 font-bold tracking-widest">SYSTEM_READY</div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-2 rounded-lg text-xs leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400' 
                    : 'bg-white/5 border border-white/10 text-white/80'
                }`}>
                  <span className="font-bold mr-2">{m.role === 'user' ? '>' : '#'}</span>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="text-[10px] text-white/30 animate-pulse uppercase tracking-widest">Processing neural sequence...</div>
              </div>
            )}
          </div>

          <div className="p-4 bg-black/40 border-t border-white/5">
            <div className="flex gap-2 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 font-bold">{'>'}</span>
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Enter command (e.g. 'explain architecture' or 'build SaaS plan')"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-12 py-3 text-xs outline-none focus:border-cyan-500/40 transition-colors"
                disabled={isLoading}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all disabled:opacity-20"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-8 items-center">
           <div className="p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/10">
              <h4 className="flex items-center gap-2 font-bold text-sm mb-2">
                <Sparkles size={16} className="text-cyan-400" />
                Want Full Power?
              </h4>
              <p className="text-xs text-white/50 leading-relaxed mb-4">
                Unlock specialized agents, persistent memory, and custom system prompts by creating your free account.
              </p>
              <Link href="/sign-up" className="text-cyan-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                Get Started Free <ChevronRight size={14} />
              </Link>
           </div>
           <div className="text-xs text-white/30 italic">
             Note: This is a restricted sandbox. File operations, persistent database writes, and multi-node routing are disabled for guest trials.
           </div>
        </div>
      </div>
    </div>
  );
}
