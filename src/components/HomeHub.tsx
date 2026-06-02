"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AgentMonitor from './AgentMonitor';

interface HubCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  href: string;
  color: string;
}

const HUB_CARDS: HubCard[] = [
  { id: 'cockpit', title: 'Director_Cockpit', subtitle: 'Primary neural command center', icon: '⚡', href: '/chat', color: 'border-orange-500/40 shadow-orange-500/20' },
  { id: 'fleet', title: 'Fleet_Mainframe', subtitle: 'Agent telemetry & diagnostics', icon: '🧠', href: '/dashboard', color: 'border-red-500/40 shadow-red-500/20' },
  { id: 'matrix', title: 'The_Matrix', subtitle: 'Global transmission feed', icon: '👥', href: '/social', color: 'border-orange-600/40 shadow-orange-600/20' },
  { id: 'forge', title: 'Agent_Forge', subtitle: 'Daemon construction module', icon: '🛠️', href: '/builder', color: 'border-yellow-600/40 shadow-yellow-600/20' },
  { id: 'studio', title: 'UI_Studio', subtitle: 'Neural interface architect', icon: '🎭', href: '/ai-studio', color: 'border-orange-400/40 shadow-orange-400/20' },
  { id: 'nexus', title: 'Bot_Forge', subtitle: 'Acquire high-tier nodes', icon: '🔧', href: '/marketplace', color: 'border-red-600/40 shadow-red-600/20' },
];

export default function HomeHub() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#f9731615,transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-block px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-[9px] font-black text-orange-500 uppercase tracking-[0.4em] mb-6 animate-pulse">
            Neural_System_Active // Node_v3.0
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-widest font-mono text-white mb-6 italic">
            Hive_Mind_Core
          </h1>
          <p className="text-xs font-bold text-zinc-600 uppercase tracking-[0.5em]">Central launchpad for autonomous orchestration</p>
        </div>

        {/* Top Telemetry */}
        <div className="mb-12">
          <AgentMonitor />
        </div>

        {/* Grid Launchpad */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HUB_CARDS.map((card) => (
            <Link 
              key={card.id}
              href={card.href}
              className={`card p-8 bg-zinc-950/40 border-2 ${card.color} hover:bg-orange-500/5 transition-all group relative overflow-hidden flex flex-col items-center text-center`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="w-16 h-16 rounded-none border border-white/10 flex items-center justify-center text-3xl mb-6 shadow-inner group-hover:scale-110 transition-transform bg-black/40">
                {card.icon}
              </div>
              
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white font-mono mb-2 group-hover:text-orange-500 transition-colors">
                {card.title}
              </h2>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">
                {card.subtitle}
              </p>
              
              <div className="mt-auto px-4 py-1.5 border border-white/5 text-[8px] font-black text-zinc-600 uppercase tracking-widest group-hover:border-orange-500/40 group-hover:text-orange-500 transition-all">
                Initialize_Module →
              </div>
            </Link>
          ))}
        </div>

        {/* System Logs Footer */}
        <div className="mt-20 border-t border-white/5 pt-10 flex flex-wrap justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1">Global_Uptime</div>
              <div className="text-xs font-black text-zinc-500 font-mono">142:52:14:02</div>
            </div>
            <div className="w-px h-6 bg-white/5" />
            <div>
              <div className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1">Security_Level</div>
              <div className="text-xs font-black text-emerald-900 font-mono">CRITICAL_STABLE</div>
            </div>
          </div>
          
          <div className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.3em] font-mono">
            LiTTreeLabStudios // All rights reserved_2026
          </div>
        </div>
      </div>
    </div>
  );
}
