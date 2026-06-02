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
    stable: 'bg-orange-500',
    in_progress: 'bg-amber-500',
    fixing: 'bg-red-500',
    error: 'bg-red-600',
  };

  return (
    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-none bg-black/40 border border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)] backdrop-blur-md">
      <div className={`h-1.5 w-1.5 rounded-none ${colors[status] || colors.stable} animate-pulse shadow-[0_0_8px_currentColor]`} />
      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
        Neural_State: <span className="text-white">{status.replace('_', ' ')}</span>
      </span>
    </div>
  );
}
