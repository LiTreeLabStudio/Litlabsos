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
  tier: "Elite" | "Pro" | "Core";
  price: string;
  rating: number;
  uses: string;
  icon: string;
}

const BOTS: Bot[] = [
  { id: "code-champion", name: "Code Champion", tag: "Development", desc: "AI pair programmer. Reviews, debugs, and writes production code.", tier: "Elite", price: "$49/mo", rating: 4.9, uses: "1.2k", icon: "💻" },
  { id: "social-assistant", name: "Social Assistant", tag: "Marketing", desc: "Content creation, scheduling, and engagement analytics.", tier: "Elite", price: "$39/mo", rating: 4.7, uses: "856", icon: "📱" },
  { id: "data-analyst", name: "Data Analyst", tag: "Analytics", desc: "Turns raw data into charts, insights, and predictions.", tier: "Pro", price: "$29/mo", rating: 4.5, uses: "634", icon: "📊" },
  { id: "writing-assistant", name: "Writing Assistant", tag: "Creative", desc: "Drafts, edits, and improves text for clarity and tone.", tier: "Pro", price: "$19/mo", rating: 4.8, uses: "978", icon: "✍️" },
  { id: "support-agent", name: "Support Agent", tag: "Support", desc: "24/7 customer support with smart escalation handling.", tier: "Core", price: "$9/mo", rating: 4.6, uses: "543", icon: "🎧" },
  { id: "research-assistant", name: "Research Assistant", tag: "Research", desc: "Finds, summarizes, and analyzes information from the web.", tier: "Core", price: "$15/mo", rating: 4.4, uses: "312", icon: "🔍" },
];

const CATEGORIES = ["All", "Development", "Marketing", "Analytics", "Creative", "Support", "Research"];

export default function MarketplacePage() {
  const router = useRouter();
  const { profile, fetchProfile } = useProfile();
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");
  const [acquiring, setAcquiring] = useState<string | null>(null);
  const [allocating, setAllocating] = useState<number | null>(null);

  const handleAcquire = async (agentId: string) => {
    setAcquiring(agentId);
    try {
      await new Promise(r => setTimeout(r, 1500));
      router.push(`/chat?acquired=${agentId}`);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setAcquiring(null);
    }
  };

  const handleAllocate = async (pkg: { amount: number; coins: number }) => {
    setAllocating(pkg.amount);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: pkg.amount, coins: pkg.coins })
      });
      const data = await res.json();
      if (data.url) router.push(data.url);
      else alert("Checkout error: " + data.error);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setAllocating(null);
    }
  };

  const filtered = BOTS.filter(bot => {
    const matchCat = active === "All" || bot.tag === active;
    const matchSearch = !search || bot.name.toLowerCase().includes(search.toLowerCase()) || bot.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const tierColor = (tier: string) => {
    if (tier === "Elite") return "text-syntax-keyword border-syntax-keyword/30 bg-syntax-keyword/10";
    if (tier === "Pro") return "text-syntax-function border-syntax-function/30 bg-syntax-function/10";
    return "text-zinc-400 border-zinc-600 bg-zinc-800";
  };

  return (
    <div className="min-h-screen bg-ide-bg font-sans">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-12 border-l-2 border-zinc-800 pl-6">
          <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em] mb-2 font-code">BOT_FORGE</div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Marketplace</h1>
          <p className="text-xs font-code text-zinc-500 uppercase tracking-widest">Browse and deploy pre-built logic units.</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            className="input flex-1 font-code text-xs"
            placeholder="Search_Agents..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-colors border ${
                  active === cat
                    ? "bg-zinc-800 text-white border-zinc-600"
                    : "bg-ide-surface text-zinc-500 border-ide-border hover:text-zinc-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(bot => (
            <div key={bot.id} className="bg-ide-surface/40 border border-ide-border p-5 flex flex-col rounded-sm hover:border-zinc-500 transition-colors group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-sm bg-black/40 border border-ide-border flex items-center justify-center text-xl shadow-sm transition-transform group-hover:scale-105">
                  {bot.icon}
                </div>
                <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border rounded-sm ${tierColor(bot.tier)}`}>
                  {bot.tier}
                </span>
              </div>

              <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-2 font-code">{bot.name}</h3>
              <span className="text-[9px] font-code text-zinc-500 uppercase tracking-widest mb-3 self-start border-b border-ide-border pb-1">{bot.tag}</span>
              <p className="text-xs text-zinc-400 font-medium leading-relaxed mb-4 flex-1">{bot.desc}</p>

              <div className="flex items-center justify-between pt-4 border-t border-ide-border">
                <div className="text-[9px] font-code text-zinc-500 uppercase flex flex-col gap-0.5">
                  <span className="text-syntax-string">RAT:{bot.rating}</span>
                  <span>DEP:{bot.uses}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-bold text-white font-code">{bot.price}</span>
                  <button
                    onClick={() => handleAcquire(bot.id)}
                    disabled={acquiring === bot.id}
                    className="btn btn-primary py-1.5 px-4 text-[9px] font-black uppercase tracking-widest disabled:opacity-50"
                  >
                    {acquiring === bot.id ? "SYNCING..." : "ACQUIRE"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-zinc-600 font-code text-xs uppercase tracking-widest">NO_LOGIC_UNITS_FOUND</p>
          </div>
        )}

        {/* Credits Section */}
        <div className="mt-16 pt-12 border-t border-ide-border">
          <div className="mb-8 border-l-2 border-zinc-800 pl-6">
            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em] mb-2 font-code">RESOURCE_ALLOCATION</div>
            <h2 className="text-xl font-bold text-white tracking-tight">Purchase Compute Credits</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { amount: 10, coins: 100, label: "Starter" },
              { amount: 25, coins: 300, label: "Popular", popular: true },
              { amount: 50, coins: 750, label: "Pro" },
            ].map(pkg => (
              <div key={pkg.amount} className={`bg-ide-surface/40 border p-6 text-center rounded-sm transition-colors ${pkg.popular ? "border-zinc-500 bg-ide-surface/80" : "border-ide-border hover:border-zinc-700"}`}>
                {pkg.popular && <div className="text-[9px] font-black text-syntax-keyword uppercase tracking-[0.2em] mb-3">REC_ALLOCATION</div>}
                <div className="text-3xl font-bold text-white mb-1 font-code tracking-tighter">{pkg.coins}</div>
                <div className="text-[10px] font-code text-zinc-500 uppercase tracking-widest mb-4">CRD_PACK</div>
                <div className="text-lg font-bold text-white mb-6 font-code">${pkg.amount}</div>
                <button
                  onClick={() => handleAllocate(pkg)}
                  disabled={allocating === pkg.amount}
                  className={`btn w-full text-[10px] font-black uppercase tracking-widest ${pkg.popular ? "btn-primary" : "btn-secondary"}`}
                >
                  {allocating === pkg.amount ? "ALLOCATING..." : "Allocate"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Custom CTA */}
        <div className="mt-12 bg-ide-surface/20 p-8 text-center border border-dashed border-ide-border rounded-sm">
          <h2 className="text-sm font-bold text-white mb-2 font-code uppercase tracking-widest">REQ_CUSTOM_LOGIC?</h2>
          <p className="text-[10px] font-code text-zinc-500 uppercase tracking-widest mb-6">Forge a daemon with bespoke architecture.</p>
          <Link href="/builder" className="btn btn-secondary border-zinc-600 text-[10px] font-black uppercase tracking-widest">
            Init_Builder
          </Link>
        </div>
      </main>
    </div>
  );
}
