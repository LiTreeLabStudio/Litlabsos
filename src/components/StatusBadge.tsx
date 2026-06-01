"use client";
import React, { useState, useEffect } from 'react';

export default function StatusBadge() {
  const [status, setStatus] = useState<string>('loading');

  useEffect(() => {
    fetch('/api/live/status')
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus('error'));
  }, []);

  const colors: Record<string, string> = {
    loading: 'bg-zinc-500',
    stable: 'bg-emerald-500',
    in_progress: 'bg-blue-500',
    fixing: 'bg-rose-500',
    error: 'bg-rose-500',
  };

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 shadow-lg backdrop-blur-sm">
      <div className={`h-2 w-2 rounded-full ${colors[status] || colors.stable} animate-pulse shadow-[0_0_8px_currentColor]`} />
      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
        Hive Mind: <span className="text-white">{status.replace('_', ' ')}</span>
      </span>
    </div>
  );
}
