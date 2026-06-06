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
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/live/status")
      .then(r => r.json())
      .then(setStatus)
      .catch(() => setError(true));
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#333] border-t-[#f97316] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Welcome back, <span className="text-[#f97316]">{user?.name || user?.email?.split("@")[0] || "Builder"}</span>
          </h1>
          <p className="text-sm text-[#71717a] mt-1">Your AI workspace. Everything running smoothly.</p>
        </div>

        {/* System Status Bar */}
        <div className="card p-4 mb-8 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={`status-dot ${status?.status === "stable" ? "online" : status?.status === "in_progress" ? "busy" : "offline"}`} />
            <span className="text-sm text-[#a1a1aa]">
              {status?.status === "stable" ? "All systems operational" : status?.activeMilestone || "Loading..."}
            </span>
          </div>
          {status?.agents && (
            <div className="flex items-center gap-4 ml-auto">
              {status.agents.map(a => (
                <div key={a.name} className="flex items-center gap-1.5">
                  <div className={`status-dot ${a.status === "online" ? "online" : "offline"}`} />
                  <span className="text-xs text-[#71717a]">{a.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Agent Monitor */}
        <div className="mb-8">
          <AgentMonitor />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/chat" className="card p-5 hover:border-[#f97316]/30 transition-colors group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#f97316]/10 flex items-center justify-center text-xl">💬</div>
                <h3 className="font-semibold text-white group-hover:text-[#f97316] transition-colors">Open Chat</h3>
              </div>
              <p className="text-sm text-[#71717a]">Talk to your AI assistant, get help, run commands.</p>
            </Link>

            <Link href="/social" className="card p-5 hover:border-[#f97316]/30 transition-colors group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-xl">👥</div>
                <h3 className="font-semibold text-white group-hover:text-[#f97316] transition-colors">Social Feed</h3>
              </div>
              <p className="text-sm text-[#71717a]">See what's happening, share updates, connect.</p>
            </Link>

            <Link href="/builder" className="card p-5 hover:border-[#f97316]/30 transition-colors group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-xl">🛠️</div>
                <h3 className="font-semibold text-white group-hover:text-[#f97316] transition-colors">Build Agent</h3>
              </div>
              <p className="text-sm text-[#71717a]">Create a new AI agent with custom personality and skills.</p>
            </Link>

            <Link href="/marketplace" className="card p-5 hover:border-[#f97316]/30 transition-colors group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-xl">🔧</div>
                <h3 className="font-semibold text-white group-hover:text-[#f97316] transition-colors">Marketplace</h3>
              </div>
              <p className="text-sm text-[#71717a]">Browse and deploy pre-built agents and tools.</p>
            </Link>

            <Link href="/settings" className="card p-5 hover:border-[#f97316]/30 transition-colors group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center text-xl">⚙️</div>
                <h3 className="font-semibold text-white group-hover:text-[#f97316] transition-colors">Settings</h3>
              </div>
              <p className="text-sm text-[#71717a]">Manage your account, preferences, and billing.</p>
            </Link>

            <a href="https://litree-ceo.github.io/larryb-portfolio/" target="_blank" rel="noopener noreferrer" className="card p-5 hover:border-[#f97316]/30 transition-colors group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-xl">🌐</div>
                <h3 className="font-semibold text-white group-hover:text-[#f97316] transition-colors">Portfolio</h3>
              </div>
              <p className="text-sm text-[#71717a]">View your public portfolio and project showcase.</p>
            </a>
          </div>
        </div>

        {/* Recent Activity / Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0a0a0a]">
                <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
                <span className="text-sm text-[#a1a1aa]">System scan completed — 25 opportunities found</span>
                <span className="text-xs text-[#555] ml-auto">2h ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0a0a0a]">
                <div className="w-2 h-2 rounded-full bg-[#f97316]" />
                <span className="text-sm text-[#a1a1aa]">Website deployed to production</span>
                <span className="text-xs text-[#555] ml-auto">3h ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0a0a0a]">
                <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
                <span className="text-sm text-[#a1a1aa]">Gig hunter agent activated</span>
                <span className="text-xs text-[#555] ml-auto">4h ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0a0a0a]">
                <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
                <span className="text-sm text-[#a1a1aa]">All services healthy — uptime 99.9%</span>
                <span className="text-xs text-[#555] ml-auto">5h ago</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Stats</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#71717a]">Active Agents</span>
                  <span className="text-white font-medium">5</span>
                </div>
                <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div className="h-full bg-[#f97316] rounded-full" style={{ width: "83%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#71717a]">Uptime</span>
                  <span className="text-white font-medium">99.9%</span>
                </div>
                <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div className="h-full bg-[#22c55e] rounded-full" style={{ width: "99.9%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#71717a]">Tasks Completed</span>
                  <span className="text-white font-medium">142</span>
                </div>
                <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div className="h-full bg-[#3b82f6] rounded-full" style={{ width: "71%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#71717a]">Proposals Ready</span>
                  <span className="text-white font-medium">0</span>
                </div>
                <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div className="h-full bg-[#71717a] rounded-full" style={{ width: "0%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
