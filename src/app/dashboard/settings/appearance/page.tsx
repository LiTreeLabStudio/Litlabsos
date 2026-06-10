"use client";

import { useTheme, type AccentColor, type SkinPreset } from "@/context/ThemeContext";
import { Monitor, Zap, Palette, Sun, Moon } from "lucide-react";

export default function AppearanceSettings() {
  const { theme, setMode, setSkin, setAccent } = useTheme();

  const skins: SkinPreset[] = ["volcanic", "cyberpunk", "retro", "matrix", "synthwave"];
  const accents: AccentColor[] = ["sunset-orange", "neon-green", "electric-blue", "hot-pink"];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-black text-volcanic-text uppercase tracking-wider mb-1">
          Interface Subsystems
        </h1>
        <p className="text-xs text-volcanic-text/40">
          Calibrate the visual output of your node.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mode Toggle */}
        <div className="space-y-4">
          <label className="text-[10px] font-mono font-bold text-volcanic-text/40 uppercase tracking-widest flex items-center gap-1.5">
            <Monitor size={12} />
            Luminance Mode
          </label>
          <div className="flex p-1 bg-black/40 border border-volcanic-border rounded-md w-fit">
            <button 
              onClick={() => setMode("dark")}
              className={`flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded transition-all ${
                theme.mode === "dark" ? "bg-volcanic-accent text-black" : "text-volcanic-text/40 hover:text-volcanic-text"
              }`}
            >
              <Moon size={14} />
              Dark
            </button>
            <button 
              onClick={() => setMode("light")}
              className={`flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded transition-all ${
                theme.mode === "light" ? "bg-volcanic-accent text-black" : "text-volcanic-text/40 hover:text-volcanic-text"
              }`}
            >
              <Sun size={14} />
              Light
            </button>
          </div>
        </div>

        {/* Accent Color */}
        <div className="space-y-4">
          <label className="text-[10px] font-mono font-bold text-volcanic-text/40 uppercase tracking-widest flex items-center gap-1.5">
            <Zap size={12} />
            Neural Accent
          </label>
          <div className="flex flex-wrap gap-2">
            {accents.map(acc => (
              <button
                key={acc}
                onClick={() => setAccent(acc)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  theme.accent === acc ? "border-volcanic-text scale-110 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                }`}
                style={{ backgroundColor: acc === "sunset-orange" ? "#ff4d00" : acc === "neon-green" ? "#39ff14" : acc === "electric-blue" ? "#00ffff" : "#ff00ff" }}
                title={acc}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-mono font-bold text-volcanic-text/40 uppercase tracking-widest flex items-center gap-1.5">
          <Palette size={12} />
          Visual Skin Presets
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {skins.map(sk => (
            <button
              key={sk}
              onClick={() => setSkin(sk)}
              className={`px-3 py-4 rounded bg-black/40 border transition-all text-[10px] font-mono font-bold uppercase tracking-widest ${
                theme.skin === sk 
                  ? "border-volcanic-accent text-volcanic-accent shadow-[0_0_10px_rgba(255,77,0,0.2)]" 
                  : "border-volcanic-border text-volcanic-text/40 hover:border-volcanic-text/40 hover:text-volcanic-text"
              }`}
            >
              {sk}
            </button>
          ))}
        </div>
      </div>

      {/* Preview Section */}
      <div className="pt-6 border-t border-volcanic-border">
        <div className="p-6 rounded bg-volcanic-surface border border-volcanic-border flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold text-volcanic-text">Protocol Preview</div>
            <div className="text-[10px] text-volcanic-text/40">This is how your dashboard elements will appear.</div>
          </div>
          <button className="px-4 py-2 bg-volcanic-accent text-black font-black text-[10px] uppercase tracking-widest rounded shadow-lg volcanic-glow">
            Execute Command
          </button>
        </div>
      </div>
    </div>
  );
}
