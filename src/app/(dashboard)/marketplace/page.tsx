"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

interface Bot {
  id: string;
  name: string;
  tag: string;
  desc: string;
  tier: "ELITE" | "PRIME" | "CORE";
  price: string;
  rating: number;
  uses: string;
  avatar: string;
}

const BOTS: Bot[] = [
  { id: "code-champion", name: "Code_Champion", tag: "DEV", desc: "Elite pair programmer. Synthesizes, reviews, and refactors production code with 99% precision.", tier: "ELITE", price: "$49", rating: 4.9, uses: "1.2k", avatar: "🧩" },
  { id: "social-dominator", name: "Social_Dominator", tag: "SOCIAL", desc: "Viral growth strategist. Manipulates engagement algorithms and manages brand presence.", tier: "ELITE", price: "$39", rating: 4.7, uses: "856", avatar: "🔥" },
  { id: "data-slayer", name: "Data_Slayer", tag: "DATA", desc: "Neural data architect. Converts raw streams into high-fidelity visual intelligence.", tier: "PRIME", price: "$29", rating: 4.5, uses: "634", avatar: "📊" },
  { id: "writing-coach", name: "Writing_Coach", tag: "CREATIVE", desc: "Linguistic engine. Refines data for maximum clarity and tonal dominance.", tier: "PRIME", price: "$19", rating: 4.8, uses: "978", avatar: "✍️" },
  { id: "support-agent", name: "Support_Node", tag: "SUPPORT", desc: "24/7 resolution engine. Handles complex escalations with neural empathy.", tier: "CORE", price: "$9", rating: 4.6, uses: "543", avatar: "🎧" },
  { id: "trading-oracle", name: "Trading_Oracle", tag: "FINANCE", desc: "Market signal analyzer. Spot trends and anomalous neural trading patterns.", tier: "ELITE", price: "$99", rating: 4.3, uses: "412", avatar: "📈" },
];

const CATEGORIES = ["ALL", "DEV", "SOCIAL", "DATA", "CREATIVE", "SUPPORT", "FINANCE"];

export default function MarketplacePage() {
  const router = useRouter();
  const [active, setActive] = useState("ALL");
  const [search, setSearch] = useState("");
  const [acquiring, setAcquiring] = useState<string | null>(null);

  const handleAcquire = async (agentId: string) => {
    setAcquiring(agentId);
    try {
      // Simulate neural acquisition
      await new Promise(r => setTimeout(r, 1500));
      router.push(`/chat?acquired=${agentId}`);
    } catch (err) {
      console.error("Acquisition error:", err);
    } finally {
      setAcquiring(null);
    }
  };

  const filtered = BOTS.filter((bot) => {
    const matchCat = active === "ALL" || bot.tag === active;
    const matchSearch =
      !search ||
      bot.name.toLowerCase().includes(search.toLowerCase()) ||
      bot.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden hud-scanlines">
      {/* Background FX */}
      <div className="absolute inset-0 hud-grid opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#f9731608,transparent_50%)]" />
      
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-32 relative z-10">
        <div className="mb-20 text-center">
          <div className="inline-block px-4 py-1 bg-orange-500/10 border border-orange-500/30 text-[10px] font-black text-orange-500 uppercase tracking-[0.5em] mb-8 animate-pulse shadow-[0_0_15px_rgba(249,115,22,0.1)]">
            NEXUS_DEPLOYMENT_CORE // V3.5
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-[0.1em] font-heading text-white mb-6 italic glow-text-orange">
            Bot_Forge
          </h1>
          <p className="text-zinc-600 font-black text-[11px] uppercase tracking-[0.6em] max-w-xl mx-auto leading-relaxed">
            Acquire_Elite_Specialized_Nodes_To_Scale_Fleet_Intelligence
          </p>
        </div>

        {/* Filters */}
        <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between border-b border-white/5 pb-12">
          <div className="relative w-full lg:max-w-lg group">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-orange-500 transition-colors">🔍</span>
            <input
              className="w-full bg-zinc-950/50 border-2 border-orange-500/10 rounded-none px-14 py-5 text-sm text-white focus:outline-none focus:border-orange-500/50 placeholder:text-zinc-900 transition-all font-mono"
              placeholder="SEARCH_NEURAL_ARCHIVES..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-8 py-3 rounded-none text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 ${
                  active === cat
                    ? "bg-orange-600 border-orange-500 text-black shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                    : "bg-transparent text-zinc-700 border-white/5 hover:border-orange-500/30 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filtered.map((bot) => (
            <div
              key={bot.id}
              className="card-cyber p-10 flex flex-col group"
            >
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-orange-500/30 group-hover:border-orange-500 transition-colors" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-orange-500/30 group-hover:border-orange-500 transition-colors" />

              <div className="flex justify-between items-start mb-10">
                <div className={`w-16 h-16 rounded-none bg-zinc-900 border border-white/5 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-all duration-500 bg-black/60 group-hover:border-orange-500/20`}>
                  {bot.avatar}
                </div>
                <div className="text-right">
                  <div className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${
                    bot.tier === 'ELITE' ? 'text-red-500 glow-text-orange' : bot.tier === 'PRIME' ? 'text-orange-500 glow-text-orange' : 'text-zinc-600'
                  }`}>
                    TIER_{bot.tier}
                  </div>
                  <div className="text-2xl font-black text-white font-mono tabular-nums tracking-tighter">{bot.price}</div>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white font-mono mb-4 group-hover:text-orange-500 transition-colors">
                  {bot.name}
                </h3>
                <p className="text-[11px] text-zinc-500 font-bold uppercase leading-loose mb-10 opacity-70 group-hover:opacity-100 transition-opacity">
                  {bot.desc}
                </p>
              </div>
              
              <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5">
                <div className="flex gap-6 text-[10px] font-black text-zinc-800 uppercase tracking-widest">
                  <span>★ {bot.rating}</span>
                  <span>{bot.uses} LINKS</span>
                </div>
                <button
                  onClick={() => handleAcquire(bot.id)}
                  disabled={acquiring === bot.id}
                  className="text-[10px] font-black text-orange-500 hover:text-white transition-colors uppercase tracking-[0.2em] flex items-center gap-3 group/btn"
                >
                  {acquiring === bot.id ? "SYNCING..." : "INITIALIZE"}
                  <span className="group-hover/btn:translate-x-2 transition-transform">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Forge Banner */}
        <div className="mt-24 card-cyber p-16 bg-orange-600/[0.02] border-dashed border-2 border-orange-500/10 text-center relative overflow-hidden group">
          <div className="absolute inset-0 hud-grid opacity-[0.03]" />
          <h2 className="text-3xl font-black uppercase tracking-[0.4em] mb-6 text-white relative z-10 glow-text-orange italic">CONSTRUCT_CUSTOM_NODE?</h2>
          <p className="text-zinc-600 text-xs font-bold uppercase tracking-[0.3em] mb-12 max-w-lg mx-auto relative z-10 leading-loose">
            Access_The_Agent_Forge_To_Build_Unique_Behavior_Directives
          </p>
          <Link 
            href="/builder" 
            className="btn-cyber btn-cyber-primary py-4 px-12 tracking-[0.3em] relative z-10"
          >
            OPEN_AGENT_FORGE
          </Link>
        </div>
      </main>
    </div>
  );
}
