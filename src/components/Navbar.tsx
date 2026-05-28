"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: "◈" },
  { href: "/gallery", label: "Agents", icon: "🏛" },
  { href: "/marketplace", label: "Bot Forge", icon: "🔧" },
  { href: "/builder", label: "Build", icon: "🛠" },
  { href: "/agent-chat", label: "AI Chat", icon: "⚡" },
  { href: "/social", label: "Social", icon: "👥" },
];

export default function Navbar({ onLogout, user }: { onLogout: () => void; user?: any }) {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/dashboard" className="text-xl font-bold tracking-widest text-neon-cyan drop-shadow-[0_0_10px_rgba(0,242,254,0.5)]">
          LITLABS
        </Link>
        <ul className="hidden items-center gap-2 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  pathname === item.href
                    ? "bg-white/10 text-neon-cyan shadow-[0_0_20px_rgba(0,242,254,0.1)]"
                    : "text-text-secondary hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.icon} {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4">
          <span className="text-xs text-text-muted hidden sm:block font-code tracking-wider uppercase">{user?.name || user?.email?.split("@")[0]}</span>
          <button onClick={onLogout} className="text-[10px] text-text-muted hover:text-red-400 transition-colors font-code tracking-widest uppercase">
            Logout
          </button>
        </div>
      </div>
      {/* Mobile nav */}
      <div className="flex overflow-x-auto border-t border-white/5 px-4 py-2 md:hidden gap-2 bg-black/20">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`whitespace-nowrap rounded-lg px-4 py-1.5 text-xs font-medium transition-colors ${
              pathname === item.href ? "text-neon-cyan bg-white/10" : "text-text-secondary"
            }`}
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
