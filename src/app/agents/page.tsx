"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { useClerkAuth } from "@/hooks/useClerkAuth";
import PageShell from "@/components/PageShell";
import { Bot, Search, Loader2, ArrowRight } from "lucide-react";

interface Agent {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  role: string;
  status: string;
  is_featured: boolean;
  price_cents: number;
  model: string;
  created_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  all: "All Agents",
  orchestrator: "Orchestrators",
  general: "General Purpose",
  developer: "Developers",
  marketing: "Marketing",
  analytics: "Analytics",
  content: "Content",
  music: "Music",
  design: "Design",
  "smart home manager": "Home",
};

type AgentTheme = ReturnType<typeof useTheme>["resolvedColors"];

function AgentCard({ agent, theme: T }: { agent: Agent; theme: AgentTheme }) {
  const isOnline = agent.status === "online";
  return (
    <Link
      href={`/agents/${agent.slug}`}
      className="group relative flex flex-col h-full overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        borderColor: T.borderColor + "40",
        backgroundColor: T.boxBg + "80",
      }}
    >
      <div className="p-6 space-y-4 flex-1">
        <div className="flex items-start justify-between">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner transition-transform duration-500 group-hover:scale-110"
            style={{
              backgroundColor: T.accentColor + "15",
              border: `1px solid ${T.accentColor}30`,
            }}
          >
            🤖
          </div>
          <div className="flex flex-col items-end gap-1">
            {agent.is_featured && (
              <span
                className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border"
                style={{
                  color: T.accentColor,
                  borderColor: T.accentColor + "30",
                  backgroundColor: T.accentColor + "10",
                }}
              >
                Core
              </span>
            )}
            <div className="flex items-center gap-1 text-xs font-bold opacity-60">
              <div
                className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-500"}`}
              />
              {isOnline ? "Online" : "Offline"}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-black tracking-tight group-hover:text-[var(--accent-color)] transition-colors">
            {agent.name}
          </h3>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40">
            <span style={{ color: T.accentColor }}>{agent.category}</span>
            <span>•</span>
            <span>{agent.model}</span>
          </div>
          <p className="text-sm opacity-60 leading-relaxed line-clamp-3 group-hover:opacity-100 transition-opacity">
            {agent.description}
          </p>
        </div>
      </div>

      <div
        className="p-4 border-t flex items-center justify-between mt-auto"
        style={{ borderColor: T.borderColor + "30" }}
      >
        <span className="text-xs font-bold opacity-50">
          {agent.price_cents === 0 ? "Free" : `${agent.price_cents} LBC`}
        </span>
        <span
          className="flex items-center gap-1 text-xs font-bold transition-all group-hover:translate-x-1"
          style={{ color: T.accentColor }}
        >
          Chat <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}

export default function AgentsListingPage() {
  const { resolvedColors: T } = useTheme();
  const { isLoaded } = useClerkAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [categories, setCategories] = useState<string[]>(["all"]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/agents")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load agents");
        const data = await res.json();
        setAgents(data.agents || []);
        setCategories(data.categories || ["all"]);
      })
      .catch((err) => {
        setError(err.message || "Could not load agents");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesCategory =
        selectedCategory === "all" ||
        agent.category === selectedCategory ||
        agent.role.toLowerCase() === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [agents, selectedCategory, searchQuery]);

  if (!isLoaded || loading) {
    return (
      <PageShell title="Agents">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2
              className="animate-spin mx-auto mb-4"
              size={32}
              style={{ color: T.accentColor }}
            />
            <div className="text-sm font-bold opacity-60">
              Loading agents...
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Agents">
      <div className="min-h-[calc(100vh-8rem)] max-w-[1600px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                backgroundColor: T.accentColor + "15",
                border: `1px solid ${T.accentColor}30`,
              }}
            >
              <Bot size={24} style={{ color: T.accentColor }} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                Agent Directory
              </h1>
              <p className="text-sm opacity-60">
                Browse, install, and chat with every AI agent in the ecosystem.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40"
              size={18}
            />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border text-sm font-bold focus:outline-none focus:ring-2"
              style={{ borderColor: T.borderColor + "40" }}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${selectedCategory === cat ? "ring-2" : "opacity-60 hover:opacity-100"}`}
                style={{
                  borderColor: T.borderColor + "40",
                  backgroundColor:
                    selectedCategory === cat
                      ? T.accentColor + "15"
                      : "transparent",
                  color: selectedCategory === cat ? T.accentColor : undefined,
                }}
              >
                {CATEGORY_LABELS[cat] || cat}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="rounded-2xl border p-6 mb-8 text-center"
            style={{
              borderColor: "#ef4444" + "40",
              backgroundColor: "#ef4444" + "08",
            }}
          >
            <p className="text-sm font-bold text-red-400">{error}</p>
          </div>
        )}

        {/* Grid */}
        {filteredAgents.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-lg font-bold mb-2">No agents found</h2>
            <p className="text-sm opacity-60">
              Try a different search or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} theme={T} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
