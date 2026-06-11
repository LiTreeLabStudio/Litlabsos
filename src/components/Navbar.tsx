"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import dynamic from "next/dynamic";
import {
  Home, Wrench, ShoppingBag, Image as ImageIcon, Sparkles, MessageSquare,
  User, Settings, Sun, Moon, Zap, Book, Users, Play, Menu, X
} from "lucide-react";
import { useState, useEffect } from "react";

const NavAuth = dynamic(
  () => import("@/components/ClerkAuth").then((m) => ({ default: m.NavAuth })),
  { ssr: false }
);

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/builder", label: "Builder", icon: Wrench },
  { href: "/image-generator", label: "Imaging", icon: ImageIcon },
  { href: "/marketplace", label: "Market", icon: ShoppingBag },
  { href: "/docs", label: "Docs", icon: Book },
  { href: "/team", label: "Team", icon: Users },
  { href: "/demo", label: "Demo", icon: Play },
  { href: "/social", label: "Social", icon: MessageSquare },
];

export default function Navbar() {
  const { theme, resolvedColors, setMode } = useTheme();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className="sticky top-0 z-50 border-b backdrop-blur-xl"
      style={{
        borderColor: resolvedColors.borderColor + "40",
        backgroundColor: resolvedColors.boxBg + "cc",
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group z-50">
            <div className="relative">
              <Zap
                size={22}
                className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                style={{ color: resolvedColors.accentColor }}
              />
              <div
                className="absolute inset-0 blur-md opacity-50"
                style={{ color: resolvedColors.accentColor }}
              />
            </div>
            <span
              className="font-black text-base tracking-tight"
              style={{ color: resolvedColors.headerColor }}
            >
              LiTree Lab&apos;s
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 hover:scale-105"
                  style={{
                    color: active ? resolvedColors.bgColor : resolvedColors.linkColor,
                    backgroundColor: active ? resolvedColors.linkColor : "transparent",
                    border: active ? "none" : `1px solid ${resolvedColors.borderColor}30`,
                  }}
                >
                  <Icon size={14} strokeWidth={active ? 2.5 : 2} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side Actions */}
          <div className="flex items-center gap-2 z-50">
            <button
              onClick={() => setMode(theme.mode === "dark" ? "light" : "dark")}
              className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
              style={{
                border: `1px solid ${resolvedColors.accentColor}40`,
                color: resolvedColors.accentColor,
                backgroundColor: resolvedColors.accentColor + "10",
              }}
              title="Toggle dark/light"
            >
              {theme.mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            
            <div className="hidden sm:block">
              <NavAuth linkColor={resolvedColors.linkColor} />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg border transition-all"
              style={{
                borderColor: resolvedColors.borderColor + "40",
                color: resolvedColors.textColor,
              }}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="absolute top-14 left-0 right-0 border-b p-6 space-y-3 animate-in slide-in-from-top duration-300"
            style={{ 
              backgroundColor: resolvedColors.boxBg,
              borderColor: resolvedColors.borderColor + "40"
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="grid grid-cols-2 gap-3">
              {links.map((link) => {
                const active = isActive(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all active:scale-95"
                    style={{
                      color: active ? resolvedColors.bgColor : resolvedColors.textColor,
                      backgroundColor: active ? resolvedColors.linkColor : "transparent",
                      borderColor: active ? resolvedColors.linkColor : resolvedColors.borderColor + "30",
                    }}
                  >
                    <Icon size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{link.label}</span>
                  </Link>
                );
              })}
            </div>
            
            <div className="pt-4 mt-2 border-t flex flex-col items-center gap-4" style={{ borderColor: resolvedColors.borderColor + "20" }}>
              <NavAuth linkColor={resolvedColors.linkColor} />
              <p className="text-[9px] text-white/20 uppercase tracking-[0.3em]">LiTree Lab Studios // Edge Node</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
