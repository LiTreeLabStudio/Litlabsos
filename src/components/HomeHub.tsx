"use client";

import React from 'react';
import Link from 'next/link';
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
    <div className="min-h-screen bg-black relative overflow-hidden hud-scanlines">
      {/* Background FX */}
      <div className="absolute inset-0 hud-grid opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#f9731615,transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className="mb-20 text-center">
          <div className="inline-block px-4 py-1 bg-orange-500/10 border border-orange-500/30 text-[10px] font-black text-orange-500 uppercase tracking-[0.5em] mb-8 animate-pulse shadow-[0_0_15px_rgba(249,115,22,0.1)]">
            NEURAL_OS_ACTIVE // BRANCH_V3.5
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-[0.1em] font-heading text-white mb-6 italic glow-text-orange">
            HIVE_MIND
          </h1>
          <p className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.6em] ml-[0.6em]">Centralized_Autonomous_Orchestration_Hub</p>
        </div>

        {/* Top Telemetry */}
        <div className="mb-16">
          <AgentMonitor />
        </div>

        {/* Grid Launchpad */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {HUB_CARDS.map((card) => (
            <Link 
              key={card.id}
              href={card.href}
              className={`card-cyber p-10 flex flex-col items-center text-center group`}
            >
              {/* Animated Corner Accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-orange-500/20 group-hover:border-orange-500 transition-colors" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-orange-500/20 group-hover:border-orange-500 transition-colors" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-orange-500/20 group-hover:border-orange-500 transition-colors" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-orange-500/20 group-hover:border-orange-500 transition-colors" />

              <div className="w-20 h-20 rounded-none border border-white/5 flex items-center justify-center text-4xl mb-8 shadow-inner group-hover:scale-110 transition-all duration-500 bg-black/60 group-hover:border-orange-500/30 group-hover:shadow-[0_0_30px_rgba(249,115,22,0.1)]">
                {card.icon}
              </div>
              
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white font-mono mb-3 group-hover:text-orange-500 transition-colors">
                {card.title}
              </h2>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed mb-8 opacity-60 group-hover:opacity-100 transition-opacity">
                {card.subtitle}
              </p>
              
              <div className="mt-auto px-6 py-2 border border-white/5 text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] group-hover:border-orange-500/40 group-hover:text-orange-500 transition-all duration-300">
                INITIATE_MODULE
              </div>
            </Link>
          ))}
        </div>

        {/* System Logs Footer */}
        <div className="mt-32 border-t border-white/5 pt-12 flex flex-wrap justify-between items-center gap-10">
          <div className="flex items-center gap-10">
            <div>
              <div className="text-[9px] font-black text-zinc-800 uppercase tracking-widest mb-2">Global_Uptime</div>
              <div className="text-sm font-black text-zinc-600 font-mono tracking-tighter">142:52:14:02</div>
            </div>
            <div className="w-px h-10 bg-white/5" />
            <div>
              <div className="text-[9px] font-black text-zinc-800 uppercase tracking-widest mb-2">Security_Integrity</div>
              <div className="text-sm font-black text-emerald-950 font-mono tracking-tighter animate-pulse">OPTIMUM_STABLE</div>
            </div>
          </div>
          
          <div className="text-[10px] font-black text-zinc-800 uppercase tracking-[0.4em] font-mono italic">
            LiTTreeLabStudios // Core_Identity_2026
          </div>
        </div>
      </div>
    </div>
  );
}
