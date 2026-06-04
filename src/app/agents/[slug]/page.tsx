"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

const NavAuth = dynamic(
  () => import("@/components/ClerkAuth").then(m => ({ default: m.NavAuth })),
  { ssr: false }
);

const theme = {
  bgColor: "#0a0a0f",
  textColor: "#00ff41",
  linkColor: "#ff0080",
  headerColor: "#00ffff",
  borderColor: "#ff00ff",
  accentColor: "#ffff00",
  boxBg: "#1a0a2e",
};

type Agent = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  avatar_url: string;
  system_prompt: string;
  personality: string;
  price_cents: number;
  features: string[];
};

export default function AgentDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchAgent();
    }
  }, [slug]);

  async function fetchAgent() {
    try {
      const res = await fetch(`/api/agents/${slug}`);
      const data = await res.json();
      
      if (data.agent) {
        setAgent(data.agent);
        checkIfInstalled(data.agent.id);
      }
    } catch (error) {
      console.error("Error fetching agent:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function checkIfInstalled(agentId: string) {
    try {
      const res = await fetch("/api/user-agents");
      const data = await res.json();
      
      if (data.agents) {
        const installed = data.agents.some((ua: { agent_id: string }) => ua.agent_id === agentId);
        setIsInstalled(installed);
      }
    } catch (error) {
      console.error("Error checking installation:", error);
    }
  }

  async function installAgent() {
    if (!agent) return;
    
    try {
      const res = await fetch("/api/user-agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ agentId: agent.id }),
      });

      if (res.ok) {
        setIsInstalled(true);
      }
    } catch (error) {
      console.error("Error installing agent:", error);
    }
  }

  function formatPrice(cents: number): string {
    if (cents === 0) return "FREE";
    return `$${(cents / 100).toFixed(0)}/mo`;
  }

  if (isLoading) {
    return (
      <div style={{ backgroundColor: theme.bgColor, minHeight: "100vh", padding: "20px" }}>
        <div className="text-center" style={{ color: theme.textColor }}>
          Loading agent...
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div style={{ backgroundColor: theme.bgColor, minHeight: "100vh", padding: "20px" }}>
        <div className="text-center" style={{ color: theme.textColor }}>
          Agent not found
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: theme.bgColor, minHeight: "100vh", padding: "20px" }}>
      {/* Header */}
      <div className="myspace-box mb-6" style={{ borderColor: theme.borderColor, backgroundColor: theme.boxBg }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{agent.avatar_url}</span>
            <div>
              <h1 style={{ color: theme.headerColor, fontSize: "24px", fontWeight: "bold" }}>
                {agent.name.toUpperCase()}
              </h1>
              <p style={{ color: theme.textColor, fontSize: "12px" }}>
                {agent.category.toUpperCase()} AGENT
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <NavAuth linkColor={theme.linkColor} />
            <Link 
              href="/marketplace" 
              style={{ color: theme.linkColor, fontSize: "12px" }}
              className="hover:underline"
            >
              ← Back to Marketplace
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Agent Info */}
        <div className="lg:col-span-2">
          <div className="myspace-box mb-4" style={{ borderColor: theme.borderColor, backgroundColor: theme.boxBg }}>
            <div className="myspace-header" style={{ color: "white" }}>📋 ABOUT</div>
            <div className="p-4">
              <p style={{ color: theme.textColor, lineHeight: "1.6", marginBottom: "20px" }}>
                {agent.description}
              </p>
              
              <div className="mb-4">
                <h4 style={{ color: theme.headerColor, fontSize: "12px", marginBottom: "8px" }}>
                  PERSONALITY
                </h4>
                <p style={{ color: theme.textColor, fontSize: "11px" }}>
                  {agent.personality}
                </p>
              </div>

              {agent.features && agent.features.length > 0 && (
                <div>
                  <h4 style={{ color: theme.headerColor, fontSize: "12px", marginBottom: "8px" }}>
                    ✨ FEATURES
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {agent.features.map((feature, i) => (
                      <div 
                        key={i}
                        className="p-2 text-xs"
                        style={{ 
                          backgroundColor: "rgba(0,255,65,0.1)", 
                          border: `1px solid ${theme.textColor}`,
                          color: theme.textColor
                        }}
                      >
                        ✓ {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Demo Chat Preview */}
          <div className="myspace-box" style={{ borderColor: theme.borderColor, backgroundColor: theme.boxBg }}>
            <div className="myspace-header" style={{ color: "white" }}>💬 TRY DEMO</div>
            <div className="p-4">
              <div className="mb-4 p-3" style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
                <div style={{ color: theme.textColor, fontSize: "11px", marginBottom: "4px" }}>
                  <strong>You:</strong> Can you help me with a project?
                </div>
              </div>
              <div className="p-3" style={{ backgroundColor: "rgba(255,0,128,0.1)" }}>
                <div style={{ color: theme.linkColor, fontSize: "11px", marginBottom: "4px" }}>
                  <strong>{agent.name}:</strong> 
                </div>
                <p style={{ color: theme.textColor, fontSize: "11px" }}>
                  {agent.personality.split(',')[0]}! I'd be happy to help you with your project. 
                  What kind of assistance do you need?
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Purchase Panel */}
        <div className="lg:col-span-1">
          <div className="myspace-box sticky top-4" style={{ borderColor: theme.borderColor, backgroundColor: theme.boxBg }}>
            <div className="p-4 text-center">
              <div 
                className="text-3xl font-bold mb-2"
                style={{ color: agent.price_cents === 0 ? theme.accentColor : theme.headerColor }}
              >
                {formatPrice(agent.price_cents)}
              </div>
              
              {agent.price_cents > 0 && (
                <p style={{ color: theme.textColor, fontSize: "10px", marginBottom: "16px" }}>
                  Billed monthly • Cancel anytime
                </p>
              )}

              {isInstalled ? (
                <Link
                  href="/builder"
                  className="block w-full py-3 text-center font-bold mb-3"
                  style={{ 
                    backgroundColor: theme.accentColor,
                    color: "black",
                    textDecoration: "none"
                  }}
                >
                  🚀 OPEN IN WORKSPACE
                </Link>
              ) : (
                <button
                  onClick={installAgent}
                  className="block w-full py-3 text-center font-bold mb-3"
                  style={{ 
                    backgroundColor: theme.linkColor,
                    color: "white",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  {agent.price_cents === 0 ? "🚀 INSTALL FREE" : "💰 SUBSCRIBE NOW"}
                </button>
              )}

              <div className="text-left mt-4" style={{ color: theme.textColor, fontSize: "10px" }}>
                <div className="mb-2">✓ Included in subscription:</div>
                <ul className="space-y-1 ml-2">
                  <li>• Unlimited conversations</li>
                  <li>• Persistent memory</li>
                  <li>• Priority responses</li>
                  <li>• 24/7 availability</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
