"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Activity, 
  Terminal, 
  Zap, 
  ShieldCheck, 
  ArrowUpRight,
  Plus,
  RefreshCw,
  Trash2,
  Coins,
  Cpu,
  Globe,
  Settings
} from "lucide-react";

interface DashboardLog {
  id: string;
  text: string;
  time: string;
  type: "info" | "warn" | "error" | "success";
}

interface AgentStatus {
  id: string;
  name: string;
  category: string;
  status: "online" | "offline" | "busy";
  load: number;
}

interface DBAgent {
  id: string;
  name: string;
  category: string;
}

export default function DashboardPage() {
  const [logs, setLogs] = useState<DashboardLog[]>([]);
  const [wallet, setWallet] = useState<{ balance: number } | null>(null);
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      "Neural link established at 12ms latency",
      "Analyzing market trends for Alpha Array...",
      "Agent 'Code Champion' completed audit.",
    ];

    const interval = setInterval(() => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      setLogs(prev => [
        { 
          id: Math.random().toString(36), 
          text: msg, 
          time: new Date().toLocaleTimeString([], { hour12: false }),
          type: Math.random() > 0.9 ? "warn" : (Math.random() > 0.95 ? "success" : "info")
        },
        ...prev.slice(0, 24)
      ]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Fetch real data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [walletRes, agentsRes] = await Promise.all([
          fetch("/api/wallet"),
          fetch("/api/agents?featured=true")
        ]);

        if (walletRes.ok) {
          const walletData = await walletRes.json();
          setWallet(walletData);
        }

        if (agentsRes.ok) {
          const agentsData = await agentsRes.json();
          // Map DB agents to dashboard format
          const mappedAgents = (agentsData.agents || []).slice(0, 5).map((a: DBAgent) => ({
            id: a.id,
            name: a.name,
            category: a.category,
            status: Math.random() > 0.1 ? "online" : "busy" as const,
            load: Math.floor(Math.random() * 90) + 5
          }));
          setAgents(mappedAgents);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const clearLogs = () => setLogs([]);
  
  const refreshSystem = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Top Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="volcanic-glass p-4 rounded-lg border border-volcanic-border volcanic-glow transition-all hover:border-volcanic-accent">
          <div className="flex justify-between items-start mb-2">
            <Activity className="text-volcanic-accent" size={18} />
            <span className="text-[9px] font-mono text-volcanic-accent border border-volcanic-accent/30 px-1 py-0.5 rounded uppercase">Neural_Link</span>
          </div>
          <div className="text-2xl font-black text-volcanic-text font-mono">98.4%</div>
          <div className="text-[9px] font-mono text-volcanic-text/40 uppercase tracking-widest mt-1">Stability Array</div>
        </div>

        <div className="volcanic-glass p-4 rounded-lg border border-volcanic-border transition-all hover:border-volcanic-accent">
          <div className="flex justify-between items-start mb-2">
            <Coins className="text-yellow-500" size={18} />
            <Link href="/marketplace" className="text-volcanic-text/20 hover:text-volcanic-accent transition-colors"><ArrowUpRight size={14} /></Link>
          </div>
          <div className="text-2xl font-black text-volcanic-text font-mono">{wallet?.balance ?? "---"}</div>
          <div className="text-[9px] font-mono text-volcanic-text/40 uppercase tracking-widest mt-1">LiTBit Credits</div>
        </div>

        <div className="volcanic-glass p-4 rounded-lg border border-volcanic-border transition-all hover:border-volcanic-accent">
          <div className="flex justify-between items-start mb-2">
            <Cpu className="text-volcanic-red" size={18} />
            <span className="text-[9px] font-mono text-volcanic-text/40">PROX_NODE</span>
          </div>
          <div className="text-2xl font-black text-volcanic-text font-mono">12.8%</div>
          <div className="text-[9px] font-mono text-volcanic-text/40 uppercase tracking-widest mt-1">Processor Load</div>
        </div>

        <div className="volcanic-glass p-4 rounded-lg border border-volcanic-border transition-all hover:border-volcanic-accent">
          <div className="flex justify-between items-start mb-2">
            <Globe className="text-blue-500" size={18} />
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          </div>
          <div className="text-2xl font-black text-volcanic-text font-mono">42ms</div>
          <div className="text-[9px] font-mono text-volcanic-text/40 uppercase tracking-widest mt-1">Global Latency</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Terminal Console (Col 7) */}
        <div className="lg:col-span-7 volcanic-glass rounded-lg border border-volcanic-border flex flex-col h-[500px] shadow-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-volcanic-border flex items-center justify-between bg-black/60">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-volcanic-accent" />
              <span className="text-[10px] font-mono font-black text-volcanic-text uppercase tracking-[0.2em]">Neural_Console_v2.5</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={clearLogs} title="Clear Terminal" className="text-volcanic-text/40 hover:text-volcanic-red transition-colors">
                <Trash2 size={14} />
              </button>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-volcanic-border border border-white/5" />
                <div className="w-2.5 h-2.5 rounded-full bg-volcanic-border border border-white/5" />
                <div className="w-2.5 h-2.5 rounded-full bg-volcanic-accent border border-white/10" />
              </div>
            </div>
          </div>
          <div className="flex-1 p-5 font-mono text-[11px] overflow-y-auto custom-scrollbar space-y-1.5 bg-black/40 backdrop-blur-sm">
            {logs.length === 0 && !isLoading && (
              <div className="text-volcanic-text/20 animate-pulse py-4 text-center">Connection idle. Waiting for telemetry data...</div>
            )}
            {isLoading && (
              <div className="text-volcanic-accent animate-pulse py-4">Initializing secure neural tunnel... [OK]</div>
            )}
            {logs.map(log => (
              <div key={log.id} className="flex gap-4 group">
                <span className="text-volcanic-text/20 shrink-0 font-bold">[{log.time}]</span>
                <span className={`
                  ${log.type === "warn" ? "text-volcanic-red" : ""}
                  ${log.type === "success" ? "text-volcanic-accent" : ""}
                  ${log.type === "info" ? "text-volcanic-text/70" : ""}
                  break-all
                `}>
                  <span className="opacity-40 mr-2">➜</span>
                  {log.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Controls & Agents (Col 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Actions */}
          <section className="space-y-3">
            <h3 className="text-[10px] font-mono font-black text-volcanic-text/40 uppercase tracking-[0.3em] px-1">Quick_Exec_Directives</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/builder" className="flex flex-col items-center justify-center p-4 bg-volcanic-surface border border-volcanic-border rounded-lg hover:border-volcanic-accent hover:bg-volcanic-accent/5 transition-all group">
                <Plus size={20} className="text-volcanic-accent mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-black uppercase tracking-widest text-volcanic-text">Deploy Node</span>
              </Link>
              <button onClick={refreshSystem} className="flex flex-col items-center justify-center p-4 bg-volcanic-surface border border-volcanic-border rounded-lg hover:border-blue-500 hover:bg-blue-500/5 transition-all group">
                <RefreshCw size={20} className="text-blue-500 mb-2 group-hover:rotate-180 transition-transform duration-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-volcanic-text">Neural Sync</span>
              </button>
              <Link href="/marketplace" className="flex flex-col items-center justify-center p-4 bg-volcanic-surface border border-volcanic-border rounded-lg hover:border-yellow-500 hover:bg-yellow-500/5 transition-all group">
                <Zap size={20} className="text-yellow-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-black uppercase tracking-widest text-volcanic-text">Upgrade Pack</span>
              </Link>
              <Link href="/settings" className="flex flex-col items-center justify-center p-4 bg-volcanic-surface border border-volcanic-border rounded-lg hover:border-volcanic-text hover:bg-white/5 transition-all group">
                <Settings size={20} className="text-volcanic-text mb-2 group-hover:rotate-90 transition-transform duration-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-volcanic-text">Sys_Config</span>
              </Link>
            </div>
          </section>

          {/* Active Personas */}
          <section className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-[10px] font-mono font-black text-volcanic-accent uppercase tracking-[0.3em] flex items-center gap-2">
                <ShieldCheck size={14} />
                Active_Personas
              </h3>
              <Link href="/agents" className="text-[9px] font-mono text-volcanic-text/40 hover:text-volcanic-text underline uppercase">View All</Link>
            </div>
            
            <div className="space-y-2">
              {isLoading ? (
                <div className="py-10 text-center text-[10px] font-mono text-volcanic-text/20 animate-pulse border border-dashed border-volcanic-border rounded-lg">
                  Scanning local agent clusters...
                </div>
              ) : agents.length > 0 ? (
                agents.map(agent => (
                  <div key={agent.id} className="p-3 bg-volcanic-surface border border-volcanic-border rounded-md flex items-center justify-between hover:border-volcanic-accent transition-all group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-black border border-volcanic-border flex items-center justify-center font-black text-xs text-volcanic-accent shadow-inner">
                        {agent.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-volcanic-text truncate">{agent.name}</div>
                        <div className="flex items-center gap-2">
                          <span className={`w-1 h-1 rounded-full ${agent.status === 'online' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                          <span className="text-[9px] text-volcanic-text/40 uppercase tracking-tighter">{agent.category} {"//"} {agent.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="text-[9px] font-mono text-volcanic-text/60">{agent.load}% CPU</div>
                      <div className="w-16 h-1 bg-black rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${agent.load > 80 ? 'bg-volcanic-red' : 'bg-volcanic-accent'}`}
                          style={{ width: `${agent.load}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-volcanic-surface border border-volcanic-border border-dashed rounded-lg">
                   <p className="text-[10px] text-volcanic-text/40 mb-3">No active agents detected in this cluster.</p>
                   <Link href="/marketplace" className="text-[10px] font-black text-volcanic-accent uppercase tracking-widest hover:underline">Marketplace ➜</Link>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}