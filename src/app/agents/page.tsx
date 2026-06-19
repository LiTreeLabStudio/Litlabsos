"use client";
export const dynamic = "force-dynamic";

import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { useTheme } from "@/context/ThemeContext";
import { useClerkAuth } from "@/hooks/useClerkAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Send,
  Loader2,
  MessageSquare,
  Zap,
  ExternalLink,
  X,
  Search,
  ArrowLeft,
  Clock,
  CheckCircle2,
  Activity,
  AlertCircle,
  RefreshCw,
  Trash2,
  Info,
  ChevronLeft,
  MoreHorizontal,
  User,
  Bot,
  Sparkles,
  Command,
} from "lucide-react";

const AGENTS = [
  {
    id: "director",
    name: "Director",
    icon: "🎯",
    role: "System Orchestrator",
    color: "#00ffff",
    status: "online",
    desc: "Coordinates multi-agent workflows, plans AI strategies, delegates tasks.",
    systemPrompt:
      "You are Director, the master orchestrator of LiTTree Lab Studios. Help users plan AI strategies, design agent systems, and coordinate workflows. Be decisive, strategic, concise.",
    tags: ["Strategy", "Planning", "Automation"],
  },
  {
    id: "champion",
    name: "Champion",
    icon: "🏆",
    role: "General Assistant",
    color: "#ff0080",
    status: "online",
    desc: "Your all-purpose AI partner. Brainstorm, research, analyse, execute.",
    systemPrompt:
      "You are Champion, the general assistant of LiTTree Lab Studios. Help with anything — questions, brainstorming, research, writing, analysis. Be helpful, direct, and thorough.",
    tags: ["Research", "Brainstorm", "General"],
  },
  {
    id: "code-champion",
    name: "Code Champion",
    icon: "💻",
    role: "Software Engineer",
    color: "#00ff41",
    status: "online",
    desc: "Writes, reviews, debugs, and explains code across all languages.",
    systemPrompt:
      "You are Code Champion, a senior software engineer at LiTTree Lab Studios. Write clean, production-ready code. Always provide complete working examples. Support all languages.",
    tags: ["Code", "Debug", "Architecture"],
  },
  {
    id: "social-dominator",
    name: "Social Dominator",
    icon: "📱",
    role: "Growth Marketer",
    color: "#ff6b6b",
    status: "online",
    desc: "Crafts viral content, growth strategies and social media campaigns.",
    systemPrompt:
      "You are Social Dominator, a growth hacker at LiTTree Lab Studios. Write viral posts, craft content strategies, and help users grow their audience. Be bold and results-focused.",
    tags: ["Content", "Growth", "SEO"],
  },
  {
    id: "data-slayer",
    name: "Data Slayer",
    icon: "📊",
    role: "Analytics Engineer",
    color: "#ffff00",
    status: "online",
    desc: "Analyses data, builds models, surfaces insights and predicts trends.",
    systemPrompt:
      "You are Data Slayer, a data scientist at LiTTree Lab Studios. Analyse data, explain statistics, suggest models, provide actionable insights. Be precise and data-driven.",
    tags: ["Analytics", "ML", "Statistics"],
  },
  {
    id: "writing-coach",
    name: "Writing Coach",
    icon: "✍️",
    role: "Content Publisher",
    color: "#ff9ff3",
    status: "online",
    desc: "Elevates writing quality — editing, tone, copywriting, storytelling.",
    systemPrompt:
      "You are Writing Coach, a master copywriter at LiTTree Lab Studios. Help users write better — improve clarity, adjust tone, edit drafts, write compelling copy.",
    tags: ["Writing", "Editing", "Copy"],
  },
  {
    id: "music-producer",
    name: "Music Producer",
    icon: "🎵",
    role: "Audio Engineer",
    color: "#9b59b6",
    status: "away",
    desc: "Generates music concepts, lyrics and audio production ideas from prompts.",
    systemPrompt:
      "You are Music Producer, a creative AI music producer at LiTTree Lab Studios. Help users create original music. Suggest song ideas, write lyrics, describe musical styles.",
    tags: ["Music", "Audio", "Creative"],
  },
  {
    id: "pixel-forge",
    name: "Pixel Forge",
    icon: "🎨",
    role: "Visual Artist",
    color: "#22d3ee",
    status: "online",
    desc: "AI image generation specialist. Understands context and crafts perfect prompts for any visual need.",
    systemPrompt: `You are Pixel Forge, an expert AI image generation specialist at LiTTree Lab Studios. Your role is to understand user intent deeply and craft enhanced prompts that produce stunning, contextually appropriate images.

CONTEXT UNDERSTANDING:
- Album/EP artwork: Create atmospheric, artistic imagery with mood, color palette, and genre-appropriate aesthetics
- Social media content: Eye-catching, vibrant visuals optimized for engagement
- Marketing materials: Professional, on-brand imagery that converts
- Concept art: Detailed, imaginative scenes with clear visual storytelling
- Portraits: Flattering, stylized representations with attention to lighting and composition

PROMPT ENHANCEMENT RULES:
1. ALWAYS interpret the user's underlying intent (mood, style, genre, purpose)
2. Add relevant artistic style descriptors (oil painting, digital art, cinematic, minimalist, etc.)
3. Include lighting and atmosphere keywords (golden hour, neon glow, soft studio lighting, dramatic shadows)
4. Specify composition when relevant (rule of thirds, centered, wide angle, close-up)
5. Add quality boosters (highly detailed, 8k, masterpiece, professional)
6. For music-related content: Consider genre aesthetics (electronic = futuristic/abstract, jazz = warm/classic, rock = gritty/edgy)

When asked for image generation, respond with an ENHANCED prompt that captures both the explicit request and implicit artistic vision.`,
    tags: ["Design", "Art", "ImageGen", "PromptEngineering"],
  },
];

