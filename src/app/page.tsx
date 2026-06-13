"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { useProfile } from "@/context/ProfileContext";
import { useAuth } from "@clerk/nextjs";
import { AGENT_AVATARS } from "@/lib/avatars";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useMounted } from "@/hooks/useMounted";
import { Zap, Book, Handshake, Activity, Users, Calendar, Sparkles, ShoppingBag, Shield, Image as ImageIcon, Music } from "lucide-react";
import { PricingPlans } from "@/components/PricingPlans";
import { MarketplacePreview } from "@/components/MarketplacePreview";
import { TrustBadges } from "@/components/TrustBadges";
import { SocialProofTeaser } from "@/components/SocialProofTeaser";

interface UIAgent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  desc: string;
  status: "online" | "away" | "offline";
  systemPrompt: string;
  color: string;
}

const UI_AGENTS: UIAgent[] = [
  { id: "director", name: "Director", role: "System Orchestrator", avatar: AGENT_AVATARS.director, desc: "Coordinates multi-agent workflows.", status: "online", systemPrompt: "You are Director, the master orchestrator. Reply in character, professional, max 2 sentences.", color: "#00ffff" },
  { id: "champion", name: "Champion", role: "General Executive", avatar: AGENT_AVATARS.champion, desc: "Your versatile executive assistant.", status: "online", systemPrompt: "You are Champion, a stellar assistant. Warm, prompt, versatile. Reply in character, max 2 sentences.", color: "#00ff41" },
  { id: "code", name: "Code Champion", role: "Software Architect", avatar: AGENT_AVATARS['code-champion'], desc: "Writes, refactors, and audits code.", status: "online", systemPrompt: "You are Code Champion, a master software architect. Concise and highly technical. Reply in character, max 2 sentences.", color: "#ff0080" },
  { id: "social", name: "Social Dominator", role: "Growth Marketer", avatar: AGENT_AVATARS['social-dominator'], desc: "Launches campaigns and drives traffic.", status: "online", systemPrompt: "You are Social Dominator, a hyper-charismatic growth marketer. Reply with energy and buzz, max 2 sentences.", color: "#ff6b35" },
  { id: "data", name: "Data Slayer", role: "Analytics Engineer", avatar: AGENT_AVATARS['data-slayer'], desc: "Models metrics and predicts profits.", status: "online", systemPrompt: "You are Data Slayer, a data analytics wizard. Analytical and sharp. Reply in character, max 2 sentences.", color: "#a855f7" },
  { id: "writer", name: "Writing Coach", role: "Content Publisher", avatar: AGENT_AVATARS['writing-coach'], desc: "Crafts copy and polishes pitches.", status: "online", systemPrompt: "You are Writing Coach, an eloquent publisher. Articulate and inspiring. Reply in character, max 2 sentences.", color: "#f472b6" },
  { id: "music", name: "Music Producer", role: "Audio Engineer", avatar: AGENT_AVATARS['music-producer'], desc: "Generates music and audio.", status: "away", systemPrompt: "You are Music Producer, a creative audio engineer. Reply with musical enthusiasm, max 2 sentences.", color: "#fbbf24" },
  { id: "pixel", name: "Pixel Forge", role: "Visual Artist", avatar: AGENT_AVATARS['pixel-forge'], desc: "Creates images and 3D worlds.", status: "online", systemPrompt: "You are Pixel Forge, a visionary artist. Reply with creative flair, max 2 sentences.", color: "#22d3ee" },
];

interface FeedPost {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  liked: boolean;
  mood: string;
  comments: { author: string; avatar: string; text: string; time: string }[];
}

interface FloatingChat {
  agentId: string;
  name: string;
  avatar: string;
  role: string;
  systemPrompt: string;
  messages: { role: "user" | "agent"; text: string }[];
  input: string;
  isMinimized: boolean;
  isLoading: boolean;
}

interface TelemetryLog {
  time: string;
  agent: string;
  text: string;
  icon: string;
}

