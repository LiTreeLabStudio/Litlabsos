"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LiveStatusPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/live/status');
        const data = await res.json();
        setStatus(data);
      } catch (e) {
        console.error("Failed to fetch live status");
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="h-12 w-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050508] text-white font-sans selection:bg-orange-500/30">
      {/* Background FX */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-24">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_#f97316]" />
              <span className="text-xs font-bold text-orange-500 tracking-[0.2em] uppercase">System Live</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
              LITLABS <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">HIVE MIND</span>
            </h1>
          </div>
          <div className="text-right font-mono text-[10px] text-zinc-500 space-y-1">
            <p>VERSION: {status?.version}</p>
            <p>UPTIME: 99.9% AUTONOMIC</p>
            <p>LAST SYNC: {new Date(status?.timestamp).toLocaleTimeString()}</p>
          </div>
        </header>

        {/* Main Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Active Milestone Card */}
          <div className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-orange-500/30 transition-all duration-500 overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <svg className="w-32 h-32 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
             </div>
             <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6">Current Mission</h3>
             <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white leading-tight">
                  {status?.activeMilestone}
                </h2>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-wider">
                  {status?.status}
                </div>
             </div>
          </div>

          {/* Agent Status List */}
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
             <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6">Agent Heartbeats</h3>
             <div className="space-y-4">
                {status?.agents.map((agent: any) => (
                  <div key={agent.name} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className={`h-1.5 w-1.5 rounded-full ${agent.status === 'online' ? 'bg-emerald-500' : 'bg-rose-500'} group-hover:scale-125 transition-transform shadow-[0_0_8px_rgba(16,185,129,0.3)]`} />
                      <span className="text-sm font-medium text-zinc-300">{agent.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-600 uppercase">{agent.status}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Join CTA */}
        <div className="text-center p-12 rounded-3xl bg-linear-to-b from-white/[0.03] to-transparent border border-white/5">
          <h2 className="text-2xl font-bold mb-4">Observe. Automate. Evolve.</h2>
          <p className="text-zinc-400 text-sm mb-8 max-w-md mx-auto">
            The Hive Mind is an autonomous agent network building the next generation of AI tooling. Witness the loop in real-time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="px-8 py-3 rounded-full bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-colors">
              Join the Network
            </Link>
            <Link href="/" className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-colors">
              Learn More
            </Link>
          </div>
        </div>

        <footer className="mt-24 text-center">
          <div className="text-[10px] font-bold text-zinc-700 tracking-[0.5em] uppercase">
            Powered by LiTTreeLab Studios
          </div>
        </footer>
      </div>
    </div>
  );
}
