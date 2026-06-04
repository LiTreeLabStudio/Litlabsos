"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export type AccentColor = "cyan" | "purple" | "gold" | "green" | "red" | "pink" | "orange" | "blue";
export type FontSize = "sm" | "md" | "lg";
export type Theme = "dark" | "light" | "system";
export type BackgroundSkin = "default" | "stars" | "grid" | "gradient" | "particles" | "matrix" | "neon";

interface ThemeState {
  theme: Theme;
  accentColor: AccentColor;
  fontSize: FontSize;
  backgroundSkin: BackgroundSkin;
}

interface ThemeContextType extends ThemeState {
  resolvedTheme: "dark" | "light";
  isDark: boolean;
  setTheme: (t: Theme) => void;
  setAccentColor: (c: AccentColor) => void;
  setFontSize: (s: FontSize) => void;
  setBackgroundSkin: (s: BackgroundSkin) => void;
  savePreferences: () => Promise<void>;
}

const ACCENT_MAP: Record<AccentColor, { hex: string; glow: string; label: string }> = {
  cyan: { hex: "#00f2fe", glow: "rgba(0,242,254,0.3)", label: "Cyan Neon" },
  purple: { hex: "#9b51e0", glow: "rgba(155,81,224,0.3)", label: "Purple Glow" },
  gold: { hex: "#ffd700", glow: "rgba(255,215,0,0.3)", label: "Gold Rush" },
  green: { hex: "#00ff88", glow: "rgba(0,255,136,0.3)", label: "Matrix Green" },
  red: { hex: "#ff5050", glow: "rgba(255,80,80,0.3)", label: "Red Alert" },
  pink: { hex: "#ff00aa", glow: "rgba(255,0,170,0.3)", label: "Hot Pink" },
  orange: { hex: "#ff6b35", glow: "rgba(255,107,53,0.3)", label: "Sunset Orange" },
  blue: { hex: "#3b82f6", glow: "rgba(59,130,246,0.3)", label: "Electric Blue" },
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  accentColor: "cyan",
  fontSize: "md",
  backgroundSkin: "default",
  resolvedTheme: "dark",
  isDark: true,
  setTheme: () => {},
  setAccentColor: () => {},
  setFontSize: () => {},
  setBackgroundSkin: () => {},
  savePreferences: async () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [accentColor, setAccentColorState] = useState<AccentColor>("cyan");
  const [fontSize, setFontSizeState] = useState<FontSize>("md");
  const [backgroundSkin, setBackgroundSkinState] = useState<BackgroundSkin>("default");
  const [systemTheme, setSystemTheme] = useState<"dark" | "light">("dark");

  // Listen for system theme changes
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemTheme(mq.matches ? "dark" : "light");
    const handler = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Load saved preferences
  useEffect(() => {
    try {
      const saved = localStorage.getItem("litlabs-theme");
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<ThemeState>;
        if (parsed.theme) setThemeState(parsed.theme);
        if (parsed.accentColor) setAccentColorState(parsed.accentColor as AccentColor);
        if (parsed.fontSize) setFontSizeState(parsed.fontSize as FontSize);
        if (parsed.backgroundSkin) setBackgroundSkinState(parsed.backgroundSkin as BackgroundSkin);
      }
    } catch { /* ignore */ }
  }, []);

  const resolvedTheme: "dark" | "light" = theme === "system" ? systemTheme : theme;
  const isDark = resolvedTheme === "dark";

  // Apply CSS variables to document
  useEffect(() => {
    const accent = ACCENT_MAP[accentColor];
    const root = document.documentElement;
    root.style.setProperty("--accent", accent.hex);
    root.style.setProperty("--accent-glow", accent.glow);
    root.setAttribute("data-theme", resolvedTheme);
    root.setAttribute("data-skin", backgroundSkin);
    root.style.fontSize = fontSize === "sm" ? "14px" : fontSize === "lg" ? "18px" : "16px";
    document.body.className = isDark
      ? "bg-[#0a0a0f] text-white"
      : "bg-[#f8f9fa] text-[#1a1a2e]";
  }, [theme, accentColor, fontSize, backgroundSkin, resolvedTheme, isDark]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const setAccentColor = useCallback((c: AccentColor) => setAccentColorState(c), []);
  const setFontSize = useCallback((s: FontSize) => setFontSizeState(s), []);
  const setBackgroundSkin = useCallback((s: BackgroundSkin) => setBackgroundSkinState(s), []);

  const savePreferences = useCallback(async () => {
    localStorage.setItem("litlabs-theme", JSON.stringify({ theme, accentColor, fontSize, backgroundSkin }));
    try {
      await fetch("/api/settings/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ theme, accentColor, fontSize, backgroundSkin }),
      });
    } catch { /* ignore */ }
  }, [theme, accentColor, fontSize, backgroundSkin]);

  return (
    <ThemeContext.Provider value={{
      theme, accentColor, fontSize, backgroundSkin,
      resolvedTheme, isDark,
      setTheme, setAccentColor, setFontSize, setBackgroundSkin, savePreferences,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
export { ACCENT_MAP };