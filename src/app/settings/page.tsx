"use client";
export const dynamic = "force-dynamic";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useTheme,
  darkSkins,
  lightSkins,
  type SkinPreset,
} from "@/context/ThemeContext";
import { useProfile } from "@/context/ProfileContext";
import { useClerkAuth } from "@/hooks/useClerkAuth";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import {
  Palette,
  User,
  Bot,
  Monitor,
  Sparkles,
  Moon,
  Sun,
  Check,
  Zap,
  RefreshCw,
  Code,
  Trash2,
  Eye,
  Camera,
  MapPin,
  Globe,
  AtSign,
  Loader2,
  Wand2,
  Link2,
  Hash,
  Fingerprint,
  ChevronDown,
  ChevronUp,
  Terminal,
  Activity,
  Database,
  AlertTriangle,
  Music,
  Volume2,
  CreditCard,
  Mail,
  Bell,
  UserX,
  Key,
  Settings2,
} from "lucide-react";

const skinLabels: Record<SkinPreset, string> = {
  cyberpunk: "Navy Cyan",
  retro: "Amber",
  ocean: "Deep Aqua",
  sunset: "Warm Ember",
  matrix: "Matrix",
  pink: "Rose",
  synthwave: "Violet",
  volcanic: "Coral",
  gold: "Gold",
  arctic: "Ice",
  emerald: "Forest",
  midnight: "Midnight",
  neon: "Neon",
  blood: "Crimson",
  cosmic: "Cosmic",
  miami: "Miami",
};

const accentHex: Record<string, string> = {
  "neon-green": "#06b6d4",
  "hot-pink": "#ec4899",
  "electric-blue": "#3b82f6",
  "cyber-yellow": "#f59e0b",
  "matrix-green": "#8b5cf6",
  "sunset-orange": "#f97316",
  "ocean-blue": "#0ea5e9",
  "purple-haze": "#a855f7",
};

type TabId =
  | "theme"
  | "profile"
  | "agents"
  | "interface"
  | "system"
  | "music"
  | "security"
  | "notifications"
  | "privacy"
  | "wallet";

const TABS: {
  id: TabId;
  label: string;
  icon: typeof Palette;
  shortcut: string;
}[] = [
  { id: "theme", label: "Theme", icon: Palette, shortcut: "T" },
  { id: "profile", label: "Identity", icon: Fingerprint, shortcut: "I" },
  { id: "wallet", label: "Wallet", icon: Zap, shortcut: "W" },
  { id: "notifications", label: "Alerts", icon: Activity, shortcut: "N" },
  { id: "security", label: "Security", icon: Hash, shortcut: "X" },
  { id: "agents", label: "Agents", icon: Bot, shortcut: "A" },
  { id: "interface", label: "UI", icon: Monitor, shortcut: "U" },
  { id: "music", label: "Audio", icon: Music, shortcut: "M" },
  { id: "privacy", label: "Privacy", icon: Eye, shortcut: "P" },
  { id: "system", label: "SYS", icon: Terminal, shortcut: "S" },
];

// Glitch text effect component — uses CSS pseudo-elements via inline styles
// to avoid triple-rendering text that screen readers and text extraction
// tools would pick up as "SETTINGSSETTINGSSETTINGS".
function GlitchText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      className={`relative inline-block ${className}`}
      data-text={text}
      style={{
        // The glitch layers are rendered via ::before / ::after using
        // attr(data-text) in globals.css — only one text node in the DOM.
        textShadow:
          "0.5px 0 0 rgba(255,0,80,0.4), -0.5px 0 0 rgba(0,255,255,0.4)",
      }}
    >
      {text}
    </span>
  );
}

// Compact field component
function Field({
  label,
  value,
  onChange,
  icon: Icon,
  prefix,
  type = "text",
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon?: typeof MapPin;
  prefix?: string;
  type?: "text" | "textarea";
  rows?: number;
}) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="group">
      <label className="text-[10px] uppercase tracking-wider opacity-40 mb-1 block font-mono">
        {label}
      </label>
      <div
        className={`relative flex items-center border transition-all ${isFocused ? "border-cyan-500/50 shadow-[0_0_8px_rgba(6,182,212,0.2)]" : "border-white/10"}`}
        style={{ background: "rgba(0,0,0,0.3)" }}
      >
        {prefix && (
          <span className="pl-2 text-[11px] opacity-30 font-mono">
            {prefix}
          </span>
        )}
        {Icon && <Icon size={12} className="ml-2 opacity-30" />}
        {type === "textarea" ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rows={rows || 3}
            className="w-full bg-transparent p-2 text-[12px] outline-none resize-none font-mono"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent p-2 text-[12px] outline-none font-mono"
            style={{ paddingLeft: prefix || Icon ? "1.5rem" : "0.5rem" }}
          />
        )}
      </div>
    </div>
  );
}

