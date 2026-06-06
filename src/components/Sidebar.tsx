"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "News_Feed", icon: "📰", href: "/dashboard" },
  { label: "My_Profile", icon: "👤", href: "/social" },
  { label: "Director_Cockpit", icon: "⚡", href: "/chat" },
  { label: "Neural_Forge", icon: "🛠️", href: "/builder" },
  { label: "Bot_Market", icon: "🔧", href: "/marketplace" },
  { label: "UI_Studio", icon: "🎭", href: "/ai-studio" },
  { label: "Neural_Groups", icon: "👥", href: "/gallery" },
];

export default function Sidebar({ user }: { user: { name: string | null; email: string } | null }) {
  const pathname = usePathname();

  return (
    <aside className="hidden xl:flex w-72 flex-col gap-6 shrink-0 h-full overflow-y-auto custom-scrollbar pb-6 pr-4">
      {/* Mini Profile Card */}
      <Link href="/social" className="card-cyber p-4 bg-zinc-950/60 border-orange-500/10 hover:border-orange-500/30 transition-all cursor-pointer group mt-2">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-full border border-orange-500/40 bg-orange-600/10 flex items-center justify-center text-lg shadow-lg shadow-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
            {user?.name?.charAt(0) || user?.email?.charAt(0) || "👤"}
          </div>
          <div>
            <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Lead_Architect</div>
            <div className="text-xs font-black text-white uppercase tracking-widest mt-0.5">{user?.name || user?.email?.split('@')[0]}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
          <div className="text-center border-r border-white/5">
            <div className="text-xs font-black text-white font-mono">1.2K</div>
            <div className="text-[7px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Nodes</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-black text-white font-mono">842</div>
            <div className="text-[7px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Directives</div>
          </div>
        </div>
      </Link>

      {/* Nav Links */}
      <nav className="flex flex-col gap-1">
        {NAV_LINKS.map(link => {
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.label}
              href={link.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-md transition-all group ${isActive ? 'bg-orange-500/10 border-l-2 border-orange-500' : 'hover:bg-zinc-900 border-l-2 border-transparent'}`}
            >
              <span className={`text-xl transition-all ${isActive ? 'opacity-100' : 'grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100'}`}>{link.icon}</span>
              <span className={`text-[11px] font-bold tracking-widest uppercase transition-colors ${isActive ? 'text-orange-500' : 'text-zinc-400 group-hover:text-white'}`}>{link.label.replace('_', ' ')}</span>
            </Link>
          );
        })}
      </nav>

      {/* Shortcuts */}
      <div className="mt-4 pt-6 border-t border-zinc-900">
        <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-4 px-4">Your_Shortcuts</div>
        <div className="flex items-center gap-3 px-4 py-2 hover:bg-zinc-900 rounded-md cursor-pointer group">
           <div className="w-6 h-6 rounded-md bg-orange-600/20 border border-orange-500/50 flex items-center justify-center text-xs group-hover:bg-orange-500/40 transition-colors">🌋</div>
           <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest group-hover:text-white transition-colors">Volcanic UI Design</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 hover:bg-zinc-900 rounded-md cursor-pointer group">
           <div className="w-6 h-6 rounded-md bg-blue-600/20 border border-blue-500/50 flex items-center justify-center text-xs group-hover:bg-blue-500/40 transition-colors">🤖</div>
           <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest group-hover:text-white transition-colors">Bot Forge Devs</span>
        </div>
      </div>
      
      <div className="mt-auto pt-6 px-4 opacity-40">
        <div className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.4em] mb-2">Protocol_v3.5</div>
        <div className="text-[9px] font-bold text-zinc-800 uppercase italic tracking-widest">Hive_Mind_Synchronized</div>
      </div>
    </aside>
  );
}
