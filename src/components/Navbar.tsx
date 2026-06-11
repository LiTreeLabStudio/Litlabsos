"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import dynamic from "next/dynamic";
import {
  Home, Wrench, ShoppingBag, Image, Sparkles, MessageSquare,
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

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

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
          <Link href="/" className="flex items-center gap-2 group">
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
              className="font-black text-base hidden sm:inline tracking-tight"
              style={{ color: resolvedColors.headerColor }}
            >
              LiTree Lab&apos;s
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {links.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 hover:scale-105"
                  style={{
                    color: active ? resolvedColors.bgColor : resolvedColors.linkColor,
                    backgroundColor: active ? resolvedColors.linkColor : "transparent",
                    border: active ? "none" : `1px solid ${resolvedColors.borderColor}30`,
                  }}
                >
                  <Icon size={14} strokeWidth={active ? 2.5 : 2} />
                  <span className="hidden md:inline">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
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
            <NavAuth linkColor={resolvedColors.linkColor} />
          </div>
        </div>
      </div>
    </nav>
  );
}
