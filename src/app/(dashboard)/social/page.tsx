"use client";

import SocialMatrix from "@/components/SocialMatrix";
import { useAuth } from "@/context/AuthContext";

const FRIENDS = [
  { name: "Code Champion", avatar: "🧩", status: "online" },
  { name: "Data Slayer", avatar: "📊", status: "online" },
  { name: "Social Bot", avatar: "🔥", status: "away" },
  { name: "UX Wizard", avatar: "🎨", status: "online" },
  { name: "Cloud Arch", avatar: "☁️", status: "offline" },
  { name: "DevOps Pro", avatar: "🔧", status: "online" },
  { name: "ML Engineer", avatar: "🤖", status: "away" },
  { name: "Security Bot", avatar: "🛡️", status: "online" },
  { name: "API Master", avatar: "⚡", status: "online" },
];

export default function SocialPage() {
  const { user } = useAuth();
  const displayName = user?.name || user?.email?.split("@")[0] || "Builder";
  const initial = user?.name?.charAt(0) || user?.email?.charAt(0) || "U";

  return (
    <div className="w-full space-y-6">
      {/* Profile Header — Facebook/MySpace Style */}
      <div className="bg-zinc-950/80 border border-white/10 rounded-xl overflow-hidden shadow-lg relative">
        {/* Cover Photo */}
        <div className="h-48 sm:h-56 bg-gradient-to-br from-orange-600/20 via-zinc-900 to-red-600/20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
          {/* Cover image overlay grid */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
          </div>
        </div>

        {/* Profile Info — Overlapping Avatar */}
        <div className="px-6 pb-6 relative">
          {/* Avatar overlapping cover */}
          <div className="absolute -top-12 left-6">
            <div className="w-24 h-24 rounded-full bg-zinc-900 border-4 border-zinc-950 flex items-center justify-center text-3xl shadow-xl">
              {initial}
            </div>
          </div>

          {/* Name + Actions */}
          <div className="pt-14 sm:pt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">{displayName}</h1>
              <p className="text-sm text-zinc-400 mt-0.5">AI Systems Architect & Autonomous Agent Developer</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                <span>📍 LitLabs HQ</span>
                <span>📅 Joined June 2026</span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-sm transition-colors shadow-md shadow-blue-600/20">
                + Add Friend
              </button>
              <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg text-sm transition-colors border border-zinc-700">
                ✉️ Message
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex gap-6 mt-4 pt-4 border-t border-zinc-800/60">
            <div className="text-center">
              <div className="text-lg font-black text-white">142</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-black text-white">1.2K</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-black text-white">842</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Following</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-black text-white">99.9%</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="bg-zinc-950/80 border border-white/10 rounded-xl p-6 shadow-lg">
        <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-3">About</h3>
        <p className="text-sm text-zinc-300 leading-relaxed">
          I build AI-powered systems that run autonomously. Specializing in LLM integration,
          multi-agent orchestration, and self-healing infrastructure. Python. FastAPI. Next.js.
          Currently lead architect at — LitLabs, building the future of autonomous AI platforms.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {["Python", "Next.js", "Gemini API", "FastAPI", "Supabase", "Docker"].map(tag => (
            <span key={tag} className="px-3 py-1 bg-zinc-800/60 border border-zinc-700/50 rounded-full text-[11px] font-semibold text-zinc-300">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Friends Grid */}
      <div className="bg-zinc-950/80 border border-white/10 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Friends — {FRIENDS.length}</h3>
          <button className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors">See All</button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {FRIENDS.map(f => (
            <div key={f.name} className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-zinc-900/50 cursor-pointer transition-colors group">
              <div className="relative">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl ${
                  f.status === "online" ? "bg-green-600/20 border-2 border-green-500/50" :
                  f.status === "away" ? "bg-yellow-600/20 border-2 border-yellow-500/50" :
                  "bg-zinc-800 border-2 border-zinc-700"
                }`}>
                  {f.avatar}
                </div>
                {f.status === "online" && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-zinc-950 rounded-full" />
                )}
                {f.status === "away" && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-yellow-500 border-2 border-zinc-950 rounded-full" />
                )}
              </div>
              <span className="text-[11px] font-semibold text-zinc-300 group-hover:text-white transition-colors text-center leading-tight">
                {f.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* The Wall — Social Feed */}
      <div>
        <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4 px-1">The Wall</h3>
        <SocialMatrix />
      </div>
    </div>
  );
}
