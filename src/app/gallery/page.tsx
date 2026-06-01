"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface Agent {
  id: string;
  name: string;
  tag: string;
  desc: string;
  author: string;
  rating: number;
  uses: string;
  personality: string;
  avatar: string;
}

const AGENTS: Agent[] = [
  {
    id: "code-champion",
    name: "Code Champion",
    tag: "DEV",
    desc: "Elite pair programmer. Debugs, reviews, and writes production code in any language.",
    author: "LiTTreeLabStudios",
    rating: 4.9,
    uses: "1.2k",
    personality: "Sharp, direct, solution-focused.",
    avatar: "👨‍💻",
  },
  {
    id: "social-dominator",
    name: "Social Dominator",
    tag: "SOCIAL",
    desc: "Manages your online presence. Writes posts, engages followers, grows your brand 24/7.",
    author: "LiTTreeLabStudios",
    rating: 4.7,
    uses: "856",
    personality: "Witty, trendy, knows what goes viral.",
    avatar: "🎭",
  },
  {
    id: "data-slayer",
    name: "Data Slayer",
    tag: "DATA",
    desc: "Upload any dataset. Get charts, insights, and predictions in seconds.",
    author: "LiTTreeLabStudios",
    rating: 4.5,
    uses: "634",
    personality: "Analytical, precise, loves patterns.",
    avatar: "📊",
  },
  {
    id: "writing-coach",
    name: "Writing Coach",
    tag: "CREATIVE",
    desc: "Improve anything you write. Essays, emails, tweets, docs. Makes your words hit different.",
    author: "LiTTreeLabStudios",
    rating: 4.8,
    uses: "978",
    personality: "Encouraging, articulate, honest editor.",
    avatar: "✍️",
  },
  {
    id: "support-agent",
    name: "Support Agent",
    tag: "SUPPORT",
    desc: "24/7 customer support. Handles FAQs, tickets, and escalations with human-level empathy.",
    author: "Community",
    rating: 4.6,
    uses: "543",
    personality: "Patient, helpful, never gets frustrated.",
    avatar: "🎧",
  },
  {
    id: "trading-oracle",
    name: "Trading Oracle",
    tag: "FINANCE",
    desc: "Analyzes markets, spots trends, alerts on opportunities. Smart signals, not financial advice.",
    author: "Community",
    rating: 4.3,
    uses: "412",
    personality: "Calculated, calm under pressure.",
    avatar: "📈",
  },
];

const CATEGORIES = ["ALL", "DEV", "SOCIAL", "DATA", "CREATIVE", "SUPPORT", "FINANCE"];
// const TAG_COLORS: Record<string, string> = {
//   DEV: "blue", SOCIAL: "purple", DATA: "amber", CREATIVE: "cyan",
//   SUPPORT: "green", FINANCE: "emerald",
// };

export default function GalleryPage() {
  const [active, setActive] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Agent | null>(null);

  const filtered = AGENTS.filter((a) => {
    const matchCat = active === "ALL" || a.tag === active;
    const matchSearch =
      !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-cyber-bg text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-28">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold text-purple-400 uppercase tracking-[0.2em] mb-4">
            Explore Agents
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Agent <span className="gradient-text">Gallery</span>
          </h1>
          <p className="text-zinc-400 font-medium text-sm max-w-xl mx-auto">
            Discover, preview, and deploy AI agents built by the community and the LiTTreeLabStudios team.
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
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((agent) => (
              <Link
                key={agent.id}
                href={`/gallery/${agent.id}`}
                className="relative rounded-2xl border border-white/10 bg-white/3 p-6 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all group shadow-lg"
                aria-label={`View details for ${agent.name}`}
                data-agent-action={agent.id}
                data-testid={`gallery-agent-${agent.id}`}
              >
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/20 uppercase tracking-widest shadow-sm">
                  {agent.tag}
                </span>
                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-white/5 border border-white/10 text-4xl group-hover:scale-105 transition-transform mb-4">
                  {agent.avatar}
                </div>
                <h3 className="font-bold text-white mb-2">{agent.name}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4 line-clamp-2">{agent.desc}</p>
                <span className="inline-flex items-center gap-1 text-xs text-blue-400 font-bold uppercase tracking-widest group-hover:gap-2 transition-all">
                  View Details →
                </span>
              </Link>
            ))}
          </div>
        )}

        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <div
              className="relative w-full sm:max-w-lg bg-[#12121a] border border-white/10 rounded-t-2xl sm:rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 text-zinc-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                ✕
              </button>

              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-5xl mx-auto mb-4">
                  {selected.avatar}
                </div>
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/20 uppercase tracking-widest mb-2">
                  {selected.tag}
                </span>
                <h2 className="text-2xl font-extrabold text-white">{selected.name}</h2>
                <p className="text-xs text-zinc-500 mt-1">by {selected.author}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                  <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                    What it does
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">{selected.desc}</p>
                </div>
                <div className="rounded-xl bg-blue-500/5 border border-blue-500/10 p-4">
                  <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
                    Personality
                  </div>
                  <p className="text-sm text-white italic">&ldquo;{selected.personality}&rdquo;</p>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="rounded-lg bg-white/5 p-3">
                    <div className="text-zinc-500 mb-1">Rating</div>
                    <div className="text-white font-bold">★ {selected.rating}</div>
                  </div>
                  <div className="rounded-lg bg-white/5 p-3">
                    <div className="text-zinc-500 mb-1">Uses</div>
                    <div className="text-white font-bold">{selected.uses}</div>
                  </div>
                  <div className="rounded-lg bg-white/5 p-3">
                    <div className="text-zinc-500 mb-1">Status</div>
                    <div className="text-green-400 font-bold">Online</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/gallery/${selected.id}`}
                  className="btn-primary flex-1 text-center"
                  data-agent-action={`deploy-${selected.id}`}
                  data-testid={`gallery-deploy-${selected.id}`}
                >
                  Deploy Agent →
                </Link>
                <button
                  onClick={() => setSelected(null)}
                  className="btn-secondary flex-1 text-center"
                  data-agent-action="close-modal"
                  data-testid="gallery-close-modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "LiTTreeLabStudios Agent Gallery",
            description: "A showcase of AI agents and their capabilities.",
            numberOfItems: AGENTS.length,
            itemListElement: AGENTS.map((agent, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              item: {
                "@type": "SoftwareApplication",
                name: agent.name,
                applicationCategory: "AI Agent",
                operatingSystem: "Web",
                description: agent.desc,
                author: { "@type": "Organization", name: agent.author },
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: agent.rating,
                  reviewCount: agent.uses.replace(/[^\d]/g, ""),
                },
              },
            })),
          }),
        }}
      />
    </div>
  );
}
