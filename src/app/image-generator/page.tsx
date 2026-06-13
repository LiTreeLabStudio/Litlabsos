"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import { useProfile } from "@/context/ProfileContext";
import { Image as ImageIcon, Sparkles, Wand2, Download, Share2, RefreshCw, Coins, Zap, ChevronDown, ChevronUp, Clock, Trash2 } from "lucide-react";

// ── Types ──────────────────────────────────────────────
interface GenerationResult {
  success: boolean;
  fileUrl?: string;
  error?: string;
  model?: string;
}

interface HistoryItem {
  id: string;
  prompt: string;
  url: string;
  provider: string;
  timestamp: number;
}

// ── Provider Config ────────────────────────────────────
const PROVIDERS = [
  {
    id: "gemini",
    name: "Gemini (Imagen)",
    desc: "Google Imagen 3",
    cost: 1,
    icon: "🧠",
  },
  {
    id: "pollinations",
    name: "Pollinations (Free)",
    desc: "FLUX + SDXL",
    cost: 0,
    icon: "🌸",
  },
  {
    id: "fal",
    name: "FAL.ai (FLUX)",
    desc: "FLUX Pro",
    cost: 3,
    icon: "⚡",
  },
] as const;

const QUICK_STARTERS = [
  "A neon-lit cyberpunk city at midnight, rain-slicked streets reflecting holographic billboards, flying cars streaking through fog",
  "Ethereal floating islands with waterfalls cascading into the void, golden hour, Studio Ghibli inspired",
  "Ancient temple ruins reclaimed by bioluminescent jungle, fireflies, mist, mystical atmosphere",
  "Crystal cavern with underground lake, light refracting through quartz, peaceful and majestic",
  "A lone astronaut standing on Mars, Earth rising in the distance, ultra-realistic, cinematic lighting",
  "Massive space station orbiting a purple gas giant, fleets of ships, epic scale, sci-fi concept art",
  "Abandoned arcade with broken neon signs, dust motes in volumetric light, retro 80s aesthetic",
  "Underwater coral city with merfolk and bio-luminescent architecture, dreamlike and serene",
];

// ── Provider Generation Functions ──────────────────────
async function generateWithGemini(prompt: string): Promise<GenerationResult> {
  try {
    const res = await fetch("/api/image/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    if (data.success) {
      return { success: true, fileUrl: data.fileUrl, model: "gemini-imagen" };
    }
    return { success: false, error: data.error || "Gemini generation failed" };
  } catch (e) {
    return { success: false, error: "Network error with Gemini" };
  }
}

