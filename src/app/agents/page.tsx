"use client";
import { useState, useEffect, useCallback } from "react";

interface AgentStatus {
  name: string;
  status: "running" | "idle" | "error" | "fixing";
  lastAction: string;
  uptime: string;
}

interface LogEntry {
  timestamp: string;
  agent: string;
  message: string;
  level: "info" | "warn" | "error" | "success";
}

interface TaskData {
  milestone: string;
  status: string;
  director_instructions: string;
  target_files: string[];
  error_logs: string;
}

export default function AgentsDashboard() {
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeTask, setActiveTask] = useState<TaskData | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [backlogCount, setBacklogCount] = useState(0);
  const [gitCommits, setGitCommits] = useState<string[]>([]);
  const [services, setServices] = useState<Record<string, string>>({});
  const [lastUpdate, setLastUpdate] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [agentsRes, logsRes, taskRes, completedRes, backlogRes, gitRes, servicesRes] = await Promise.all([
        fetch("/api/agents/status").then(r => r.json()).catch(() => []),
        fetch("/api/agents/logs").then(r => r.json()).catch(() => []),
        fetch("/api/agents/task").then(r => r.json()).catch(() => null),
        fetch("/api/agents/completed").then(r => r.json()).catch(() => []),
        fetch("/api/agents/backlog").then(r => r.json()).catch(() => 0),
        fetch("/api/agents/commits").then(r => r.json()).catch(() => []),
        fetch("/api/agents/services").then(r => r.json()).catch(() => ({})),
      ]);
      if (agentsRes.length) setAgents(agentsRes);
      if (logsRes.length) setLogs(logsRes);
      if (taskRes) setActiveTask(taskRes);
      if (completedRes.length) setCompletedTasks(completedRes);
      if (backlogRes !== undefined) setBacklogCount(backlogRes);
      if (gitRes.length) setGitCommits(gitRes);
      if (Object.keys(servicesRes).length) setServices(servicesRes);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const statusDot = (s: string) => s === "running" ? "bg-green-400 animate-pulse" : s === "fixing" ? "bg-yellow-400 animate-pulse" : s === "error" ? "bg-red-400" : "bg-zinc-600";
  const statusColor = (s: string) => s === "running" ? "text-green-400" : s === "fixing" ? "text-yellow-400" : s === "error" ? "text-red-400" : "text-zinc-500";
  const logColor = (l: string) => l === "error" ? "text-red-400" : l === "warn" ? "text-yellow-400" : l === "success" ? "text-green-400" : "text-zinc-400";

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              <span className="text-orange-500">⚡</span> Hive Mind <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Command Center</span>
            </h1>
            <p className="text-sm text-zinc-500 mt-1">Real-time autonomous agent monitoring</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400 font-mono">LIVE</span>
            <span className="text-xs text-zinc-500 font-mono">{lastUpdate}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Agents</div>
            <div className="text-xl font-extrabold text-green-400 mt-1">{agents.filter(a => a.status === "running").length}<span className="text-xs text-zinc-500">/{agents.length}</span></div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Backlog</div>
            <div className="text-xl font-extrabold text-orange-400 mt-1">{backlogCount}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Completed</div>
            <div className="text-xl font-extrabold text-blue-400 mt-1">{completedTasks.length}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Commits</div>
            <div className="text-xl font-extrabold text-purple-400 mt-1">{gitCommits.length}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Agents */}
          <div>
            <h2 className="text-sm font-bold mb-3 text-zinc-400 uppercase tracking-wider">🤖 Agents</h2>
            <div className="space-y-2">
              {agents.map((a, i) => (
                <div key={i} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${statusDot(a.status)}`} />
                      <span className="text-sm font-semibold">{a.name}</span>
                    </div>
                    <span className={`text-[10px] font-mono uppercase ${statusColor(a.status)}`}>{a.status}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1 truncate">{a.lastAction}</div>
                </div>
              ))}
            </div>

            <h2 className="text-sm font-bold mb-3 mt-4 text-zinc-400 uppercase tracking-wider">⚙️ Services</h2>
            <div className="space-y-1">
              {Object.entries(services).map(([n, s], i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.01] px-3 py-1.5">
                  <span className="text-[10px] text-zinc-400 font-mono">{n}</span>
                  <span className={`text-[10px] font-mono ${s === "active" ? "text-green-400" : "text-red-400"}`}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Task + Git */}
          <div>
            <h2 className="text-sm font-bold mb-3 text-zinc-400 uppercase tracking-wider">🎯 Active Task</h2>
            {activeTask ? (
              <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-3 mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-orange-400 text-sm">{activeTask.milestone}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400">{activeTask.status}</span>
                </div>
                <p className="text-xs text-zinc-400">{activeTask.director_instructions}</p>
                <div className="text-[10px] text-zinc-500 mt-1">→ {activeTask.target_files.join(", ")}</div>
                {activeTask.error_logs && (
                  <div className="mt-2 p-2 rounded bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 font-mono">{activeTask.error_logs}</div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 mb-4 text-center text-zinc-500 text-xs">No active task</div>
            )}

            <h2 className="text-sm font-bold mb-3 text-zinc-400 uppercase tracking-wider">📡 Recent Commits</h2>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {gitCommits.map((c, i) => (
                <div key={i} className="rounded border border-white/5 bg-white/[0.01] px-2 py-1.5 text-[10px] font-mono text-zinc-300">{c}</div>
              ))}
            </div>

            <h2 className="text-sm font-bold mb-3 mt-4 text-zinc-400 uppercase tracking-wider">✅ Completed</h2>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {completedTasks.map((t, i) => (
                <div key={i} className="rounded border border-green-500/10 bg-green-500/5 px-2 py-1.5 text-[10px] text-green-400">{t}</div>
              ))}
            </div>
          </div>

          {/* Logs */}
          <div>
            <h2 className="text-sm font-bold mb-3 text-zinc-400 uppercase tracking-wider">📋 Live Logs</h2>
            <div className="rounded-xl border border-white/10 bg-black/40 p-3 h-[500px] overflow-y-auto font-mono text-[10px]">
              {logs.map((l, i) => (
                <div key={i} className="mb-1.5 flex gap-1.5">
                  <span className="text-zinc-600 shrink-0">[{l.timestamp}]</span>
                  <span className="text-orange-400 shrink-0">[{l.agent}]</span>
                  <span className={logColor(l.level)}>{l.message}</span>
                </div>
              ))}
              {logs.length === 0 && <div className="text-zinc-600 text-center mt-8">Waiting for agent activity...</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
