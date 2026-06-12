"use client";

import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { Shield, Share2, MessageSquare, Zap, Globe, Music } from "lucide-react";

export default function Footer() {
  const { resolvedColors: T } = useTheme();

  return (
    <footer
      className="border-t mt-auto relative z-10"
      style={{
        borderColor: T.borderColor + "40",
        backgroundColor: T.boxBg + "cc",
        color: T.textColor,
        fontFamily: "monospace",
        backdropFilter: "blur(12px)"
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6 group cursor-pointer">
              <Zap size={24} style={{ color: T.accentColor }} className="group-hover:animate-pulse" />
              <span className="font-display font-black text-xl uppercase tracking-tighter" style={{ color: T.headerColor }}>
                LiTree Lab&apos;s
              </span>
            </div>
            <p className="text-xs text-white/40 leading-relaxed max-w-xs mb-6 uppercase tracking-wide">
              The Hive Mind Orchestration Platform. Building autonomous agent swarms across the global edge since 2024.
            </p>
            <div className="flex gap-4">
               <a href="https://litlabs.net" target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-colors">
                  <Globe size={16} className="text-cyan-400" />
               </a>
               <div className="p-2 rounded bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-colors">
                  <MessageSquare size={16} className="text-cyan-400" />
               </div>
               <a href="https://open.spotify.com/user/31qrpfn62mbpjdz32mbnbpwiwad4?si=jp4WImbgQZGKjlMpigyfCw" target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-colors" title="The Architect's Spotify">
                  <Music size={16} className="text-cyan-400" />
               </a>
               <div className="p-2 rounded bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-colors">
                  <Share2 size={16} className="text-cyan-400" />
               </div>
            </div>
          </div>

          <div>
            <h4 className="font-display text-[10px] font-bold uppercase tracking-[0.3em] mb-6" style={{ color: T.accentColor }}>Core Nodes</h4>
            <ul className="space-y-4 text-xs">
              <li><Link href="/builder" className="text-white/50 hover:text-cyan-400 transition-colors">Agent Builder</Link></li>
              <li><Link href="/marketplace" className="text-white/50 hover:text-cyan-400 transition-colors">Marketplace</Link></li>
              <li><Link href="/image-generator" className="text-white/50 hover:text-cyan-400 transition-colors">Imaging Lab</Link></li>
              <li><Link href="/demo" className="text-white/50 hover:text-cyan-400 transition-colors">Sandbox Demo</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-[10px] font-bold uppercase tracking-[0.3em] mb-6" style={{ color: T.accentColor }}>System</h4>
            <ul className="space-y-4 text-xs">
              <li><Link href="/docs" className="text-white/50 hover:text-cyan-400 transition-colors">Documentation</Link></li>
              <li><Link href="/status" className="text-white/50 hover:text-cyan-400 transition-colors text-green-400 flex items-center gap-2">System Status <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" /></Link></li>
              <li><Link href="/team" className="text-white/50 hover:text-cyan-400 transition-colors">The Architects</Link></li>
              <li><Link href="/blog" className="text-white/50 hover:text-cyan-400 transition-colors">Neural Log</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-[10px] font-bold uppercase tracking-[0.3em] mb-6" style={{ color: T.accentColor }}>Protocol</h4>
            <ul className="space-y-4 text-xs">
              <li><Link href="/privacy" className="text-white/50 hover:text-cyan-400 transition-colors">Privacy Shield</Link></li>
              <li><Link href="/terms" className="text-white/50 hover:text-cyan-400 transition-colors">Terms of Link</Link></li>
              <li><Link href="/cookies" className="text-white/50 hover:text-cyan-400 transition-colors">Data Cookies</Link></li>
              <li className="flex items-center gap-2 pt-2">
                 <Shield size={14} className="text-white/20" />
                 <span className="text-[10px] text-white/20 font-bold tracking-widest uppercase">SOC 2 TYPE II</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-white/20 uppercase tracking-widest">
           <div>© {new Date().getFullYear()} LiTTree Lab Studios · All sequences encrypted</div>
           <div className="flex items-center gap-4">
              <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-cyan-400" /> LATENCY: 12ms</span>
              <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-cyan-400" /> UPTIME: 99.99%</span>
              <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-cyan-400" /> BLESSED STATE: ACTIVE</span>
           </div>
        </div>
      </div>
    </footer>
  );
}
