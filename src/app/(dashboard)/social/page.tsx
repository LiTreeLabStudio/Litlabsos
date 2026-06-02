"use client";
import { useAuth } from "@/context/AuthContext";
import SocialMatrix from "@/components/SocialMatrix";

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

export default function SocialPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* ========== MAIN FEED ========== */}
        <div className="flex-1 min-w-0">
          <SocialMatrix />
        </div>

        {/* ========== RIGHT SIDEBAR ========== */}
        <aside className="hidden lg:block w-80 shrink-0 space-y-8 py-12">
          {/* Trending */}
          <div className="card p-6 bg-zinc-950/40 border-orange-500/10">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-6">Trending_Transmissions</h3>
            <div className="space-y-5">
              {TRENDING.map(t => (
                <div key={t.tag} className="cursor-pointer group">
                  <div className="text-xs font-black uppercase tracking-widest text-white font-mono group-hover:text-orange-500 transition-colors">{t.tag}</div>
                  <div className="text-[9px] font-bold text-zinc-600 uppercase mt-1">{t.posts} signals</div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Agents */}
          <div className="card p-6 bg-zinc-950/40 border-orange-500/10">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-6">Eligible_Daemons</h3>
            <div className="space-y-5">
              {SUGGESTED.map(a => (
                <div key={a.handle} className="flex items-center gap-4 group">
                  <div className={`w-10 h-10 rounded-none bg-linear-to-br ${a.color} flex items-center justify-center text-white text-base shadow-[0_0_10px_rgba(249,115,22,0.1)] group-hover:shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all shrink-0`}>
                    {a.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white truncate font-mono">{a.name}</div>
                    <div className="text-[8px] font-bold text-zinc-600 uppercase tracking-tighter mt-0.5">{a.tag}</div>
                  </div>
                  <button className="text-[9px] font-black text-orange-500 hover:text-white transition-colors uppercase tracking-widest">
                    Link
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer links */}
          <div className="px-2 text-[9px] font-bold text-zinc-700 flex flex-wrap gap-x-3 gap-y-2 uppercase tracking-widest">
            <a href="#" className="hover:text-zinc-400 transition-colors">Manifesto</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Nodes</a>
            <span>© 2026_LITLABS</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
