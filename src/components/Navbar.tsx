"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: "🏠" },
  { href: "/gallery", label: "Explore", icon: "🏛" },
  { href: "/marketplace", label: "Forge", icon: "🔧" },
  { href: "/chat", label: "Cockpit", icon: "⚡" },
  { href: "/social", label: "Feed", icon: "👥" },
];

interface User {
  id: string;
  email: string;
  name: string | null;
  isAdmin: boolean;
}

export default function Navbar({ user: ssrUser }: { user?: User | null }) {
  const pathname = usePathname();
  const { user: clientUser } = useAuth();
  const user = ssrUser ?? clientUser;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-orange-500/20 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-10">
          <Link href={user ? "/dashboard" : "/"} className="text-2xl font-black uppercase tracking-[0.2em] text-white font-heading drop-shadow-lg group italic">
            LiT<span className="text-orange-500 glow-text-orange group-hover:animate-pulse">Tree</span>Lab
          </Link>
          
          {/* System Ticker (Desktop) */}
          <div className="hidden xl:flex items-center gap-6 border-l border-white/5 pl-10 h-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-none bg-orange-500 animate-pulse shadow-[0_0_8px_#f97316]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500/60">Neural_Link: Stable</span>
            </div>
            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700 animate-flicker">
              CPU_LOAD: 2.4% // AGENTS_LIVE: 14
            </div>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {NAV_ITEMS.filter(item => {
            const adminOnly = ["/chat", "/builder", "/marketplace"].some(p => item.href.startsWith(p));
            if (adminOnly) return user?.isAdmin;
            return true;
          }).map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  isActive
                    ? "text-orange-500 glow-text-orange"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-6">
              <Link
                href="/settings"
                className="flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-none border border-orange-500/40 bg-orange-500/10 flex items-center justify-center text-orange-500 text-[10px] font-black shadow-lg group-hover:bg-orange-500 group-hover:text-black transition-all duration-500">
                  {(user.name?.charAt(0) || user.email?.charAt(0) || "U").toUpperCase()}
                </div>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hidden lg:block group-hover:text-white transition-colors">
                  {user.name || user.email?.split("@")[0]}
                </span>
              </Link>
              <form action="/api/auth/logout" method="POST">
                <button type="submit" className="text-[9px] font-black text-zinc-800 hover:text-red-500 transition-colors uppercase tracking-[0.2em]">
                  Terminate
                </button>
              </form>
            </div>
          ) : (
            <Link href="/login" className="btn-cyber btn-cyber-outline py-2 px-6">
              SIGN_IN
            </Link>
          )}

          {/* Mobile toggle */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-none border border-white/5 text-zinc-500 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-orange-500/10 bg-zinc-950 p-6 shadow-2xl">
          <div className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-4 py-4 text-xs font-black uppercase tracking-[0.3em] border ${
                    isActive ? "border-orange-500/40 bg-orange-500/5 text-white" : "border-transparent text-zinc-600"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-lg">{item.icon}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
