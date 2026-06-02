"use client";
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  href: string;
}

const actions: QuickAction[] = [
  { id: 'agents', title: 'Hive Mind', subtitle: 'Neural node status', icon: '🧠', color: 'from-orange-600 to-red-600', href: '/dashboard/agents' },
  { id: 'ai-studio', title: 'AI Studio', subtitle: 'Neural UI Forge', icon: '🎭', color: 'from-orange-500 to-orange-700', href: '/ai-studio' },
  { id: 'neural-link', title: 'Neural Chat', subtitle: 'Director Cockpit', icon: '⚡', color: 'from-amber-500 to-orange-600', href: '/chat' },
  { id: 'bot-forge', title: 'Bot Forge', subtitle: 'Acquire elite agents', icon: '🔧', color: 'from-red-500 to-orange-800', href: '/marketplace' },
  { id: 'the-matrix', title: 'The Feed', subtitle: 'Neural transmission', icon: '👥', color: 'from-orange-400 to-red-500', href: '/social' },
  { id: 'forge-agent', title: 'Forge Agent', subtitle: 'Construct new daemon', icon: '🛠️', color: 'from-yellow-500 to-orange-600', href: '/builder' },
];

export default function DashboardGrid() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10 border-l-2 border-orange-500 pl-6">
        <div className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-2 animate-pulse">Session_Active</div>
        <h1 className="text-3xl font-black uppercase tracking-widest font-mono text-white mb-1">
          Welcome back, <span className="text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">{user?.name || user?.email?.split("@")[0] || "Architect"}</span>
        </h1>
        <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Hive Mind synchronization complete. Awaiting directives.</p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Link
            key={action.id}
            href={action.href}
            className="flex flex-col gap-4 rounded-none border border-orange-500/10 bg-zinc-950/50 p-6 hover:bg-orange-500/5 hover:border-orange-500/40 hover:shadow-[0_0_20px_rgba(249,115,22,0.1)] transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className={`w-12 h-12 rounded-none bg-linear-to-br ${action.color} flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(249,115,22,0.2)] group-hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] group-hover:scale-110 transition-all`}>
              {action.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-black uppercase tracking-widest text-white font-mono group-hover:text-orange-500 transition-colors">{action.title}</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter mt-1">{action.subtitle}</p>
            </div>
            
            <div className="mt-2 text-[10px] font-black text-orange-500/40 group-hover:text-orange-500 transition-colors self-end uppercase tracking-[0.2em]">
              Initialize_Link →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
