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
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-cyber-bg/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href={user ? "/dashboard" : "/"} className="text-xl font-black uppercase tracking-widest text-white font-mono drop-shadow-md group">
            LiT<span className="text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] group-hover:animate-pulse">Tree</span>Lab
          </Link>
          
          {/* System Ticker (Desktop) */}
          <div className="hidden lg:flex items-center gap-4 border-l border-white/10 pl-6 h-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_#f97316]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500/70">Neural_Link: Stable</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 animate-flicker">
              CPU_LOAD: 2.4% // AGENTS_LIVE: 14
            </div>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
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
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/settings"
                className="flex items-center gap-2 rounded-none border border-orange-500/30 bg-zinc-950 px-3 py-1.5 hover:bg-orange-500/10 hover:border-orange-500 hover:shadow-[0_0_10px_rgba(249,115,22,0.2)] transition-all"
              >
                <div className="w-7 h-7 rounded-none border border-orange-500 bg-orange-600/20 flex items-center justify-center text-orange-400 text-xs font-mono font-bold shadow-[0_0_10px_rgba(249,115,22,0.3)]">
                  {(user.name?.charAt(0) || user.email?.charAt(0) || "U").toUpperCase()}
                </div>
                <span className="text-sm font-medium text-zinc-300 hidden sm:block">
                  {user.name || user.email?.split("@")[0]}
                </span>
              </Link>
              <form action="/api/auth/logout" method="POST">
                <button type="submit" className="text-xs font-medium text-zinc-500 hover:text-red-400 transition-colors">
                  Log out
                </button>
              </form>
            </div>
          ) : (
            <Link href="/login" className="rounded-none border border-orange-500 bg-orange-600/10 px-4 py-2 text-sm font-mono font-bold tracking-widest text-orange-400 hover:text-white hover:bg-orange-600/40 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all uppercase">
              Sign In
            </Link>
          )}

          {/* Mobile toggle */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-cyber-bg p-4">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
