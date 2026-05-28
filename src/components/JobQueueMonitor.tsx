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
    <div className="glass-panel space-y-4">
      <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-neon-cyan">Autonomous Pipeline</h2>
      <div className="space-y-3">
        {jobs.length === 0 && <p className="text-xs text-text-muted">Queue idle...</p>}
        {jobs.map((job) => (
          <div key={job.id} className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/5">
            <div>
              <p className="text-xs font-bold text-white">{job.theme}</p>
              <p className="text-[10px] text-text-secondary truncate max-w-[200px]">{job.director_prompt}</p>
            </div>
            <div className={`text-[10px] px-2 py-1 rounded-full font-code ${
              job.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
              job.status === 'RUNNING' ? 'bg-neon-cyan/20 text-neon-cyan animate-pulse' :
              'bg-white/10 text-white'
            }`}>
              {job.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
