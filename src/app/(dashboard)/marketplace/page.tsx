"use client";

import { useState } from "react";
import Link from "next/link";

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
  { id: "code-champion", name: "Code Champion", tag: "DEV", desc: "Elite pair programmer. Debugs, reviews, and writes production code in any language.", author: "LitLabs", rating: 4.9, uses: "1.2k", avatar: "👨‍💻" },
  { id: "social-dominator", name: "Social Dominator", tag: "SOCIAL", desc: "Manages your online presence. Writes posts, engages followers, grows your brand 24/7.", author: "LitLabs", rating: 4.7, uses: "856", avatar: "🎭" },
  { id: "data-slayer", name: "Data Slayer", tag: "DATA", desc: "Upload any dataset. Get charts, insights, and predictions in seconds.", author: "LitLabs", rating: 4.5, uses: "634", avatar: "📊" },
  { id: "writing-coach", name: "Writing Coach", tag: "WRITING", desc: "Improve anything you write. Essays, emails, tweets, docs.", author: "LitLabs", rating: 4.8, uses: "978", avatar: "✍️" },
  { id: "support-agent", name: "Support Agent", tag: "SUPPORT", desc: "24/7 customer support. Handles tickets and escalations with human-level empathy.", author: "Community", rating: 4.6, uses: "543", avatar: "🎧" },
  { id: "trading-oracle", name: "Trading Oracle", tag: "FINANCE", desc: "Analyzes markets, spots trends, alerts on opportunities. Smart signals, not financial advice.", author: "Community", rating: 4.3, uses: "412", avatar: "📈" },
];

const TAG_COLORS: Record<string, string> = {
  DEV: "blue", SOCIAL: "purple", DATA: "amber", WRITING: "cyan", SUPPORT: "green", FINANCE: "emerald",
};

export default function MarketplacePage() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Bot <span className="gradient-text">Forge</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Browse and deploy ready-made AI agents.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white/5 border border-white/10 rounded-lg p-1">
            <button onClick={() => setView("grid")} className={`p-2 rounded-md transition-colors ${view === "grid" ? "bg-blue-600 text-white" : "text-zinc-500 hover:text-white"}`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><rect x="0" y="0" width="7" height="7" rx="1"/><rect x="9" y="0" width="7" height="7" rx="1"/><rect x="0" y="9" width="7" height="7" rx="1"/><rect x="9" y="9" width="7" height="7" rx="1"/></svg>
            </button>
            <button onClick={() => setView("list")} className={`p-2 rounded-md transition-colors ${view === "list" ? "bg-blue-600 text-white" : "text-zinc-500 hover:text-white"}`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><rect x="0" y="0" width="16" height="3" rx="1"/><rect x="0" y="5" width="16" height="3" rx="1"/><rect x="0" y="10" width="16" height="3" rx="1"/></svg>
            </button>
          </div>
          <Link href="/builder" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors">
            + Create Agent
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div className={`grid gap-4 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
        {BOTS.map((bot) => (
          <Link
            key={bot.id}
            href={`/gallery/${bot.id}`}
            className={`rounded-xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 hover:bg-white/[0.05] transition-all group ${view === "list" ? "flex items-center gap-6" : ""}`}
          >
            <div className={`flex shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:scale-105 transition-transform ${view === "list" ? "w-14 h-14 text-2xl" : "w-16 h-16 text-4xl mb-4"}`}>
              {bot.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="font-bold text-white truncate">{bot.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">{bot.tag}</span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed mb-3 line-clamp-2">{bot.desc}</p>
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>★ {bot.rating}</span>
                <span>{bot.uses} uses</span>
                <span>by {bot.author}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Need something custom?</h2>
        <p className="text-zinc-500 text-sm mb-4">Build your own AI agent with custom personality, skills, and integrations.</p>
        <Link href="/builder" className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors">
          Open Agent Builder →
        </Link>
      </div>
    </div>
  );
}
