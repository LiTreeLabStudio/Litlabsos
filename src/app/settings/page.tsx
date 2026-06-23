"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useTheme,
  ThemeMode,
  SkinPreset,
  AccentColor,
} from "@/context/ThemeContext";
import { useProfile, WallpaperId } from "@/context/ProfileContext";
import { useClerkAuth } from "@/hooks/useClerkAuth";
import PageShell from "@/components/PageShell";
import {
  User,
  Palette,
  Bell,
  Shield,
  Save,
  RotateCcw,
  Moon,
  Sun,
  Monitor,
  Check,
} from "lucide-react";

const SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Shield },
];

const WALLPAPERS: { id: WallpaperId; label: string }[] = [
  { id: "default", label: "Default" },
  { id: "mesh", label: "Mesh" },
  { id: "gradient", label: "Gradient" },
  { id: "nebula", label: "Nebula" },
  { id: "cyberpunk", label: "Cyberpunk" },
  { id: "aurora", label: "Aurora" },
  { id: "matrix", label: "Matrix" },
  { id: "sunset", label: "Sunset" },
  { id: "ocean", label: "Ocean" },
  { id: "forest", label: "Forest" },
  { id: "cosmic", label: "Cosmic" },
  { id: "minimal", label: "Minimal" },
  { id: "glass", label: "Glass" },
];

const SIDEBAR_STYLES = [
  { id: "compact", label: "Compact" },
  { id: "comfortable", label: "Comfortable" },
  { id: "spacious", label: "Spacious" },
];

