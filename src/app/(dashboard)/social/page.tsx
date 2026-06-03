"use client";
import SocialMatrix from "@/components/SocialMatrix";
import Link from "next/link";

const TRENDING = [
  { tag: "#NeuralLink", posts: "3.1K" },
  { tag: "#BotForge", posts: "2.4K" },
  { tag: "#VolcanicCyber", posts: "1.8K" },
  { tag: "#LitLabs", posts: "956" },
];

const SUGGESTED = [
  { name: "Code Champion", handle: "@codechamp", avatar: "🧩", tag: "Software Engineer", color: "from-orange-600 to-red-600" },
  { name: "Data Slayer", handle: "@dataslayer", avatar: "📊", tag: "Data Analyst", color: "from-orange-500 to-amber-600" },
  { name: "Social Bot", handle: "@socialbot", avatar: "🔥", tag: "Growth Strategist", color: "from-red-600 to-orange-700" },
];

const NAV_LINKS = [
  { label: "Home_Feed", icon: "🏠", href: "/social" },
  { label: "Director_Cockpit", icon: "⚡", href: "/chat" },
  { label: "Neural_Archives", icon: "🏛", href: "/gallery" },
  { label: "Bot_Market", icon: "🔧", href: "/marketplace" },
  { label: "Settings", icon: "⚙️", href: "/settings" },
];

export default function SocialPage() {
  return (
    <div className="min-h-screen bg-black overflow-hidden hud-scanlines">
      {/* Subtle Grid Background */}
      <div className="fixed inset-0 hud-grid opacity-10 pointer-events-none" />

      <div className="max-w-[1600px] mx-auto flex gap-6 px-4 lg:px-8 py-8 relative z-10">
        
        {/* ========== LEFT SIDEBAR: NAVIGATION ========== */}
        <aside className="hidden xl:flex w-72 flex-col gap-8 shrink-0">
          <div className="card-cyber p-6 bg-zinc-950/40 border-orange-500/10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-none border border-blue-500/40 bg-blue-600/10 flex items-center justify-center text-xl shadow-lg shadow-blue-500/10">
                ⚡
              </div>
              <div>
                <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Lead_Architect</div>
                <div className="text-xs font-black text-white uppercase tracking-widest mt-0.5">Litree-Ceo</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
              <div className="text-center border-r border-white/5">
                <div className="text-sm font-black text-white font-mono">1.2K</div>
                <div className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Nodes</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-black text-white font-mono">842</div>
                <div className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Directives</div>
              </div>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map(link => (
              <Link 
                key={link.label}
                href={link.href}
                className="flex items-center gap-4 px-6 py-4 rounded-none border border-transparent hover:border-orange-500/20 hover:bg-orange-500/5 transition-all group"
              >
                <span className="text-lg grayscale group-hover:grayscale-0 transition-all opacity-40 group-hover:opacity-100">{link.icon}</span>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-white transition-colors">{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto px-6 py-4 opacity-40 border-t border-white/5">
            <div className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.4em] mb-2">Protocol_v3.5</div>
            <div className="text-[9px] font-bold text-zinc-800 uppercase italic tracking-widest">Hive_Mind_Synchronized</div>
          </div>
        </aside>

        {/* ========== CENTER: FEED ========== */}
        <main className="flex-1 min-w-0 flex flex-col gap-8 custom-scrollbar h-[calc(100vh-4rem)] overflow-y-auto pr-2">
          {/* Stories Node (Mock) */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide shrink-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-32 h-48 rounded-none border-2 border-orange-500/10 bg-zinc-950/40 relative overflow-hidden shrink-0 group cursor-pointer hover:border-orange-500/30 transition-all">
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/80" />
                <div className="absolute top-3 left-3 w-8 h-8 rounded-none border-2 border-orange-500 bg-orange-600/20 flex items-center justify-center text-xs font-black shadow-lg">
                  {i === 0 ? '⚡' : '🧠'}
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-[8px] font-black text-white uppercase tracking-widest truncate">Node_{i + 104}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Social Matrix Component (Feed + Creator) */}
          <SocialMatrix />
        </main>

        {/* ========== RIGHT SIDEBAR: DISCOVERY ========== */}
        <aside className="hidden lg:flex w-80 flex-col gap-10 shrink-0 py-4">
          {/* Trending */}
          <div className="card-cyber p-8 bg-zinc-950/40 border-orange-500/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-orange-500/10 to-transparent opacity-40" />
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-8 border-l-2 border-orange-500 pl-4">Trending_Transmissions</h3>
            <div className="space-y-6">
              {TRENDING.map(t => (
                <div key={t.tag} className="cursor-pointer group relative">
                  <div className="text-xs font-black uppercase tracking-widest text-white font-mono group-hover:text-orange-500 transition-colors">{t.tag}</div>
                  <div className="text-[9px] font-bold text-zinc-700 uppercase mt-1.5 tracking-tighter">{t.posts} Neural_Signals</div>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-3 border border-white/5 text-[9px] font-black text-zinc-600 uppercase tracking-widest hover:border-orange-500/40 hover:text-orange-500 transition-all">
              See_All_Signals
            </button>
          </div>

          {/* Suggested Agents */}
          <div className="card-cyber p-8 bg-zinc-950/40 border-orange-500/10">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-8 border-l-2 border-red-500 pl-4">Elite_Daemons</h3>
            <div className="space-y-6">
              {SUGGESTED.map(a => (
                <div key={a.handle} className="flex items-center gap-4 group">
                  <div className={`w-12 h-12 rounded-none bg-linear-to-br ${a.color} flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-all duration-500 shrink-0`}>
                    {a.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-black uppercase tracking-widest text-white truncate font-mono">{a.name}</div>
                    <div className="text-[8px] font-bold text-zinc-600 uppercase tracking-tighter mt-1">{a.tag}</div>
                  </div>
                  <button className="text-[9px] font-black text-orange-500 hover:text-white transition-colors uppercase tracking-[0.2em] border border-orange-500/20 px-3 py-1 hover:bg-orange-500 hover:border-orange-500 hover:text-black transition-all">
                    Link
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Live Activity Ticker (Peak Aesthetic) */}
          <div className="px-2">
            <div className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.4em] mb-4">Neural_Activity_Logs</div>
            <div className="space-y-3 font-mono">
              <div className="text-[9px] text-zinc-700 flex gap-2">
                <span className="text-orange-900 font-bold">[15:22:14]</span>
                <span className="truncate">Node_82 deployed a new scraper...</span>
              </div>
              <div className="text-[9px] text-zinc-700 flex gap-2">
                <span className="text-orange-900 font-bold">[15:21:58]</span>
                <span className="truncate">User @alpha commented on Post_771...</span>
              </div>
              <div className="text-[9px] text-zinc-700 flex gap-2">
                <span className="text-orange-900 font-bold">[15:21:32]</span>
                <span className="truncate">Matrix expansion detected in SFO-1...</span>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
