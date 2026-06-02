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
    <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#f9731608,transparent_50%)]" />
      
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-28 relative z-10">
        <div className="mb-16 text-center">
          <div className="inline-block px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-[9px] font-black text-orange-500 uppercase tracking-[0.4em] mb-6">
            Nexus_Deployment_Module
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-widest text-white mb-4 italic">
            Bot_Forge
          </h1>
          <p className="text-zinc-600 font-bold text-[10px] uppercase tracking-[0.3em] max-w-xl mx-auto">
            Acquire elite specialized nodes to scale your neural network.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-white/5 pb-10">
          <div className="relative w-full lg:max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700">🔍</span>
            <input
              className="w-full bg-zinc-950/50 border border-white/10 rounded-none px-12 py-4 text-sm text-white focus:outline-none focus:border-orange-500/50 placeholder:text-zinc-800 transition-all"
              placeholder="Search_Neural_Archives..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-6 py-2.5 rounded-none text-[10px] font-black uppercase tracking-widest transition-all border ${
                  active === cat
                    ? "bg-orange-600 border-orange-500 text-black shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                    : "bg-transparent text-zinc-600 border-white/5 hover:border-white/20 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((bot) => (
            <div
              key={bot.id}
              className="card p-8 bg-zinc-950/40 border-2 border-white/5 hover:border-orange-500/40 transition-all group relative overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-start mb-8">
                <div className={`w-14 h-14 rounded-none bg-zinc-900 border border-white/10 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform`}>
                  {bot.avatar}
                </div>
                <div className="text-right">
                  <div className={`text-[9px] font-black uppercase tracking-widest mb-1 ${
                    bot.tier === 'ELITE' ? 'text-red-500' : bot.tier === 'PRIME' ? 'text-orange-500' : 'text-zinc-500'
                  }`}>
                    Tier_{bot.tier}
                  </div>
                  <div className="text-xl font-black text-white font-mono tabular-nums">{bot.price}</div>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white font-mono mb-3 group-hover:text-orange-500 transition-colors">
                  {bot.name}
                </h3>
                <p className="text-[11px] text-zinc-500 font-bold uppercase leading-relaxed mb-8">
                  {bot.desc}
                </p>
              </div>
              
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                <div className="flex gap-4 text-[9px] font-black text-zinc-700 uppercase tracking-widest">
                  <span>★ {bot.rating}</span>
                  <span>{bot.uses} Links</span>
                </div>
                <button
                  onClick={() => handleAcquire(bot.id)}
                  disabled={acquiring === bot.id}
                  className="text-[9px] font-black text-orange-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2 group/btn"
                >
                  {acquiring === bot.id ? "SYNCING..." : "Initialize_Acquisition"}
                  <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Forge Banner */}
        <div className="mt-20 card p-12 bg-orange-600/5 border-dashed border-2 border-orange-500/20 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
          <h2 className="text-2xl font-black uppercase tracking-[0.3em] mb-4 text-white relative z-10">Need_Custom_Orchestration?</h2>
          <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest mb-8 max-w-lg mx-auto relative z-10">
            Construct a unique behavior node with the Agent Forge module.
          </p>
          <Link 
            href="/builder" 
            className="inline-block px-10 py-4 bg-orange-600 text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-orange-500 transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)] relative z-10"
          >
            Open_Agent_Forge
          </Link>
        </div>
      </main>
    </div>
  );
}