async function generateWithPollinations(prompt: string): Promise<GenerationResult> {
  try {
    const encoded = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 999999)}`;
    // Test if the URL is valid by doing a HEAD request
    const test = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(5000) });
    if (test.ok) {
      return { success: true, fileUrl: url, model: "pollinations" };
    }
    return { success: false, error: "Pollinations service unavailable" };
  } catch (e) {
    return { success: false, error: "Pollinations timeout — try again" };
  }
}

async function generateWithFAL(prompt: string): Promise<GenerationResult> {
  try {
    const res = await fetch("/api/image/fal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    if (data.success) {
      return { success: true, fileUrl: data.fileUrl, model: "fal-flux" };
    }
    return { success: false, error: data.error || "FAL.ai generation failed" };
  } catch (e) {
    return { success: false, error: "Network error with FAL.ai" };
  }
}

// ── Main Component ─────────────────────────────────────
export default function ImageGeneratorPage() {
  const { resolvedColors: T } = useTheme();
  const { profile } = useProfile();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>("gemini");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [isLoadingWallet, setIsLoadingWallet] = useState(true);

  // Load wallet on mount
  useEffect(() => {
    loadWallet();
    loadHistory();
  }, []);

  const loadWallet = async () => {
    try {
      const res = await fetch("/api/wallet");
      if (res.ok) {
        const data = await res.json();
        setWalletBalance(data.balance ?? 500);
      } else if (res.status === 401) {
        // Not signed in — use local balance
        const local = localStorage.getItem("litbitcoins");
        setWalletBalance(local ? parseInt(local) : 500);
      }
    } catch {
      setWalletBalance(500);
    } finally {
      setIsLoadingWallet(false);
    }
  };

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem("image_gen_history");
      if (stored) setHistory(JSON.parse(stored));
    } catch { /* ignore */ }
  };

  const saveHistory = (item: HistoryItem) => {
    const updated = [item, ...history].slice(0, 20);
    setHistory(updated);
    localStorage.setItem("image_gen_history", JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("image_gen_history");
  };

  const deductCoins = async (amount: number) => {
    if (walletBalance === null) return;
    const newBalance = walletBalance - amount;
    setWalletBalance(newBalance);
    localStorage.setItem("litbitcoins", newBalance.toString());
    // Try to sync with server
    try {
      await fetch("/api/wallet/spend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, type: "image_generation" }),
      });
    } catch { /* offline spend is fine */ }
  };

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isGenerating) return;

    const provider = PROVIDERS.find((p) => p.id === selectedProvider);
    if (!provider) return;

    // Check wallet
    if (walletBalance !== null && provider.cost > 0 && walletBalance < provider.cost) {
      setError(`Not enough LiTBit Coins. Need ${provider.cost}, have ${walletBalance}. Claim your daily bonus!`);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResultImage(null);

    let result: GenerationResult;

    switch (selectedProvider) {
      case "gemini":
        result = await generateWithGemini(prompt);
        break;
      case "pollinations":
        result = await generateWithPollinations(prompt);
        break;
      case "fal":
        result = await generateWithFAL(prompt);
        break;
      default:
        result = { success: false, error: "Unknown provider" };
    }

    if (result.success && result.fileUrl) {
      setResultImage(result.fileUrl);
      if (provider.cost > 0) {
        await deductCoins(provider.cost);
      }
      saveHistory({
        id: `img_${Date.now()}`,
        prompt: prompt.trim(),
        url: result.fileUrl,
        provider: selectedProvider,
        timestamp: Date.now(),
      });
    } else {
      setError(result.error || "Generation failed. Try again.");
    }

    setIsGenerating(false);
  }, [prompt, isGenerating, selectedProvider, walletBalance]);

  const handleQuickStart = (text: string) => {
    setPrompt(text);
  };

  const handleRetry = () => {
    handleGenerate();
  };

  return (
    <div style={{ backgroundColor: T.bgColor, minHeight: "100vh", color: T.textColor, fontFamily: "monospace" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-3">
            <Wand2 size={14} className="animate-pulse" />
            Neural Imaging Studio
          </div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="font-display text-3xl sm:text-4xl font-black uppercase">Image Generator</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border" style={{ borderColor: T.borderColor + "40", background: T.boxBg }}>
                <Coins size={14} style={{ color: T.accentColor }} />
                <span className="text-xs font-bold" style={{ color: T.accentColor }}>
                  {isLoadingWallet ? "..." : walletBalance ?? 500} LiTBit
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Provider Selection */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProvider(p.id)}
              className="p-3 rounded-xl border text-left transition-all hover:scale-[1.02]"
              style={{
                borderColor: selectedProvider === p.id ? T.linkColor : T.borderColor + "30",
                backgroundColor: selectedProvider === p.id ? T.linkColor + "15" : T.boxBg,
                boxShadow: selectedProvider === p.id ? `0 0 20px ${T.linkColor}20` : "none",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{p.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: selectedProvider === p.id ? T.linkColor : T.textColor }}>
                  {p.name}
                </span>
              </div>
              <div className="text-[9px] opacity-50">{p.desc}</div>
              <div className="text-[9px] font-bold mt-1" style={{ color: p.cost === 0 ? "#25e08a" : T.accentColor }}>
                {p.cost === 0 ? "FREE" : `${p.cost} 🪙`}
              </div>
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Panel */}
          <div className="lg:col-span-4 space-y-4">
            {/* Prompt Input */}
            <div className="rounded-2xl border p-4" style={{ borderColor: T.borderColor + "20", background: T.boxBg }}>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: T.textMuted }}>
                Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your vision..."
                className="w-full h-28 rounded-xl p-3 text-xs outline-none resize-none"
                style={{
                  background: "rgba(0,0,0,0.3)",
                  border: `1px solid ${T.borderColor}20`,
                  color: T.textColor,
                }}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[9px] opacity-40">{prompt.length} chars</span>
                {prompt.length >= 3 && (
                  <span className="text-[9px] text-green-400 font-bold">✓ Ready</span>
                )}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full py-3 rounded-xl font-bold text-sm uppercase flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
              style={{
                background: isGenerating ? T.borderColor : T.linkColor,
                color: "white",
              }}
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Generate ({PROVIDERS.find((p) => p.id === selectedProvider)?.cost === 0 ? "FREE" : `${PROVIDERS.find((p) => p.id === selectedProvider)?.cost} 🪙`})
                </>
              )}
            </button>

            {/* Error Display */}
            {error && (
              <div className="rounded-xl p-3 border" style={{ borderColor: "#ff444440", background: "#ff444410" }}>
                <div className="flex items-start gap-2">
                  <span className="text-red-400 text-xs">⚠️</span>
                  <div>
                    <p className="text-[10px] text-red-400 font-bold">{error}</p>
                    <button onClick={handleRetry} className="text-[9px] text-cyan-400 mt-1 flex items-center gap-1 hover:underline">
                      <RefreshCw size={10} /> Retry
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Starters */}
            <div className="rounded-2xl border p-4" style={{ borderColor: T.borderColor + "20", background: T.boxBg }}>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: T.textMuted }}>
                Quick Starters
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {QUICK_STARTERS.map((text, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickStart(text)}
                    className="w-full text-left p-2 rounded-lg text-[10px] leading-relaxed transition-all hover:scale-[1.01]"
                    style={{
                      background: prompt === text ? T.linkColor + "15" : "rgba(0,0,0,0.2)",
                      border: `1px solid ${prompt === text ? T.linkColor + "30" : T.borderColor + "10"}`,
                      color: prompt === text ? T.linkColor : T.textColor + "99",
                    }}
                  >
                    {text.slice(0, 80)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest w-full p-2 rounded-lg"
              style={{ color: T.textMuted }}
            >
              {showAdvanced ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              Advanced
            </button>

            {showAdvanced && (
              <div className="rounded-2xl border p-4 space-y-3" style={{ borderColor: T.borderColor + "20", background: T.boxBg }}>
                {["High Fidelity", "Cinema 4D Render", "Octane Lights", "8K Resolution"].map((param) => (
                  <div key={param} className="flex items-center justify-between text-[10px]">
                    <span style={{ color: T.textColor + "80" }}>{param}</span>
                    <span className="font-bold uppercase" style={{ color: T.accentColor }}>Active</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel — Preview */}
          <div className="lg:col-span-8">
            <div
              className="relative aspect-video rounded-2xl overflow-hidden border flex items-center justify-center"
              style={{ borderColor: T.borderColor + "20", background: "rgba(0,0,0,0.3)" }}
            >
              {resultImage ? (
                <>
                  <img src={resultImage} alt="Generated" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <a href={resultImage} download="generated-image.png" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all">
                      <Download size={18} />
                    </a>
                    <button onClick={() => navigator.clipboard.writeText(resultImage)} className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all">
                      <Share2 size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-3 px-8">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
                    <ImageIcon size={28} style={{ color: T.textColor + "30" }} />
                  </div>
                  <h3 className="text-sm font-bold" style={{ color: T.textColor + "40" }}>
                    {isGenerating ? "Neural Pathing in Progress..." : "Viewport Standby"}
                  </h3>
                  <p className="text-[10px] max-w-xs mx-auto" style={{ color: T.textColor + "20" }}>
                    {isGenerating
                      ? "Generating usually takes 10-30 seconds depending on provider."
                      : "Select a provider, enter a prompt, and click generate."}
                  </p>
                </div>
              )}

              {isGenerating && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-3 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse" style={{ color: T.accentColor }}>
                      Synthesizing...
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-2"
                  style={{ color: T.textMuted }}
                >
                  <Clock size={12} />
                  Recent ({history.length})
                  {showHistory ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                </button>

                {showHistory && (
                  <div className="space-y-2">
                    <button onClick={clearHistory} className="text-[9px] text-red-400 flex items-center gap-1 mb-2 hover:underline">
                      <Trash2 size={10} /> Clear All
                    </button>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                      {history.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setResultImage(item.url);
                            setPrompt(item.prompt);
                          }}
                          className="relative aspect-square rounded-lg overflow-hidden border hover:scale-105 transition-transform"
                          style={{ borderColor: T.borderColor + "20" }}
                        >
                          <img src={item.url} alt={item.prompt} className="w-full h-full object-cover" />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1">
                            <span className="text-[8px] font-bold">{item.provider}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t text-center" style={{ borderColor: T.borderColor + "10" }}>
          <p className="text-[9px] opacity-30 uppercase tracking-widest">
            LiTTree Lab Studios © 2026 · Multi-Modal Generation Workspace
          </p>
        </div>
      </div>
    </div>
  );
}
