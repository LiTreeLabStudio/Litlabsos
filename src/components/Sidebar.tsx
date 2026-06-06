"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "News Feed", icon: "📰", href: "/dashboard" },
  { label: "My Profile", icon: "👤", href: "/social" },
  { label: "Messages", icon: "💬", href: "/chat" },
  { label: "Build Agent", icon: "🛠️", href: "/builder" },
  { label: "Marketplace", icon: "🔧", href: "/marketplace" },
  { label: "AI Studio", icon: "🎭", href: "/ai-studio" },
  { label: "Gallery", icon: "🏛️", href: "/gallery" },
];

export default function Sidebar({ user }: { user: { name: string | null; email: string } | null }) {
  const pathname = usePathname();

  return (
    <aside className="hidden xl:flex w-64 flex-col gap-4 shrink-0 h-full overflow-y-auto custom-scrollbar pb-6 pr-4">
      {/* Mini Profile Card */}
      <Link href="/social" className="p-4 bg-zinc-950/60 border border-white/5 hover:border-white/10 rounded-xl transition-all cursor-pointer group mt-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-sm font-black shadow-lg">
            {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              {user?.name || user?.email?.split('@')[0] || "Guest"}
            </div>
            <div className="text-[10px] text-zinc-500">View Profile</div>
          </div>
        </div>
      </Link>

      {/* Nav Links */}
      <nav className="flex flex-col gap-0.5">
        {NAV_LINKS.map(link => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all group ${
                isActive
                  ? "bg-white/5 text-white font-semibold"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className={`text-lg ${isActive ? "opacity-100" : "opacity-50 group-hover:opacity-100"} transition-opacity`}>
                {link.icon}
              </span>
              <span className="text-sm">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 px-2">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-zinc-500 hover:bg-white/5 hover:text-white transition-all"
        >
          <span className="text-lg">⚙️</span>
          <span className="text-sm">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
