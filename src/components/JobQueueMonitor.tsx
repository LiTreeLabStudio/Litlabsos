"use client";

import { useEffect, useState } from "react";

export default function JobQueueMonitor() {
  const [jobs, setJobs] = useState<{ id: string; theme: string; director_prompt: string; status: string }[]>([]);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await fetch("https://api.litlabs.net/api/queue");
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        }
      } catch (e) {
        console.error("Failed to fetch queue", e);
      }
    };
    fetchQueue();
    const interval = setInterval(fetchQueue, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel p-6 border-neon-cyan/10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-neon-cyan/20" />
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-[10px] font-bold uppercase tracking-[0.3em] text-neon-cyan">Pipeline_Telemetry</h2>
        <div className="flex gap-1">
          <span className="w-1 h-1 rounded-full bg-neon-cyan animate-ping" />
          <span className="w-1 h-1 rounded-full bg-neon-cyan opacity-50" />
        </div>
      </div>
      <div className="space-y-3">
        {jobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 opacity-30">
            <div className="text-[10px] font-bold font-code tracking-widest">QUEUE_IDLE</div>
            <div className="text-[8px] uppercase mt-1">Listening for transmissions...</div>
          </div>
        )}
        {jobs.map((job) => (
          <div key={job.id} className="group relative p-3 bg-black/40 rounded-xl border border-white/5 hover:border-neon-cyan/30 transition-all duration-300">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-1 h-1 rounded-full bg-neon-cyan" />
                  <p className="text-[10px] font-bold text-white uppercase tracking-tight truncate">{job.theme}</p>
                </div>
                <p className="text-[9px] text-text-muted font-code truncate max-w-[180px] opacity-60">ID_{job.id.slice(0,8)}{" // "}{job.director_prompt}</p>
              </div>
              <div className={`text-[9px] px-2.5 py-1 rounded-lg font-bold tracking-widest transition-all ${
                job.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                job.status === 'RUNNING' ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 animate-pulse' :
                'bg-white/5 text-text-muted border border-white/5'
              }`}>
                {job.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
