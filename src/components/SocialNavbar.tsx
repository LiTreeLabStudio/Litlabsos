"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme, ACCENT_MAP } from "@/context/ThemeContext";

/* ══════════════════════════════════════════════════
   NOTIFICATIONS DROPDOWN
══════════════════════════════════════════════════ */
interface Notification {
  id: string;
  type: "friend" | "comment" | "agent" | "system";
  text: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "1", type: "friend", text: "PixelQueen sent you a friend request", time: "2m ago", read: false },
  { id: "2", type: "comment", text: "CodeWizard42 commented on your profile", time: "15m ago", read: false },
  { id: "3", type: "agent", text: "Director agent completed a task", time: "1h ago", read: true },
  { id: "4", type: "system", text: "Your profile reached 100K views!", time: "2h ago", read: true },
  { id: "5", type: "friend", text: "DataNinja is now your friend", time: "1d ago", read: true },
];

function NotificationsDropdown({ onClose }: { onClose: () => void }) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unread = notifications.filter(n => !n.read).length;

  const iconMap: Record<string, string> = {
    friend: "👥",
    comment: "💬",
    agent: "🤖",
    system: "⚙️",
  };

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <div className="absolute right-0 top-14 w-80 rounded-2xl bg-gradient-to-br from-white/[0.1] to-white/[0.05] border border-white/20 shadow-2xl overflow-hidden z-50">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h3 className="text-xs font-bold uppercase tracking-widest">NOTIFICATIONS</h3>
        <div className="flex gap-2">
          <button onClick={markAllRead} className="text-[10px] font-bold text-text-muted hover:text-white uppercase tracking-widest">MARK ALL READ</button>
          <button onClick={onClose} className="text-text-muted hover:text-white">✕</button>
        </div>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-center text-xs text-text-muted py-8">No notifications</p>
        ) : (
          notifications.map(n => (
            <div key={n.id} className={`flex items-start gap-3 p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${!n.read ? "bg-white/[0.02]" : ""}`}>
              <span className="text-xl shrink-0">{iconMap[n.type]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-secondary leading-tight">{n.text}</p>
                <p className="text-[10px] text-text-muted mt-1">{n.time}</p>
              </div>
              {!n.read && <span className="w-2 h-2 rounded-full bg-[var(--accent)] shrink-0 mt-1" />}
            </div>
          ))
        )}
      </div>
      <Link href="/notifications" className="block text-center py-3 text-xs font-bold text-text-muted hover:text-white border-t border-white/10">
        VIEW ALL NOTIFICATIONS
      </Link>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   QUICK THEME SWITCHER
