"use client";

import React, { useState, useEffect } from "react";
import { 
  Activity, 
  Terminal, 
  Zap, 
  ShieldCheck, 
  Database,
  ArrowUpRight
} from "lucide-react";

export default function DashboardPage() {
  const [logs, setLogs] = useState<{ id: string; text: string; time: string; type: "info" | "warn" | "error" }[]>([]);

  // Simulation for live terminal
  useEffect(() => {
    const messages = [
      "Initializing HIVE_CORE v2.5...",
      "Connecting to PC Director node...",
      "Syncing neural weights for Agent 'Director'...",
      "Checking Ghost Autonomic Sync status...",
      "Memory optimized: 72% free",
      "Tailscale mesh active: monolith connected",
      "Heartbeat received from Termux node",
    ];

    const interval = setInterval(() => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      setLogs(prev => [
        { 
          id: Math.random().toString(36), 
          text: msg, 
          time: new Date().toLocaleTimeString([], { hour12: false }),
          type: Math.random() > 0.9 ? "warn" : "info"
        },
        ...prev.slice(0, 19)
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="volcanic-glass p-4 rounded-lg border border-volcanic-border volcanic-glow transition-all hover:border-volcanic-accent group">
          <div className="flex justify-between items-start mb-2">
            <Activity className="text-volcanic-accent" size={20} />
            <span className="text-[10px] font-mono text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">ACTIVE</span>
          </div>
          <div className="text-2xl font-black text-volcanic-text font-mono">98.4%</div>
          <div className="text-[10px] font-mono text-volcanic-text/40 uppercase tracking-tighter">Neural Link Stability</div>
        </div>

        <div className="volcanic-glass p-4 rounded-lg border border-volcanic-border transition-all hover:border-volcanic-accent group">
          <div className="flex justify-between items-start mb-2">
            <Database className="text-volcanic-red" size={20} />
            <span className="text-[10px] font-mono text-volcanic-text/40">v2.0.1</span>
          </div>
          <div className="text-2xl font-black text-volcanic-text font-mono">1.2 TB</div>
          <div className="text-[10px] font-mono text-volcanic-text/40 uppercase tracking-tighter">Knowledge Base Capacity</div>
        </div>

        <div className="volcanic-glass p-4 rounded-lg border border-volcanic-border transition-all hover:border-volcanic-accent group">
          <div className="flex justify-between items-start mb-2">
            <Zap className="text-yellow-500" size={20} />
            <ArrowUpRight className="text-volcanic-text/20 group-hover:text-volcanic-accent transition-colors" size={16} />
          </div>
          <div className="text-2xl font-black text-volcanic-text font-mono">42ms</div>
          <div className="text-[10px] font-mono text-volcanic-text/40 uppercase tracking-tighter">Response Latency (OWL)</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Terminal */}
        <div className="volcanic-glass rounded-lg border border-volcanic-border flex flex-col h-[400px]">
          <div className="px-4 py-2 border-b border-volcanic-border flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-volcanic-accent" />
              <span className="text-[11px] font-mono font-bold text-volcanic-text uppercase tracking-wider">Neural_Console</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-volcanic-border" />
              <div className="w-2 h-2 rounded-full bg-volcanic-border" />
              <div className="w-2 h-2 rounded-full bg-volcanic-accent" />
            </div>
          </div>
          <div className="flex-1 p-4 font-mono text-[12px] overflow-y-auto custom-scrollbar space-y-1 bg-black/20">
            {logs.length === 0 && (
              <div className="text-volcanic-text/20 animate-pulse">Establishing connection to hive...</div>
            )}
            {logs.map(log => (
              <div key={log.id} className="flex gap-3">
                <span className="text-volcanic-text/30 shrink-0">[{log.time}]</span>
                <span className={log.type === "warn" ? "text-yellow-500" : "text-volcanic-text/80"}>
                  {log.type === "warn" ? "!" : ">"} {log.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Agents / Status */}
        <div className="space-y-4">
          <h2 className="text-[12px] font-mono font-bold text-volcanic-accent uppercase tracking-[0.2em] flex items-center gap-2">
            <ShieldCheck size={16} />
            Active Personas
          </h2>
          
          <div className="space-y-2">
            {[
              { name: "Director", status: "Orchestrating", load: 12, color: "text-volcanic-accent" },
              { name: "Executor", status: "Coding", load: 85, color: "text-blue-500" },
              { name: "NemoClaw", status: "Thinking", load: 42, color: "text-purple-500" },
              { name: "Jarvis", status: "Watching", load: 5, color: "text-volcanic-red" },
            ].map(agent => (
              <div key={agent.name} className="p-3 bg-volcanic-surface border border-volcanic-border rounded-md flex items-center justify-between hover:bg-black/40 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full bg-black border border-volcanic-border flex items-center justify-center font-bold text-[10px] ${agent.color}`}>
                    {agent.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-volcanic-text">{agent.name}</div>
                    <div className="text-[10px] text-volcanic-text/40">{agent.status}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-1 bg-volcanic-border rounded-full overflow-hidden hidden sm:block">
                    <div 
                      className="h-full bg-volcanic-accent transition-all duration-1000" 
                      style={{ width: `${agent.load}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-volcanic-text/60 w-8 text-right">{agent.load}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button className="w-full py-2 bg-volcanic-accent text-black font-black text-[10px] uppercase tracking-[0.2em] rounded hover:bg-volcanic-accent/80 transition-all volcanic-glow">
              Initialize New Agent Node
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
