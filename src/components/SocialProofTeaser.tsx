import React from 'react';
import { Play } from 'lucide-react';

export const SocialProofTeaser = () => {
  return (
    <div className="py-20 border-t border-white/5">
      <div className="grid md:grid-cols-2 gap-12 max-w-7xl mx-auto px-6 items-center">
        <div className="relative aspect-video rounded-2xl overflow-hidden glass-card flex items-center justify-center group cursor-pointer border border-white/10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1024&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity" />
          <div className="relative w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play fill="#06b6d4" className="text-cyan-400 ml-1" size={24} />
          </div>
          <div className="absolute bottom-4 left-4">
             <span className="badge text-[9px] uppercase tracking-widest bg-black/60">Galaxy Access: Debut June 2024</span>
          </div>
        </div>
        
        <div>
          <h2 className="font-display text-4xl font-black mb-6">1M+ AI Agents Built</h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            The Hive Mind is expanding. From individual developers to enterprise swarms, our users have deployed over a million autonomous agents across the global edge.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-2xl font-bold text-cyan-400">12ms</div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest">Global Latency</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">99.99%</div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest">System Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
