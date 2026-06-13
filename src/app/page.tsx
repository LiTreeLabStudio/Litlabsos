"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { useTheme } from "@/context/ThemeContext";
import { useProfile } from "@/context/ProfileContext";
import dynamic from "next/dynamic";
import { 
  Zap, Activity, Users, MessageSquare, Play, 
  ChevronRight, ArrowRight, Shield, ShoppingBag, 
  ImageIcon, Sparkles, Wand2, Download, Share2, 
  Plus, Search, Maximize, X, MoreHorizontal,
  Settings, Radio, Layout, Terminal
} from "lucide-react";

const NavAuth = dynamic(
  () => import("@/components/ClerkAuth").then((m) => ({ default: m.NavAuth })),
  { ssr: false }
);

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

interface TelemetryLog {
  time: string;
  agent: string;
  text: string;
  icon?: string;
}

interface ActiveChat {
  agentId: string;
  name: string;
  avatar: string;
  messages: { role: "user" | "agent"; text: string }[];
  input: string;
  isMinimized: boolean;
  isLoading: boolean;
}

// ── UTILS ──────────────────────────────────────────────
const AGENT_AVATARS: Record<string, string> = {
  director: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Director&backgroundColor=00ffff",
  champion: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Champion&backgroundColor=00ff41",
  'code-champion': "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Code&backgroundColor=ff0080",
  'social-dominator': "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Social&backgroundColor=ff6b35",
  'data-slayer': "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Data&backgroundColor=7c3aed",
  'writing-coach': "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Write&backgroundColor=fbbf24",
  'music-producer': "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Music&backgroundColor=22c55e",
  'pixel-forge': "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Pixel&backgroundColor=00d4ff",
};