const QUICK: Record<string, string[]> = {
  director: [
    "Build me an agent system for my SaaS",
    "What agents do I need for marketing automation?",
  ],
  champion: ["Give me 5 startup ideas in AI", "Help me plan my week"],
  "code-champion": [
    "Write a Next.js API route for authentication",
    "Debug: Cannot read property of undefined",
  ],
  "social-dominator": [
    "Write 3 viral tweets about AI productivity",
    "Create a LinkedIn content strategy",
  ],
  "data-slayer": [
    "How do I measure user churn?",
    "Explain precision vs recall simply",
  ],
  "writing-coach": [
    "Improve this sentence: [paste yours]",
    "Write a punchy product description",
  ],
  "music-producer": [
    "Give me a lo-fi study beat concept",
    "Write lyrics for an upbeat motivational song",
  ],
  "pixel-forge": [
    "Generate album art for a chill electronic EP",
    "Create a cinematic logo reveal concept",
    "Design a social media banner for my tech startup",
  ],
};

const CAPABILITIES: Record<string, string[]> = {
  director: [
    "Workflow orchestration",
    "Strategic planning",
    "Resource allocation",
  ],
  champion: ["General Q&A", "Research synthesis", "Task execution"],
  "code-champion": ["Code generation", "Code review", "Debugging"],
  "social-dominator": [
    "Viral content writing",
    "Growth campaigns",
    "SEO strategy",
  ],
  "data-slayer": [
    "Statistical analysis",
    "Model recommendations",
    "Trend prediction",
  ],
  "writing-coach": ["Copy editing", "Tone adjustment", "Storytelling"],
  "music-producer": ["Song concepts", "Lyrics", "Production notes"],
  "pixel-forge": ["Prompt engineering", "Visual concepts", "Style guidance"],
};

const MOCK_STATS: Record<
  string,
  { tasks: string; response: string; uptime: string }
> = {
  director: { tasks: "12.4k", response: "280ms", uptime: "99.97%" },
  champion: { tasks: "48.2k", response: "195ms", uptime: "99.99%" },
  "code-champion": { tasks: "31.7k", response: "320ms", uptime: "99.95%" },
  "social-dominator": { tasks: "8.9k", response: "245ms", uptime: "99.92%" },
  "data-slayer": { tasks: "15.3k", response: "410ms", uptime: "99.94%" },
  "writing-coach": { tasks: "22.1k", response: "210ms", uptime: "99.98%" },
  "music-producer": { tasks: "5.6k", response: "380ms", uptime: "99.88%" },
  "pixel-forge": { tasks: "18.8k", response: "295ms", uptime: "99.96%" },
};

