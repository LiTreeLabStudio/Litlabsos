"use client";

import { useState } from "react";
import { useTheme, darkSkins, lightSkins, type SkinPreset, type AccentColor } from "@/context/ThemeContext";
import { useProfile, type UserProfile } from "@/context/ProfileContext";

export default function SettingsPage() {
  const { theme, resolvedColors, setMode, setSkin, setAccent, resetTheme } = useTheme();
  const { profile, updateProfile, resetProfile } = useProfile();

  const [activeTab, setActiveTab] = useState<"theme" | "profile" | "agents" | "advanced">("theme");
  const [saved, setSaved] = useState(false);

  const skinPresets: SkinPreset[] = ["cyberpunk", "retro", "ocean", "sunset", "matrix", "pink"];
  const accentColors: AccentColor[] = ["neon-green", "hot-pink", "electric-blue", "cyber-yellow", "matrix-green", "sunset-orange", "ocean-blue", "purple-haze"];

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const T = resolvedColors;

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: T.bgColor, color: T.textColor }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6" style={{ color: T.headerColor }}>⚙️ Settings</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["theme", "profile", "agents", "advanced"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 text-sm font-bold border-2 capitalize transition-all"
              style={{
                borderColor: activeTab === tab ? T.linkColor : T.borderColor,
                backgroundColor: activeTab === tab ? `${T.linkColor}22` : "transparent",
                color: activeTab === tab ? T.linkColor : T.textColor,
              }}
            >
              {tab === "agents" ? "Agent Prefs" : tab}
            </button>
          ))}
        </div>

        {/* Theme Tab */}
        {activeTab === "theme" && (
          <div className="space-y-6">
            {/* Dark / Light */}
            <div className="p-4 border-2" style={{ borderColor: T.borderColor, backgroundColor: T.boxBg }}>
              <h2 className="font-bold mb-3" style={{ color: T.headerColor }}>Mode</h2>
              <div className="flex gap-3">
                <button onClick={() => { setMode("dark"); showSaved(); }} className="px-4 py-2 border-2 font-bold text-sm" style={{ borderColor: T.borderColor, backgroundColor: theme.mode === "dark" ? T.linkColor : "transparent", color: theme.mode === "dark" ? "white" : T.textColor }}>🌙 Dark</button>
                <button onClick={() => { setMode("light"); showSaved(); }} className="px-4 py-2 border-2 font-bold text-sm" style={{ borderColor: T.borderColor, backgroundColor: theme.mode === "light" ? T.linkColor : "transparent", color: theme.mode === "light" ? "white" : T.textColor }}>☀️ Light</button>
              </div>
            </div>

            {/* Skin Presets */}
            <div className="p-4 border-2" style={{ borderColor: T.borderColor, backgroundColor: T.boxBg }}>
              <h2 className="font-bold mb-3" style={{ color: T.headerColor }}>Skin</h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {skinPresets.map((skin) => (
                  <button
                    key={skin}
                    onClick={() => { setSkin(skin); showSaved(); }}
                    className="p-3 border-2 text-center text-xs font-bold capitalize transition-all hover:scale-105"
                    style={{
                      borderColor: theme.skin === skin ? T.linkColor : T.borderColor,
                      backgroundColor: theme.skin === skin ? `${T.linkColor}22` : "transparent",
                      color: T.textColor,
                    }}
                  >
                    {skin}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Colors */}
            <div className="p-4 border-2" style={{ borderColor: T.borderColor, backgroundColor: T.boxBg }}>
              <h2 className="font-bold mb-3" style={{ color: T.headerColor }}>Accent Color</h2>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {accentColors.map((accent) => (
                  <button
                    key={accent}
                    onClick={() => { setAccent(accent); showSaved(); }}
                    className="p-2 border-2 text-center text-xs font-bold capitalize transition-all hover:scale-105"
                    style={{
                      borderColor: theme.accent === accent ? T.linkColor : T.borderColor,
                      backgroundColor: theme.accent === accent ? `${T.linkColor}22` : "transparent",
                      color: T.textColor,
                    }}
                  >
                    {accent.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => { resetTheme(); showSaved(); }} className="px-4 py-2 text-sm font-bold border-2" style={{ borderColor: T.borderColor, color: T.textColor }}>↺ Reset to Default</button>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-4">
            <div className="p-4 border-2" style={{ borderColor: T.borderColor, backgroundColor: T.boxBg }}>
              <h2 className="font-bold mb-3" style={{ color: T.headerColor }}>Display Name</h2>
              <input
                type="text"
                value={profile.displayName}
                onChange={(e) => { updateProfile({ displayName: e.target.value }); showSaved(); }}
                className="w-full p-2 border-2 bg-transparent text-sm"
                style={{ borderColor: T.borderColor, color: T.textColor }}
              />
            </div>
            <div className="p-4 border-2" style={{ borderColor: T.borderColor, backgroundColor: T.boxBg }}>
              <h2 className="font-bold mb-3" style={{ color: T.headerColor }}>Bio</h2>
              <textarea
                value={profile.bio}
                onChange={(e) => { updateProfile({ bio: e.target.value }); showSaved(); }}
                rows={3}
                className="w-full p-2 border-2 bg-transparent text-sm"
                style={{ borderColor: T.borderColor, color: T.textColor }}
              />
            </div>
            <div className="p-4 border-2" style={{ borderColor: T.borderColor, backgroundColor: T.boxBg }}>
              <h2 className="font-bold mb-3" style={{ color: T.headerColor }}>Mood</h2>
              <input
                type="text"
                value={profile.mood}
                onChange={(e) => { updateProfile({ mood: e.target.value }); showSaved(); }}
                className="w-full p-2 border-2 bg-transparent text-sm"
                style={{ borderColor: T.borderColor, color: T.textColor }}
              />
            </div>
            <div className="p-4 border-2" style={{ borderColor: T.borderColor, backgroundColor: T.boxBg }}>
              <h2 className="font-bold mb-3" style={{ color: T.headerColor }}>Website</h2>
              <input
                type="text"
                value={profile.website}
                onChange={(e) => { updateProfile({ website: e.target.value }); showSaved(); }}
                className="w-full p-2 border-2 bg-transparent text-sm"
                style={{ borderColor: T.borderColor, color: T.textColor }}
              />
            </div>
            <button onClick={() => { resetProfile(); showSaved(); }} className="px-4 py-2 text-sm font-bold border-2" style={{ borderColor: T.borderColor, color: T.textColor }}>↺ Reset Profile</button>
          </div>
        )}

        {/* Agents Tab */}
        {activeTab === "agents" && (
          <div className="space-y-4">
            <div className="p-4 border-2" style={{ borderColor: T.borderColor, backgroundColor: T.boxBg }}>
              <h2 className="font-bold mb-3" style={{ color: T.headerColor }}>ActivePieces Webhook</h2>
              <p className="text-xs mb-2 opacity-70">Your multi-agent flow is connected. Director plans, specialists execute.</p>
              <code className="block p-2 text-xs border" style={{ borderColor: T.borderColor, backgroundColor: T.bgColor }}>
                https://cloud.activepieces.com/api/v1/webhooks/VoccE3SEr4bciLvkThTlO
              </code>
            </div>
            <div className="p-4 border-2" style={{ borderColor: T.borderColor, backgroundColor: T.boxBg }}>
              <h2 className="font-bold mb-3" style={{ color: T.headerColor }}>Built-in Agents</h2>
              <div className="space-y-2 text-sm">
                {[
                  { name: "Director", role: "Orchestrator", icon: "🎯" },
                  { name: "Champion", role: "General Assistant", icon: "🏆" },
                  { name: "Code Champion", role: "Software Engineer", icon: "💻" },
                  { name: "Social Dominator", role: "Growth & Content", icon: "📱" },
                  { name: "Data Slayer", role: "Data Scientist", icon: "📊" },
                  { name: "Writing Coach", role: "Content Writer", icon: "✍️" },
                ].map((a) => (
                  <div key={a.name} className="flex items-center gap-3 p-2 border" style={{ borderColor: T.borderColor }}>
                    <span>{a.icon}</span>
                    <span className="font-bold">{a.name}</span>
                    <span className="text-xs opacity-60">{a.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Advanced Tab */}
        {activeTab === "advanced" && (
          <div className="space-y-4">
            <div className="p-4 border-2" style={{ borderColor: T.borderColor, backgroundColor: T.boxBg }}>
              <h2 className="font-bold mb-3" style={{ color: T.headerColor }}>Environment</h2>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between"><span>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</span><span className="opacity-50">pk_test_***</span></div>
                <div className="flex justify-between"><span>GEMINI_API_KEY</span><span className="opacity-50">AIza***</span></div>
                <div className="flex justify-between"><span>OPENROUTER_API_KEY</span><span className="opacity-50">sk-or-v1-***</span></div>
              </div>
              <p className="text-xs mt-3 opacity-60">Update keys in Vercel dashboard → Settings → Environment Variables</p>
            </div>
            <div className="p-4 border-2" style={{ borderColor: T.borderColor, backgroundColor: T.boxBg }}>
              <h2 className="font-bold mb-3" style={{ color: T.headerColor }}>Data</h2>
              <p className="text-xs opacity-70 mb-2">Profile and theme data is stored in your browser's localStorage.</p>
              <button
                onClick={() => { localStorage.clear(); window.location.reload(); }}
                className="px-4 py-2 text-xs font-bold border-2"
                style={{ borderColor: "#ff4444", color: "#ff4444" }}
              >
                🗑 Clear All Local Data
              </button>
            </div>
          </div>
        )}

        {/* Saved indicator */}
        {saved && (
          <div className="fixed bottom-6 right-6 px-4 py-2 font-bold text-sm border-2" style={{ borderColor: T.linkColor, backgroundColor: T.boxBg, color: T.linkColor }}>
            ✅ Saved
          </div>
        )}
      </div>
    </div>
  );
}