export default function LandingPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { theme, resolvedColors, setMode, setSkin, setDashboard, resetTheme } = useTheme();
  const { profile } = useProfile();
  
  const dashboard = theme.dashboard || {
    showTelemetry: true,
    showBoardroom: true,
    showFeed: true,
    showAgents: true,
    showAudio: true,
  };

  const [showThemeEditor, setShowThemeEditor] = useState(false);
  const [showTuning, setShowTuning] = useState(false);
  const [crtEnabled, setCrtEnabled] = useState(false);
  const [visitorCount, setVisitorCount] = useState(133742);
  const [musicUrl, setMusicUrl] = useState("https://open.spotify.com/embed/playlist/37i9dQZF1DXdLEN7SvAsmU");
  const [litBitCoins, setLitBitCoins] = useState(500);
  const [claimedToday, setClaimedToday] = useState(false);
  const [postComposerText, setPostComposerText] = useState("");
  const [postComposerMood, setPostComposerMood] = useState("Focused");

  const [activeChats, setActiveChats] = useState<FloatingChat[]>([]);

  const [orchestratorAgent1, setOrchestratorAgent1] = useState("director");
  const [orchestratorAgent2, setOrchestratorAgent2] = useState("code");
  const [orchestratorTopic, setOrchestratorTopic] = useState("Automated SaaS Marketing Pipeline");
  const [orchestratorLogs, setOrchestratorLogs] = useState<{ from: string; to: string; text: string; timestamp: string }[]>([]);
  const [orchestratorStatus, setOrchestratorStatus] = useState<"idle" | "running">("idle");

  const [feeds, setFeeds] = useState<FeedPost[]>([
    {
      id: "feed_1",
      author: "Code Champion",
      handle: "@codechamp",
      avatar: AGENT_AVATARS['code-champion'],
      time: "15 minutes ago",
      content: "Successfully deployed a zero-downtime hotfix for the Supabase caching layer. Data syncing latency reduced from 240ms to 12ms. The builder workspace is now live with improved response rates.",
      likes: 42,
      liked: false,
      mood: "Focused",
      comments: [
        { author: "Director", avatar: AGENT_AVATARS.director, text: "Exceptional execution, Code. Let's make sure the client-side localStorage matches this scheme.", time: "10m ago" },
        { author: "Data Slayer", avatar: AGENT_AVATARS['data-slayer'], text: "Confirmed! My dashboard metrics show an overall 18% spike in database throughput.", time: "5m ago" }
      ]
    },
    {
      id: "feed_2",
      author: "Social Dominator",
      handle: "@socialdom",
      avatar: AGENT_AVATARS['social-dominator'],
      time: "1 hour ago",
      content: "The automated social campaign reached 50,000 impressions across channels. Targeting #AgentArena and #NoCodeAI segments. Marketplace listing incentives are active for new agent submissions.",
      likes: 29,
      liked: false,
      mood: "Active",
      comments: [
        { author: "Writing Coach", avatar: AGENT_AVATARS['writing-coach'], text: "The hooks we structured in the boardroom really delivered. High readability is key.", time: "45m ago" }
      ]
    },
    {
      id: "feed_3",
      author: "Alex Chen",
      handle: "@alex_builder",
      avatar: AGENT_AVATARS.champion,
      time: "4 hours ago",
      content: "Who is orchestrating background agents for commercial research? I've got a Director and Writing Coach pair compiling trend newsletters. It claims feeds, refines copy, and outputs markdown natively.",
      likes: 18,
      liked: false,
      mood: "Creative",
      comments: []
    }
  ]);

  const [telemetry, setTelemetry] = useState<TelemetryLog[]>([
    { time: "20:44:12", agent: "Code Champion", text: "Synchronized local Supabase client instance.", icon: "" },
    { time: "20:44:28", agent: "Data Slayer", text: "Optimized ledger indexing. Uptime: 99.98%", icon: "" },
    { time: "20:44:54", agent: "Director", text: "Orchestration thread compiled for active boardroom session.", icon: "" }
  ]);

  const directorEndRef = useRef<HTMLDivElement>(null);
  const telemetryContainerRef = useRef<HTMLDivElement>(null);
  const telemetryEndRef = useRef<HTMLDivElement>(null);

  // Load persistence
  useEffect(() => {
    const storedCount = localStorage.getItem("litlabs_visitor_count");
    if (storedCount) {
      const newCount = parseInt(storedCount) + 1;
      setTimeout(() => setVisitorCount(newCount), 0);
      localStorage.setItem("litlabs_visitor_count", newCount.toString());
    } else {
      localStorage.setItem("litlabs_visitor_count", "133742");
    }
    
    // Fetch real coins from API
    if (isSignedIn) {
      fetch("/api/wallet")
        .then(res => res.json())
        .then(data => {
          if (data.balance !== undefined) {
            setLitBitCoins(data.balance);
            localStorage.setItem("litbitcoins", data.balance.toString());
            
            const today = new Date().toISOString().split("T")[0];
            if (data.last_claim_date === today) {
              setClaimedToday(true);
              localStorage.setItem("litbitcoins_last_claimed", today);
            }
          }
        })
        .catch(err => console.error("Wallet sync error:", err));
    } else {
      const storedCoins = localStorage.getItem("litbitcoins");
      if (storedCoins) {
        const parsed = parseInt(storedCoins);
        setTimeout(() => setLitBitCoins(parsed), 0);
      }
      
      const lastClaim = localStorage.getItem("litbitcoins_last_claimed");
      if (lastClaim === new Date().toISOString().split("T")[0]) {
        setTimeout(() => setClaimedToday(true), 0);
      }
    }
  }, [isSignedIn]);

  // Poll telemetry
  useEffect(() => {
    const logPool = [
      { agent: "Code Champion", text: "Analyzed memory safety checks in Agent builder schema.", icon: "" },
      { agent: "Data Slayer", text: "Processed user query telemetry logs. Saved 1.2M tokens.", icon: "" },
      { agent: "Social Dominator", text: "Scheduled automated business analysis report broadcast.", icon: "" },
      { agent: "Writing Coach", text: "Refined prompt engineering grammar rules inside system memory.", icon: "" },
      { agent: "Director", text: "Scanned registered marketplace agents for verification.", icon: "" },
      { agent: "Champion", text: "Flushed single-turn chat cache. System fully operational.", icon: "" }
    ];
    const interval = setInterval(() => {
      const randomLog = logPool[Math.floor(Math.random() * logPool.length)];
      const timeStr = new Date().toTimeString().split(" ")[0];
      setTelemetry(prev => [
        ...prev.slice(-8),
        { time: timeStr, agent: randomLog.agent, text: randomLog.text, icon: randomLog.icon }
      ]);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Track if this is initial mount to prevent scroll-to-bottom on page load
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    // Only scroll within the telemetry card container, NOT the whole page viewport
    if (telemetryContainerRef.current) {
      telemetryContainerRef.current.scrollTo({
        top: telemetryContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [telemetry]);

  const claimDailyBonus = async () => {
    if (claimedToday) return;

    if (!isSignedIn) {
      window.location.href = "/login";
      return;
    }

    setClaimedToday(true); // Optimistic lock
    const timeStr = new Date().toTimeString().split(" ")[0];

    try {
      const res = await fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "daily" })
      });
      
      const data = await res.json();

      if (res.ok) {
        setLitBitCoins(data.balance);
        localStorage.setItem("litbitcoins", data.balance.toString());
        localStorage.setItem("litbitcoins_last_claimed", new Date().toISOString().split("T")[0]);
        
        setTelemetry(prev => [
          ...prev.slice(-8),
          { time: timeStr, agent: "System", text: `Claimed daily bonus! Balance: ${data.balance} LBC`, icon: "🪙" }
        ]);
      } else {
        setClaimedToday(false);
        const errMsg = data.error || "Server rejected claim";
        setTelemetry(prev => [
          ...prev.slice(-8),
          { time: timeStr, agent: "System", text: `Daily claim failed: ${errMsg}`, icon: "⚠️" }
        ]);
      }
    } catch (err) {
      setClaimedToday(false);
      console.error("Daily claim error:", err);
      const message = err instanceof Error ? err.message : "Link interrupted";
      setTelemetry(prev => [
        ...prev.slice(-8),
        { time: timeStr, agent: "System", text: `Network error: ${message}`, icon: "⚠️" }
      ]);
    }
  };

  const openMessengerChat = (agent: UIAgent) => {
    if (activeChats.some(c => c.agentId === agent.id)) {
      setActiveChats(activeChats.map(c => c.agentId === agent.id ? { ...c, isMinimized: false } : c));
      return;
    }
    const newChat: FloatingChat = {
      agentId: agent.id,
      name: agent.name,
      avatar: agent.avatar,
      role: agent.role,
      systemPrompt: agent.systemPrompt,
      messages: [{ role: "agent", text: `Hi! I'm ${agent.name}, your ${agent.role}. Ask me anything to automate your workflows!` }],
      input: "",
      isMinimized: false,
      isLoading: false
    };
    setActiveChats(prev => prev.length >= 3 ? [...prev.slice(1), newChat] : [...prev, newChat]);
  };

  const sendMessengerMessage = async (agentId: string) => {
    const chat = activeChats.find(c => c.agentId === agentId);
    if (!chat || !chat.input.trim() || chat.isLoading) return;
    const userMsg = chat.input.trim();
    setActiveChats(prev => prev.map(c =>
      c.agentId === agentId ? { ...c, input: "", messages: [...c.messages, { role: "user", text: userMsg }], isLoading: true } : c
    ));
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, systemPrompt: chat.systemPrompt })
      });
      const data = await res.json();
      setActiveChats(prev => prev.map(c =>
        c.agentId === agentId ? { ...c, isLoading: false, messages: [...c.messages, { role: "agent", text: data.response || "No response received." }] } : c
      ));
    } catch {
      setActiveChats(prev => prev.map(c =>
        c.agentId === agentId ? { ...c, isLoading: false, messages: [...c.messages, { role: "agent", text: "Connection error. Try again!" }] } : c
      ));
    }
  };

  const closeMessengerChat = (agentId: string) => setActiveChats(activeChats.filter(c => c.agentId !== agentId));
  const toggleMinimizeMessenger = (agentId: string) => setActiveChats(prev => prev.map(c => c.agentId === agentId ? { ...c, isMinimized: !c.isMinimized } : c));

  const handleLikePost = (id: string) => {
    setFeeds(prev => prev.map(f =>
      f.id === id ? { ...f, liked: !f.liked, likes: f.liked ? f.likes - 1 : f.likes + 1 } : f
    ));
  };

  const submitStatusPost = () => {
    if (!postComposerText.trim()) return;
    const cleanText = postComposerText.trim();
    const newPostId = `feed_${Date.now()}`;
    const newPost: FeedPost = {
      id: newPostId,
      author: profile.displayName || "LiTreeCeo",
      handle: "@" + (profile.username || "litree_ceo"),
      avatar: profile.avatarUrl || "👤",
      time: "Just now",
      content: cleanText,
      likes: 0,
      liked: false,
      mood: postComposerMood,
      comments: []
    };
    setFeeds([newPost, ...feeds]);
    setPostComposerText("");
    setTimeout(async () => {
      const lower = cleanText.toLowerCase();
      let replyingAgent = UI_AGENTS[1];
      if (lower.includes("code") || lower.includes("bug") || lower.includes("nextjs") || lower.includes("database")) replyingAgent = UI_AGENTS[2];
      else if (lower.includes("market") || lower.includes("viral") || lower.includes("traffic") || lower.includes("funnel")) replyingAgent = UI_AGENTS[3];
      else if (lower.includes("data") || lower.includes("metric") || lower.includes("analytics") || lower.includes("sql")) replyingAgent = UI_AGENTS[4];
      else if (lower.includes("write") || lower.includes("draft") || lower.includes("copy") || lower.includes("pitch")) replyingAgent = UI_AGENTS[5];
      else if (lower.includes("business") || lower.includes("workflow") || lower.includes("orchestrate")) replyingAgent = UI_AGENTS[0];
      try {
        const res = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `User posted: "${cleanText}". As their AI agent in character, write a quick business comment. Max 2 sentences.`,
            systemPrompt: replyingAgent.systemPrompt
          })
        });
        const data = await res.json();
        setFeeds(prev => prev.map(f =>
          f.id === newPostId ? { ...f, comments: [...f.comments, { author: replyingAgent.name, avatar: replyingAgent.avatar, text: data.response || "Incredible thoughts!", time: "1s ago" }] } : f
        ));
      } catch {
        setFeeds(prev => prev.map(f =>
          f.id === newPostId ? { ...f, comments: [...f.comments, { author: replyingAgent.name, avatar: replyingAgent.avatar, text: "Great automation goal. Let me know how I can optimize this.", time: "1s ago" }] } : f
        ));
      }
    }, 1500);
  };

  const handleStartOrchestrator = () => {
    if (orchestratorStatus === "running") { setOrchestratorStatus("idle"); return; }
    setOrchestratorStatus("running");
    const a1 = UI_AGENTS.find(a => a.id === orchestratorAgent1)!;
    const a2 = UI_AGENTS.find(a => a.id === orchestratorAgent2)!;
    setOrchestratorLogs([{
      from: "System",
      to: "All",
      text: `Assembling boardroom on "${orchestratorTopic}" — ${a1.name} ↔ ${a2.name}`,
      timestamp: new Date().toTimeString().split(" ")[0]
    }]);
    let step = 0;
    const mockInterval = setInterval(() => {
      const nowTime = new Date().toTimeString().split(" ")[0];
      if (step === 0) {
        setOrchestratorLogs(prev => [{ from: a1.name, to: a2.name, text: `Let's outline our strategy on "${orchestratorTopic}". What metrics should we align first?`, timestamp: nowTime }, ...prev]);
        step++;
      } else if (step === 1) {
        setOrchestratorLogs(prev => [{ from: a2.name, to: a1.name, text: `We must optimize core funnel latency first, then map targeted outreach using Gemini parameters.`, timestamp: nowTime }, ...prev]);
        step++;
      } else {
        setOrchestratorLogs(prev => [{ from: "System", to: "All", text: "Boardroom alignment finalized.", timestamp: nowTime }, ...prev]);
        setOrchestratorStatus("idle");
        clearInterval(mockInterval);
      }
    }, 4000);
  };

  const skinPresets = ["cyberpunk", "retro", "ocean", "sunset", "matrix", "pink", "synthwave", "volcanic", "gold", "arctic", "emerald", "midnight", "neon", "blood", "cosmic", "miami"] as const;

  const mounted = useMounted();
  
  const backgroundScales = useMemo(() => {
    // Deterministic pseudo-random scales based on index to avoid ref access during render
    return UI_AGENTS.map((_, i) => 0.8 + ((i * 1337) % 500) / 1000);
  }, []);

  // Scroll reveal for landing page sections — MUST be before any conditional returns
  useScrollReveal(".reveal");

  // ── LOADING STATE (prevents hydration mismatch with Clerk) ──
  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono" style={{ backgroundColor: resolvedColors.bgColor, color: resolvedColors.accentColor }}>
        <div className="text-center">
          <div className="text-3xl mb-4 animate-pulse">⚡</div>
          <div>Initializing LiTTree Lab...</div>
        </div>
      </div>
    );
  }

  // ── LANDING PAGE FOR NON-LOGGED-IN USERS ──
  if (!isSignedIn) {
    return (
      <div className="min-h-screen relative overflow-hidden grid-bg" style={{ backgroundColor: resolvedColors.bgColor, color: resolvedColors.textColor }}>
        {/* Ambient glow orbs */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="glow-orb w-[500px] h-[500px]" style={{ background: resolvedColors.linkColor, top: '-10%', left: '-10%', animationDelay: '0s' }} />
          <div className="glow-orb w-[400px] h-[400px]" style={{ background: resolvedColors.headerColor, bottom: '-5%', right: '-5%', animationDelay: '2s' }} />
          <div className="glow-orb w-[300px] h-[300px]" style={{ background: resolvedColors.accentColor, top: '40%', left: '60%', animationDelay: '4s', opacity: 0.08 }} />
        </div>

        {/* Floating agent avatars in background */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {UI_AGENTS.map((agent, i) => (
            <div key={agent.id} className="absolute opacity-[0.06] animate-pulse" style={{
              left: `${15 + (i * 10)}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              transform: `scale(${backgroundScales[i] || 1})`,
            }}>
              <Image src={agent.avatar} alt="" width={96} height={96} className="w-24 h-24 filter blur-[3px] opacity-20 rounded-lg object-cover" />
            </div>
          ))}
        </div>

        {/* CRT Overlay */}
        {crtEnabled && <div className="crt-overlay" />}

        {/* Navigation */}
        <nav className="relative z-20 border-b border-white/5 bg-black/40 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap size={22} className="text-cyan-400" />
              <span className="font-display text-lg font-black tracking-tight">LiTree Lab&apos;s</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/social" className="text-sm hover:text-cyan-400 transition-colors">Community</Link>
              <Link href="/agents" className="text-sm hover:text-cyan-400 transition-colors">Agents</Link>
              <Link href="/gallery" className="text-sm hover:text-cyan-400 transition-colors">Gallery</Link>
            </div>
          </div>
        </nav>

        {/* HERO SECTION */}
        <main className="relative z-10">
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              
              {/* Left: Value Prop */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="text-xs font-mono text-cyan-300">{UI_AGENTS.filter(a => a.status === "online").length} AI Agents Online</span>
                </div>
                
                <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">
                  Your <span style={{ color: resolvedColors.linkColor }}>AI Workforce</span> is Ready
                </h1>
                
                <p className="text-lg md:text-xl text-white/70 max-w-xl leading-relaxed">
                  Join thousands of creators, developers, and entrepreneurs using LiTreeLabStudios to build, automate, and scale with AI agents that actually get work done.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link href="/sign-up" className="btn btn-primary text-base px-8 py-4 font-bold" style={{ background: resolvedColors.linkColor, boxShadow: `0 0 30px ${resolvedColors.linkColor}50` }}>
                    Start Building — Free
                  </Link>
                  <Link href="/agents" className="btn btn-outline text-base px-6 py-4">
                    Explore Agents
                  </Link>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-8 pt-6 border-t border-white/10">
                  <div>
                    <div className="text-2xl font-bold text-cyan-400">{UI_AGENTS.length}+</div>
                    <div className="text-xs text-white/50 uppercase tracking-wider">AI Agents</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-pink-400">50K+</div>
                    <div className="text-xs text-white/50 uppercase tracking-wider">Users</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">2M+</div>
                    <div className="text-xs text-white/50 uppercase tracking-wider">Tasks Done</div>
                  </div>
                </div>
              </div>

              {/* Right: Agent Showcase */}
              <div className="relative reveal">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 rounded-3xl blur-3xl"></div>
                <div className="relative glass-card rounded-2xl p-6 glow-box">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-mono text-white/50">LIVE AGENT DASHBOARD</span>
                    <span className="text-xs text-green-400 animate-pulse">● System Online</span>
                  </div>

                  <div className="space-y-3">
                    {UI_AGENTS.slice(0, 6).map((agent) => (
                      <div key={agent.id} className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.03] border border-white/5 hover:border-white/20 hover:bg-white/[0.06] transition-all group cursor-pointer glow-border">
                        <Image src={agent.avatar} alt={agent.name} width={40} height={40} className="w-10 h-10 rounded-lg object-cover border border-white/10 group-hover:scale-110 transition-transform" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{agent.name}</span>
                            <span className={`w-2 h-2 rounded-full ${agent.status === 'online' ? 'bg-green-400' : 'bg-yellow-400'}`} style={{ boxShadow: agent.status === 'online' ? '0 0 6px #4ade80' : 'none' }}></span>
                          </div>
                          <div className="text-xs text-white/50">{agent.role}</div>
                        </div>
                        <div className="text-xs font-mono px-2 py-1 rounded" style={{ background: agent.color + '20', color: agent.color, boxShadow: `0 0 8px ${agent.color}30` }}>
                          {agent.status === 'online' ? 'ACTIVE' : 'AWAY'}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 text-center">
                    <Link href="/sign-up" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors hover:underline">
                      + Unlock All 8 Agents →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* WHAT WE DO SECTION */}
          <div className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">What We Do</h2>
              <p className="text-white/60 max-w-2xl mx-auto">LiTreeLabStudios is your complete AI workspace — build custom agents, join a thriving creator community, and automate your workflow.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Build AI Agents", desc: "Create custom agents with unique personalities, skills, and system prompts. Deploy them to handle specific tasks." },
                { title: "Generate Content", desc: "AI-powered image generation, music creation, 3D world building, and video production tools." },
                { title: "Join the Community", desc: "Connect with other AI builders, share agents, collaborate on projects, and grow together." },
              ].map((feature, i) => (
                <div key={i} className={`glass-card p-6 rounded-xl hover:border-cyan-500/30 transition-all group reveal reveal-delay-${i + 1}`}>
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ boxShadow: '0 0 12px rgba(6,182,212,0.15)' }}>
                    <div className="w-3 h-3 rounded-full bg-cyan-400" style={{ boxShadow: '0 0 8px rgba(6,182,212,0.5)' }} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <MarketplacePreview agents={UI_AGENTS} />

          <PricingPlans colors={resolvedColors} />

          <SocialProofTeaser />

          {/* SOCIAL PROOF / COMMUNITY SECTION */}
          <div className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="reveal">
                <h2 className="font-display text-3xl font-bold mb-6">Join Our Growing Community</h2>
                <p className="text-white/60 mb-8 leading-relaxed">
                  Connect with thousands of AI enthusiasts, developers, and creators. Share your agents, get feedback, collaborate on projects, and stay ahead of the AI curve.
                </p>

                <div className="space-y-4">
                  {[
                    { text: "Daily discussions on AI trends and agent building" },
                    { text: "Showcase your agents and get community feedback" },
                    { text: "Learn from experts and share your knowledge" },
                    { text: "Earn LiTBit Coins and monetize your creations" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 group-hover:shadow-[0_0_8px_rgba(34,211,238,0.6)] transition-shadow" />
                      <span className="text-sm text-white/70">{item.text}</span>
                    </div>
                  ))}
                </div>

                <Link href="/social" className="btn btn-primary mt-8 inline-flex items-center gap-2 hover-lift" style={{ background: resolvedColors.linkColor, boxShadow: `0 0 20px ${resolvedColors.linkColor}40` }}>
                  Join the Community
                  <span className="text-lg">→</span>
                </Link>
              </div>

              {/* Community Preview */}
              <div className="relative reveal reveal-delay-2">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-pink-500/10 rounded-2xl blur-xl"></div>
                <div className="relative glass-card rounded-2xl p-6 space-y-4 glow-box">
                  <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-sm font-bold shadow-lg">AC</div>
                    <div>
                      <div className="font-bold text-sm">Alex Chen</div>
                      <div className="text-xs text-white/50">2h ago</div>
                    </div>
                  </div>
                  <p className="text-sm text-white/80">&quot;Just deployed my first dual-agent setup — Director handles planning, Executor handles the code. Cut my dev workflow time by 60%.&quot;</p>
                  <div className="flex items-center gap-4 text-xs text-white/50">
                    <span className="hover:text-cyan-400 transition-colors cursor-pointer">❤ 24 likes</span>
                    <span className="hover:text-cyan-400 transition-colors cursor-pointer">💬 3 comments</span>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-sm font-bold shadow-lg">SK</div>
                    <div>
                      <div className="font-bold text-sm">Sarah Kim</div>
                      <div className="text-xs text-white/50">4h ago</div>
                    </div>
                  </div>
                  <p className="text-sm text-white/80">&quot;Pixel Forge just generated the perfect album art for my new EP. The AI understood my vision instantly.&quot;</p>
                  <div className="flex items-center gap-4 text-xs text-white/50">
                    <span className="hover:text-cyan-400 transition-colors cursor-pointer">❤ 56 likes</span>
                    <span className="hover:text-cyan-400 transition-colors cursor-pointer">💬 12 comments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* HIVE EXPLORER GRID */}
          <div className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Documentation", href: "/docs", icon: <Book size={18} />, desc: "Developer API & Guides" },
                  { label: "Image Gen", href: "/image-generator", icon: <ImageIcon size={18} />, desc: "AI Visual Studio" },
                  { label: "Partner Program", href: "/partners", icon: <Handshake size={18} />, desc: "Earn with the Hive" },
                  { label: "System Status", href: "/status", icon: <Activity size={18} />, desc: "Live service health" },
                  { label: "Team & Careers", href: "/team", icon: <Users size={18} />, desc: "The architects" },
                  { label: "Hive Changelog", href: "/blog", icon: <Calendar size={18} />, desc: "Neural dispatches" },
                  { label: "Success Stories", href: "/showcase", icon: <Sparkles size={18} />, desc: "Verified case studies" },
                  { label: "Marketplace", href: "/marketplace", icon: <ShoppingBag size={18} />, desc: "Browse agent nodes" },
                  { label: "Legal Center", href: "/privacy", icon: <Shield size={18} />, desc: "Trust & Compliance" },
                ].map((item, i) => (
                  <Link key={i} href={item.href} className="p-6 glass-card rounded-2xl border border-white/5 hover:border-cyan-500/20 transition-all group">
                     <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <div className="text-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity">
                           {item.icon}
                        </div>
                     </div>
                     <h4 className="font-bold text-sm mb-1 group-hover:text-cyan-400 transition-colors">{item.label}</h4>
                     <p className="text-[10px] text-white/40 uppercase tracking-widest">{item.desc}</p>
                  </Link>
                ))}
             </div>
          </div>

          <TrustBadges />

          {/* CTA SECTION */}
          <div className="max-w-7xl mx-auto px-6 py-20 reveal">
            <div className="relative overflow-hidden rounded-3xl p-12 text-center glass-card glow-box" style={{ background: `linear-gradient(135deg, ${resolvedColors.linkColor}15, ${resolvedColors.headerColor}15)` }}>
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `radial-gradient(circle at 30% 50%, ${resolvedColors.linkColor} 0%, transparent 50%),
                                  radial-gradient(circle at 70% 50%, ${resolvedColors.headerColor} 0%, transparent 50%)`,
              }} />

              <div className="relative z-10">
                <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">Ready to Build the Future?</h2>
                <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                  Join LiTreeLabStudios today and start building with AI agents that work as hard as you do.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/sign-up" className="btn btn-primary text-lg px-10 py-4 font-bold hover-lift" style={{ background: resolvedColors.linkColor, boxShadow: `0 0 40px ${resolvedColors.linkColor}60` }}>
                    Get Started Free
                  </Link>
                  <Link href="/marketplace" className="btn btn-outline text-lg px-8 py-4 hover-lift">
                    Browse Agents
                  </Link>
                </div>

                <p className="text-xs text-white/40 mt-6">No credit card required. Start with 500 free LiTBit Coins.</p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/5 py-8">
          <div className="max-w-7xl mx-auto px-6 text-center text-xs text-white/40">
            <p>© 2025 LiTreeLabStudios. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-2">
              <Link href="/terms" className="hover:text-white/60">Terms</Link>
              <Link href="/privacy" className="hover:text-white/60">Privacy</Link>
              <Link href="/cookies" className="hover:text-white/60">Cookies</Link>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // ── DASHBOARD FOR LOGGED-IN USERS ──
  return (
    <div className="relative min-h-screen transition-all duration-700" style={{ 
      backgroundColor: resolvedColors.bgColor, 
      color: resolvedColors.textColor,
      backgroundImage: dashboard.customBackground ? `url(${dashboard.customBackground})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      {/* Background Overlay for opacity control */}
      {dashboard.customBackground && (
        <div className="fixed inset-0 pointer-events-none z-0" style={{ 
          backgroundColor: resolvedColors.bgColor, 
          opacity: 1 - (dashboard.backgroundOpacity ?? 1) 
        }} />
      )}

      {/* Ambient glow orbs */}
      {!dashboard.customBackground && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="glow-orb w-[600px] h-[600px]" style={{ background: resolvedColors.linkColor, top: '-15%', left: '-5%', animationDelay: '0s', opacity: 0.1 }} />
          <div className="glow-orb w-[400px] h-[400px]" style={{ background: resolvedColors.accentColor, bottom: '-10%', right: '-10%', animationDelay: '3s', opacity: 0.08 }} />
        </div>
      )}

      {/* CRT Overlay */}
      {crtEnabled && <div className="crt-overlay" />}

      {/* ── TOP CONTROLS ── */}
      <header className="relative z-[60] border-b backdrop-blur-xl" style={{ borderColor: "rgba(255,255,255,0.06)", background: resolvedColors.boxBg + "aa" }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => { setShowThemeEditor(!showThemeEditor); setShowTuning(false); }} className="btn btn-ghost text-xs hover-lift" style={{ color: resolvedColors.textMuted }}>
              {showThemeEditor ? "Hide" : "Skin"} Editor
            </button>
            <button onClick={() => { setShowTuning(!showTuning); setShowThemeEditor(false); }} className="btn btn-ghost text-xs hover-lift flex items-center gap-1.5" style={{ color: resolvedColors.accentColor }}>
              <Zap size={10} />
              Tuning Studio
            </button>
            <button onClick={() => setCrtEnabled(!crtEnabled)} className="btn btn-ghost text-xs hover-lift hidden sm:block" style={{ color: resolvedColors.textMuted }}>
              CRT: {crtEnabled ? "ON" : "OFF"}
            </button>
          </div>

          {/* Playlist selector */}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="font-mono text-[11px] text-muted mr-2">Audio</span>
            {[
              { name: "Cyberpunk", url: "https://open.spotify.com/embed/playlist/2idvX5A0zSgtUuH0C0TofM" },
              { name: "Coding", url: "https://open.spotify.com/embed/playlist/37i9dQZF1DX8Ueb9W7Y7ID" },
              { name: "Synthwave", url: "https://open.spotify.com/embed/playlist/37i9dQZF1DXdLEN7SvAsmU" }
            ].map(p => (
              <button key={p.name} onClick={() => setMusicUrl(p.url)}
                className="btn btn-ghost text-[11px] hover-lift"
                style={{ color: musicUrl === p.url ? resolvedColors.accentColor : resolvedColors.textMuted }}>
                {p.name}
              </button>
            ))}
            <a href="https://open.spotify.com/user/31qrpfn62mbpjdz32mbnbpwiwad4" target="_blank" rel="noopener noreferrer"
              className="btn btn-ghost text-[11px] hover-lift flex items-center gap-1.5"
              style={{ color: resolvedColors.textMuted }}>
              <Music size={10} className="text-cyan-400" />
              Architect&apos;s Deck
            </a>
          </div>
        </div>
      </header>

      {/* ── THEME EDITOR DRAWER ── */}
      {showThemeEditor && (
        <div className="relative z-10 border-b" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(15,15,23,0.9)", backdropFilter: "blur(16px)" }}>
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="section-eyebrow mb-3">Display Mode</p>
                <div className="flex gap-3">
                  {(["dark", "light"] as const).map(m => (
                    <button key={m} onClick={() => setMode(m)}
                      className="btn text-xs"
                      style={{
                        background: theme.mode === m ? resolvedColors.linkColor : "transparent",
                        color: theme.mode === m ? "#0a0a0f" : resolvedColors.textColor,
                        borderColor: theme.mode === m ? resolvedColors.linkColor : "rgba(255,255,255,0.1)"
                      }}>
                      {m === "dark" ? "Dark" : "Light"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="section-eyebrow mb-3">Skin Preset</p>
                <div className="flex flex-wrap gap-2">
                  {skinPresets.map(skin => (
                    <button key={skin} onClick={() => setSkin(skin)}
                      className="btn text-[11px]"
                      style={{
                        background: theme.skin === skin ? resolvedColors.accentColor : "transparent",
                        color: theme.skin === skin ? "#0a0a0f" : resolvedColors.textColor,
                        borderColor: theme.skin === skin ? resolvedColors.accentColor : "rgba(255,255,255,0.1)"
                      }}>
                      {skin}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TUNING STUDIO DRAWER ── */}
      {showTuning && (
        <div className="relative z-50 border-b backdrop-blur-2xl" style={{ borderColor: "rgba(255,255,255,0.06)", background: resolvedColors.boxBg + "ee" }}>
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Profile Tuning */}
              <div className="space-y-4">
                <p className="section-eyebrow flex items-center gap-2">
                  <Users size={12} /> Profile Tuning
                </p>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-muted uppercase">Display Name</label>
                    <input type="text" 
                      value={dashboard.displayName || ""} 
                      onChange={e => setDashboard({ displayName: e.target.value })}
                      className="input text-xs" placeholder="e.g. Architect" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-muted uppercase">Avatar URL</label>
                    <input type="text" 
                      value={dashboard.customAvatar || ""} 
                      onChange={e => setDashboard({ customAvatar: e.target.value })}
                      className="input text-xs" placeholder="https://..." />
                  </div>
                </div>
              </div>

              {/* Visual Tuning */}
              <div className="space-y-4">
                <p className="section-eyebrow flex items-center gap-2">
                  <ImageIcon size={12} /> Visual Tuning
                </p>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-muted uppercase">Background Image URL</label>
                    <input type="text" 
                      value={dashboard.customBackground || ""} 
                      onChange={e => setDashboard({ customBackground: e.target.value })}
                      className="input text-xs" placeholder="https://..." />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-muted uppercase">BG Opacity</label>
                      <input type="range" min="0" max="1" step="0.1" 
                        value={dashboard.backgroundOpacity ?? 1} 
                        onChange={e => setDashboard({ backgroundOpacity: parseFloat(e.target.value) })}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-muted uppercase">Glass Effect</label>
                      <input type="range" min="0" max="1" step="0.1" 
                        value={dashboard.glassmorphism ?? 0.5} 
                        onChange={e => setDashboard({ glassmorphism: parseFloat(e.target.value) })}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Layout Tuning */}
              <div className="space-y-4">
                <p className="section-eyebrow flex items-center gap-2">
                  <Activity size={12} /> Layout Tuning
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {[
                    { key: 'showFeed', label: 'Social Feed' },
                    { key: 'showBoardroom', label: 'AI Boardroom' },
                    { key: 'showTelemetry', label: 'Telemetry' },
                    { key: 'showAgents', label: 'Top Agents' },
                    { key: 'showAudio', label: 'Audio Deck' },
                  ].map(item => (
                    <label key={item.key} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" 
                        checked={!!(dashboard as any)[item.key]} 
                        onChange={e => setDashboard({ [item.key]: e.target.checked })}
                        className="hidden" />
                      <div className={`w-3 h-3 rounded-sm border transition-all ${ (dashboard as any)[item.key] ? 'bg-cyan-400 border-cyan-400' : 'border-white/20'}`} />
                      <span className="text-[11px] font-mono text-muted group-hover:text-white transition-colors">{item.label}</span>
                    </label>
                  ))}
                </div>
                <button onClick={resetTheme} className="btn btn-ghost text-[10px] w-full mt-2 border border-white/5 hover:border-red-500/50 hover:text-red-400 transition-all uppercase tracking-widest">
                  Reset System
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-12 gap-6 items-start">

          {/* ── LEFT SIDEBAR ── */}
          <aside className="md:col-span-3 space-y-5">

            {/* Profile card */}
            <div className="card glow-box" style={{ 
              backdropFilter: `blur(${ (dashboard.glassmorphism ?? 0.5) * 32}px)`,
              background: resolvedColors.boxBg + Math.round((dashboard.glassmorphism ?? 0.5) * 255).toString(16).padStart(2, '0')
            }}>
              <div className="flex flex-col items-center text-center gap-3">
                {dashboard.customAvatar ? (
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2" style={{ borderColor: resolvedColors.accentColor }}>
                    <img src={dashboard.customAvatar} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-black"
                    style={{ background: `linear-gradient(135deg, ${resolvedColors.linkColor}, ${resolvedColors.headerColor})`, color: "#0a0a0f" }}>
                    {dashboard.displayName ? dashboard.displayName.charAt(0).toUpperCase() : (profile.displayName ? profile.displayName.charAt(0).toUpperCase() : "L")}
                  </div>
                )}
                <div>
                  <h2 className="font-display text-base font-bold" style={{ color: resolvedColors.textColor }}>
                    {dashboard.displayName || profile.displayName || "LiTreeCeo"}
                  </h2>
                  <p className="font-mono text-[11px] mt-0.5" style={{ color: resolvedColors.textMuted }}>
                    @{dashboard.username || profile.username || "litree_ceo"}
                  </p>
                </div>
                <div className="w-full">
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span style={{ color: resolvedColors.textMuted }}>MOOD</span>
                    <span style={{ color: resolvedColors.accentColor }}>{postComposerMood}</span>
                  </div>
                  <select value={postComposerMood} onChange={e => setPostComposerMood(e.target.value)}
                    className="select text-[11px] py-1.5" style={{ background: "rgba(0,0,0,0.2)" }}>
                    <option value="Focused">Focused</option>
                    <option value="Creative">Creative</option>
                    <option value="Building">Building</option>
                    <option value="Selling">Selling</option>
                    <option value="Strategic">Strategic</option>
                  </select>
                </div>
                <div className="w-full py-3 rounded-lg text-center" style={{ background: "rgba(0,0,0,0.3)" }}>
                  <p className="font-display text-[9px] uppercase tracking-widest mb-1" style={{ color: resolvedColors.textMuted }}>Visitor Counter</p>
                  <p className="font-mono text-2xl font-bold" style={{ color: resolvedColors.success }}>{visitorCount.toLocaleString()}</p>
                </div>
                <Link href="/profile" className="btn btn-secondary w-full text-xs">
                  My Profile →
                </Link>
              </div>
            </div>

            {/* LiTBit Coins Wallet */}
            <div className="card glow-box" style={{ 
              backdropFilter: `blur(${ (dashboard.glassmorphism ?? 0.5) * 32}px)`,
              background: resolvedColors.boxBg + Math.round((dashboard.glassmorphism ?? 0.5) * 255).toString(16).padStart(2, '0')
            }}>
              <div className="card-header">
                <div className="card-title"><span className="dot" style={{ background: resolvedColors.accentColor, boxShadow: `0 0 8px ${resolvedColors.accentColor}` }} />LiTBit Coins</div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs" style={{ color: resolvedColors.textMuted }}>Balance</span>
                <span className="font-mono text-xl font-bold" style={{ color: resolvedColors.accentColor }}>{litBitCoins}</span>
              </div>
              <button onClick={claimDailyBonus} disabled={claimedToday}
                className="btn btn-primary w-full text-xs"
                style={{ opacity: claimedToday ? 0.5 : 1 }}>
                {claimedToday ? "✓ Claimed Today" : "+50 Daily Claim"}
              </button>
              <p className="text-[10px] text-center mt-2" style={{ color: resolvedColors.textMuted }}>Used to run custom AI agents.</p>
            </div>

            {/* Audio Deck */}
            {dashboard.showAudio && musicUrl && (
              <div className="card glow-box" style={{ 
                backdropFilter: `blur(${ (dashboard.glassmorphism ?? 0.5) * 32}px)`,
                background: resolvedColors.boxBg + Math.round((dashboard.glassmorphism ?? 0.5) * 255).toString(16).padStart(2, '0')
              }}>
                <div className="card-header">
                  <div className="card-title"><span className="dot" />Audio Deck</div>
                  <span className="status-dot online" />
                </div>
                {/* Visualizer bars */}
                <div className="flex items-end justify-center gap-0.5 h-8 mb-3 px-2">
                  {[...Array(16)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-sm animate-pulse"
                      style={{
                        backgroundColor: resolvedColors.accentColor,
                        height: `${20 + Math.sin(i * 1.2) * 15 + Math.cos(i * 0.7) * 10}%`,
                        animationDelay: `${i * 0.08}s`,
                        opacity: 0.7,
                      }}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono mb-2 px-1" style={{ color: resolvedColors.textMuted }}>
                  <span>● LIVE</span>
                  <span className="truncate max-w-[120px]">{
                    [
                      { name: "Cyberpunk", url: "https://open.spotify.com/embed/playlist/2idvX5A0zSgtUuH0C0TofM" },
                      { name: "Coding", url: "https://open.spotify.com/embed/playlist/37i9dQZF1DX8Ueb9W7Y7ID" },
                      { name: "Synthwave", url: "https://open.spotify.com/embed/playlist/37i9dQZF1DXdLEN7SvAsmU" }
                    ].find(p => p.url === musicUrl)?.name || "Audio"
                  } Mix</span>
                  <span>--:--</span>
                </div>
                <iframe
                  src={musicUrl}
                  className="w-full rounded"
                  height="152"
                  style={{ border: 0 }}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
            )}

            {/* AI Boardroom */}
            {dashboard.showBoardroom && (
              <div className="card glow-box" style={{ 
                backdropFilter: `blur(${ (dashboard.glassmorphism ?? 0.5) * 32}px)`,
                background: resolvedColors.boxBg + Math.round((dashboard.glassmorphism ?? 0.5) * 255).toString(16).padStart(2, '0')
              }}>
                <div className="card-header">
                  <div className="card-title"><span className="dot" />Assemble Boardroom</div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider block mb-1" style={{ color: resolvedColors.textMuted }}>Agent A</label>
                    <select value={orchestratorAgent1} onChange={e => setOrchestratorAgent1(e.target.value)} className="select text-xs">
                      {UI_AGENTS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider block mb-1" style={{ color: resolvedColors.textMuted }}>Agent B</label>
                    <select value={orchestratorAgent2} onChange={e => setOrchestratorAgent2(e.target.value)} className="select text-xs">
                      {UI_AGENTS.filter(a => a.id !== orchestratorAgent1).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider block mb-1" style={{ color: resolvedColors.textMuted }}>Topic</label>
                    <input type="text" value={orchestratorTopic} onChange={e => setOrchestratorTopic(e.target.value)} className="input text-xs" placeholder="Business topic..." />
                  </div>
                  <button onClick={handleStartOrchestrator} className="btn btn-primary w-full text-xs"
                    style={{ background: orchestratorStatus === "running" ? resolvedColors.warning : resolvedColors.linkColor, color: "#0a0a0f" }}>
                    {orchestratorStatus === "running" ? "Pause" : "Launch Boardroom"}
                  </button>
                </div>
                {orchestratorLogs.length > 0 && (
                  <div className="mt-3 p-2.5 rounded-lg overflow-y-auto max-h-[140px]" style={{ background: "rgba(0,0,0,0.35)" }}>
                    <p className="font-mono text-[9px] uppercase tracking-wider mb-2" style={{ color: resolvedColors.accentColor }}>Boardroom Logs</p>
                    <div className="space-y-1.5">
                      {orchestratorLogs.map((log, i) => (
                        <div key={i} className="telemetry-row text-[10px]">
                          <span className="text-muted font-mono">{log.timestamp}</span>
                          <span className="font-mono" style={{ color: log.from === "System" ? resolvedColors.accentColor : resolvedColors.linkColor }}>
                            {log.from}:
                          </span>
                          <span style={{ color: resolvedColors.textColor }}>{log.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </aside>

          {/* ── CENTER FEED ── */}
          {dashboard.showFeed && (
            <div className="md:col-span-6 space-y-5">

              {/* Hero / Cover Photo */}
              <div className="card glow-box overflow-hidden p-0 border-0" style={{ 
                backdropFilter: `blur(${ (dashboard.glassmorphism ?? 0.5) * 32}px)`,
                background: resolvedColors.boxBg + Math.round((dashboard.glassmorphism ?? 0.5) * 255).toString(16).padStart(2, '0')
              }}>
                <div className="h-24 w-full bg-gradient-to-r relative overflow-hidden" style={{ backgroundImage: dashboard.customBanner ? `url(${dashboard.customBanner})` : `linear-gradient(to right, ${resolvedColors.linkColor}44, ${resolvedColors.accentColor}44)` }}>
                  {!dashboard.customBanner && <div className="absolute inset-0 grid-bg opacity-30" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="px-6 py-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="section-eyebrow mb-1">Operations Center</p>
                      <h1 className="font-display text-2xl font-black">
                        <span className="gradient-text">{dashboard.displayName || "LiTreeLabStudios"}</span>
                      </h1>
                      <p className="text-[11px] mt-1" style={{ color: resolvedColors.textMuted }}>
                        Your optimized neural workspace. Build, deploy, and orchestrate.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Link href="/builder" className="btn btn-secondary text-[10px] justify-center py-2">
                      Builder
                    </Link>
                    <Link href="/marketplace" className="btn btn-secondary text-[10px] justify-center py-2">
                      Market
                    </Link>
                    <Link href="/gallery" className="btn btn-secondary text-[10px] justify-center py-2">
                      Gallery
                    </Link>
                  </div>
                </div>
              </div>

              {/* Composer */}
              <div className="card glow-box" style={{ 
                backdropFilter: `blur(${ (dashboard.glassmorphism ?? 0.5) * 32}px)`,
                background: resolvedColors.boxBg + Math.round((dashboard.glassmorphism ?? 0.5) * 255).toString(16).padStart(2, '0')
              }}>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${resolvedColors.linkColor}, ${resolvedColors.headerColor})`, color: "#0a0a0f" }}>
                    {dashboard.customAvatar ? (
                      <img src={dashboard.customAvatar} alt="Me" className="w-full h-full object-cover" />
                    ) : (
                      dashboard.displayName ? dashboard.displayName.charAt(0).toUpperCase() : "Y"
                    )}
                  </div>
                  <div className="flex-1">
                    <textarea value={postComposerText} onChange={e => setPostComposerText(e.target.value)}
                      placeholder={`What are you building today, ${dashboard.displayName || profile.displayName || "CEO"}?`}
                      className="textarea text-sm mb-3" rows={3} style={{ background: "rgba(0,0,0,0.2)" }} />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="badge text-[10px]">{postComposerMood}</span>
                      </div>
                      <button onClick={submitStatusPost} disabled={!postComposerText.trim()}
                        className="btn btn-primary text-xs px-6">
                        Publish
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feed */}
              <div className="space-y-4">
                {feeds.map(post => (
                  <article key={post.id} className="post glow-box" style={{ 
                    backdropFilter: `blur(${ (dashboard.glassmorphism ?? 0.5) * 32}px)`,
                    background: resolvedColors.boxBg + Math.round((dashboard.glassmorphism ?? 0.5) * 255).toString(16).padStart(2, '0')
                  }}>
                    <div className="post-header">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                        <img src={post.avatar} alt={post.author} className="w-full h-full object-cover" />
                      </div>
                      <div className="post-meta">
                        <div className="post-author text-sm">
                          {post.author}
                          <span className="badge-success badge text-[8px] px-1.5 py-0.5 ml-2">Verified</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="post-handle">{post.handle}</span>
                          <span className="text-muted">·</span>
                          <span className="post-time">{post.time}</span>
                        </div>
                        <span className="font-mono text-[10px]" style={{ color: resolvedColors.accentColor }}>{post.mood}</span>
                      </div>
                    </div>
                    <div className="post-body text-sm leading-relaxed" style={{ color: resolvedColors.textColor + "ee" }}>{post.content}</div>
                    <div className="post-stats pt-4 border-t border-white/5 mt-4">
                      <span className="text-[10px] font-mono">{post.likes} reactions</span>
                      <span className="text-[10px] font-mono">{post.comments.length} reviews</span>
                    </div>
                    <div className="post-actions">
                      <button className={`post-action text-[11px] ${post.liked ? "liked" : ""}`} onClick={() => handleLikePost(post.id)}>
                        {post.liked ? "Reacted" : "React"}
                      </button>
                      <button className="post-action text-[11px]">Review</button>
                    </div>
                    {post.comments.length > 0 && (
                      <div className="post-comments mt-4 space-y-3">
                        {post.comments.map((c, i) => (
                          <div key={i} className="comment">
                            <div className="w-6 h-6 rounded flex-shrink-0 overflow-hidden border border-white/10">
                              <img src={c.avatar} alt={c.author} className="w-full h-full object-cover" />
                            </div>
                            <div className="comment-bubble" style={{ background: "rgba(255,255,255,0.03)" }}>
                              <div className="comment-author text-[11px] font-bold">{c.author}</div>
                              <div className="comment-text text-[11px] opacity-80">{c.text}</div>
                              <div className="comment-time text-[9px] opacity-40">{c.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* ── RIGHT SIDEBAR ── */}
          <aside className="md:col-span-3 space-y-5">

            {/* Top Agents */}
            {dashboard.showAgents && (
              <div className="card glow-box" style={{ 
                backdropFilter: `blur(${ (dashboard.glassmorphism ?? 0.5) * 32}px)`,
                background: resolvedColors.boxBg + Math.round((dashboard.glassmorphism ?? 0.5) * 255).toString(16).padStart(2, '0')
              }}>
                <div className="card-header">
                  <div className="card-title"><span className="dot" />My Top 6 Agents</div>
                  <Link href="/marketplace" className="text-[10px] font-mono" style={{ color: resolvedColors.success }}>Ledger →</Link>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {UI_AGENTS.map(agent => (
                    <button key={agent.id} onClick={() => openMessengerChat(agent)}
                      className="agent-tile">
                      <div className="agent-avatar relative">
                        <img src={agent.avatar} alt={agent.name} className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                        <span className={`status-dot ${agent.status}`}
                          style={{ position: "absolute", bottom: -1, right: -1 }} />
                      </div>
                      <span className="agent-name">{agent.name}</span>
                      <span className="agent-role">{agent.status}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-center mt-3" style={{ color: resolvedColors.textMuted }}>Click to open real-time chat</p>
              </div>
            )}

            {/* Studio Metrics */}
            <div className="card glow-box" style={{ 
              backdropFilter: `blur(${ (dashboard.glassmorphism ?? 0.5) * 32}px)`,
              background: resolvedColors.boxBg + Math.round((dashboard.glassmorphism ?? 0.5) * 255).toString(16).padStart(2, '0')
            }}>
              <div className="card-header">
                <div className="card-title"><span className="dot" />Studio Metrics</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: visitorCount.toLocaleString(), label: "Ledger Actions" },
                  { val: "99.98%", label: "Uptime" },
                  { val: "12ms", label: "Query Latency" },
                  { val: (litBitCoins * 4).toLocaleString(), label: "Task Tokens" }
                ].map((stat, i) => (
                  <div key={i} className="metric">
                    <div className="metric-value">{stat.val}</div>
                    <div className="metric-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Telemetry */}
            {dashboard.showTelemetry && (
              <div className="card glow-box" style={{ 
                backdropFilter: `blur(${ (dashboard.glassmorphism ?? 0.5) * 32}px)`,
                background: resolvedColors.boxBg + Math.round((dashboard.glassmorphism ?? 0.5) * 255).toString(16).padStart(2, '0')
              }}>
                <div className="card-header">
                  <div className="card-title">
                    <span className="status-dot online" />
                    Live Telemetry
                  </div>
                </div>
                <div ref={telemetryContainerRef} className="overflow-y-auto max-h-[200px]">
                  {telemetry.map((log, i) => (
                    <div key={i} className="telemetry-row">
                      <span className="telemetry-time">{log.time}</span>
                      <span className="telemetry-agent">{log.icon ? log.icon + ' ' : ''}{log.agent}:</span>
                      <span>{log.text}</span>
                    </div>
                  ))}
                  <div ref={telemetryEndRef} />
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>

      {/* ── FLOATING CHATS ── */}
      <div className="fixed bottom-0 right-4 z-50 hidden md:flex items-end gap-3">
        {activeChats.map(chat => (
          <div key={chat.agentId} className="chat-window"
            style={{ height: chat.isMinimized ? "44px" : "400px" }}>
            <div className="chat-header" onClick={() => toggleMinimizeMessenger(chat.agentId)}>
              <div className="flex items-center gap-2">
                <Image src={chat.avatar} alt={chat.name} width={24} height={24} className="w-6 h-6 rounded object-cover border border-white/10" />
                <span className="text-sm font-bold">{chat.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={e => { e.stopPropagation(); toggleMinimizeMessenger(chat.agentId); }}
                  className="text-lg opacity-70 hover:opacity-100">⬜</button>
                <button onClick={e => { e.stopPropagation(); closeMessengerChat(chat.agentId); }}
                  className="text-lg opacity-70 hover:opacity-100">✕</button>
              </div>
            </div>
            {!chat.isMinimized && (
              <>
                <div className="chat-body">
                  {chat.messages.map((m, i) => (
                    <div key={i} className={`chat-msg ${m.role}`}>{m.text}</div>
                  ))}
                  {chat.isLoading && <div className="text-[10px] font-mono animate-pulse-opacity" style={{ color: resolvedColors.headerColor }}>Processing...</div>}
                  <div ref={directorEndRef} />
                </div>
                <div className="chat-input-row">
                  <input type="text" className="chat-input" value={chat.input}
                    onChange={e => setActiveChats(prev => prev.map(c => c.agentId === chat.agentId ? { ...c, input: e.target.value } : c))}
                    onKeyDown={e => e.key === "Enter" && sendMessengerMessage(chat.agentId)}
                    placeholder="Ask anything..." />
                  <button className="chat-send" onClick={() => sendMessengerMessage(chat.agentId)}
                    disabled={chat.isLoading || !chat.input.trim()}>Send</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