// Collapsible section
function Section({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: typeof Palette;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className="border border-white/10"
      style={{ background: "rgba(15,15,25,0.6)" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon size={14} className="opacity-50" />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            {title}
          </span>
        </div>
        {open ? (
          <ChevronUp size={14} className="opacity-40" />
        ) : (
          <ChevronDown size={14} className="opacity-40" />
        )}
      </button>
      {open && (
        <div className="p-3 pt-0 space-y-3 border-t border-white/5">
          {children}
        </div>
      )}
    </div>
  );
}

// Toggle switch
function Toggle({
  label,
  desc,
  value,
  onChange,
}: {
  label: string;
  desc?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="text-[12px] font-medium">{label}</div>
        {desc && <div className="text-[10px] opacity-40">{desc}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-8 h-4 border transition-all ${value ? "border-cyan-500 bg-cyan-500/20" : "border-white/20"}`}
      >
        <div
          className={`w-3 h-3 bg-white transition-transform ${value ? "translate-x-4" : "translate-x-0.5"}`}
        />
      </button>
    </div>
  );
}

// Color swatch
function Swatch({
  color,
  active,
  onClick,
  label,
}: {
  color: string;
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-2 border transition-all hover:scale-105 ${active ? "border-white/40" : "border-white/10"}`}
      style={{ background: active ? `${color}15` : "transparent" }}
    >
      <div
        className="w-6 h-6 border border-white/20"
        style={{ background: color }}
      />
      <span className="text-[9px] opacity-60 uppercase">{label}</span>
    </button>
  );
}

// Generate image button
function GenBtn({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-3 py-2 border border-white/20 text-[10px] uppercase tracking-wider hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all disabled:opacity-50"
    >
      {loading ? (
        <Loader2 size={12} className="animate-spin" />
      ) : (
        <Wand2 size={12} />
      )}
    </button>
  );
}

export default function SettingsPage() {
  const { isLoaded, isSignedIn } = useClerkAuth();
  const router = useRouter();
  const { theme, setMode, setSkin, setAccent, setBackgroundMode, resetTheme } =
    useTheme();
  const { profile, updateProfile, resetProfile } = useProfile();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?redirect_url=/settings");
    }
  }, [isLoaded, isSignedIn, router]);

  const [activeTab, setActiveTab] = useState<TabId>("theme");
  const [saved, setSaved] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);

  // UI prefs
  const [animSpeed, setAnimSpeed] = useState(() => {
    if (typeof window === "undefined") return "normal";
    return localStorage.getItem("litlabs-anim-speed") || "normal";
  });
  const [compactMode, setCompactMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("litlabs-compact") === "true";
  });
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("litlabs-reduced-motion") === "true";
  });
  const [soundEffects, setSoundEffects] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("litlabs-sound") === "true";
  });
  const [customCSS, setCustomCSS] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("litlabs-custom-css") || "";
  });

  // Music prefs
  const [musicEnabled, setMusicEnabled] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const prefs = JSON.parse(
        localStorage.getItem("litlabs-music-prefs") || "{}",
      );
      return prefs.enabled ?? false;
    } catch {
      return false;
    }
  });
  const [musicVolume, setMusicVolume] = useState(() => {
    if (typeof window === "undefined") return 50;
    try {
      const prefs = JSON.parse(
        localStorage.getItem("litlabs-music-prefs") || "{}",
      );
      return prefs.volume ?? 50;
    } catch {
      return 50;
    }
  });
  const [musicAutoPlay, setMusicAutoPlay] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const prefs = JSON.parse(
        localStorage.getItem("litlabs-music-prefs") || "{}",
      );
      return prefs.autoPlay ?? false;
    } catch {
      return false;
    }
  });
  const [musicMuteOnLeave, setMusicMuteOnLeave] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const prefs = JSON.parse(
        localStorage.getItem("litlabs-music-prefs") || "{}",
      );
      return prefs.muteOnLeave ?? true;
    } catch {
      return true;
    }
  });

  const showSaved = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }, []);

  const save = (key: string, val: string | boolean) => {
    localStorage.setItem(`litlabs-${key}`, String(val));
    showSaved();
  };

  const generateImage = async (type: "avatar" | "cover") => {
    setGenerating(type);
    try {
      const prompt =
        type === "avatar"
          ? "Professional portrait avatar, abstract digital art style, single figure centered, dark background with subtle purple and blue neon glow, futuristic, clean, high quality, square composition"
          : "Abstract futuristic technology banner, dark purple and blue gradient, subtle grid lines, soft glowing particles, wide cinematic composition, clean minimal, high quality";
      const res = await fetch("/api/media/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          mediaType: "image",
          provider: "pollinations",
          model: "flux",
          width: type === "avatar" ? 512 : 1280,
          height: type === "avatar" ? 512 : 640,
        }),
      });
      const data = await res.json();
      if (data.url) {
        updateProfile({
          [type === "avatar" ? "avatarUrl" : "coverUrl"]: data.url,
        });
        showSaved();
      }
    } catch {
      /* ignore generation errors */
    } finally {
      setGenerating(null);
    }
  };

  const skinPresets: SkinPreset[] = [
    "cyberpunk",
    "retro",
    "ocean",
    "sunset",
    "matrix",
    "pink",
    "synthwave",
    "volcanic",
    "gold",
    "arctic",
    "emerald",
    "midnight",
    "neon",
    "blood",
    "cosmic",
    "miami",
  ];
  const bgModes = ["constellation", "nebula", "waves", "minimal"] as const;
  const accents = [
    "electric-blue",
    "purple-haze",
    "hot-pink",
    "cyber-yellow",
    "neon-green",
    "matrix-green",
    "sunset-orange",
    "ocean-blue",
  ] as const;

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a12] text-cyan-400 font-mono">
        <div className="text-center">
          <div className="text-2xl mb-2 animate-pulse">▓▒░</div>
          <div className="text-xs opacity-50">SYSTEM_INIT...</div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <PageShell title="Access Denied">
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 font-mono">
          <AlertTriangle size={32} className="text-red-500" />
          <p className="text-xs opacity-60">AUTHENTICATION REQUIRED</p>
          <Link
            href="/sign-in?redirect_url=/settings"
            className="px-4 py-2 border border-cyan-500/50 text-cyan-400 text-xs hover:bg-cyan-500/10"
          >
            LOGIN &gt;&gt;
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell className="font-mono">
      <div className="w-full px-3 py-4">
        {/* Terminal Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Terminal size={14} className="text-cyan-400" />
              <span className="text-[10px] uppercase tracking-widest opacity-40">
                System Config
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              <GlitchText text="SETTINGS" />
            </h1>
          </div>
          <div className="flex items-center gap-3 text-[10px] opacity-40">
            <span className="flex items-center gap-1">
              <Activity size={10} className="text-green-400" /> ONLINE
            </span>
            <span>v2.0.6</span>
          </div>
        </div>

        {/* Compact Tab Nav */}
        <div className="flex gap-1 mb-4 overflow-x-auto pb-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider border transition-all whitespace-nowrap ${
                  isActive
                    ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <Icon size={12} />
                {tab.label}
                <span className="opacity-30 ml-1">[{tab.shortcut}]</span>
              </button>
            );
          })}
        </div>

        {/* THEME TAB */}
        {activeTab === "theme" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Section title="Background" icon={Sparkles}>
              <div className="grid grid-cols-4 gap-1">
                {bgModes.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setBackgroundMode(mode);
                      showSaved();
                    }}
                    className={`p-2 text-[9px] uppercase border transition-all ${
                      theme.backgroundMode === mode
                        ? "border-cyan-500/50 bg-cyan-500/10"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Mode" icon={Monitor}>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setMode("dark");
                    showSaved();
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 p-2 border text-[11px] ${
                    theme.mode === "dark"
                      ? "border-cyan-500/50 bg-cyan-500/10"
                      : "border-white/10"
                  }`}
                >
                  <Moon size={12} /> Dark
                </button>
                <button
                  onClick={() => {
                    setMode("light");
                    showSaved();
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 p-2 border text-[11px] ${
                    theme.mode === "light"
                      ? "border-cyan-500/50 bg-cyan-500/10"
                      : "border-white/10"
                  }`}
                >
                  <Sun size={12} /> Light
                </button>
              </div>
            </Section>

            <Section title="Palette" icon={Palette}>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1">
                {skinPresets.map((skin) => {
                  const colors =
                    theme.mode === "light" ? lightSkins[skin] : darkSkins[skin];
                  return (
                    <Swatch
                      key={skin}
                      color={colors.accentColor}
                      active={theme.skin === skin}
                      onClick={() => {
                        setSkin(skin);
                        showSaved();
                      }}
                      label={skinLabels[skin]}
                    />
                  );
                })}
              </div>
            </Section>

            <Section title="Accent" icon={Zap}>
              <div className="flex flex-wrap gap-1">
                {accents.map((accent) => (
                  <button
                    key={accent}
                    onClick={() => {
                      setAccent(accent);
                      showSaved();
                    }}
                    className={`w-8 h-8 border transition-all hover:scale-110 ${
                      theme.accent === accent
                        ? "border-white"
                        : "border-white/20"
                    }`}
                    style={{ background: accentHex[accent] }}
                    title={accent}
                  />
                ))}
              </div>
            </Section>

            <div className="lg:col-span-2 flex justify-end">
              <button
                onClick={() => {
                  resetTheme();
                  showSaved();
                }}
                className="flex items-center gap-2 px-3 py-2 border border-white/10 text-[10px] uppercase hover:border-red-500/50 hover:text-red-400 transition-colors"
              >
                <RefreshCw size={12} /> Reset Defaults
              </button>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="lg:col-span-2 border border-white/10 overflow-hidden">
              <div
                className="h-24 relative"
                style={{
                  background: profile.coverUrl
                    ? `url(${profile.coverUrl}) center/cover`
                    : "linear-gradient(135deg, #ff00a050, #00f0ff30)",
                }}
              >
                <div className="absolute -bottom-6 left-4">
                  <div
                    className="w-16 h-16 border-2 border-black overflow-hidden"
                    style={{
                      background: profile.avatarUrl ? "transparent" : "#1a1a2e",
                    }}
                  >
                    {profile.avatarUrl ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={profile.avatarUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </>
                    ) : (
                      <User size={24} className="m-4 opacity-50" />
                    )}
                  </div>
                </div>
              </div>
              <div className="pt-8 pb-3 px-4">
                <div className="text-sm font-bold">
                  {profile.displayName || "Unknown"}
                </div>
                <div className="text-[10px] opacity-40">
                  @{profile.username || "user"}
                </div>
              </div>
            </div>

            <Section title="Identity" icon={Fingerprint}>
              <div className="space-y-2">
                <Field
                  label="Display Name"
                  value={profile.displayName || ""}
                  onChange={(v) => updateProfile({ displayName: v })}
                />
                <Field
                  label="Username"
                  value={profile.username || ""}
                  onChange={(v) => updateProfile({ username: v })}
                  prefix="@"
                />
                <Field
                  label="Mood"
                  value={profile.mood || ""}
                  onChange={(v) => updateProfile({ mood: v })}
                />
                <Field
                  label="Location"
                  value={profile.location || ""}
                  onChange={(v) => updateProfile({ location: v })}
                  icon={MapPin}
                />
                <Field
                  label="Website"
                  value={profile.website || ""}
                  onChange={(v) => updateProfile({ website: v })}
                  icon={Globe}
                />
                <Field
                  label="Bio"
                  value={profile.bio || ""}
                  onChange={(v) => updateProfile({ bio: v })}
                  type="textarea"
                  rows={3}
                />
              </div>
            </Section>

            <Section title="Assets" icon={Camera}>
              <div className="space-y-2">
                <div className="flex-1">
                  <label className="text-[10px] uppercase tracking-wider opacity-40 mb-1 block">
                    Avatar
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={profile.avatarUrl || ""}
                      onChange={(e) =>
                        updateProfile({ avatarUrl: e.target.value })
                      }
                      className="flex-1 p-2 text-[11px] bg-black/30 border border-white/10 outline-none focus:border-cyan-500/50"
                      placeholder="https://..."
                    />
                    <GenBtn
                      onClick={() => generateImage("avatar")}
                      loading={generating === "avatar"}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-[10px] uppercase tracking-wider opacity-40 mb-1 block">
                    Cover
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={profile.coverUrl || ""}
                      onChange={(e) =>
                        updateProfile({ coverUrl: e.target.value })
                      }
                      className="flex-1 p-2 text-[11px] bg-black/30 border border-white/10 outline-none focus:border-cyan-500/50"
                      placeholder="https://..."
                    />
                    <GenBtn
                      onClick={() => generateImage("cover")}
                      loading={generating === "cover"}
                    />
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Social" icon={Link2}>
              <div className="space-y-2">
                <Field
                  label="X/Twitter"
                  value={profile.socialLinks?.twitter || ""}
                  onChange={(v) =>
                    updateProfile({
                      socialLinks: { ...profile.socialLinks, twitter: v },
                    })
                  }
                  icon={AtSign}
                />
                <Field
                  label="Instagram"
                  value={profile.socialLinks?.instagram || ""}
                  onChange={(v) =>
                    updateProfile({
                      socialLinks: { ...profile.socialLinks, instagram: v },
                    })
                  }
                  icon={AtSign}
                />
                <Field
                  label="GitHub"
                  value={profile.socialLinks?.github || ""}
                  onChange={(v) =>
                    updateProfile({
                      socialLinks: { ...profile.socialLinks, github: v },
                    })
                  }
                  icon={Hash}
                />
                <Field
                  label="LinkedIn"
                  value={profile.socialLinks?.linkedin || ""}
                  onChange={(v) =>
                    updateProfile({
                      socialLinks: { ...profile.socialLinks, linkedin: v },
                    })
                  }
                  icon={Link2}
                />
              </div>
            </Section>

            <div className="lg:col-span-2 flex justify-end">
              <button
                onClick={() => {
                  resetProfile();
                  showSaved();
                }}
                className="flex items-center gap-2 px-3 py-2 border border-white/10 text-[10px] uppercase hover:border-red-500/50 hover:text-red-400 transition-colors"
              >
                <RefreshCw size={12} /> Reset Profile
              </button>
            </div>
          </div>
        )}

        {/* AGENTS TAB */}
        {activeTab === "agents" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Section title="Webhook Endpoint" icon={Link2}>
              <p className="text-[10px] opacity-60 mb-2">
                ActivePieces flow endpoint
              </p>
              <code className="block p-3 bg-black/30 border border-white/10 text-[9px] break-all text-cyan-400 font-mono">
                https://cloud.activepieces.com/api/v1/webhooks/VoccE3SEr4bciLvkThTlO
              </code>
            </Section>

            <Section title="Core Agents" icon={Bot}>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {[
                  {
                    name: "Director",
                    role: "Orchestrator",
                    color: "#00ffff",
                    installed: true,
                  },
                  {
                    name: "Champion",
                    role: "General Assistant",
                    color: "#ff0080",
                    installed: true,
                  },
                  {
                    name: "Code Champion",
                    role: "Software Expert",
                    color: "#00ff41",
                    installed: true,
                  },
                  {
                    name: "Social Dominator",
                    role: "Growth & Viral",
                    color: "#ff6b6b",
                    installed: false,
                  },
                  {
                    name: "Data Slayer",
                    role: "Analytics",
                    color: "#ffff00",
                    installed: false,
                  },
                  {
                    name: "Writing Coach",
                    role: "Copy & Content",
                    color: "#ff9ff3",
                    installed: true,
                  },
                  {
                    name: "Alex Chen",
                    role: "Developer",
                    color: "#3b82f6",
                    installed: false,
                  },
                  {
                    name: "Sarah K.",
                    role: "Marketing",
                    color: "#ec4899",
                    installed: false,
                  },
                  {
                    name: "Mike Dev",
                    role: "Developer",
                    color: "#06b6d4",
                    installed: false,
                  },
                  {
                    name: "J. Taylor",
                    role: "Content",
                    color: "#f59e0b",
                    installed: false,
                  },
                  {
                    name: "Home Controller",
                    role: "Smart Home",
                    color: "#22d3ee",
                    installed: false,
                  },
                ].map((a) => (
                  <div
                    key={a.name}
                    className="flex items-center gap-3 p-2 border border-white/10 bg-black/20"
                  >
                    <span
                      className="w-2 h-2"
                      style={{ backgroundColor: a.color }}
                    />
                    <span className="text-[11px] font-bold">{a.name}</span>
                    <span className="text-[10px] opacity-40">{a.role}</span>
                    <span className="ml-auto">
                      {a.installed ? (
                        <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-[9px]">
                          INSTALLED
                        </span>
                      ) : (
                        <button className="px-2 py-0.5 border border-cyan-500/50 text-cyan-400 text-[9px] hover:bg-cyan-500/10">
                          INSTALL
                        </button>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="API Keys" icon={Key} defaultOpen={false}>
              <div className="space-y-3">
                <p className="text-[10px] opacity-60">
                  Personal API keys for external integrations
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value="lit_key_••••••••••••••••"
                    readOnly
                    className="flex-1 p-2 text-[11px] bg-black/30 border border-white/10 outline-none font-mono"
                  />
                  <button
                    onClick={() => showSaved()}
                    className="px-3 py-2 border border-cyan-500/50 text-cyan-400 text-[10px] uppercase hover:bg-cyan-500/10 transition-colors"
                  >
                    Regenerate
                  </button>
                </div>
                <div className="text-[9px] opacity-40">
                  Created: Jan 15, 2026 • Never used
                </div>
                <button
                  onClick={() => showSaved()}
                  className="w-full p-2 border border-dashed border-white/20 text-[10px] uppercase hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-colors"
                >
                  + Create New API Key
                </button>
              </div>
            </Section>

            <Section title="Agent Preferences" icon={Settings2}>
              <div className="space-y-1">
                <Toggle
                  label="Auto-run on Startup"
                  desc="Launch installed agents when you log in"
                  value={true}
                  onChange={() => showSaved()}
                />
                <Toggle
                  label="Agent Suggestions"
                  desc="Show AI-powered agent recommendations"
                  value={true}
                  onChange={() => showSaved()}
                />
                <Toggle
                  label="Share Usage Data"
                  desc="Help improve agents by sharing anonymized data"
                  value={false}
                  onChange={() => showSaved()}
                />
              </div>
            </Section>
          </div>
        )}

        {/* INTERFACE TAB */}
        {activeTab === "interface" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Section title="Animation" icon={Zap}>
              <div className="grid grid-cols-4 gap-1">
                {["fast", "normal", "slow", "off"].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => {
                      setAnimSpeed(speed);
                      save("anim-speed", speed);
                    }}
                    className={`p-2 text-[9px] uppercase border transition-all ${
                      animSpeed === speed
                        ? "border-cyan-500/50 bg-cyan-500/10"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    {speed}
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Density" icon={Monitor}>
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => {
                    setCompactMode(true);
                    save("compact", true);
                  }}
                  className={`p-2 text-[9px] uppercase border transition-all ${
                    compactMode
                      ? "border-cyan-500/50 bg-cyan-500/10"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  Compact
                </button>
                <button
                  onClick={() => {
                    setCompactMode(false);
                    save("compact", false);
                  }}
                  className={`p-2 text-[9px] uppercase border transition-all ${
                    !compactMode
                      ? "border-cyan-500/50 bg-cyan-500/10"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  Comfortable
                </button>
              </div>
            </Section>

            <Section title="Accessibility" icon={Eye}>
              <Toggle
                label="Reduced Motion"
                desc="Disable animations"
                value={reducedMotion}
                onChange={(v) => {
                  setReducedMotion(v);
                  save("reduced-motion", v);
                }}
              />
              <Toggle
                label="Sound Effects"
                desc="UI audio cues"
                value={soundEffects}
                onChange={(v) => {
                  setSoundEffects(v);
                  save("sound", v);
                }}
              />
            </Section>

            <Section title="Custom CSS" icon={Code}>
              <textarea
                value={customCSS}
                onChange={(e) => setCustomCSS(e.target.value)}
                onBlur={(e) => save("custom-css", e.target.value)}
                rows={5}
                placeholder=":root { --border: #333; }"
                className="w-full p-3 bg-black/30 border border-white/10 text-[11px] font-mono outline-none focus:border-cyan-500/50 resize-none"
              />
              <button
                onClick={() => {
                  setCustomCSS("");
                  save("custom-css", "");
                }}
                className="w-full mt-2 p-2 border border-white/10 text-[9px] uppercase hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all"
              >
                Clear CSS
              </button>
            </Section>
          </div>
        )}

        {/* MUSIC TAB */}
        {activeTab === "music" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Section title="Background Music" icon={Music}>
              <div className="space-y-4">
                <Toggle
                  label="Enable Music Player"
                  desc="Show the music player widget on all pages"
                  value={musicEnabled}
                  onChange={(v) => {
                    setMusicEnabled(v);
                    const prefs = JSON.parse(
                      localStorage.getItem("litlabs-music-prefs") || "{}",
                    );
                    prefs.enabled = v;
                    localStorage.setItem(
                      "litlabs-music-prefs",
                      JSON.stringify(prefs),
                    );
                    showSaved();
                  }}
                />
                <Toggle
                  label="Auto-play on Load"
                  desc="Start playing music when you open the site"
                  value={musicAutoPlay}
                  onChange={(v) => {
                    setMusicAutoPlay(v);
                    const prefs = JSON.parse(
                      localStorage.getItem("litlabs-music-prefs") || "{}",
                    );
                    prefs.autoPlay = v;
                    localStorage.setItem(
                      "litlabs-music-prefs",
                      JSON.stringify(prefs),
                    );
                    showSaved();
                  }}
                />
                <Toggle
                  label="Mute on Tab Leave"
                  desc="Pause music when you switch to another tab"
                  value={musicMuteOnLeave}
                  onChange={(v) => {
                    setMusicMuteOnLeave(v);
                    const prefs = JSON.parse(
                      localStorage.getItem("litlabs-music-prefs") || "{}",
                    );
                    prefs.muteOnLeave = v;
                    localStorage.setItem(
                      "litlabs-music-prefs",
                      JSON.stringify(prefs),
                    );
                    showSaved();
                  }}
                />
              </div>
            </Section>

            <Section title="Volume Control" icon={Volume2}>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[11px] opacity-60">
                      Master Volume
                    </span>
                    <span className="text-[11px] opacity-60">
                      {musicVolume}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={musicVolume}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setMusicVolume(val);
                      const prefs = JSON.parse(
                        localStorage.getItem("litlabs-music-prefs") || "{}",
                      );
                      prefs.volume = val;
                      localStorage.setItem(
                        "litlabs-music-prefs",
                        JSON.stringify(prefs),
                      );
                    }}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.1)",
                      accentColor: "#06b6d4",
                    }}
                  />
                </div>
                <p className="text-[10px] opacity-40">
                  The music player appears in the bottom-right corner when
                  enabled. You can minimize it or access full controls by
                  clicking on it.
                </p>
                <div className="p-3 border border-white/10 bg-black/20">
                  <div className="text-[10px] opacity-60 mb-2">
                    Currently Playing
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎵</span>
                    <div>
                      <div className="text-xs font-bold">Synthwave Radio</div>
                      <div className="text-[9px] opacity-50">
                        Curated playlist • 5 tracks
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* SYSTEM TAB */}
        {activeTab === "system" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Section title="Environment" icon={Terminal}>
              <div className="space-y-1 text-[10px] font-mono">
                {[
                  {
                    key: "CLERK_AUTH",
                    status: "CONFIGURED",
                    color: "text-green-400",
                  },
                  {
                    key: "GEMINI_AI",
                    status: "ACTIVE",
                    color: "text-green-400",
                  },
                  {
                    key: "OPENROUTER",
                    status: "ACTIVE",
                    color: "text-green-400",
                  },
                ].map((env) => (
                  <div
                    key={env.key}
                    className="flex justify-between p-2 border border-white/10 bg-black/20"
                  >
                    <span className="opacity-60">{env.key}</span>
                    <span className={env.color}>{env.status}</span>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Data Management" icon={Database}>
              <p className="text-[10px] opacity-60 mb-3">
                Erase all local config and reset system
              </p>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="w-full p-3 border border-red-500/50 text-red-400 text-[10px] uppercase hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={12} className="inline-block mr-2" /> WIPE_ALL_DATA
              </button>
            </Section>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === "security" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Section title="Password" icon={Hash}>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider opacity-40 mb-1 block">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full p-2 text-[11px] bg-black/30 border border-white/10 outline-none focus:border-cyan-500/50 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider opacity-40 mb-1 block">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full p-2 text-[11px] bg-black/30 border border-white/10 outline-none focus:border-cyan-500/50 font-mono"
                  />
                </div>
                <button
                  onClick={() => showSaved()}
                  className="w-full p-2 border border-cyan-500/50 text-cyan-400 text-[10px] uppercase hover:bg-cyan-500/10 transition-colors"
                >
                  Update Password
                </button>
              </div>
            </Section>

            <Section title="Two-Factor Auth" icon={Fingerprint}>
              <div className="space-y-3">
                <Toggle
                  label="Enable 2FA"
                  desc="Require code from authenticator app"
                  value={false}
                  onChange={() => showSaved()}
                />
                <div className="p-3 border border-white/10 bg-black/20">
                  <div className="text-[10px] opacity-60 mb-2">Status</div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span className="text-[11px]">Not Configured</span>
                  </div>
                </div>
                <button
                  onClick={() => showSaved()}
                  className="w-full p-2 border border-white/20 text-[10px] uppercase hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-colors"
                >
                  Setup 2FA
                </button>
              </div>
            </Section>

            <Section title="Active Sessions" icon={Monitor} defaultOpen={false}>
              <div className="space-y-2">
                {[
                  {
                    device: "Chrome on Windows",
                    ip: "192.168.1.1",
                    current: true,
                  },
                  {
                    device: "Firefox on MacOS",
                    ip: "10.0.0.5",
                    current: false,
                  },
                ].map((session, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 border border-white/10 bg-black/20"
                  >
                    <div>
                      <div className="text-[11px] font-bold">
                        {session.device}
                        {session.current && (
                          <span className="ml-2 px-1.5 py-0.5 bg-green-500/20 text-green-400 text-[9px]">
                            CURRENT
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] opacity-40">{session.ip}</div>
                    </div>
                    {!session.current && (
                      <button className="px-2 py-1 border border-red-500/50 text-red-400 text-[9px] hover:bg-red-500/10">
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => showSaved()}
                  className="w-full p-2 border border-red-500/50 text-red-400 text-[10px] uppercase hover:bg-red-500/10 transition-colors"
                >
                  Revoke All Other Sessions
                </button>
              </div>
            </Section>

            <Section title="Login History" icon={Activity} defaultOpen={false}>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {[
                  {
                    date: "Today, 14:32",
                    action: "Login",
                    location: "Chrome/Windows",
                  },
                  {
                    date: "Yesterday, 09:15",
                    action: "Login",
                    location: "Firefox/MacOS",
                  },
                  {
                    date: "Jan 10, 18:45",
                    action: "Password Change",
                    location: "Chrome/Windows",
                  },
                ].map((log, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 text-[10px] border-b border-white/5"
                  >
                    <span className="opacity-60">{log.date}</span>
                    <span>{log.action}</span>
                    <span className="opacity-40">{log.location}</span>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {/* WALLET TAB */}
        {activeTab === "wallet" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Section title="LiTBit Coins" icon={Zap}>
              <div className="p-4 border border-yellow-500/30 bg-yellow-500/5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-[10px] opacity-60 uppercase">
                      Balance
                    </div>
                    <div className="text-3xl font-bold text-yellow-400">
                      9,999 🪙
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] opacity-60">Value</div>
                    <div className="text-sm">~$99.99</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => showSaved()}
                    className="flex-1 p-2 border border-yellow-500/50 text-yellow-400 text-[10px] uppercase hover:bg-yellow-500/10 transition-colors"
                  >
                    Buy Coins
                  </button>
                  <button
                    onClick={() => showSaved()}
                    className="flex-1 p-2 border border-white/20 text-[10px] uppercase hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-colors"
                  >
                    Earn Free
                  </button>
                </div>
              </div>
            </Section>

            <Section title="Payment Methods" icon={CreditCard}>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 border border-white/10 bg-black/20">
                  <div className="w-8 h-8 bg-blue-500/20 flex items-center justify-center text-blue-400 text-lg">
                    💳
                  </div>
                  <div className="flex-1">
                    <div className="text-[11px] font-bold">
                      Visa ending in 4242
                    </div>
                    <div className="text-[10px] opacity-40">Expires 12/25</div>
                  </div>
                  <button className="text-[9px] text-red-400 hover:underline">
                    Remove
                  </button>
                </div>
                <button
                  onClick={() => showSaved()}
                  className="w-full p-2 border border-dashed border-white/20 text-[10px] uppercase hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-colors"
                >
                  + Add Payment Method
                </button>
              </div>
            </Section>

            <Section
              title="Transaction History"
              icon={Database}
              defaultOpen={false}
            >
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {[
                  {
                    date: "Today",
                    type: "Daily Bonus",
                    amount: "+50",
                    color: "text-green-400",
                  },
                  {
                    date: "Yesterday",
                    type: "Agent Purchase",
                    amount: "-200",
                    color: "text-red-400",
                  },
                  {
                    date: "Jan 10",
                    type: "Stripe Top-up",
                    amount: "+1000",
                    color: "text-green-400",
                  },
                  {
                    date: "Jan 8",
                    type: "Referral Bonus",
                    amount: "+100",
                    color: "text-green-400",
                  },
                ].map((tx, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 text-[10px] border-b border-white/5"
                  >
                    <span className="opacity-60">{tx.date}</span>
                    <span>{tx.type}</span>
                    <span className={tx.color}>{tx.amount} 🪙</span>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Referrals" icon={Link2}>
              <div className="space-y-3">
                <p className="text-[10px] opacity-60">
                  Invite friends and earn 100 🪙 for each signup
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value="https://litlabs.net/ref/user123"
                    readOnly
                    className="flex-1 p-2 text-[11px] bg-black/30 border border-white/10 outline-none font-mono"
                  />
                  <button
                    onClick={() => showSaved()}
                    className="px-3 py-2 border border-cyan-500/50 text-cyan-400 text-[10px] uppercase hover:bg-cyan-500/10 transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="opacity-60">Referrals: 0</span>
                  <span className="opacity-60">Earned: 0 🪙</span>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === "notifications" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Section title="Email Notifications" icon={Mail}>
              <div className="space-y-1">
                <Toggle
                  label="Account Updates"
                  desc="Password changes, security alerts"
                  value={true}
                  onChange={() => showSaved()}
                />
                <Toggle
                  label="Marketing Emails"
                  desc="New features, promotions, tips"
                  value={false}
                  onChange={() => showSaved()}
                />
                <Toggle
                  label="Weekly Digest"
                  desc="Summary of your activity"
                  value={true}
                  onChange={() => showSaved()}
                />
              </div>
            </Section>

            <Section title="Push Notifications" icon={Bell}>
              <div className="space-y-1">
                <Toggle
                  label="Browser Push"
                  desc="Enable browser notifications"
                  value={false}
                  onChange={() => showSaved()}
                />
                <Toggle
                  label="Agent Messages"
                  desc="When agents complete tasks"
                  value={true}
                  onChange={() => showSaved()}
                />
                <Toggle
                  label="Social Activity"
                  desc="Likes, comments, mentions"
                  value={true}
                  onChange={() => showSaved()}
                />
              </div>
            </Section>

            <Section title="Notification Channels" icon={Globe}>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 border border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📧</span>
                    <span className="text-[11px]">Email</span>
                  </div>
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[9px]">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 border border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔔</span>
                    <span className="text-[11px]">Push</span>
                  </div>
                  <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-[9px]">
                    Disabled
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 border border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💬</span>
                    <span className="text-[11px]">Discord</span>
                  </div>
                  <button className="text-[9px] text-cyan-400 hover:underline">
                    Connect
                  </button>
                </div>
              </div>
            </Section>

            <Section title="Quiet Hours" icon={Moon}>
              <div className="space-y-3">
                <Toggle
                  label="Enable Quiet Hours"
                  desc="Pause notifications during set times"
                  value={false}
                  onChange={() => showSaved()}
                />
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] opacity-40">From</label>
                    <input
                      type="time"
                      defaultValue="22:00"
                      className="w-full p-2 text-[11px] bg-black/30 border border-white/10 outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] opacity-40">To</label>
                    <input
                      type="time"
                      defaultValue="08:00"
                      className="w-full p-2 text-[11px] bg-black/30 border border-white/10 outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* PRIVACY TAB */}
        {activeTab === "privacy" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Section title="Visibility" icon={Eye}>
              <div className="space-y-1">
                <Toggle
                  label="Public Profile"
                  desc="Allow others to view your profile"
                  value={true}
                  onChange={() => showSaved()}
                />
                <Toggle
                  label="Show Activity Status"
                  desc="Display when you're online"
                  value={true}
                  onChange={() => showSaved()}
                />
                <Toggle
                  label="Allow Friend Requests"
                  desc="Others can add you as friend"
                  value={true}
                  onChange={() => showSaved()}
                />
              </div>
            </Section>

            <Section title="Data & Export" icon={Database}>
              <div className="space-y-3">
                <p className="text-[10px] opacity-60">
                  Download all your data in JSON format
                </p>
                <button
                  onClick={() => showSaved()}
                  className="w-full p-2 border border-cyan-500/50 text-cyan-400 text-[10px] uppercase hover:bg-cyan-500/10 transition-colors"
                >
                  Export My Data
                </button>
                <div className="text-[9px] opacity-40">Last export: Never</div>
              </div>
            </Section>

            <Section title="Blocked Users" icon={UserX} defaultOpen={false}>
              <div className="space-y-2">
                {[].map((user, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 border border-white/10"
                  >
                    <span className="text-[11px]">{user}</span>
                    <button className="text-[9px] text-cyan-400 hover:underline">
                      Unblock
                    </button>
                  </div>
                ))}
                <p className="text-[10px] opacity-40 italic">
                  No blocked users
                </p>
              </div>
            </Section>

            <Section title="Danger Zone" icon={AlertTriangle}>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    if (
                      confirm("Delete your account? This cannot be undone!")
                    ) {
                      localStorage.clear();
                      window.location.href = "/";
                    }
                  }}
                  className="w-full p-3 border border-red-500/50 text-red-400 text-[10px] uppercase hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={12} className="inline-block mr-2" /> Delete
                  Account
                </button>
                <p className="text-[9px] opacity-40">
                  This will permanently delete all your data
                </p>
              </div>
            </Section>
          </div>
        )}

        {/* Saved toast */}
        {saved && (
          <div className="fixed bottom-6 right-6 px-4 py-2 border border-cyan-500/50 bg-black/80 text-cyan-400 text-[10px] flex items-center gap-2 shadow-lg animate-pulse z-50 font-mono">
            <Check size={12} /> [DATA_SAVED]
          </div>
        )}
      </div>
    </PageShell>
  );
}
