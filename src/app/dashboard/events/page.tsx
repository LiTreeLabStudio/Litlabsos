"use client";

import React, { useState } from "react";
import { 
  Activity, 
  Terminal, 
  Zap, 
  ShieldCheck, 
  Database,
  ArrowUpRight,
  Filter,
  Download,
  Search
} from "lucide-react";

export default function EventsPage() {
  const [events] = useState([
    { id: "evt_1", type: "webhook", source: "Stripe", action: "payment_intent.succeeded", status: "success", time: "2m ago", detail: "Transaction $49.00 - User user_987x" },
    { id: "evt_2", type: "agent", source: "Director", action: "orchestration_dispatch", status: "success", time: "15m ago", detail: "Routed task 'SEO Audit' to Executor node" },
    { id: "evt_3", type: "system", source: "Auth", action: "user.signed_up", status: "success", time: "1h ago", detail: "New hive member: user_1024j" },
    { id: "evt_4", type: "webhook", source: "Clerk", action: "user.updated", status: "success", time: "2h ago", detail: "Profile synchronization complete" },
    { id: "evt_5", type: "agent", source: "Code Champion", action: "refactor_complete", status: "success", time: "5h ago", detail: "Optimized 14 files in repository 'litlabs-frontend'" },
    { id: "evt_6", type: "system", source: "Database", action: "backup_vaulted", status: "success", time: "12h ago", detail: "Daily snapshot stored in R2 encryption vault" },
    { id: "evt_7", type: "error", source: "API", action: "rate_limit_hit", status: "warning", time: "1d ago", detail: "Upstream provider: OpenRouter 429 error handled" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-volcanic-text uppercase tracking-tight mb-2">Event Ledger</h1>
          <p className="text-xs text-volcanic-text/40 font-mono uppercase tracking-widest">Real-time transparency of all hive operations</p>
        </div>
        <div className="flex gap-2">
           <button className="p-2 border border-volcanic-border bg-volcanic-surface rounded hover:border-volcanic-accent transition-colors">
              <Filter size={14} className="text-volcanic-text/60" />
           </button>
           <button className="p-2 border border-volcanic-border bg-volcanic-surface rounded hover:border-volcanic-accent transition-colors">
              <Download size={14} className="text-volcanic-text/60" />
           </button>
        </div>
      </div>

      <div className="volcanic-glass border border-volcanic-border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-volcanic-border bg-black/40 flex items-center gap-4">
           <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-volcanic-text/30" />
              <input 
                placeholder="Search ledger entries..." 
                className="w-full bg-black/40 border border-volcanic-border rounded py-2 pl-10 pr-4 text-xs outline-none focus:border-volcanic-accent transition-all"
              />
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-volcanic-surface border-b border-volcanic-border">
                <th className="px-6 py-3 text-[10px] font-mono font-bold text-volcanic-text/40 uppercase tracking-widest">Time</th>
                <th className="px-6 py-3 text-[10px] font-mono font-bold text-volcanic-text/40 uppercase tracking-widest">Source</th>
                <th className="px-6 py-3 text-[10px] font-mono font-bold text-volcanic-text/40 uppercase tracking-widest">Action</th>
                <th className="px-6 py-3 text-[10px] font-mono font-bold text-volcanic-text/40 uppercase tracking-widest">Status</th>
                <th className="px-6 py-3 text-[10px] font-mono font-bold text-volcanic-text/40 uppercase tracking-widest">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-volcanic-border/50">
              {events.map(event => (
                <tr key={event.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 text-[11px] font-mono text-volcanic-text/30">{event.time}</td>
                  <td className="px-6 py-4">
                    <span className={'px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter ' + (
                      event.type === 'webhook' ? 'bg-blue-500/10 text-blue-400' :
                      event.type === 'agent' ? 'bg-purple-500/10 text-purple-400' :
                      'bg-white/5 text-volcanic-text/60'
                    )}>
                      {event.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-volcanic-text/80">{event.action}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                       <div className={'w-1.5 h-1.5 rounded-full ' + (event.status === 'success' ? 'bg-green-500' : 'bg-yellow-500')} />
                       <span className="text-[10px] font-mono text-volcanic-text/60 uppercase">{event.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-volcanic-text/40 italic">{event.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-volcanic-border bg-black/20 flex justify-between items-center text-[10px] font-mono text-volcanic-text/40">
           <div>Showing 7 entries of 14,203 total records</div>
           <div className="flex gap-4">
              <button className="hover:text-volcanic-accent uppercase">Prev</button>
              <button className="hover:text-volcanic-accent uppercase">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
}
