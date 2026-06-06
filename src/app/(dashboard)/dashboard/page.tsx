"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import AgentMonitor from "@/components/AgentMonitor";

interface StatusData {
  status: string;
  activeMilestone: string;
  agents: { name: string; status: string }[];
  timestamp: string;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<StatusData | null>(null);

  useEffect(() => {
    fetch("/api/live/status")
      .then(r => r.json())
      .then(setStatus)
      .catch(() => {});
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-ide-bg flex items-center justify-center">
        <div className="w-5 h-5 border border-zinc-800 border-t-syntax-string rounded-sm animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ide-bg font-sans">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-10 border-l-2 border-zinc-800 pl-6">
          <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em] mb-2 font-code">WORKSPACE_INIT</div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Welcome back, <span className="text-syntax-keyword font-code">{user?.name || user?.email?.split("@")[0] || "Architect"}</span>
          </h1>
          <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest font-code mt-1">Awaiting logic execution.</p>
        </div>

        {/* System Status Bar */}
        <div className="bg-ide-surface border border-ide-border p-4 mb-8 flex flex-wrap items-center gap-6 rounded-sm">
          <div className="flex items-center gap-2">
            <div className={`status-dot ${status?.status === "stable" ? "online" : status?.status === "in_progress" ? "busy" : "offline"}`} />
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider font-code">
              {status?.status === "stable" ? "SYSTEM_OPERATIONAL" : status?.activeMilestone || "CONNECTING..."}
            </span>
          </div>
          {status?.agents && (
            <div className="flex items-center gap-4 ml-auto">
              {status.agents.map(a => (
                <div key={a.name} className="flex items-center gap-1.5 px-2 py-0.5 bg-black/20 border border-ide-border rounded-sm">
                  <div className={`status-dot ${a.status === "online" ? "online" : "offline"}`} />
                  <span className="text-[10px] font-bold text-zinc-600 font-code">{a.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Agent Monitor */}
        <div className="mb-12">
          <AgentMonitor />
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-[10px] font-black text-orange-500/80 uppercase tracking-[0.4em] mb-6">Execution_Directives</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { href: "/chat", icon: "💬", title: "Open_Chat", desc: "Initialize neural link with the Hive Mind.", color: "text-syntax-function" },
              { href: "/social", icon: "👥", title: "Social_Feed", desc: "Monitor incoming data transmissions.", color: "text-syntax-string" },
              { href: "/builder", icon: "🛠️", title: "Forge_Agent", desc: "Construct and deploy a new daemon.", color: "text-syntax-keyword" },
              { href: "/marketplace", icon: "🔧", title: "Marketplace", desc: "Acquire pre-built logic templates.", color: "text-syntax-variable" },
              { href: "/settings", icon: "⚙️", title: "Settings", desc: "Configure system-level parameters.", color: "text-zinc-400" },
              { href: "https://litree-ceo.github.io/larryb-portfolio/", icon: "🌐", title: "Portfolio", desc: "Public project showcase repository.", color: "text-syntax-comment" },
            ].map(action => (
              <Link key={action.href} href={action.href} className="bg-ide-surface/40 border border-ide-border p-6 hover:bg-ide-surface/80 hover:border-zinc-500 transition-all group rounded-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-sm bg-black/40 border border-ide-border flex items-center justify-center text-xl shadow-sm transition-transform group-hover:scale-105">
                    {action.icon}
                  </div>
                  <h3 className={`text-sm font-bold uppercase tracking-widest font-code group-hover:text-white transition-colors ${action.color}`}>{action.title}</h3>
                </div>
                <p className="text-xs text-zinc-600 font-medium leading-relaxed">{action.desc}</p>
                <div className="mt-auto pt-2 text-[9px] font-bold text-zinc-800 group-hover:text-zinc-500 transition-colors self-end font-code uppercase tracking-widest">
                  EXECUTE &gt;
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-ide-surface border border-ide-border p-8 rounded-sm">
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-8 font-code">TRANSMISSION_LOG</h2>
            <div className="space-y-4">
              {[
                { label: "System scan completed — 25 opportunities found", color: "bg-syntax-string", time: "2h ago" },
                { label: "Website deployed to production", color: "bg-orange-600", time: "3h ago" },
                { label: "Gig hunter agent activated", color: "bg-syntax-function", time: "4h ago" },
                { label: "All services healthy — uptime 99.9%", color: "bg-syntax-string", time: "5h ago" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-black/20 border border-ide-border hover:border-zinc-700 transition-colors group">
                  <div className={`w-1.5 h-1.5 rounded-none ${item.color} group-hover:scale-125 transition-transform`} />
                  <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors font-code">{item.label}</span>
                  <span className="text-[10px] font-bold text-zinc-800 ml-auto font-code tracking-tighter">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-ide-surface border border-ide-border p-8 rounded-sm flex flex-col">
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-8 font-code">TELEMETRY_DATA</h2>
            <div className="space-y-8 flex-1">
              {[
                { label: "ACTIVE_AGENTS", val: "05", width: "83%", color: "bg-syntax-keyword" },
                { label: "SYSTEM_UPTIME", val: "99.9%", width: "99.9%", color: "bg-syntax-string" },
                { label: "TASKS_EXEC", val: "142", width: "71%", color: "bg-syntax-function" },
                { label: "PROPOSALS", val: "00", width: "5%", color: "bg-zinc-800" },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[9px] font-black text-zinc-700 tracking-widest font-code">{stat.label}</span>
                    <span className="text-xs font-bold text-white font-code">{stat.val}</span>
                  </div>
                  <div className="h-1 bg-black/40 rounded-none overflow-hidden">
                    <div className={`h-full ${stat.color} transition-all duration-1000`} style={{ width: stat.width }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-ide-border text-center">
              <div className="text-[8px] font-bold text-zinc-800 uppercase tracking-[0.3em] font-code">Data_Stale: 0.2ms ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
