import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const MarketplacePreview = ({ agents, colors }: { agents: any[], colors: any }) => {
  return (
    <div className="py-20 border-t border-white/5">
      <div className="flex justify-between items-end mb-12 px-6 max-w-7xl mx-auto">
        <div>
          <h2 className="font-display text-3xl font-bold mb-2">Featured Agents</h2>
          <p className="text-white/50 text-sm italic">Powered by Upwork Talent & Local Hive Orchestration</p>
        </div>
        <Link href="/marketplace" className="text-cyan-400 text-xs font-bold uppercase tracking-widest hover:underline">
          View All Agents →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 max-w-7xl mx-auto">
        {agents.slice(0, 4).map((agent, i) => (
          <div key={i} className="glass-card p-4 rounded-xl group hover:border-cyan-500/30 transition-all">
            <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden border border-white/5">
              <Image src={agent.avatar} alt={agent.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h3 className="font-bold text-sm mb-1">{agent.name}</h3>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3">{agent.role}</p>
            <Link href={'/agents/' + agent.id} className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300">
              DEPLOY NODE →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
