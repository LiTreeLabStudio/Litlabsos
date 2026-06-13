"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import dynamic from "next/dynamic";
import {
  Home, Wrench, ShoppingBag, Image as ImageIcon, MessageSquare,
  Sun, Moon, Zap, Book, Users, Play, Menu, X
} from "lucide-react";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMenuOpen) setIsMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const sidebarContent = (isMobile: boolean) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 px-5 py-4 group">
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

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const active = isActive(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 hover:scale-[1.02]"
              style={{
                color: active ? resolvedColors.bgColor : resolvedColors.linkColor,
                backgroundColor: active ? resolvedColors.linkColor : "transparent",
                border: active ? "none" : `1px solid ${resolvedColors.borderColor}15`,
              }}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 2} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 py-4 space-y-3 border-t" style={{ borderColor: resolvedColors.borderColor + "20" }}>
        {/* Theme Toggle */}
        <button
          onClick={() => setMode(theme.mode === "dark" ? "light" : "dark")}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 hover:scale-[1.02]"
          style={{
            border: `1px solid ${resolvedColors.accentColor}40`,
            color: resolvedColors.accentColor,
            backgroundColor: resolvedColors.accentColor + "10",
          }}
          title="Toggle dark/light"
        >
          {theme.mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          <span>{theme.mode === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>

        {/* Auth */}
        <NavAuth linkColor={resolvedColors.linkColor} />
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header Bar */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-[100] flex items-center justify-between h-14 px-4 border-b backdrop-blur-xl"
        style={{
          borderColor: resolvedColors.borderColor + "40",
          backgroundColor: resolvedColors.boxBg + "ee",
        }}
      >
        <button
          onClick={() => setIsMenuOpen(true)}
          className="p-2 rounded-lg transition-all duration-200"
          style={{
            color: resolvedColors.linkColor,
            border: `1px solid ${resolvedColors.borderColor}30`,
          }}
        >
          <Menu size={20} />
        </button>

        <Link href="/" className="flex items-center gap-2 group">
          <Zap size={20} style={{ color: resolvedColors.accentColor }} />
          <span
            className="font-black text-sm tracking-tight"
            style={{ color: resolvedColors.headerColor }}
          >
            LiTree Lab&apos;s
          </span>
        </Link>

        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Mobile Slide-out Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[200]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div
            className="absolute left-0 top-0 bottom-0 w-[280px] border-r shadow-2xl"
            style={{
              borderColor: resolvedColors.borderColor + "30",
              backgroundColor: resolvedColors.boxBg + "fa",
            }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: resolvedColors.borderColor + "20" }}>
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: resolvedColors.textMuted }}>Menu</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 rounded-lg"
                style={{ color: resolvedColors.linkColor, border: `1px solid ${resolvedColors.borderColor}30` }}
              >
                <X size={18} />
              </button>
            </div>
            {sidebarContent(true)}
          </div>
        </div>
      )}

      {/* Desktop Left Sidebar */}
      <div
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[240px] border-r z-[100]"
        style={{
          borderColor: resolvedColors.borderColor + "30",
          backgroundColor: resolvedColors.boxBg + "f5",
        }}
      >
        {sidebarContent(false)}
      </div>
    </>
  );
}
