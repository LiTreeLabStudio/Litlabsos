"use client";
import React, { useState, useEffect, useCallback } from 'react';

interface Agent {
  id: string;
  name: string;
  status: string;
  lastActive: string;
}

interface LogEntry {
  time: string;
  msg: string;
}

interface ActiveTask {
  milestone: string;
  director_instructions: string;
  status: string;
}

interface CompletedTask {
  id: string;
  title: string;
}

export default function AgentsDashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeTask, setActiveTask] = useState<ActiveTask | null>(null);
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [backlogCount, setBacklogCount] = useState(0);
  const [services, setServices] = useState<Record<string, string>>({});
  const [lastUpdate, setLastUpdate] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [agentsRes, logsRes, taskRes, completedRes, backlogRes, servicesRes] = await Promise.all([
        fetch("/api/agents/status").then(r => r.json()).catch(() => []),
        fetch("/api/agents/logs").then(r => r.json()).catch(() => []),
        fetch("/api/agents/task").then(r => r.json()).catch(() => null),
        fetch("/api/agents/completed").then(r => r.json()).catch(() => []),
        fetch("/api/agents/backlog").then(r => r.json()).catch(() => 0),
        fetch("/api/agents/services").then(r => r.json()).catch(() => ({})),
      ]);

      if (agentsRes.length) setAgents(agentsRes);
      if (logsRes.length) setLogs(logsRes);
      if (taskRes) setActiveTask(taskRes);
      if (completedRes.length) setCompletedTasks(completedRes);
      if (backlogRes !== undefined) setBacklogCount(backlogRes);
      if (Object.keys(servicesRes).length) setServices(servicesRes);
      
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (mounted) await fetchData();
    };
    load();
    
    const interval = setInterval(() => {
      if (mounted) fetchData();
    }, 5000);
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [fetchData]);

  const [command, setCommand] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendCommand = async () => {
    if (!command.trim()) return;
    setIsSending(true);
    try {
      const res = await fetch("/api/agents/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      });
      if (!res.ok) throw new Error("Failed to send command");
      setCommand("");
      // Refresh data to show new task
      fetchData();
    } catch (e) {
      console.error("Command error:", e);
    } finally {
      setIsSending(false);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "running": 
      case "active": return "text-emerald-400";
      case "idle": return "text-amber-400";
      case "error": 
      case "inactive": return "text-rose-400";
      default: return "text-zinc-500";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Hive Mind <span className="gradient-text">Agents</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Real-time status of your autonomic agent fleet.</p>
        </div>
        <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
          Last Update: {lastUpdate}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Agents Status */}
        <div className="md:col-span-2 space-y-4">
          {/* Command Hub */}
          <section className="rounded-2xl border border-white/10 bg-white/3 p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              🧠 Smart Command Hub
            </h2>
            <div className="flex gap-2">
              <input 
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendCommand()}
                placeholder="Instruct the Hive Mind... (e.g. 'Audit the landing page design')"
                className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
                disabled={isSending}
              />
              <button 
                onClick={handleSendCommand}
                disabled={isSending || !command.trim()}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
              >
                {isSending ? "Syncing..." : "Send"}
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/3 p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Active Agents
            </h2>
            <div className="grid gap-3">
              {agents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-xl">
                      🤖
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{agent.name}</h3>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{agent.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-bold uppercase tracking-widest ${statusColor(agent.status)}`}>
                      {agent.status}
                    </div>
                    <div className="text-[10px] text-zinc-600 mt-1">
                      {new Date(agent.lastActive).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Services Health */}
          <section className="rounded-2xl border border-white/10 bg-white/3 p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              🔌 System Services
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(services).map(([name, status]) => (
                <div key={name} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-300 capitalize">{name}</span>
                  <span className={`text-[10px] ${statusColor(status)} font-bold`}>{status}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Active Task */}
          {activeTask && (
            <section className="rounded-sm border border-ide-border bg-ide-surface/80 p-6 shadow-sm relative overflow-hidden">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2 font-code uppercase tracking-widest">
                Current_Milestone
              </h2>
              <div className="space-y-4">
                <div className="p-4 rounded-sm bg-black/40 border border-ide-border">
                  <h3 className="text-white font-bold mb-1 font-code text-[11px] uppercase tracking-widest">{activeTask.milestone}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed italic font-code">
                    &quot;{activeTask.director_instructions}&quot;
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-bold px-3 py-1 rounded-sm bg-syntax-keyword/10 text-syntax-keyword border border-syntax-keyword/30 uppercase tracking-[0.2em] font-code">
                    {activeTask.status}
                  </span>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Stats & Logs */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-white/3 p-6 shadow-xl">
            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">System Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-2xl font-black text-white">{backlogCount}</div>
                <div className="text-[10px] text-zinc-500 uppercase font-bold">Backlog</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-2xl font-black text-white">{completedTasks.length}</div>
                <div className="text-[10px] text-zinc-500 uppercase font-bold">Completed</div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/3 p-6 h-[500px] flex flex-col shadow-xl">
            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Live Logs</h2>
            <div className="flex-1 overflow-auto space-y-2 font-mono text-[10px]">
              {logs.length > 0 ? logs.map((log, i) => (
                <div key={i} className="text-zinc-400 border-l border-white/10 pl-2 hover:bg-white/5 transition-colors">
                  <span className="text-zinc-600">[{log.time}]</span> {log.msg}
                </div>
              )) : (
                <div className="text-zinc-600 italic">No logs available...</div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
