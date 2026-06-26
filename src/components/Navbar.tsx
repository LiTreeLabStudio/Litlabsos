"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { useSupabaseAuth } from "@/app/supabase-auth"
import { useSessionAuth } from "@/hooks/useSessionAuth"
import { useTheme } from "@/context/ThemeContext"
import dynamic from "next/dynamic"
import { NavAuth } from "@/components/ClerkAuth"
import {
  ShoppingBag,
  Sparkles,
  Settings,
  Sun,
  Moon,
  Zap,
  Bot,
  X,
  Menu,
  Coins,
  User,
  Gamepad as GamepadIcon,
  Code2,
  Layout,
  Search,
  Users,
} from "lucide-react"

// Dynamic imports to avoid SSR issues
const UserSync = dynamic(
  () => import("@/components/UserSync"),
  { ssr: false }
)

const settingsLinks = [
  { href: "/profile", label: "My Profile", icon: User },
  { href: "/settings", label: "System Config", icon: Settings },
  { href: "/code", label: "Scanner", icon: Code2 },
  { href: "/showcase", label: "Showcase", icon: Sparkles },
]

const navLinks = [
  { href: "/", label: "Dashboard", icon: Layout },
  { href: "/studio", label: "Studio", icon: Zap },
  { href: "/games", label: "Play", icon: GamepadIcon },
  { href: "/gallery", label: "Gallery", icon: Sparkles },
  { href: "/agent", label: "Jarvis", icon: Bot },
  { href: "/agents", label: "Agents", icon: Users },
  { href: "/marketplace", label: "Market", icon: ShoppingBag },
]

const userLinks = [
  { href: "/profile", label: "My Profile", icon: User },
  { href: "/settings", label: "System Config", icon: Settings },
  { href: "/code", label: "Scanner", icon: Code2 },
]

export default function Navbar() {
  const { resolvedColors: T, setMode, theme } = useTheme()
  const userSync = dynamic(() => import("@/components/UserSync"), { ssr: false })
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userOpen, _setUserOpen] = useState(false)
  const [notifOpen, _setNotifOpen] = useState(false)
  const [notifications, _setNotifications] = useState<
    Record<string, unknown>[]
  >([])
  const [unreadCount, _setUnreadCount] = useState(0)

  const userRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  const { isLoaded: sessionLoaded, isSignedIn: sessionSignedIn } =
    useSessionAuth()
  const authLoaded = sessionLoaded
  const isSignedIn = sessionSignedIn

  const pathname = usePathname()
  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") return false
    return pathname?.startsWith(path)
  }

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node))
        _setUserOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        _setNotifOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <nav
      className="sticky top-0 z-[60] w-full backdrop-blur-xl border-b transition-all duration-300"
      style={{
        backgroundColor: T.bgColor + "cc",
        borderColor: T.borderColor + "40",
      }}
    >
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div
                className="relative w-9 h-9 rounded-xl overflow-hidden transition-all duration-500 group-hover:scale-110 shadow-lg"
                style={{ border: `2px solid ${T.accentColor}40` }}
              >
                <div className="w-full h-full bg-gradient-to-br from-jarvis-accent to-jarvis-accent2 flex items-center justify-center">
                  <span className="text-white text-[12px] font-bold">
                    JT
                  </span>
                </div>
              </div>
              <div className="hidden md:flex flex-col">
                <span
                  className="font-black text-lg tracking-tight leading-none"
                  style={{ color: T.textColor }}
                >
                  LiTree Lab
                </span>
                <span
                  className="text-[10px] font-bold tracking-[.25em] uppercase opacity-75"
                  style={{ color: T.textMuted }}
                >
                  Studios
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative flex items-center gap-2 px-4 py-2 text-[13px] font-bold rounded-xl transition-all duration-300 group"
                  style={{
                    color: active ? T.accentColor : T.textColor,
                    backgroundColor: active
                      ? T.accentColor + "10"
                      : "transparent",
                  }}
                >
                  {link.label}
                  {active && (
                    <span
                      className="absolute bottom-1 left-4 right-4 h-0.5 rounded-full"
                      style={{ backgroundColor: T.accentColor }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right Section Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              aria-label={
                theme.mode === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              onClick={() => setMode(theme.mode === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-xl hover:bg-white/5 transition-all"
              style={{ color: T.textMuted }}
            >
              {theme.mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block" />

            {/* Nav Auth */}
            <div className="relative flex items-center">
              <NavAuth />
            </div>

            {/* Mobile Hamburger */}
            <button
              ref={hamburgerRef}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-xl hover:bg-white/5 transition-all"
              style={{ color: T.textColor }}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-[100 lg:hidden animate-fadeIn">
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <div
              className="absolute top-0 right-0 bottom-0 w-[280px] p-6 shadow-2xl flex flex-col gap-8 animate-slideInRight"
              style={{
                backgroundColor: T.bgColor,
                borderLeft: `1px solid ${T.borderColor}40`,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-lg">Menu</span>
                <button
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                >
                  <X />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-2xl font-bold transition-all active:scale-95"
                    style={{
                      backgroundColor: isActive(link.href)
                        ? T.accentColor + "15"
                        : "transparent",
                      color: isActive(link.href) ? T.accentColor : T.textColor,
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div
                className="mt-auto pt-6 border-t"
                style={{ borderColor: T.borderColor + "20" }}
              >
                <div className="flex flex-col gap-2">
                  {userLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 p-3 text-sm opacity-70 hover:opacity-100"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}