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

  // Close menu on route change
  useEffect(() => {
    if (isMenuOpen) setIsMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      className="sticky top-0 z-[100] border-b backdrop-blur-xl transition-all duration-300"
      style={{
        borderColor: resolvedColors.borderColor + "40",
        backgroundColor: resolvedColors.boxBg + "ee",
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
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg transition-all duration-200"
              style={{
                color: resolvedColors.linkColor,
                border: `1px solid ${resolvedColors.borderColor}30`,
              }}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-[500px] border-t" : "max-h-0"
        }`}
        style={{
          borderColor: resolvedColors.borderColor + "20",
          backgroundColor: resolvedColors.boxBg + "f9",
        }}
      >
        <div className="flex flex-col p-4 gap-2">
          {links.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 p-3 rounded-lg text-sm font-bold transition-all"
                style={{
                  color: active ? resolvedColors.bgColor : resolvedColors.linkColor,
                  backgroundColor: active ? resolvedColors.linkColor : "transparent",
                  border: active ? "none" : `1px solid ${resolvedColors.borderColor}10`,
                }}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                <span>{link.label}</span>
              </Link>
            );
          })}
          
          <div className="sm:hidden pt-2 border-t mt-2" style={{ borderColor: resolvedColors.borderColor + "20" }}>
            <NavAuth linkColor={resolvedColors.linkColor} />
          </div>
        </div>
      </div>
    </nav>
  );
}