const UI_AGENTS = [
  { id: "director", name: "Director", status: "online", avatar: AGENT_AVATARS.director },
  { id: "champion", name: "Champion", status: "online", avatar: AGENT_AVATARS.champion },
  { id: "code", name: "Code Champion", status: "online", avatar: AGENT_AVATARS['code-champion'] },
  { id: "social", name: "Social Dominator", status: "online", avatar: AGENT_AVATARS['social-dominator'] },
  { id: "data", name: "Data Slayer", status: "online", avatar: AGENT_AVATARS['data-slayer'] },
  { id: "pixel", name: "Pixel Forge", status: "online", avatar: AGENT_AVATARS['pixel-forge'] },
];

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
    glassmorphism: 0.5,
    backgroundOpacity: 1,
  };

  const [showThemeEditor, setShowThemeEditor] = useState(false);
  const [showTuning, setShowTuning] = useState(false);
  const [crtEnabled, setCrtEnabled] = useState(false);
  const [visitorCount, setVisitorCount] = useState(133921);
  const [musicUrl, setMusicUrl] = useState("https://open.spotify.com/embed/playlist/37i9dQZF1DXdLEN7SvAsmU");
  const [litBitCoins, setLitBitCoins] = useState(500);
  const [claimedToday, setClaimedToday] = useState(false);
  const [postComposerText, setPostComposerText] = useState("");
  const [postComposerMood, setPostComposerMood] = useState("Focused");

  const [activeChats, setActiveChats] = useState<ActiveChat[]>([]);
  const [discoverQuery, setDiscoverQuery] = useState("");
  
  const DISCOVERABLE_ARCHITECTS = [
    { name: "Zero_Dev", handle: "@zero", avatar: AGENT_AVATARS.director },
    { name: "Neural_Knight", handle: "@knight", avatar: AGENT_AVATARS.champion },
    { name: "Synapse_CEO", handle: "@synapse", avatar: AGENT_AVATARS['code-champion'] },
  ];

  const connections = dashboard.connections || [];

  const handleAddArchitect = (handle: string) => {
    if (connections.includes(handle)) return;
    setDashboard({ connections: [...connections, handle] });
    addTelemetryLog("Director", `Synchronized neural link with ${handle}.`, "🔗");
  };

  const [orchestratorAgent1, setOrchestratorAgent1] = useState("director");
  const [orchestratorAgent2, setOrchestratorAgent2] = useState("code");
  const [orchestratorTopic, setOrchestratorTopic] = useState("Automated SaaS Marketing Pipeline");
  const [orchestratorLogs, setOrchestratorLogs] = useState<{ from: string; text: string; timestamp: string }[]>([]);
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

  const telemetryContainerRef = useRef<HTMLDivElement>(null);
  const telemetryEndRef = useRef<HTMLDivElement>(null);

  const addTelemetryLog = (agent: string, text: string, icon = "") => {
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
    setTelemetry(prev => [...prev, { time, agent, text, icon }].slice(-50));
  };

  const claimDailyBonus = () => {
    if (claimedToday) return;
    setLitBitCoins(prev => prev + 50);
    setClaimedToday(true);
    addTelemetryLog("System", "Claimed daily LiTBit bonus: +50 coins", "🪙");
  };

  const submitStatusPost = () => {
    if (!postComposerText.trim()) return;
    const newPost: FeedPost = {
      id: `post_${Date.now()}`,
      author: dashboard.displayName || profile.displayName || "Architect",
      handle: `@${dashboard.username || profile.username || "ceo"}`,
      avatar: dashboard.customAvatar || AGENT_AVATARS.champion,
      time: "Just now",
      content: postComposerText,
      likes: 0,
      liked: false,
      mood: postComposerMood,
      comments: []
    };
    setFeeds([newPost, ...feeds]);
    setPostComposerText("");
    addTelemetryLog("System", "Broadcasted manual status update to neural feed.", "📡");
  };

  const handleLikePost = (id: string) => {
    setFeeds(feeds.map(f => f.id === id ? { ...f, likes: f.liked ? f.likes - 1 : f.likes + 1, liked: !f.liked } : f));
  };

  const handleStartOrchestrator = () => {
    if (orchestratorStatus === "running") {
      setOrchestratorStatus("idle");
      addTelemetryLog("Director", "Suspended active boardroom session.");
      return;
    }
    setOrchestratorStatus("running");
    addTelemetryLog("Director", `Initializing Boardroom: ${orchestratorAgent1} + ${orchestratorAgent2} on topic "${orchestratorTopic}"`);
    setOrchestratorLogs([]);
  };

  const openMessengerChat = (agent: any) => {
    if (activeChats.find(c => c.agentId === agent.id)) {
      setActiveChats(activeChats.map(c => c.agentId === agent.id ? { ...c, isMinimized: false } : c));
      return;
    }
    setActiveChats([...activeChats, {
      agentId: agent.id,
      name: agent.name,
      avatar: agent.avatar,
      messages: [{ role: "agent", text: `Ready to assist with "${orchestratorTopic}". State your directive.` }],
      input: "",
      isMinimized: false,
      isLoading: false
    }]);
  };

  if (!isLoaded) return null;

  return (
    <div className="relative min-h-screen transition-all duration-700" style={{ 
      backgroundColor: resolvedColors.bgColor, 
      color: resolvedColors.textColor,
      backgroundImage: dashboard.customBackground ? `url(${dashboard.customBackground})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      {/* Background Overlay */}
      {dashboard.customBackground && (
        <div className="fixed inset-0 pointer-events-none z-0" style={{ 
          backgroundColor: resolvedColors.bgColor, 
          opacity: 1 - (dashboard.backgroundOpacity ?? 1) 
        }} />
      )}

      {/* CRT Overlay */}
      {crtEnabled && <div className="crt-overlay" />}

      {/* ── TOP HEADER ── */}
      <header className="relative z-[60] border-b backdrop-blur-xl" style={{ borderColor: "rgba(255,255,255,0.06)", background: resolvedColors.boxBg + "aa" }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => { setShowThemeEditor(!showThemeEditor); setShowTuning(false); }} className="btn btn-ghost text-xs hover-lift" style={{ color: resolvedColors.textMuted }}>
              Skin Editor
            </button>
            <button onClick={() => { setShowTuning(!showTuning); setShowThemeEditor(false); }} className="btn btn-ghost text-xs hover-lift flex items-center gap-1.5" style={{ color: resolvedColors.accentColor }}>
              <Zap size={10} /> Tuning Studio
            </button>
            <button onClick={() => setDashboard({ cinematicMode: !dashboard.cinematicMode })} className="btn btn-ghost text-xs hover-lift flex items-center gap-1.5" style={{ color: dashboard.cinematicMode ? resolvedColors.accentColor : resolvedColors.textMuted }}>
              <Layout size={10} /> Cinematic: {dashboard.cinematicMode ? "ON" : "OFF"}
            </button>
            <button onClick={() => setCrtEnabled(!crtEnabled)} className="btn btn-ghost text-xs hover-lift hidden sm:block" style={{ color: resolvedColors.textMuted }}>
              CRT: {crtEnabled ? "ON" : "OFF"}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-[9px] font-mono tracking-widest opacity-40 uppercase">Latency</span>
              <span className="text-[10px] font-mono font-bold text-success">12ms</span>
            </div>
            <div className="h-8 w-[1px] bg-white/5" />
            <NavAuth linkColor={resolvedColors.linkColor} />
          </div>
        </div>
      </header>

      {/* ── TUNING STUDIO DRAWER ── */}
      {showTuning && (
        <div className="relative z-50 border-b backdrop-blur-2xl" style={{ borderColor: "rgba(255,255,255,0.06)", background: resolvedColors.boxBg + "ee" }}>
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <p className="section-eyebrow flex items-center gap-2"><Users size={12} /> Profile Tuning</p>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-muted uppercase">Display Name</label>
                    <input type="text" value={dashboard.displayName || ""} onChange={e => setDashboard({ displayName: e.target.value })} className="input text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-muted uppercase">Avatar URL</label>
                    <input type="text" value={dashboard.customAvatar || ""} onChange={e => setDashboard({ customAvatar: e.target.value })} className="input text-xs" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <p className="section-eyebrow flex items-center gap-2"><ImageIcon size={12} /> Visual Tuning</p>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-muted uppercase">Background URL</label>
                    <input type="text" value={dashboard.customBackground || ""} onChange={e => setDashboard({ customBackground: e.target.value })} className="input text-xs" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-muted uppercase">Glass Blur</label>
                      <input type="range" min="0" max="1" step="0.1" value={dashboard.glassmorphism ?? 0.5} onChange={e => setDashboard({ glassmorphism: parseFloat(e.target.value) })} className="w-full h-1 bg-white/10 rounded-lg appearance-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-muted uppercase">Opacity</label>
                      <input type="range" min="0" max="1" step="0.1" value={dashboard.backgroundOpacity ?? 1} onChange={e => setDashboard({ backgroundOpacity: parseFloat(e.target.value) })} className="w-full h-1 bg-white/10 rounded-lg appearance-none" />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/5">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" checked={!!dashboard.enableWatermark} onChange={e => setDashboard({ enableWatermark: e.target.checked })} className="hidden" />
                      <div className={`w-3 h-3 rounded-sm border ${dashboard.enableWatermark ? 'bg-orange-500 border-orange-500' : 'border-white/20'}`} />
                      <span className="text-[11px] font-mono text-muted">Watermark Logo</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <p className="section-eyebrow flex items-center gap-2"><Layout size={12} /> Layout Tuning</p>
                <div className="grid grid-cols-2 gap-2">
                   {[
                    { key: 'showFeed', label: 'Social Feed' },
                    { key: 'showBoardroom', label: 'Boardroom' },
                    { key: 'showTelemetry', label: 'Telemetry' },
                    { key: 'showAgents', label: 'Top Agents' },
                    { key: 'showAudio', label: 'Audio Deck' },
                  ].map(item => (
                    <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={!!(dashboard as any)[item.key]} onChange={e => setDashboard({ [item.key]: e.target.checked })} className="hidden" />
                      <div className={`w-3 h-3 rounded-sm border ${ (dashboard as any)[item.key] ? 'bg-cyan-400 border-cyan-400' : 'border-white/20'}`} />
                      <span className="text-[10px] font-mono text-muted">{item.label}</span>
                    </label>
                  ))}
                </div>
                <button onClick={resetTheme} className="btn btn-ghost text-[10px] w-full mt-2 border border-white/5">Reset System</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {dashboard.cinematicMode ? (
          /* CINEMATIC MODE */
          <div className="grid md:grid-cols-2 gap-8 items-start min-h-[70vh]">
            <div className="card glow-box min-h-[500px] flex flex-col" style={{ backdropFilter: `blur(${(dashboard.glassmorphism ?? 0.5) * 48}px)`, background: resolvedColors.boxBg + 'aa' }}>
              <div className="card-header border-b border-white/5 pb-4">
                <h2 className="text-xl font-black gradient-text flex items-center gap-2"><Activity size={18} /> Neural Boardroom</h2>
              </div>
              <div className="flex-1 py-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <select value={orchestratorAgent1} onChange={e => setOrchestratorAgent1(e.target.value)} className="select text-sm">{UI_AGENTS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
                  <select value={orchestratorAgent2} onChange={e => setOrchestratorAgent2(e.target.value)} className="select text-sm">{UI_AGENTS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
                </div>
                <input type="text" value={orchestratorTopic} onChange={e => setOrchestratorTopic(e.target.value)} className="input text-sm" placeholder="Business topic..." />
                <button onClick={handleStartOrchestrator} className="btn btn-primary w-full py-3" style={{ background: orchestratorStatus === "running" ? resolvedColors.warning : resolvedColors.linkColor, color: "#0a0a0f" }}>
                  {orchestratorStatus === "running" ? "Pause Execution" : "Initialize Boardroom"}
                </button>
                <div className="mt-4 p-4 rounded-xl flex-1 overflow-y-auto max-h-[300px]" style={{ background: "rgba(0,0,0,0.4)" }}>
                  {orchestratorLogs.map((log, i) => (
                    <div key={i} className="text-xs mb-1 font-mono"><span style={{ color: resolvedColors.accentColor }}>{log.from}:</span> {log.text}</div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card glow-box min-h-[500px] flex flex-col" style={{ backdropFilter: `blur(${(dashboard.glassmorphism ?? 0.5) * 48}px)`, background: resolvedColors.boxBg + 'aa' }}>
              <div className="card-header border-b border-white/5 pb-4">
                <h2 className="text-xl font-black gradient-text flex items-center gap-2"><Zap size={18} /> Live Telemetry</h2>
              </div>
              <div className="flex-1 py-4 overflow-y-auto font-mono text-xs space-y-1">
                {telemetry.map((log, i) => (
                  <div key={i} className="p-1 hover:bg-white/5 rounded"><span className="opacity-30">[{log.time}]</span> <span className="text-orange-400 font-bold">{log.agent}:</span> {log.text}</div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* NORMAL MODE */
          <div className="grid md:grid-cols-12 gap-6 items-start">
            {/* Left Sidebar */}
            <aside className="md:col-span-3 space-y-5">
              <div className="card glow-box" style={{ backdropFilter: `blur(${(dashboard.glassmorphism ?? 0.5) * 32}px)`, background: resolvedColors.boxBg + 'aa' }}>
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2" style={{ borderColor: resolvedColors.accentColor }}>
                    {dashboard.customAvatar ? <img src={dashboard.customAvatar} alt="P" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-zinc-800 font-black">L</div>}
                  </div>
                  <div>
                    <h2 className="text-base font-bold">{dashboard.displayName || profile.displayName || "Architect"}</h2>
                    <p className="text-[10px] opacity-40 font-mono">@{dashboard.username || profile.username || "ceo"}</p>
                  </div>
                  <select value={postComposerMood} onChange={e => setPostComposerMood(e.target.value)} className="select text-[10px] w-full py-1.5" style={{ background: "rgba(0,0,0,0.2)" }}>
                    <option value="Focused">Focused</option><option value="Building">Building</option><option value="Creative">Creative</option>
                  </select>
                  <Link href="/profile" className="btn btn-secondary w-full text-[10px] py-2">My Profile →</Link>
                </div>
              </div>

              <div className="card glow-box" style={{ background: resolvedColors.boxBg + 'aa' }}>
                <div className="card-header"><div className="card-title">LiTBit Coins</div></div>
                <div className="flex justify-between items-center"><span className="text-muted text-xs">Balance</span><span className="text-xl font-black" style={{ color: resolvedColors.accentColor }}>{litBitCoins}</span></div>
                <button onClick={claimDailyBonus} disabled={claimedToday} className="btn btn-primary w-full mt-3 text-[10px] py-2">{claimedToday ? "✓ Claimed" : "+50 Daily"}</button>
              </div>

              {dashboard.showAudio && (
                <div className="card glow-box p-0 overflow-hidden" style={{ background: resolvedColors.boxBg + 'aa' }}>
                  <iframe src={musicUrl} className="w-full" height="152" style={{ border: 0 }} allow="autoplay" loading="lazy" />
                </div>
              )}
            </aside>

            {/* Center Feed */}
            <div className="md:col-span-6 space-y-5">
              {dashboard.showFeed && (
                <>
                  <div className="card glow-box p-0 overflow-hidden border-0" style={{ background: resolvedColors.boxBg + 'aa' }}>
                    <div className="h-24 bg-zinc-800 relative" style={{ backgroundImage: dashboard.customBanner ? `url(${dashboard.customBanner})` : 'none', backgroundSize: 'cover' }}>
                      <div className="absolute inset-0 bg-black/40" />
                    </div>
                    <div className="px-6 py-4">
                      <h1 className="text-xl font-black gradient-text uppercase tracking-tight">{dashboard.displayName || "LiTreeLabStudios"}</h1>
                      <div className="flex gap-2 mt-3">
                        <Link href="/builder" className="btn btn-secondary text-[10px] px-4 py-2">Builder</Link>
                        <Link href="/marketplace" className="btn btn-secondary text-[10px] px-4 py-2">Market</Link>
                      </div>
                    </div>
                  </div>

                  <div className="card glow-box" style={{ background: resolvedColors.boxBg + 'aa' }}>
                    <textarea value={postComposerText} onChange={e => setPostComposerText(e.target.value)} placeholder="Neural broadcast..." className="textarea text-sm mb-3" rows={2} style={{ background: "rgba(0,0,0,0.2)" }} />
                    <div className="flex justify-between items-center"><span className="badge text-[10px]">{postComposerMood}</span><button onClick={submitStatusPost} className="btn btn-primary text-xs px-4">Broadcast</button></div>
                  </div>

                  <div className="space-y-4">
                    {feeds.map(post => (
                      <article key={post.id} className="card glow-box" style={{ background: resolvedColors.boxBg + 'aa' }}>
                        <div className="flex items-center gap-3 mb-3">
                          <img src={post.avatar} alt="A" className="w-10 h-10 rounded-lg object-cover" />
                          <div><p className="text-sm font-bold">{post.author}</p><p className="text-[10px] opacity-40">{post.handle} · {post.time}</p></div>
                        </div>
                        <p className="text-sm leading-relaxed">{post.content}</p>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Right Sidebar */}
            <aside className="md:col-span-3 space-y-5">
              {dashboard.showTelemetry && (
                <div className="card glow-box" style={{ background: resolvedColors.boxBg + 'aa' }}>
                  <div className="card-header"><div className="card-title">Live Telemetry</div></div>
                  <div className="overflow-y-auto max-h-[160px] text-[10px] font-mono space-y-1">
                    {telemetry.map((log, i) => (
                      <div key={i}><span className="opacity-30">{log.time}</span> <span className="text-cyan-400">{log.agent}:</span> {log.text}</div>
                    ))}
                  </div>
                </div>
              )}

              {connections.length > 0 && (
                <div className="card glow-box" style={{ background: resolvedColors.boxBg + 'aa' }}>
                  <div className="card-header"><div className="card-title">Neural Network</div></div>
                  <div className="space-y-2">
                    {connections.map(h => (
                      <div key={h} className="text-[10px] p-2 bg-white/5 rounded border border-white/5 flex justify-between">
                        <span>{h}</span><span className="status-dot online" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="card glow-box" style={{ background: resolvedColors.boxBg + 'aa' }}>
                <div className="card-header"><div className="card-title">Architect Discovery</div></div>
                <div className="space-y-2">
                  {DISCOVERABLE_ARCHITECTS.map(arch => (
                    <div key={arch.handle} className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5 overflow-hidden">
                      <span className="text-[10px] truncate mr-2">{arch.handle}</span>
                      <button onClick={() => handleAddArchitect(arch.handle)} className={`px-2 py-1 rounded text-[8px] font-bold uppercase ${connections.includes(arch.handle) ? 'bg-green-500/20 text-green-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                        {connections.includes(arch.handle) ? 'Active' : 'Connect'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      {/* Floating Chats */}
      <div className="fixed bottom-0 right-4 z-50 flex items-end gap-3 pointer-events-none">
        {activeChats.map(chat => (
          <div key={chat.agentId} className="w-72 bg-zinc-900 border border-white/10 rounded-t-xl pointer-events-auto shadow-2xl" style={{ height: chat.isMinimized ? '44px' : '400px' }}>
            <div className="p-3 border-b border-white/10 flex justify-between items-center cursor-pointer" onClick={() => setActiveChats(activeChats.map(c => c.agentId === chat.agentId ? { ...c, isMinimized: !c.isMinimized } : c))}>
              <span className="text-xs font-bold">{chat.name}</span>
              <button onClick={(e) => { e.stopPropagation(); setActiveChats(activeChats.filter(c => c.agentId !== chat.agentId)); }} className="text-muted">✕</button>
            </div>
            {!chat.isMinimized && (
              <div className="p-3 flex flex-col h-[356px]">
                <div className="flex-1 overflow-y-auto space-y-3 text-xs mb-3">
                  {chat.messages.map((m, i) => <div key={i} className={`p-2 rounded-lg ${m.role === 'agent' ? 'bg-white/5' : 'bg-cyan-500/20 ml-4'}`}>{m.text}</div>)}
                </div>
                <input type="text" className="input text-xs" placeholder="neural link..." onKeyDown={e => { if(e.key === 'Enter') { /* handle send */ } }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
