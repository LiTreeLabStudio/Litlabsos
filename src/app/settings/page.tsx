"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
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
  Mic,
  Save,
  Moon,
  Sun,
  Monitor,
  Check,
} from "lucide-react";

const SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "voice", label: "Voice & Mic", icon: Mic },
  { id: "privacy", label: "Privacy", icon: Shield },
];

const inputBorderClass = "border-(--border-color)";

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
  const { theme, setMode, setSkin, setAccent } = useTheme();
  const { profile, updateProfile, resetProfile } = useProfile();

  const [activeSection, setActiveSection] = useState("profile");
  const [displayName, setDisplayName] = useState(() => profile.displayName);
  const [username, setUsername] = useState(() => profile.username);
  const [bio, setBio] = useState(() => profile.bio);
  const [location, setLocation] = useState(() => profile.location);
  const [website, setWebsite] = useState(() => profile.website);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const [notifAgents, setNotifAgents] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      return JSON.parse(
        localStorage.getItem("notif-agents") ?? "true",
      ) as boolean;
    } catch {
      return true;
    }
  });
  const [notifSocial, setNotifSocial] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      return JSON.parse(
        localStorage.getItem("notif-social") ?? "true",
      ) as boolean;
    } catch {
      return true;
    }
  });
  const [notifSystem, setNotifSystem] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      return JSON.parse(
        localStorage.getItem("notif-system") ?? "true",
      ) as boolean;
    } catch {
      return true;
    }
  });
  const [notifMarketing, setNotifMarketing] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return JSON.parse(
        localStorage.getItem("notif-marketing") ?? "false",
      ) as boolean;
    } catch {
      return false;
    }
  });

  const [exportRequested, setExportRequested] = useState(false);

  const [micTest, setMicTest] = useState<"idle" | "testing" | "ok" | "denied">(
    "idle",
  );
  const [micPermission, setMicPermission] = useState<
    "Granted" | "Denied" | "Prompt" | "unknown"
  >("unknown");

  const handleToggleNotif = useCallback(
    (key: string, value: boolean, setter: (v: boolean) => void) => {
      setter(value);
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(value));
      }
    },
    [],
  );

  const handleMicTest = useCallback(async () => {
    setMicTest("testing");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicTest("ok");
      stream.getTracks().forEach((track) => track.stop());
    } catch {
      setMicTest("denied");
    }
  }, []);

  const handleSaveProfile = useCallback(() => {
    updateProfile({
      displayName: displayName.trim() || profile.displayName,
      username: username.trim() || profile.username,
      bio: bio.trim(),
      location: location.trim(),
      website: website.trim(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [updateProfile, profile, displayName, username, bio, location, website]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cleanup: (() => void) | undefined;
    if ("permissions" in navigator && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "microphone" as PermissionName })
        .then((status) => {
          const update = () => {
            setMicPermission(
              status.state === "granted"
                ? "Granted"
                : status.state === "denied"
                  ? "Denied"
                  : "Prompt",
            );
          };
          update();
          status.addEventListener("change", update);
          cleanup = () => status.removeEventListener("change", update);
        })
        .catch(() => setMicPermission("unknown"));
    }
    return () => cleanup?.();
  }, []);

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
                  className={`w-full px-4 py-3 rounded-xl bg-white/5 border focus:outline-none focus:ring-2 text-sm ${inputBorderClass}`}
                  placeholder="Your display name"
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
                  className={`w-full px-4 py-3 rounded-xl bg-white/5 border focus:outline-none focus:ring-2 text-sm ${inputBorderClass}`}
                  placeholder="@username"
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
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border focus:outline-none focus:ring-2 text-sm resize-none ${inputBorderClass}`}
                placeholder="Tell us about yourself"
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
                  className={`w-full px-4 py-3 rounded-xl bg-white/5 border focus:outline-none focus:ring-2 text-sm ${inputBorderClass}`}
                  placeholder="City, Country"
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
                  className={`w-full px-4 py-3 rounded-xl bg-white/5 border focus:outline-none focus:ring-2 text-sm ${inputBorderClass}`}
                  placeholder="https://yoursite.com"
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold transition-all ${theme.mode === id ? "ring-2" : "opacity-70 hover:opacity-100"} ${inputBorderClass}`}
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
                    className={`px-3 py-2 rounded-xl border text-xs font-bold capitalize transition-all ${theme.skin === skin ? "ring-2" : "opacity-70 hover:opacity-100"} ${inputBorderClass}`}
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
                    className={`px-3 py-2 rounded-xl border text-xs font-bold capitalize transition-all ${theme.accent === accent ? "ring-2" : "opacity-70 hover:opacity-100"} ${inputBorderClass}`}
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
                    className={`px-3 py-2 rounded-xl border text-xs font-bold capitalize transition-all ${profile.wallpaper === wp.id ? "ring-2" : "opacity-70 hover:opacity-100"} ${inputBorderClass}`}
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
                    className={`px-4 py-2 rounded-xl border text-sm font-bold capitalize transition-all ${profile.sidebarStyle === style.id ? "ring-2" : "opacity-70 hover:opacity-100"} ${inputBorderClass}`}
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

      case "notifications": {
        const notifs = [
          {
            key: "notif-system",
            label: "Email notifications",
            desc: "Receive updates about your account.",
            value: notifSystem,
            setter: setNotifSystem,
          },
          {
            key: "notif-marketing",
            label: "Marketing emails",
            desc: "Get tips, product news, and promotional offers.",
            value: notifMarketing,
            setter: setNotifMarketing,
          },
          {
            key: "notif-agents",
            label: "Agent alerts",
            desc: "Notify when agents complete tasks or need attention.",
            value: notifAgents,
            setter: setNotifAgents,
          },
          {
            key: "notif-social",
            label: "Social mentions",
            desc: "Notify when someone mentions you in the community.",
            value: notifSocial,
            setter: setNotifSocial,
          },
        ];
        return (
          <div className="space-y-4">
            {notifs.map(({ key, label, desc, value, setter }) => (
              <div
                key={key}
                className={`flex items-center justify-between p-4 rounded-xl border ${inputBorderClass}`}
              >
                <div>
                  <div className="font-bold text-sm">{label}</div>
                  <div className="text-xs opacity-60">{desc}</div>
                </div>
                <label className="relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full bg-white/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      handleToggleNotif(key, e.target.checked, setter)
                    }
                    className="sr-only"
                  />
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${value ? "translate-x-6" : "translate-x-1"}`}
                  />
                </label>
              </div>
            ))}
            <p className="text-xs opacity-50">
              Notification preferences are stored locally.
            </p>
          </div>
        );
      }

      case "voice":
        return (
          <div className="space-y-6">
            <div
              className={`p-4 rounded-xl border bg-white/5 ${inputBorderClass}`}
            >
              <h3 className="font-bold text-sm mb-2">Microphone Test</h3>
              <p className="text-xs opacity-60 mb-3">
                Test that your browser can access the microphone.
              </p>
              <button
                onClick={handleMicTest}
                disabled={micTest === "testing"}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105 bg-(--accent-color) text-black disabled:opacity-50 disabled:hover:scale-100"
              >
                <Mic size={16} />
                {micTest === "testing" ? "Testing..." : "Test Microphone"}
              </button>
              {micTest === "ok" && (
                <p className="mt-3 text-sm text-green-400">
                  Microphone working!
                </p>
              )}
              {micTest === "denied" && (
                <p className="mt-3 text-sm text-red-400">
                  Permission denied - check browser settings
                </p>
              )}
            </div>

            <div
              className={`p-4 rounded-xl border bg-white/5 ${inputBorderClass}`}
            >
              <h3 className="font-bold text-sm mb-2">Microphone Permission</h3>
              <p className="text-xs opacity-60">
                Status: <span className="font-bold">{micPermission}</span>
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border bg-white/5 ${inputBorderClass}`}
            >
              <h3 className="font-bold text-sm mb-2">Browser Support</h3>
              <p className="text-xs opacity-60">
                The Web Speech API (speech-to-text) is supported in Chrome,
                Edge, Safari, and Firefox. Voice commands are processed locally
                in supported browsers.
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border bg-white/5 ${inputBorderClass}`}
            >
              <h3 className="font-bold text-sm mb-2">Text-to-Speech Voice</h3>
              <p className="text-xs opacity-60">
                TTS voice is configured in the Jarvis terminal. Open the
                terminal to choose your preferred voice and speed.
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border bg-white/5 ${inputBorderClass}`}
            >
              <h3 className="font-bold text-sm mb-2">
                How to Enable Microphone
              </h3>
              <ul className="text-xs opacity-60 space-y-2 list-disc pl-4">
                <li>
                  <strong>Chrome:</strong> Click the lock icon in the address
                  bar → Microphone → Allow.
                </li>
                <li>
                  <strong>Firefox:</strong> Click the lock icon in the address
                  bar → Permissions → Microphone → Allow.
                </li>
                <li>
                  <strong>Mobile:</strong> Open browser settings → Site
                  permissions → Microphone → Allow.
                </li>
                <li>
                  <strong>Safari:</strong> Preferences → Websites → Microphone →
                  Allow for this site.
                </li>
              </ul>
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-6">
            <div
              className={`p-4 rounded-xl border bg-white/5 ${inputBorderClass}`}
            >
              <h3 className="font-bold text-sm mb-2">Public Profile</h3>
              <p className="text-xs opacity-60 mb-3">
                Your profile is visible to other signed-in users. You can manage
                details from the Profile tab.
              </p>
              <button
                onClick={() => router.push(`/profile/${profile.username}`)}
                className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all hover:opacity-80 bg-white/5 ${inputBorderClass}`}
              >
                View Public Profile
              </button>
            </div>

            <div
              className={`p-4 rounded-xl border bg-white/5 ${inputBorderClass}`}
            >
              <h3 className="font-bold text-sm mb-2">Data & Export</h3>
              <p className="text-xs opacity-60 mb-3">
                Download your profile, agent preferences, and marketplace
                history.
              </p>
              <button
                onClick={() => setExportRequested(true)}
                className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all hover:opacity-80 bg-white/5 ${inputBorderClass}`}
              >
                {exportRequested ? "Export Requested" : "Request Data Export"}
              </button>
              {exportRequested && (
                <p className="mt-3 text-xs text-green-400">
                  Your data export will be emailed within 24 hours.
                </p>
              )}
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
                onClick={() => setConfirmReset(true)}
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

  const activeLabel = SECTIONS.find((s) => s.id === activeSection)?.label;

  return (
    <PageShell title="Settings">
      <div className="min-h-[calc(100vh-8rem)] max-w-6xl mx-auto px-4 py-8">
        {/* Mobile tabs */}
        <div className="lg:hidden flex overflow-x-auto gap-2 mb-6 pb-2">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold whitespace-nowrap transition-all ${inputBorderClass} ${activeSection === id ? "bg-[color-mix(in_srgb,var(--accent-color)_8%,transparent)] text-(--accent-color)" : "opacity-70 hover:opacity-100"}`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block lg:w-64 shrink-0">
            <div
              className={`rounded-2xl border p-2 sticky top-24 bg-white/5 ${inputBorderClass}`}
            >
              {SECTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeSection === id ? "bg-[color-mix(in_srgb,var(--accent-color)_8%,transparent)] text-(--accent-color)" : "opacity-60 hover:opacity-100"}`}
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
              className={`rounded-2xl border p-6 md:p-8 bg-white/5 ${inputBorderClass}`}
            >
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-black uppercase tracking-tight">
                  {activeLabel}
                </h1>
                {activeSection === "profile" && (
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105 bg-(--accent-color) text-black"
                  >
                    {saved ? <Check size={16} /> : <Save size={16} />}
                    {saved ? "Saved" : "Save"}
                  </button>
                )}
              </div>

              {renderSection()}
            </div>
          </main>
        </div>
      </div>
      {confirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#151520] border border-[#2a2a45] rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-black mb-2">Reset Settings?</h3>
            <p className="text-sm opacity-70 mb-6">
              Reset all profile settings to defaults? This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmReset(false)}
                className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all hover:opacity-80 bg-white/5 ${inputBorderClass}`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetProfile();
                  setConfirmReset(false);
                }}
                className="px-4 py-2 rounded-lg text-xs font-bold border border-red-500/50 text-red-400 transition-all hover:bg-red-500/10"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
