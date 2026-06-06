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
      <div className="mb-10 border-l-2 border-zinc-800 pl-6">
        <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em] mb-2 font-code">SESSION_ACTIVE</div>
        <h1 className="text-3xl font-bold text-white mb-1 font-code tracking-tight">
          Welcome back, <span className="text-orange-500">{user?.name || user?.email?.split("@")[0] || "Architect"}</span>
        </h1>
        <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest font-code">Synchronized. Awaiting logic execution.</p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Link
            key={action.id}
            href={action.href}
            className="flex flex-col gap-4 rounded-sm border border-ide-border bg-ide-surface/40 p-6 hover:bg-ide-surface/80 hover:border-zinc-500 transition-all group relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-sm bg-zinc-900 border border-ide-border flex items-center justify-center text-2xl shadow-sm transition-transform group-hover:scale-105">
              {action.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white font-code group-hover:text-orange-500 transition-colors">{action.title}</h3>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter mt-1">{action.subtitle}</p>
            </div>
            
            <div className="mt-2 text-[9px] font-bold text-zinc-700 group-hover:text-zinc-400 transition-colors self-end uppercase tracking-widest font-code">
              EXEC_INTERNAL_LINK &gt;
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
