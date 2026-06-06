"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Agent {
  name: string;
  status: 'online' | 'offline';
}

interface SystemStatus {
  version: string;
  timestamp: string;
  activeMilestone: string;
  status: string;
  agents: Agent[];
}

export default function LiveStatusPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/live/status');
        const data = await res.json();
        setStatus(data);
      } catch (error) {
        console.error("Failed to fetch live status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-ide-bg flex items-center justify-center font-code">
      <div className="h-8 w-8 border-2 border-zinc-800 border-t-syntax-string rounded-sm animate-spin mb-4" />
    </div>
  );

  return (
    <div className="min-h-screen bg-ide-bg text-white font-sans selection:bg-white/10">
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-24">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-ide-border pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2 font-code">
              <span className="h-1.5 w-1.5 rounded-none bg-syntax-string" />
              <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">System_Live</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              LITLABS <span className="font-code text-syntax-keyword">HIVE MIND</span>
            </h1>
          </div>
          <div className="text-right font-code text-[10px] text-zinc-500 space-y-1 uppercase tracking-widest">
            <p>VERSION: {status?.version}</p>
            <p>UPTIME: 99.9% AUTONOMIC</p>
            <p>LAST SYNC: {status?.timestamp ? new Date(status.timestamp).toLocaleTimeString() : 'N/A'}</p>
          </div>
        </header>

        {/* Main Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Active Milestone Card */}
          <div className="group p-8 rounded-sm bg-ide-surface/40 border border-ide-border transition-colors hover:border-zinc-500">
             <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6 font-code">Current_Mission</h3>
             <div className="space-y-4">
                <h2 className="text-xl font-bold text-white leading-tight font-code">
                  {status?.activeMilestone}
                </h2>
                <div className="inline-flex items-center px-3 py-1 rounded-sm bg-black/40 border border-ide-border text-syntax-string text-[9px] font-bold uppercase tracking-widest font-code">
                  {status?.status}
                </div>
             </div>
          </div>

          {/* Agent Status List */}
          <div className="p-8 rounded-sm bg-ide-surface/40 border border-ide-border">
             <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6 font-code">Agent_Heartbeats</h3>
             <div className="space-y-4">
                {status?.agents.map((agent) => (
                  <div key={agent.name} className="flex items-center justify-between group py-2 border-b border-ide-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`h-1.5 w-1.5 rounded-none ${agent.status === 'online' ? 'bg-syntax-string' : 'bg-zinc-600'} transition-transform group-hover:scale-125`} />
                      <span className="text-xs font-bold text-zinc-300 font-code uppercase tracking-widest">{agent.name}</span>
                    </div>
                    <span className="text-[9px] font-code text-zinc-600 uppercase tracking-widest">{agent.status}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Join CTA */}
        <div className="text-center p-12 rounded-sm bg-ide-surface/20 border border-dashed border-ide-border">
          <h2 className="text-lg font-bold mb-4 font-code uppercase tracking-widest">Observe. Automate. Evolve.</h2>
          <p className="text-zinc-500 text-[10px] font-code uppercase tracking-widest mb-8 max-w-md mx-auto">
            The Hive Mind is an autonomous agent network. Witness the loop in real-time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="btn btn-primary px-8 py-3 text-[10px] font-black uppercase tracking-widest">
              Init_Connection
            </Link>
            <Link href="/" className="btn btn-secondary px-8 py-3 text-[10px] font-black uppercase tracking-widest border-zinc-600">
              View_Source
            </Link>
          </div>
        </div>

        <footer className="mt-24 text-center">
          <div className="text-[9px] font-bold text-zinc-700 tracking-[0.5em] uppercase font-code">
            LitLabs / Autonomic_Loop
          </div>
        </footer>
      </div>
    </div>
  );
}