══════════════════════════════════════════════════ */
function ThemeSwitcher({ onClose }: { onClose: () => void }) {
  const { theme, setTheme, accentColor, setAccentColor, backgroundSkin, setBackgroundSkin, savePreferences } = useTheme();

  const accentButtons: Array<{ id: typeof accentColor; hex: string }> = [
    { id: "cyan", hex: "#00f2fe" },
    { id: "purple", hex: "#9b51e0" },
    { id: "gold", hex: "#ffd700" },
    { id: "green", hex: "#00ff88" },
    { id: "red", hex: "#ff5050" },
    { id: "pink", hex: "#ff00aa" },
    { id: "orange", hex: "#ff6b35" },
    { id: "blue", hex: "#3b82f6" },
  ];

  return (
    <div className="absolute right-0 top-14 w-72 rounded-2xl bg-gradient-to-br from-white/[0.1] to-white/[0.05] border border-white/20 shadow-2xl p-6 z-50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold uppercase tracking-widest">QUICK THEME</h3>
        <button onClick={onClose} className="text-text-muted hover:text-white">✕</button>
      </div>

      {/* Dark / Light Toggle */}
      <div className="mb-6">
        <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3 block">MODE</label>
        <div className="flex gap-3">
          {(["dark", "light", "system"] as const).map(t => (
            <button key={t} onClick={() => setTheme(t)} className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
              theme === t ? "bg-[var(--accent)] text-black shadow-[0_0_15px_rgba(var(--accent),0.3)]" : "bg-white/5 text-text-muted hover:bg-white/10"
            }`}>
              {t === "dark" ? "🌙 DARK" : t === "light" ? "☀️ LIGHT" : "💻 AUTO"}
            </button>
          ))}
        </div>
      </div>

      {/* Accent Colors */}
      <div className="mb-6">
        <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3 block">ACCENT COLOR</label>
        <div className="flex gap-3 flex-wrap">
          {accentButtons.map(c => (
            <button key={c.id} onClick={() => setAccentColor(c.id)} className={`w-10 h-10 rounded-xl transition-all ${
              accentColor === c.id ? "scale-110 shadow-[0_0_20px_rgba(255,255,255,0.2)] border-2 border-white" : "opacity-50 hover:opacity-100"
            }`} style={{ backgroundColor: c.hex }} />
          ))}
        </div>
      </div>

      {/* Background Skins */}
      <div className="mb-6">
        <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3 block">BACKGROUND</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "default", label: "DEFAULT", preview: "⬛" },
            { id: "stars", label: "STARS", preview: "✨" },
            { id: "grid", label: "GRID", preview: "▦" },
            { id: "gradient", label: "GRADIENT", preview: "🌈" },
            { id: "particles", label: "PARTICLES", preview: "⚪" },
            { id: "matrix", label: "MATRIX", preview: "💚" },
          ].map(skin => (
            <button key={skin.id} onClick={() => setBackgroundSkin(skin.id as any)} className={`p-3 rounded-xl text-center transition-all ${
              backgroundSkin === skin.id ? "bg-[var(--accent)] text-black" : "bg-white/5 hover:bg-white/10"
            }`}>
              <div className="text-xl mb-1">{skin.preview}</div>
              <div className="text-[9px] font-bold uppercase tracking-widest">{skin.label}</div>
            </button>
          ))}
        </div>
      </div>

      <button onClick={savePreferences} className="btn-primary w-full py-3 text-xs font-bold uppercase tracking-widest">
        SAVE THEME
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SEARCH DROPDOWN
══════════════════════════════════════════════════ */
function SearchDropdown({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results] = useState([
    { name: "PixelQueen", type: "User", avatar: "👸" },
    { name: "Director Agent", type: "Agent", avatar: "🎯" },
    { name: "LitLabs Blog", type: "Post", avatar: "📝" },
  ]);

  return (
    <div className="absolute left-0 top-14 w-96 rounded-2xl bg-gradient-to-br from-white/[0.1] to-white/[0.05] border border-white/20 shadow-2xl overflow-hidden z-50">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
          <span className="text-text-muted">🔍</span>
          <input
            className="bg-transparent outline-none text-sm flex-1"
            placeholder="Search users, agents, posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && <button onClick={() => setQuery("")} className="text-text-muted">✕</button>}
        </div>
      </div>
      <div className="max-h-72 overflow-y-auto">
        {results.length === 0 ? (
          <p className="text-center text-xs text-text-muted py-8">No results found</p>
        ) : (
          results.map((r, i) => (
            <div key={i} className="flex items-center gap-3 p-4 hover:bg-white/5 cursor-pointer border-b border-white/5 transition-colors">
              <span className="text-2xl">{r.avatar}</span>
              <div>
                <p className="text-sm font-bold">{r.name}</p>
                <p className="text-[10px] text-text-muted">{r.type}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <Link href="/search" className="block text-center py-3 text-xs font-bold text-text-muted hover:text-white border-t border-white/10">
        VIEW ALL RESULTS
      </Link>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   NAVIGATION LINK
══════════════════════════════════════════════════ */
function NavLink({ href, icon, label, badge }: { href: string; icon: string; label: string; badge?: number }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors group relative">
      <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted group-hover:text-white">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">{badge > 9 ? "9+" : badge}</span>
      )}
    </Link>
  );
}

/* ══════════════════════════════════════════════════
   MAIN SOCIAL NAVBAR
══════════════════════════════════════════════════ */
export default function SocialNavbar() {
  const { user } = useAuth();
  const { isDark, accentColor } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Track scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) setShowTheme(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const unreadCount = 2;

  return (
    <>
      {/* ═══ MAIN NAVBAR ═══ */}
      <nav className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-black/90 backdrop-blur-lg shadow-lg border-b border-white/10" : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl font-bold transition-all group-hover:scale-110" style={{ background: `linear-gradient(135deg, var(--accent), ${ACCENT_MAP[accentColor].hex})` }}>
                🔥
              </div>
              <span className="font-heading text-xl font-bold uppercase tracking-tight hidden sm:block">
                lit<span style={{ color: "var(--accent)" }}>labs</span>
              </span>
            </Link>

            {/* Center Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink href="/dashboard" icon="🏠" label="Home" />
              <NavLink href="/profile" icon="👤" label="Profile" />
              <NavLink href="/agents" icon="🤖" label="Agents" />
              <NavLink href="/social" icon="🌐" label="Social" />
              <NavLink href="/gallery" icon="🎨" label="Gallery" />
              <NavLink href="/notifications" icon="🔔" label="Alerts" badge={unreadCount} />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">

              {/* Search */}
              <div className="relative" ref={searchRef}>
                <button
                  onClick={() => { setShowSearch(!showSearch); setShowNotifications(false); setShowTheme(false); }}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-lg transition-colors"
                >
                  🔍
                </button>
                {showSearch && <SearchDropdown onClose={() => setShowSearch(false)} />}
              </div>

              {/* Theme Switcher */}
              <div className="relative" ref={themeRef}>
                <button
                  onClick={() => { setShowTheme(!showTheme); setShowNotifications(false); setShowSearch(false); }}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-lg transition-colors"
                  style={{ boxShadow: showTheme ? `0 0 15px var(--accent)` : "none" }}
                >
                  {isDark ? "🌙" : "☀️"}
                </button>
                {showTheme && <ThemeSwitcher onClose={() => setShowTheme(false)} />}
              </div>

              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => { setShowNotifications(!showNotifications); setShowTheme(false); setShowSearch(false); }}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-lg transition-colors relative"
                >
                  🔔
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotifications && <NotificationsDropdown onClose={() => setShowNotifications(false)} />}
              </div>

              {/* User Menu */}
              <Link href="/settings" className="flex items-center gap-2 pl-2 ml-2 border-l border-white/10">
                <div className="w-9 h-9 rounded-xl overflow-hidden border-2 transition-colors" style={{ borderColor: "var(--accent)" }}>
                  <img src={user?.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=litlabs"} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-bold hidden lg:block">{user?.name || user?.email?.split("@")[0] || "User"}</span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-lg transition-colors">
                {showMobileMenu ? "✕" : "☰"}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden py-4 border-t border-white/10 space-y-1">
              <NavLink href="/dashboard" icon="🏠" label="Home" />
              <NavLink href="/profile" icon="👤" label="Profile" />
              <NavLink href="/agents" icon="🤖" label="Agents" />
              <NavLink href="/social" icon="🌐" label="Social" />
              <NavLink href="/gallery" icon="🎨" label="Gallery" />
              <NavLink href="/notifications" icon="🔔" label="Alerts" badge={unreadCount} />
              <NavLink href="/settings" icon="⚙️" label="Settings" />
            </div>
          )}
        </div>
      </nav>

      {/* Background Skins */}
      <BackgroundSkins />
    </>
  );
}

/* ══════════════════════════════════════════════════
   BACKGROUND SKIN OVERLAY
══════════════════════════════════════════════════ */
function BackgroundSkins() {
  const { backgroundSkin } = useTheme();

  if (backgroundSkin === "stars") {
    return <div className="fixed inset-0 pointer-events-none z-0" style={{
      backgroundImage: `radial-gradient(2px 2px at 20px 30px, white, transparent), radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent), radial-gradient(1px 1px at 90px 40px, white, transparent), radial-gradient(2px 2px at 160px 120px, rgba(255,255,255,0.6), transparent), radial-gradient(1px 1px at 230px 80px, white, transparent), radial-gradient(2px 2px at 300px 150px, rgba(255,255,255,0.7), transparent), radial-gradient(1px 1px at 370px 60px, white, transparent), radial-gradient(2px 2px at 440px 200px, rgba(255,255,255,0.5), transparent)`,
      backgroundSize: "500px 250px",
      opacity: 0.5,
    }} />;
  }

  if (backgroundSkin === "grid") {
    return (
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }} />
    );
  }

  if (backgroundSkin === "gradient") {
    return <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-black" />;
  }

  if (backgroundSkin === "particles") {
    return <div className="fixed inset-0 pointer-events-none z-0" id="particles-bg" />;
  }

  if (backgroundSkin === "matrix") {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10" style={{
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.03) 2px, rgba(0,255,136,0.03) 4px)`,
        backgroundSize: "100% 4px",
      }} />
    );
  }

  return null;
}

/* ══════════════════════════════════════════════════
   EXPORTS
══════════════════════════════════════════════════ */
export { NotificationsDropdown, ThemeSwitcher, SearchDropdown };