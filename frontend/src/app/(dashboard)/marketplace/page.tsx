"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface Bot {
  id: string;
  name: string;
  tag: string;
  desc: string;
  author: string;
  rating: number;
  uses: string;
  avatar: string;
}

const BOTS: Bot[] = [
  { id: "code-champion", name: "Code Champion", tag: "DEV", desc: "Elite pair programmer. Debugs, reviews, and writes production code in any language.", author: "LiTTreeLabStudios", rating: 4.9, uses: "1.2k", avatar: "👨‍💻" },
  { id: "social-dominator", name: "Social Dominator", tag: "SOCIAL", desc: "Manages your online presence. Writes posts, engages followers, grows your brand 24/7.", author: "LiTTreeLabStudios", rating: 4.7, uses: "856", avatar: "🎭" },
  { id: "data-slayer", name: "Data Slayer", tag: "DATA", desc: "Upload any dataset. Get charts, insights, and predictions in seconds.", author: "LiTTreeLabStudios", rating: 4.5, uses: "634", avatar: "📊" },
  { id: "writing-coach", name: "Writing Coach", tag: "CREATIVE", desc: "Improve anything you write. Essays, emails, tweets, docs.", author: "LiTTreeLabStudios", rating: 4.8, uses: "978", avatar: "✍️" },
  { id: "support-agent", name: "Support Agent", tag: "SUPPORT", desc: "24/7 customer support. Handles tickets and escalations with human-level empathy.", author: "Community", rating: 4.6, uses: "543", avatar: "🎧" },
  { id: "trading-oracle", name: "Trading Oracle", tag: "FINANCE", desc: "Analyzes markets, spots trends, alerts on opportunities. Smart signals, not financial advice.", author: "Community", rating: 4.3, uses: "412", avatar: "📈" },
];

const CATEGORIES = ["ALL", "DEV", "SOCIAL", "DATA", "CREATIVE", "SUPPORT", "FINANCE"];
const TAG_COLORS: Record<string, string> = {
  DEV: "blue", SOCIAL: "purple", DATA: "amber", CREATIVE: "cyan",
  SUPPORT: "green", FINANCE: "emerald",
};

const schemaData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "LiTTreeLabStudios Agent Marketplace",
  description: "A collection of AI agents available for deployment.",
  numberOfItems: BOTS.length,
  itemListElement: BOTS.map((bot, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    item: {
      "@type": "SoftwareApplication",
      name: bot.name,
      applicationCategory: "AI Agent",
      operatingSystem: "Web",
      description: bot.desc,
      author: { "@type": "Organization", name: bot.author },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: bot.rating,
        reviewCount: bot.uses.replace(/[^\d]/g, ""),
      },
    },
  })),
};

export default function MarketplacePage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [active, setActive] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = BOTS.filter((bot) => {
    const matchCat = active === "ALL" || bot.tag === active;
    const matchSearch =
      !search ||
      bot.name.toLowerCase().includes(search.toLowerCase()) ||
      bot.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-cyber-bg text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-28">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">
            Marketplace
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Bot <span className="gradient-text">Forge</span>
          </h1>
          <p className="text-zinc-400 font-medium text-sm max-w-xl mx-auto">
            Browse and deploy ready-made AI agents. Each one is built and tested by the LiTTreeLabStudios team.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">🔍</span>
            <input
              className="input pl-10 w-full"
              placeholder="Search agents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                  active === cat
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-white/5 text-zinc-500 border border-white/10 hover:text-white"
                }`}
                data-agent-action={`filter-${cat}`}
                data-testid={`marketplace-filter-${cat}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-zinc-400 mb-2">No agents found</h3>
            <p className="text-sm text-zinc-600">Try a different search or category.</p>
          </div>
        ) : (
          <div className={`grid gap-4 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {filtered.map((bot) => (
              <Link
                key={bot.id}
                href={`/gallery/${bot.id}`}
                className={`relative rounded-2xl border border-white/10 bg-white/3 p-6 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all group shadow-lg ${view === "list" ? "flex items-center gap-6" : ""}`}
                aria-label={`View details for ${bot.name}`}
                data-agent-action={bot.id}
                data-testid={`marketplace-bot-${bot.id}`}
              >
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/20 uppercase tracking-widest shadow-sm">
                  {bot.tag}
                </span>
                <div className={`flex items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:scale-105 transition-transform ${view === "list" ? "w-14 h-14 text-2xl" : "w-16 h-16 text-4xl mb-4"}`}>
                  {bot.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-bold text-white truncate">{bot.name}</h3>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-3 line-clamp-2">{bot.desc}</p>
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>★ {bot.rating}</span>
                    <span>{bot.uses} uses</span>
                    <span>by <span className="font-bold text-blue-400">{bot.author}</span></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 rounded-xl border border-white/10 bg-white/2 p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Need something custom?</h2>
          <p className="text-zinc-500 text-sm mb-4">Build your own AI agent with custom personality, skills, and integrations.</p>
          <Link href="/builder" className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors">
            Open Agent Builder →
          </Link>
        </div>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    </div>
  );
}