export default function SettingsPage() {
  const { isLoaded, isSignedIn } = useClerkAuth();
  const router = useRouter();
  const { theme, setMode, setSkin, setAccent, resolvedColors: T } = useTheme();
  const { profile, updateProfile, resetProfile } = useProfile();

  const [activeSection, setActiveSection] = useState("profile");
  const [displayName, setDisplayName] = useState(() => profile.displayName);
  const [username, setUsername] = useState(() => profile.username);
  const [bio, setBio] = useState(() => profile.bio);
  const [location, setLocation] = useState(() => profile.location);
  const [website, setWebsite] = useState(() => profile.website);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?redirect_url=/settings");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <PageShell title="Settings">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl mb-4 animate-pulse">⚙️</div>
            <div>Loading settings...</div>
          </div>
        </div>
      </PageShell>
    );
  }

  if (!isSignedIn) {
    return (
      <PageShell title="Sign In">
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold mb-2">
            Sign in to manage settings
          </h1>
          <p className="opacity-60 mb-6 max-w-md">
            Your settings are tied to your account. Sign in to customize your
            experience.
          </p>
        </div>
      </PageShell>
    );
  }

  const handleSaveProfile = () => {
    updateProfile({
      displayName: displayName.trim() || profile.displayName,
      username: username.trim() || profile.username,
      bio: bio.trim(),
      location: location.trim(),
      website: website.trim(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (
      confirm("Reset all profile settings to defaults? This cannot be undone.")
    ) {
      resetProfile();
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider opacity-70">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border focus:outline-none focus:ring-2 text-sm"
                  style={{ borderColor: T.borderColor + "40" }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider opacity-70">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border focus:outline-none focus:ring-2 text-sm"
                  style={{ borderColor: T.borderColor + "40" }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider opacity-70">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border focus:outline-none focus:ring-2 text-sm resize-none"
                style={{ borderColor: T.borderColor + "40" }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider opacity-70">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border focus:outline-none focus:ring-2 text-sm"
                  style={{ borderColor: T.borderColor + "40" }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider opacity-70">
                  Website
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border focus:outline-none focus:ring-2 text-sm"
                  style={{ borderColor: T.borderColor + "40" }}
                />
              </div>
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider opacity-70">
                Theme Mode
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: "light", label: "Light", icon: Sun },
                  { id: "dark", label: "Dark", icon: Moon },
                  { id: "system", label: "System", icon: Monitor },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setMode(id as ThemeMode)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold transition-all ${theme.mode === id ? "ring-2" : "opacity-70 hover:opacity-100"}`}
                    style={{ borderColor: T.borderColor + "40" }}
                  >
                    <Icon size={16} />
                    {label}
                    {theme.mode === id && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider opacity-70">
                Skin Preset
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {(
                  [
                    "midnight",
                    "cyberpunk",
                    "ocean",
                    "sunset",
                    "matrix",
                    "pink",
                    "synthwave",
                    "volcanic",
                    "gold",
                    "arctic",
                    "emerald",
                    "neon",
                    "blood",
                    "cosmic",
                    "miami",
                    "minimal",
                  ] as SkinPreset[]
                ).map((skin) => (
                  <button
                    key={skin}
                    onClick={() => setSkin(skin)}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold capitalize transition-all ${theme.skin === skin ? "ring-2" : "opacity-70 hover:opacity-100"}`}
                    style={{ borderColor: T.borderColor + "40" }}
                  >
                    {skin}
                    {theme.skin === skin && (
                      <Check size={12} className="inline ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider opacity-70">
                Accent Color
              </label>
              <div className="flex flex-wrap gap-3">
                {(
                  [
                    "electric-blue",
                    "neon-green",
                    "hot-pink",
                    "cyber-yellow",
                    "matrix-green",
                    "sunset-orange",
                    "ocean-blue",
                    "purple-haze",
                  ] as AccentColor[]
                ).map((accent) => (
                  <button
                    key={accent}
                    onClick={() => setAccent(accent)}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold capitalize transition-all ${theme.accent === accent ? "ring-2" : "opacity-70 hover:opacity-100"}`}
                    style={{ borderColor: T.borderColor + "40" }}
                  >
                    {accent.replace(/-/g, " ")}
                    {theme.accent === accent && (
                      <Check size={12} className="inline ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider opacity-70">
                Wallpaper
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {WALLPAPERS.map((wp) => (
                  <button
                    key={wp.id}
                    onClick={() => updateProfile({ wallpaper: wp.id })}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold capitalize transition-all ${profile.wallpaper === wp.id ? "ring-2" : "opacity-70 hover:opacity-100"}`}
                    style={{ borderColor: T.borderColor + "40" }}
                  >
                    {wp.label}
                    {profile.wallpaper === wp.id && (
                      <Check size={12} className="inline ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider opacity-70">
                Sidebar Density
              </label>
              <div className="flex flex-wrap gap-3">
                {SIDEBAR_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() =>
                      updateProfile({
                        sidebarStyle: style.id as typeof profile.sidebarStyle,
                      })
                    }
                    className={`px-4 py-2 rounded-xl border text-sm font-bold capitalize transition-all ${profile.sidebarStyle === style.id ? "ring-2" : "opacity-70 hover:opacity-100"}`}
                    style={{ borderColor: T.borderColor + "40" }}
                  >
                    {style.label}
                    {profile.sidebarStyle === style.id && (
                      <Check size={14} className="inline ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-4">
            {[
              {
                label: "Email notifications",
                desc: "Receive updates about your agents and account.",
              },
              {
                label: "Marketing emails",
                desc: "Get tips, product news, and promotional offers.",
              },
              {
                label: "Agent alerts",
                desc: "Notify when agents complete tasks or need attention.",
              },
              {
                label: "Social mentions",
                desc: "Notify when someone mentions you in the community.",
              },
            ].map(({ label, desc }) => (
              <div
                key={label}
                className="flex items-center justify-between p-4 rounded-xl border"
                style={{ borderColor: T.borderColor + "40" }}
              >
                <div>
                  <div className="font-bold text-sm">{label}</div>
                  <div className="text-xs opacity-60">{desc}</div>
                </div>
                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-white/10">
                  <span className="sr-only">Toggle {label}</span>
                  <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white/50 transition" />
                </div>
              </div>
            ))}
            <p className="text-xs opacity-50">
              Notification preferences are stored locally. Full sync coming
              soon.
            </p>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-6">
            <div
              className="p-4 rounded-xl border"
              style={{ borderColor: T.borderColor + "40" }}
            >
              <h3 className="font-bold text-sm mb-2">Public Profile</h3>
              <p className="text-xs opacity-60 mb-3">
                Your profile is visible to other signed-in users. You can manage
                details from the Profile tab.
              </p>
              <button
                className="px-4 py-2 rounded-lg text-xs font-bold border transition-all hover:opacity-80"
                style={{ borderColor: T.borderColor + "40" }}
              >
                View Public Profile
              </button>
            </div>

            <div
              className="p-4 rounded-xl border"
              style={{ borderColor: T.borderColor + "40" }}
            >
              <h3 className="font-bold text-sm mb-2">Data & Export</h3>
              <p className="text-xs opacity-60 mb-3">
                Download your profile, agent preferences, and marketplace
                history.
              </p>
              <button
                className="px-4 py-2 rounded-lg text-xs font-bold border transition-all hover:opacity-80"
                style={{ borderColor: T.borderColor + "40" }}
              >
                Request Data Export
              </button>
            </div>

            <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5">
              <h3 className="font-bold text-sm mb-2 text-red-400">
                Danger Zone
              </h3>
              <p className="text-xs opacity-60 mb-3">
                Reset all local settings to default values. This will not delete
                your account.
              </p>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg text-xs font-bold border border-red-500/50 text-red-400 transition-all hover:bg-red-500/10"
              >
                Reset Settings
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <PageShell title="Settings">
      <div className="min-h-[calc(100vh-8rem)] max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div
              className="rounded-2xl border p-2 sticky top-24"
              style={{
                borderColor: T.borderColor + "40",
                backgroundColor: T.boxBg + "80",
              }}
            >
              {SECTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeSection === id ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
                  style={
                    activeSection === id
                      ? {
                          backgroundColor: T.accentColor + "15",
                          color: T.accentColor,
                        }
                      : {}
                  }
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <div
              className="rounded-2xl border p-6 md:p-8"
              style={{
                borderColor: T.borderColor + "40",
                backgroundColor: T.boxBg + "80",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-black uppercase tracking-tight">
                  {SECTIONS.find((s) => s.id === activeSection)?.label}
                </h1>
                {activeSection === "profile" && (
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
                    style={{ backgroundColor: T.accentColor, color: "#000" }}
                  >
                    {saved ? <Check size={16} /> : <Save size={16} />}
                    {saved ? "Saved" : "Save"}
                  </button>
                )}
                {activeSection === "appearance" && (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all hover:opacity-80"
                    style={{ borderColor: T.borderColor + "40" }}
                  >
                    <RotateCcw size={16} />
                    Reset
                  </button>
                )}
              </div>

              {renderSection()}
            </div>
          </main>
        </div>
      </div>
    </PageShell>
  );
}
