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
  { id: "writing-assistant", name: "Writing Assistant", tag: "Creative", desc: "Drafts, edits, and improves any text for clarity and tone.", tier: "Pro", price: "$19/mo", rating: 4.8, uses: "978", icon: "✍️" },
  { id: "support-agent", name: "Support Agent", tag: "Support", desc: "24/7 customer support with smart escalation handling.", tier: "Core", price: "$9/mo", rating: 4.6, uses: "543", icon: "🎧" },
  { id: "research-assistant", name: "Research Assistant", tag: "Research", desc: "Finds, summarizes, and analyzes information from the web.", tier: "Core", price: "$15/mo", rating: 4.4, uses: "312", icon: "🔍" },
];

const CATEGORIES = ["All", "Development", "Marketing", "Analytics", "Creative", "Support", "Research"];

export default function MarketplacePage() {
  const router = useRouter();
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");
  const [acquiring, setAcquiring] = useState<string | null>(null);

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

  const filtered = BOTS.filter(bot => {
    const matchCat = active === "All" || bot.tag === active;
    const matchSearch = !search || bot.name.toLowerCase().includes(search.toLowerCase()) || bot.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const tierColor = (tier: string) => {
    if (tier === "Elite") return "badge-orange";
    if (tier === "Pro") return "badge-blue";
    return "badge-gray";
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-2">Marketplace</h1>
          <p className="text-[#71717a]">Browse and deploy pre-built AI agents for your workflow.</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            className="input flex-1"
            placeholder="Search agents..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  active === cat
                    ? "bg-[#f97316] text-black"
                    : "bg-[#1a1a1a] text-[#71717a] hover:text-white hover:bg-[#222]"
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
            <div key={bot.id} className="card p-5 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#f97316]/10 flex items-center justify-center text-2xl">
                  {bot.icon}
                </div>
                <span className={`badge ${tierColor(bot.tier)}`}>{bot.tier}</span>
              </div>

              <h3 className="text-base font-semibold text-white mb-1">{bot.name}</h3>
              <span className="badge badge-gray mb-3 self-start">{bot.tag}</span>
              <p className="text-sm text-[#71717a] mb-4 flex-1">{bot.desc}</p>

              <div className="flex items-center justify-between pt-4 border-t border-[#1a1a1a]">
                <div className="text-xs text-[#555]">
                  <span className="text-[#f97316]">★ {bot.rating}</span> · {bot.uses} users
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-white">{bot.price}</span>
                  <button
                    onClick={() => handleAcquire(bot.id)}
                    disabled={acquiring === bot.id}
                    className="btn btn-primary py-1.5 px-4 text-xs disabled:opacity-50"
                  >
                    {acquiring === bot.id ? "Adding..." : "Add"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#71717a]">No agents found matching your search.</p>
          </div>
        )}

        {/* Credits Section */}
        <div className="mt-16">
          <h2 className="text-xl font-bold text-white mb-6">Buy Credits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { amount: 10, credits: 100, label: "Starter" },
              { amount: 25, credits: 300, label: "Popular", popular: true },
              { amount: 50, credits: 750, label: "Pro" },
            ].map(pkg => (
              <div key={pkg.amount} className={`card p-6 text-center ${pkg.popular ? "border-[#f97316]/40" : ""}`}>
                {pkg.popular && <div className="badge badge-orange mb-3">Most Popular</div>}
                <div className="text-3xl font-bold text-white mb-1">{pkg.credits}</div>
                <div className="text-xs text-[#71717a] mb-2">{pkg.label} Pack</div>
                <div className="text-xl font-bold text-white mb-4">${pkg.amount}</div>
                <button
                  onClick={() => {}}
                  className={`btn w-full text-sm ${pkg.popular ? "btn-primary" : "btn-secondary"}`}
                >
                  Buy Credits
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Custom CTA */}
        <div className="mt-12 card p-8 text-center border-dashed">
          <h2 className="text-xl font-bold text-white mb-2">Need something custom?</h2>
          <p className="text-sm text-[#71717a] mb-4">Build your own agent with custom personality and skills.</p>
          <Link href="/builder" className="btn btn-primary">
            Open Agent Builder
          </Link>
        </div>
      </main>
    </div>
  );
}