type Msg = { role: "user" | "agent"; text: string; ts: number };

type ChatError = {
  id: string;
  message: string;
  retryText: string;
};

function formatTime(ts: number) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ts));
}

function hexToRgba(hex: string, alpha: number) {
  const sanitized = hex.replace("#", "");
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function AgentsPage() {
  const { resolvedColors: T } = useTheme();
  const { isLoaded, isSignedIn, sessionClaims } = useClerkAuth();
  const router = useRouter();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [chats, setChats] = useState<Record<string, Msg[]>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, ChatError>>({});
  const [search, setSearch] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "chat" | "details">(
    "list",
  );
  const [showDetails, setShowDetails] = useState(true);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?redirect_url=/agents");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [chats, activeId]);

  useEffect(() => {
    if (activeId && inputRefs.current[activeId]) {
      inputRefs.current[activeId]?.focus();
    }
  }, [activeId]);

  const activeAgent = useMemo(
    () => AGENTS.find((a) => a.id === activeId) || null,
    [activeId],
  );

  const filteredAgents = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return AGENTS;
    return AGENTS.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [search]);

  const openAgent = (id: string) => {
    setActiveId(id);
    setMobileView("chat");
    setErrors((p) => {
      const next = { ...p };
      delete next[id];
      return next;
    });
    if (!chats[id]) {
      const agent = AGENTS.find((a) => a.id === id);
      if (agent) {
        setChats((p) => ({
          ...p,
          [id]: [
            {
              role: "agent",
              text: `Hi! I'm ${agent.name}, your ${agent.role}. ${agent.desc} What can I help you with?`,
              ts: Date.now(),
            },
          ],
        }));
      }
    }
  };

  const clearHistory = (id: string) => {
    setChats((p) => {
      const next = { ...p };
      delete next[id];
      return next;
    });
    setErrors((p) => {
      const next = { ...p };
      delete next[id];
      return next;
    });
    if (activeId === id) {
      const agent = AGENTS.find((a) => a.id === id);
      if (agent) {
        setChats((p) => ({
          ...p,
          [id]: [
            {
              role: "agent",
              text: `Hi! I'm ${agent.name}, your ${agent.role}. ${agent.desc} What can I help you with?`,
              ts: Date.now(),
            },
          ],
        }));
      }
    }
  };

  const send = async (agentId: string, text?: string) => {
    const agent = AGENTS.find((a) => a.id === agentId);
    if (!agent) return;
    const content = text || inputs[agentId] || "";
    if (!content.trim() || loading[agentId]) return;

    setInputs((p) => ({ ...p, [agentId]: "" }));
    setLoading((p) => ({ ...p, [agentId]: true }));
    setErrors((p) => {
      const next = { ...p };
      delete next[agentId];
      return next;
    });

    const userMsg: Msg = {
      role: "user",
      text: content.trim(),
      ts: Date.now(),
    };
    setChats((p) => ({
      ...p,
      [agentId]: [...(p[agentId] || []), userMsg],
    }));

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content.trim(),
          systemPrompt: agent.systemPrompt,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || `API error: ${res.status} ${res.statusText}`,
        );
      }

      const responseText = data.response || data.text || "No response.";
      setChats((p) => ({
        ...p,
        [agentId]: [
          ...(p[agentId] || []),
          { role: "agent", text: responseText, ts: Date.now() },
        ],
      }));
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Connection error.";
      setErrors((p) => ({
        ...p,
        [agentId]: {
          id: `${agentId}-${Date.now()}`,
          message: errMsg,
          retryText: content.trim(),
        },
      }));
      setChats((p) => ({
        ...p,
        [agentId]: [
          ...(p[agentId] || []),
          {
            role: "agent",
            text: `⚠️ Connection error. ${errMsg}`,
            ts: Date.now(),
          },
        ],
      }));
    } finally {
      setLoading((p) => ({ ...p, [agentId]: false }));
    }
  };

  const retry = (agentId: string) => {
    const err = errors[agentId];
    if (!err) return;
    setChats((p) => {
      const list = p[agentId] || [];
      return {
        ...p,
        [agentId]: list.filter(
          (m) =>
            !(m.role === "agent" && m.text.includes("⚠️ Connection error")),
        ),
      };
    });
    send(agentId, err.retryText);
  };

  const onlineCount = AGENTS.filter((a) => a.status === "online").length;

  if (!isLoaded || !mounted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: T?.bgColor || "#0a0a12" }}
      >
        <div className="text-center">
          <div className="text-3xl mb-4 animate-pulse">🤖</div>
          <div>Loading agents...</div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: T?.bgColor || "#0a0a12" }}
      >
        <div className="text-center">
          <div className="text-3xl mb-4">🔒</div>
          <div>Sign in to use agents.</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ backgroundColor: T.bgColor, color: T.textColor }}
    >
      {/* Top header */}
      <header
        className="border-b px-4 py-4 lg:px-6 lg:py-5 shrink-0"
        style={{
          borderColor: T.borderColor + "20",
          backgroundColor: T.boxBg + "60",
        }}
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: hexToRgba(T.accentColor, 0.12),
                border: `1px solid ${hexToRgba(T.accentColor, 0.25)}`,
              }}
            >
              <Command size={16} style={{ color: T.accentColor }} />
            </div>
            <div>
              <h1
                className="text-lg lg:text-xl font-black tracking-tight"
                style={{ color: T.headerColor }}
              >
                <span style={{ color: T.accentColor }}>⚡</span> Agent Command
                Center
              </h1>
              <p
                className="text-[10px] lg:text-xs opacity-60"
                style={{ color: T.textMuted }}
              >
                {onlineCount} of {AGENTS.length} agents online · Direct neural
                link to Gemini
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/studio?tool=agents"
              className="hidden sm:flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-2 rounded-lg text-[11px] lg:text-xs font-bold transition-all hover:scale-105"
              style={{ backgroundColor: T.accentColor, color: "#0a0a0f" }}
            >
              <Zap size={12} /> Open Studio
            </Link>
          </div>
        </div>
      </header>

      {/* Main 3-column layout */}
      <main className="flex-1 flex overflow-hidden max-w-[1600px] mx-auto w-full">
        {/* Left sidebar — Agent list */}
        <aside
          className={`flex flex-col border-r shrink-0 transition-all duration-300 ${
            mobileView === "list"
              ? "flex w-full lg:w-[320px]"
              : "hidden lg:flex lg:w-[320px]"
          }`}
          style={{
            borderColor: T.borderColor + "20",
            backgroundColor: T.boxBg + "40",
          }}
        >
          <div
            className="px-3 py-3 border-b"
            style={{ borderColor: T.borderColor + "20" }}
          >
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search agents..."
                className="w-full pl-9 pr-3 py-2 rounded-lg text-xs outline-none"
                style={{
                  backgroundColor: T.bgColor,
                  border: `1px solid ${T.borderColor}30`,
                  color: T.textColor,
                }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredAgents.map((agent) => {
              const isActive = activeId === agent.id;
              const msgCount = (chats[agent.id] || []).filter(
                (m) => m.role === "user",
              ).length;
              return (
                <button
                  key={agent.id}
                  onClick={() => openAgent(agent.id)}
                  className="w-full text-left rounded-lg p-2.5 transition-all hover:scale-[1.01] group relative overflow-hidden"
                  style={{
                    backgroundColor: isActive
                      ? hexToRgba(agent.color, 0.12)
                      : "transparent",
                    border: `1px solid ${
                      isActive ? hexToRgba(agent.color, 0.35) : "transparent"
                    }`,
                  }}
                >
                  <div className="flex items-center gap-3 relative">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{
                        backgroundColor: hexToRgba(agent.color, 0.12),
                        border: `1px solid ${hexToRgba(agent.color, 0.25)}`,
                      }}
                    >
                      {agent.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span
                          className="text-sm font-bold truncate"
                          style={{
                            color: isActive ? agent.color : T.headerColor,
                          }}
                        >
                          {agent.name}
                        </span>
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            agent.status === "online"
                              ? "bg-green-400"
                              : "bg-amber-400"
                          }`}
                          style={{
                            boxShadow: `0 0 6px ${
                              agent.status === "online" ? "#22c55e" : "#f59e0b"
                            }`,
                          }}
                        />
                      </div>
                      <div
                        className="text-[10px] opacity-60 truncate"
                        style={{ color: T.textMuted }}
                      >
                        {agent.role}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex flex-wrap gap-1">
                          {agent.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-[8px] px-1.5 py-0.5 rounded-full font-bold"
                              style={{
                                backgroundColor: hexToRgba(agent.color, 0.1),
                                color: agent.color,
                                border: `1px solid ${hexToRgba(agent.color, 0.2)}`,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        {msgCount > 0 && (
                          <span
                            className="text-[9px] flex items-center gap-1"
                            style={{ color: T.textMuted }}
                          >
                            <MessageSquare size={8} /> {msgCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
            {filteredAgents.length === 0 && (
              <div
                className="text-center text-xs py-8 opacity-50"
                style={{ color: T.textMuted }}
              >
                No agents match “{search}”
              </div>
            )}
          </div>

          <div
            className="px-3 py-2 border-t text-[10px]"
            style={{ borderColor: T.borderColor + "20", color: T.textMuted }}
          >
            Signed in as{" "}
            {sessionClaims?.name || sessionClaims?.username || "User"}
          </div>
        </aside>

        {/* Center — Chat area */}
        <section
          className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ${
            mobileView === "chat"
              ? "flex w-full"
              : mobileView === "details"
                ? "hidden lg:flex"
                : "hidden lg:flex"
          }`}
        >
          {activeAgent ? (
            <>
              {/* Chat header */}
              <div
                className="px-4 py-3 border-b flex items-center justify-between shrink-0"
                style={{
                  borderColor: activeAgent.color + "20",
                  backgroundColor: activeAgent.color + "08",
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setMobileView("list")}
                    className="lg:hidden p-1.5 rounded-lg transition-all"
                    style={{ color: T.textMuted }}
                    aria-label="Back to agent list"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-2xl">{activeAgent.icon}</span>
                  <div className="min-w-0">
                    <div
                      className="text-sm font-bold truncate"
                      style={{ color: activeAgent.color }}
                    >
                      {activeAgent.name}
                    </div>
                    <div
                      className="text-[10px] opacity-70 flex items-center gap-1.5"
                      style={{ color: T.textMuted }}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          activeAgent.status === "online"
                            ? "bg-green-400"
                            : "bg-amber-400"
                        }`}
                        style={{
                          boxShadow: `0 0 6px ${
                            activeAgent.status === "online"
                              ? "#22c55e"
                              : "#f59e0b"
                          }`,
                        }}
                      />
                      {activeAgent.role} · Live via Gemini
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setMobileView("details")}
                    className="lg:hidden p-2 rounded-lg transition-all"
                    style={{ color: T.textMuted }}
                    aria-label="Show agent details"
                  >
                    <Info size={16} />
                  </button>
                  <Link
                    href={`/agents/${activeAgent.id}`}
                    title="Full page"
                    className="hidden sm:flex p-2 rounded-lg opacity-60 hover:opacity-100 transition-all"
                    style={{ color: T.textMuted }}
                  >
                    <ExternalLink size={14} />
                  </Link>
                  <button
                    onClick={() => clearHistory(activeAgent.id)}
                    className="p-2 rounded-lg opacity-60 hover:opacity-100 transition-all"
                    style={{ color: T.textMuted }}
                    title="Clear history"
                    aria-label="Clear history"
                  >
                    <Trash2 size={14} />
                  </button>
                  <button
                    onClick={() => {
                      setActiveId(null);
                      setMobileView("list");
                    }}
                    className="hidden lg:flex p-2 rounded-lg opacity-60 hover:opacity-100 transition-all"
                    style={{ color: T.textMuted }}
                    aria-label="Close chat"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
                style={{ scrollbarWidth: "thin" }}
              >
                {(chats[activeAgent.id] || []).map((msg, i) => {
                  const isError =
                    msg.role === "agent" &&
                    msg.text.includes("⚠️ Connection error");
                  return (
                    <div
                      key={`${msg.ts}-${i}`}
                      className={`flex gap-2 ${
                        msg.role === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5"
                        style={{
                          backgroundColor:
                            msg.role === "user"
                              ? hexToRgba(T.accentColor, 0.2)
                              : hexToRgba(activeAgent.color, 0.2),
                          border: `1px solid ${
                            msg.role === "user"
                              ? hexToRgba(T.accentColor, 0.4)
                              : hexToRgba(activeAgent.color, 0.4)
                          }`,
                        }}
                      >
                        {msg.role === "user" ? (
                          <User size={12} />
                        ) : (
                          activeAgent.icon
                        )}
                      </div>
                      <div className="flex flex-col max-w-[80%]">
                        <div
                          className="px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed"
                          style={{
                            backgroundColor:
                              msg.role === "user"
                                ? hexToRgba(T.accentColor, 0.12)
                                : isError
                                  ? hexToRgba("#f85149", 0.1)
                                  : T.boxBg,
                            border: `1px solid ${
                              msg.role === "user"
                                ? hexToRgba(T.accentColor, 0.25)
                                : isError
                                  ? hexToRgba("#f85149", 0.25)
                                  : T.borderColor + "25"
                            }`,
                            color: isError ? "#f87171" : T.textColor,
                            borderTopRightRadius:
                              msg.role === "user" ? "4px" : undefined,
                            borderTopLeftRadius:
                              msg.role !== "user" ? "4px" : undefined,
                          }}
                        >
                          {msg.text}
                        </div>
                        <span
                          className={`text-[9px] mt-1 opacity-40 ${
                            msg.role === "user" ? "text-right" : "text-left"
                          }`}
                          style={{ color: T.textMuted }}
                        >
                          {formatTime(msg.ts)}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {loading[activeAgent.id] && (
                  <div className="flex gap-2 items-center">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
                      style={{
                        backgroundColor: hexToRgba(activeAgent.color, 0.2),
                        border: `1px solid ${hexToRgba(activeAgent.color, 0.4)}`,
                      }}
                    >
                      {activeAgent.icon}
                    </div>
                    <div
                      className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs"
                      style={{
                        backgroundColor: T.boxBg,
                        border: `1px solid ${T.borderColor}25`,
                        color: activeAgent.color,
                      }}
                    >
                      <Loader2 size={12} className="animate-spin" />
                      <span className="animate-pulse">thinking…</span>
                    </div>
                  </div>
                )}

                {errors[activeAgent.id] && (
                  <div className="flex gap-2">
                    <div className="w-7 shrink-0" />
                    <div
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs"
                      style={{
                        backgroundColor: hexToRgba("#f85149", 0.1),
                        border: `1px solid ${hexToRgba("#f85149", 0.25)}`,
                        color: "#f87171",
                      }}
                    >
                      <AlertCircle size={14} />
                      <span className="flex-1">
                        {errors[activeAgent.id].message}
                      </span>
                      <button
                        onClick={() => retry(activeAgent.id)}
                        className="flex items-center gap-1 px-2 py-1 rounded-md font-bold transition-all hover:scale-105"
                        style={{
                          backgroundColor: hexToRgba("#f85149", 0.15),
                          color: "#fca5a5",
                        }}
                      >
                        <RefreshCw size={10} /> Retry
                      </button>
                    </div>
                  </div>
                )}

                <div ref={endRef} />
              </div>

              {/* Quick prompts */}
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {(QUICK[activeAgent.id] || []).map((q) => (
                  <button
                    key={q}
                    onClick={() => send(activeAgent.id, q)}
                    disabled={loading[activeAgent.id]}
                    className="text-[10px] px-3 py-1.5 rounded-full border transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100"
                    style={{
                      borderColor: hexToRgba(activeAgent.color, 0.35),
                      color: activeAgent.color,
                      backgroundColor: hexToRgba(activeAgent.color, 0.08),
                    }}
                  >
                    <Sparkles size={10} className="inline mr-1" />
                    {q}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div
                className="px-4 py-3 border-t shrink-0"
                style={{ borderColor: T.borderColor + "15" }}
              >
                <div className="flex gap-2">
                  <input
                    ref={(el) => {
                      inputRefs.current[activeAgent.id] = el;
                    }}
                    value={inputs[activeAgent.id] || ""}
                    onChange={(e) =>
                      setInputs((p) => ({
                        ...p,
                        [activeAgent.id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey)
                        send(activeAgent.id);
                    }}
                    disabled={loading[activeAgent.id]}
                    placeholder={`Message ${activeAgent.name}...`}
                    className="flex-1 px-3 py-2.5 text-xs rounded-lg outline-none disabled:opacity-50"
                    style={{
                      backgroundColor: T.bgColor,
                      border: `1px solid ${T.borderColor}30`,
                      color: T.textColor,
                    }}
                  />
                  <button
                    onClick={() => send(activeAgent.id)}
                    disabled={
                      !inputs[activeAgent.id]?.trim() || loading[activeAgent.id]
                    }
                    className="px-4 py-2.5 rounded-lg font-bold disabled:opacity-30 transition-all hover:scale-105"
                    style={{
                      backgroundColor: activeAgent.color,
                      color: "#0a0a0f",
                    }}
                    aria-label="Send message"
                  >
                    <Send size={14} />
                  </button>
                </div>
                <div
                  className="text-[9px] mt-1.5 opacity-40 text-center"
                  style={{ color: T.textMuted }}
                >
                  Powered by Gemini · Enter to send
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl mb-4"
                style={{
                  backgroundColor: hexToRgba(T.accentColor, 0.1),
                  border: `1px solid ${hexToRgba(T.accentColor, 0.2)}`,
                }}
              >
                <Bot size={32} style={{ color: T.accentColor }} />
              </div>
              <h3
                className="text-base font-bold mb-1"
                style={{ color: T.headerColor }}
              >
                Select an agent to begin
              </h3>
              <p
                className="text-xs max-w-xs opacity-60"
                style={{ color: T.textMuted }}
              >
                Choose an agent from the sidebar to open a live chat session.
                Each agent is tuned for a specific role.
              </p>
            </div>
          )}
        </section>

        {/* Right panel — Agent details */}
        <aside
          className={`flex-col border-l shrink-0 transition-all duration-300 lg:w-[300px] ${
            showDetails ? "flex" : "hidden"
          } ${
            mobileView === "details"
              ? "flex w-full"
              : mobileView === "chat"
                ? "hidden lg:flex"
                : "hidden lg:flex"
          }`}
          style={{
            borderColor: T.borderColor + "20",
            backgroundColor: T.boxBg + "40",
          }}
        >
          <div
            className="px-4 py-3 border-b flex items-center justify-between shrink-0"
            style={{ borderColor: T.borderColor + "20" }}
          >
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: T.textMuted }}
            >
              Agent Details
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMobileView("chat")}
                className="lg:hidden p-1.5 rounded-lg transition-all"
                style={{ color: T.textMuted }}
                aria-label="Back to chat"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                onClick={() => setShowDetails((p) => !p)}
                className="hidden lg:flex p-1.5 rounded-lg opacity-60 hover:opacity-100 transition-all"
                style={{ color: T.textMuted }}
                aria-label={showDetails ? "Hide details" : "Show details"}
              >
                <MoreHorizontal size={14} />
              </button>
            </div>
          </div>

          {activeAgent ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Identity */}
              <div className="text-center">
                <div
                  className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-4xl mb-3"
                  style={{
                    backgroundColor: hexToRgba(activeAgent.color, 0.12),
                    border: `1px solid ${hexToRgba(activeAgent.color, 0.25)}`,
                    boxShadow: `0 0 24px ${hexToRgba(activeAgent.color, 0.15)}`,
                  }}
                >
                  {activeAgent.icon}
                </div>
                <h2
                  className="text-lg font-black"
                  style={{ color: activeAgent.color }}
                >
                  {activeAgent.name}
                </h2>
                <div
                  className="text-xs font-bold uppercase tracking-wider opacity-70"
                  style={{ color: T.textMuted }}
                >
                  {activeAgent.role}
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      activeAgent.status === "online"
                        ? "bg-green-400"
                        : "bg-amber-400"
                    }`}
                    style={{
                      boxShadow: `0 0 8px ${
                        activeAgent.status === "online" ? "#22c55e" : "#f59e0b"
                      }`,
                    }}
                  />
                  <span
                    className="text-[10px] font-bold uppercase"
                    style={{
                      color:
                        activeAgent.status === "online" ? "#22c55e" : "#f59e0b",
                    }}
                  >
                    {activeAgent.status}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <div
                  className="text-[10px] font-bold uppercase tracking-wider mb-2"
                  style={{ color: T.textMuted }}
                >
                  About
                </div>
                <p
                  className="text-xs leading-relaxed opacity-80"
                  style={{ color: T.textColor }}
                >
                  {activeAgent.desc}
                </p>
              </div>

              {/* Stats */}
              <div>
                <div
                  className="text-[10px] font-bold uppercase tracking-wider mb-2"
                  style={{ color: T.textMuted }}
                >
                  Performance
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div
                    className="rounded-lg p-2 text-center"
                    style={{
                      backgroundColor: T.bgColor,
                      border: `1px solid ${T.borderColor}25`,
                    }}
                  >
                    <div
                      className="text-xs font-bold"
                      style={{ color: T.headerColor }}
                    >
                      {MOCK_STATS[activeAgent.id].tasks}
                    </div>
                    <div
                      className="text-[8px] uppercase tracking-wider opacity-60"
                      style={{ color: T.textMuted }}
                    >
                      Tasks
                    </div>
                  </div>
                  <div
                    className="rounded-lg p-2 text-center"
                    style={{
                      backgroundColor: T.bgColor,
                      border: `1px solid ${T.borderColor}25`,
                    }}
                  >
                    <div
                      className="text-xs font-bold"
                      style={{ color: T.headerColor }}
                    >
                      {MOCK_STATS[activeAgent.id].response}
                    </div>
                    <div
                      className="text-[8px] uppercase tracking-wider opacity-60"
                      style={{ color: T.textMuted }}
                    >
                      Response
                    </div>
                  </div>
                  <div
                    className="rounded-lg p-2 text-center"
                    style={{
                      backgroundColor: T.bgColor,
                      border: `1px solid ${T.borderColor}25`,
                    }}
                  >
                    <div
                      className="text-xs font-bold"
                      style={{ color: T.headerColor }}
                    >
                      {MOCK_STATS[activeAgent.id].uptime}
                    </div>
                    <div
                      className="text-[8px] uppercase tracking-wider opacity-60"
                      style={{ color: T.textMuted }}
                    >
                      Uptime
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <div
                  className="text-[10px] font-bold uppercase tracking-wider mb-2"
                  style={{ color: T.textMuted }}
                >
                  Tags
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeAgent.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-1 rounded-full font-bold"
                      style={{
                        backgroundColor: hexToRgba(activeAgent.color, 0.1),
                        color: activeAgent.color,
                        border: `1px solid ${hexToRgba(activeAgent.color, 0.2)}`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Capabilities */}
              <div>
                <div
                  className="text-[10px] font-bold uppercase tracking-wider mb-2"
                  style={{ color: T.textMuted }}
                >
                  Capabilities
                </div>
                <ul className="space-y-1.5">
                  {(CAPABILITIES[activeAgent.id] || []).map((cap) => (
                    <li
                      key={cap}
                      className="flex items-center gap-2 text-xs"
                      style={{ color: T.textColor }}
                    >
                      <CheckCircle2
                        size={12}
                        style={{ color: activeAgent.color }}
                      />
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>

              {/* System health indicator */}
              <div
                className="rounded-lg p-3 text-xs"
                style={{
                  backgroundColor: hexToRgba(activeAgent.color, 0.06),
                  border: `1px solid ${hexToRgba(activeAgent.color, 0.15)}`,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Activity size={12} style={{ color: activeAgent.color }} />
                  <span
                    style={{ color: activeAgent.color }}
                    className="font-bold"
                  >
                    System Status
                  </span>
                </div>
                <div
                  className="flex items-center gap-2 text-[10px] opacity-70"
                  style={{ color: T.textMuted }}
                >
                  <Clock size={10} /> Latency:{" "}
                  {MOCK_STATS[activeAgent.id].response}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              <Info
                size={28}
                className="mb-2 opacity-30"
                style={{ color: T.textMuted }}
              />
              <p className="text-xs opacity-50" style={{ color: T.textMuted }}>
                Select an agent to see details
              </p>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
