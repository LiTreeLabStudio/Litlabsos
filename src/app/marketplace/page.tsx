"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const NavAuth = dynamic(
  () => import("@/components/ClerkAuth").then(m => ({ default: m.NavAuth })),
  { ssr: false }
);

// Theme presets (same as main app)
const themePresets = {
  cyberpunk: {
    bgColor: "#0a0a0f",
    textColor: "#00ff41",
    linkColor: "#ff0080",
    headerColor: "#00ffff",
    borderColor: "#ff00ff",
    accentColor: "#ffff00",
    boxBg: "#1a0a2e",
  },
};

const theme = themePresets.cyberpunk;

function formatPrice(cents: number): string {
  if (cents === 0) return "FREE";
  return `$${(cents / 100).toFixed(0)}/mo`;
}

type Agent = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  avatar_url: string;
  price_cents: number;
  features: string[];
  is_featured: boolean;
  personality: string;
};

export default function Marketplace() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [featuredAgents, setFeaturedAgents] = useState<Agent[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [installedAgents, setInstalledAgents] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
    fetchInstalledAgents();
  }, [selectedCategory]);

  async function fetchAgents() {
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append("category", selectedCategory);
      
      const res = await fetch(`/api/agents?${params}`);
      const data = await res.json();
      
      if (data.agents) {
        setAgents(data.agents);
        setFeaturedAgents(data.agents.filter((a: Agent) => a.is_featured));
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchInstalledAgents() {
    try {
      const res = await fetch("/api/user-agents");
      const data = await res.json();
      
      if (data.agents) {
        setInstalledAgents(new Set(data.agents.map((ua: { agent_id: string }) => ua.agent_id)));
      }
    } catch (error) {
      console.error("Error fetching installed agents:", error);
    }
  }

  async function installAgent(agentId: string) {
    
    try {
      const res = await fetch("/api/user-agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ agentId }),
      });

      if (res.ok) {
        setInstalledAgents(prev => new Set([...prev, agentId]));
      }
    } catch (error) {
      console.error("Error installing agent:", error);
    }
  }

  if (isLoading) {
    return (
      <div style={{ backgroundColor: theme.bgColor, minHeight: "100vh", padding: "20px" }}>
        <div className="text-center" style={{ color: theme.textColor }}>
          Loading marketplace...
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: theme.bgColor, minHeight: "100vh", padding: "20px" }}>
      {/* Header */}
      <div className="myspace-box mb-6" style={{ borderColor: theme.borderColor, backgroundColor: theme.boxBg }}>
        <div className="flex justify-between items-center">
          <h1 style={{ color: theme.headerColor, fontSize: "24px", fontWeight: "bold" }}>
            🤖 AGENT MARKETPLACE
          </h1>
          <div className="flex gap-4 items-center">
            <NavAuth linkColor={theme.linkColor} />
            <Link 
              href="/builder" 
              style={{ color: theme.linkColor, fontSize: "12px" }}
              className="hover:underline"
            >
              🚀 My Dock
            </Link>
            <Link 
              href="/" 
              style={{ color: theme.linkColor, fontSize: "12px" }}
              className="hover:underline"
            >
              🏠 Home
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Sidebar - Categories */}
        <div className="lg:col-span-1">
          <div className="myspace-box" style={{ borderColor: theme.borderColor, backgroundColor: theme.boxBg }}>
            <div className="myspace-header" style={{ color: "white" }}>📂 CATEGORIES</div>
            <div className="p-2">
              <button
                onClick={() => setSelectedCategory("")}
                className="w-full text-left p-2 mb-1 text-xs"
                style={{ 
                  color: selectedCategory === "" ? theme.accentColor : theme.textColor,
                  backgroundColor: selectedCategory === "" ? "rgba(255,255,255,0.1)" : "transparent"
                }}
              >
                🌟 All Agents
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="w-full text-left p-2 mb-1 text-xs capitalize"
                  style={{ 
                    color: selectedCategory === cat ? theme.accentColor : theme.textColor,
                    backgroundColor: selectedCategory === cat ? "rgba(255,255,255,0.1)" : "transparent"
                  }}
                >
                  {cat === 'developer' && '💻'} 
                  {cat === 'marketing' && '📱'} 
                  {cat === 'analytics' && '📊'} 
                  {cat === 'content' && '✍️'} 
                  {cat === 'general' && '🏆'} 
                  {cat === 'orchestrator' && '🎯'} 
                  {' '}{cat}
                </button>
              ))}
            </div>
          </div>

          <div className="myspace-box mt-4" style={{ borderColor: theme.borderColor, backgroundColor: theme.boxBg }}>
            <div className="myspace-header" style={{ color: "white" }}>🎯 MY DOCK</div>
            <div className="p-2 text-xs" style={{ color: theme.textColor }}>
              <p className="mb-2">You have {installedAgents.size} agents installed</p>
              <Link 
                href="/builder"
                className="block text-center p-2"
                style={{ 
                  backgroundColor: theme.linkColor, 
                  color: "white",
                  textDecoration: "none"
                }}
              >
                🚀 Open Workspace
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Featured Agents */}
          {!selectedCategory && featuredAgents.length > 0 && (
            <div className="myspace-box mb-4" style={{ borderColor: theme.borderColor, backgroundColor: theme.boxBg }}>
              <div className="myspace-header" style={{ color: "white" }}>⭐ FEATURED AGENTS</div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredAgents.map(agent => (
                  <AgentCard 
                    key={agent.id} 
                    agent={agent} 
                    isInstalled={installedAgents.has(agent.id)}
                    onInstall={() => installAgent(agent.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Agents */}
          <div className="myspace-box" style={{ borderColor: theme.borderColor, backgroundColor: theme.boxBg }}>
            <div className="myspace-header" style={{ color: "white" }}>
              {selectedCategory ? `📂 ${selectedCategory.toUpperCase()}` : "🔥 ALL AGENTS"}
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents
                .filter(a => selectedCategory ? true : !a.is_featured)
                .map(agent => (
                <AgentCard 
                  key={agent.id} 
                  agent={agent} 
                  isInstalled={installedAgents.has(agent.id)}
                  onInstall={() => installAgent(agent.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentCard({ 
  agent, 
  isInstalled, 
  onInstall 
}: { 
  agent: Agent; 
  isInstalled: boolean;
  onInstall: () => void;
}) {
  return (
    <div 
      className="p-4"
      style={{ 
        border: `2px solid ${theme.borderColor}`, 
        backgroundColor: "rgba(0,0,0,0.3)"
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-4xl">{agent.avatar_url}</div>
        <div 
          className="px-2 py-1 text-xs font-bold"
          style={{ 
            backgroundColor: agent.price_cents === 0 ? theme.accentColor : theme.headerColor,
            color: "black"
          }}
        >
          {formatPrice(agent.price_cents)}
        </div>
      </div>
      
      <h3 
        className="font-bold mb-1"
        style={{ color: theme.headerColor, fontSize: "14px" }}
      >
        {agent.name}
      </h3>
      
      <p 
        className="text-xs mb-3"
        style={{ color: theme.textColor, lineHeight: "1.4" }}
      >
        {agent.description}
      </p>
      
      {agent.features && agent.features.length > 0 && (
        <div className="mb-3">
          {agent.features.slice(0, 3).map((feature, i) => (
            <span 
              key={i}
              className="inline-block mr-1 mb-1 px-2 py-1 text-xs"
              style={{ 
                backgroundColor: "rgba(255,0,128,0.2)", 
                color: theme.linkColor,
                border: `1px solid ${theme.linkColor}`
              }}
            >
              {feature}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex gap-2">
        <Link
          href={`/agents/${agent.slug}`}
          className="flex-1 text-center py-2 text-xs"
          style={{ 
            border: `2px solid ${theme.linkColor}`,
            color: theme.linkColor,
            textDecoration: "none"
          }}
        >
          👁 Preview
        </Link>
        
        {isInstalled ? (
          <button
            disabled
            className="flex-1 py-2 text-xs"
            style={{ 
              backgroundColor: "#333",
              color: "#666"
            }}
          >
            ✓ Installed
          </button>
        ) : (
          <button
            onClick={onInstall}
            className="flex-1 py-2 text-xs font-bold"
            style={{ 
              backgroundColor: theme.linkColor,
              color: "white",
              border: "none",
              cursor: "pointer"
            }}
          >
            {agent.price_cents === 0 ? "🚀 Install" : "💰 Buy"}
          </button>
        )}
      </div>
    </div>
  );
}
