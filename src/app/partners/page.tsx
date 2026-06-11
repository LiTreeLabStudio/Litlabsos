"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { Users, Handshake, Globe, TrendingUp, DollarSign, Rocket } from "lucide-react";

export default function PartnersPage() {
  const { resolvedColors: T } = useTheme();

  const benefits = [
    { icon: <DollarSign className="text-green-400" />, title: "20% Recurring Commission", desc: "Earn for every month your referrals stay active on Galaxy or Universe plans." },
    { icon: <Handshake className="text-cyan-400" />, title: "Marketplace Listing Perks", desc: "Partners get featured slots for their custom agents in the global marketplace." },
    { icon: <TrendingUp className="text-orange-400" />, title: "Early Beta Access", desc: "Be the first to test new gemini-2.5-flash capabilities and orchestration hooks." },
  ];

  return (
    <div style={{ backgroundColor: T.bgColor, minHeight: "100vh", color: T.textColor, fontFamily: "monospace" }}>
      <div className="max-w-6xl mx-auto px-6 py-20">
        <header className="text-center mb-20">
          <p className="section-eyebrow" style={{ justifyContent: "center", marginBottom: "16px" }}>Scale With the Hive</p>
          <h1 className="font-display text-5xl font-black mb-6 uppercase tracking-tight">Partner Program</h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed">
            Join the LiTTree Lab ecosystem. Build, refer, and earn as we decentralize AI intelligence across the edge.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {benefits.map((b, i) => (
            <div key={i} className="glass-card p-8 rounded-3xl border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6">
                {b.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{b.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>

        <section className="glass-card rounded-3xl border border-white/5 p-12 mb-20">
           <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                 <h2 className="font-display text-3xl font-bold mb-6">Become an Affiliate</h2>
                 <p className="text-white/60 mb-6 leading-relaxed">
                   Are you a creator, developer, or agency? Share LitLabs with your audience and earn substantial recurring revenue. Our attribution window is 60 days, giving you the best chance to convert.
                 </p>
                 <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                       <Rocket size={18} className="text-cyan-400" />
                       <span className="text-sm font-bold uppercase tracking-widest">Instant Approval</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <Globe size={18} className="text-cyan-400" />
                       <span className="text-sm font-bold uppercase tracking-widest">Global Payouts</span>
                    </div>
                 </div>
                 <Link href="/sign-up" className="btn btn-primary px-8 py-3 font-bold uppercase">Apply Now</Link>
              </div>
              <div className="bg-black/40 rounded-2xl p-6 border border-white/5">
                 <div className="text-[10px] font-mono text-cyan-400 mb-4 uppercase tracking-[0.3em]">Affiliate_Dashboard_Preview</div>
                 <div className="space-y-4">
                    <div className="h-2 w-3/4 bg-white/5 rounded" />
                    <div className="h-2 w-1/2 bg-white/5 rounded" />
                    <div className="grid grid-cols-2 gap-4 mt-6">
                       <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                          <div className="text-[10px] text-white/40 uppercase mb-1">Referrals</div>
                          <div className="text-xl font-bold text-cyan-400">142</div>
                       </div>
                       <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                          <div className="text-[10px] text-white/40 uppercase mb-1">Earnings</div>
                          <div className="text-xl font-bold text-green-400">$2,410</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}
