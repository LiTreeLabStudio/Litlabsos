"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { useProfile } from "@/context/ProfileContext";
import { Zap, Play, Clock, Sparkles, Wand2, Film, Video, History, ChevronRight } from "lucide-react";
import { useMounted } from "@/hooks/useMounted";

const VIDEO_MODELS = [
  { id: "veo", name: "Veo", provider: "Google", desc: "High-quality cinematic", cost: 5, icon: "🎬" },
  { id: "wan", name: "Wan", provider: "Alibaba", desc: "Fast general purpose", cost: 3, icon: "🚀" },
  { id: "wan-pro", name: "Wan Pro", provider: "Alibaba", desc: "Enhanced quality", cost: 4, icon: "💎" },
  { id: "seedance", name: "Seedance Pro", provider: "ByteDance", desc: "Motion mastery", cost: 4, icon: "🕺" },
  { id: "ltx2", name: "LTX-2", provider: "Lightricks", desc: "Realistic scenes", cost: 3, icon: "🎥" },
];

const QUICK_STARTERS = [
  "A cyberpunk street market at night, neon signs flickering, people walking in rain, cinematic slow motion",
  "Space station orbiting a gas giant, ships docking, Earth visible in distance, epic sci-fi",
  "Ancient temple crumbling, dust and debris, dramatic sunlight beams, Indiana Jones style",
  "Underwater coral reef, tropical fish swimming, sunlight filtering through water, serene",
];

export default function VideoWorkspace() {
  const { resolvedColors } = useTheme();
  const { profile, updateProfile } = useProfile();
  const mounted = useMounted();
  
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState(VIDEO_MODELS[0]);
  const [duration, setDuration] = useState(6);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<unknown[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/generate/video/history");
        const data = await res.json();
        if (data.history) setHistory(data.history);
      } catch (err) {
        console.error("Failed to fetch history", err);
      }
    };
    if (mounted) fetchHistory();
  }, [mounted]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if ((profile as Record<string, unknown>).litbit_coins < selectedModel.cost) {
      alert("Insufficient LiTBit Coins!");
      return;
    }

    setIsGenerating(true);
    setVideoUrl(null);

    try {
      console.log("Initiating video generation...");
      const res = await fetch("/api/generate/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          model: selectedModel.id,
          duration,
        }),
      });

      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);

      if (data.success) {
        setVideoUrl(data.url);
        // Refresh profile to get updated balance
        const profRes = await fetch("/api/account");
        const profData = await profRes.json();
        if (profData.user) updateProfile(profData.user);
        
        setHistory([data.generation, ...history]);
      } else {
        alert(data.error || "Generation failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Video className="text-syntax-keyword" />
            Video Generator
          </h1>
          <p className="text-sm text-text-muted">Pollinations · Wan 2.1</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-ide-surface-2 border border-ide-border px-4 py-2 rounded-lg flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Balance</div>
              <div className="text-sm font-mono font-bold text-syntax-keyword">{Number((profile as Record<string, unknown>).litbit_coins) || 0} LiTBit</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-syntax-keyword/10 flex items-center justify-center text-syntax-keyword">
              🪙
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card p-6 space-y-6">
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2 block">Scene Description</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A dramatic sunset over a cyberpunk city..."
                className="textarea min-h-[120px] text-sm"
              />
              <div className="text-[10px] text-text-muted mt-1 text-right">{prompt.length} chars</div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3 block">Model</label>
              <div className="space-y-2">
                {VIDEO_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model)}
                    className={`w-full p-3 rounded-xl border text-left transition-all group ${
                      selectedModel.id === model.id
                        ? "bg-syntax-keyword/5 border-syntax-keyword"
                        : "bg-ide-bg border-ide-border hover:border-ide-border-light"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{model.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-white">{model.name}</div>
                          <div className="text-[10px] text-text-muted">{model.provider}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-text-muted group-hover:text-white transition-colors">{model.desc}</div>
                        <div className="text-xs font-mono font-bold text-syntax-keyword">{model.cost} 🪙</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Duration</label>
                <span className="text-xs font-mono text-white">{duration}s</span>
              </div>
              <input
                type="range"
                min="2"
                max="8"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full accent-syntax-keyword"
              />
              <div className="flex justify-between text-[9px] text-text-muted mt-1">
                <span>2s</span>
                <span>8s</span>
              </div>
            </div>

            <div className="pt-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3 block">Quick Starters</label>
              <div className="flex flex-wrap gap-2">
                {QUICK_STARTERS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(s)}
                    className="text-[10px] bg-ide-surface-2 hover:bg-ide-border border border-ide-border rounded-full px-3 py-1.5 transition-colors text-text-secondary hover:text-white"
                  >
                    {s.split(',')[0]}...
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="btn btn-primary w-full py-4 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 group"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Forging Video...
                </>
              ) : (
                <>
                  <Zap size={18} className="group-hover:animate-pulse" />
                  Generate ({selectedModel.cost} 🪙)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Preview & History */}
        <div className="lg:col-span-8 space-y-8">
          {/* Preview Area */}
          <div className="card overflow-hidden bg-black/40 min-h-[480px] flex flex-col relative group">
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
            
            <div className="p-4 border-b border-ide-border flex items-center justify-between bg-ide-surface/50 backdrop-blur-sm z-10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-syntax-keyword animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Preview Output</span>
              </div>
              {videoUrl && (
                <a
                  href={videoUrl}
                  download
                  className="text-[10px] font-bold text-syntax-keyword hover:underline flex items-center gap-1"
                >
                  Download HD <ChevronRight size={10} />
                </a>
              )}
            </div>

            <div className="flex-1 flex items-center justify-center p-8">
              {videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  loop
                  className="max-w-full max-h-[400px] rounded-xl shadow-2xl border border-white/5"
                />
              ) : isGenerating ? (
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-t-2 border-syntax-keyword animate-spin mx-auto" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Film className="text-syntax-keyword animate-pulse" size={32} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">Rendering Cinematic Scene</h3>
                    <p className="text-xs text-text-muted max-w-xs mx-auto">
                      Our GPU cluster is processing your prompt. This usually takes 30-60 seconds.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center opacity-40 group-hover:opacity-60 transition-opacity">
                  <div className="w-20 h-20 rounded-full border border-dashed border-text-muted flex items-center justify-center mx-auto mb-4">
                    <Film size={32} />
                  </div>
                  <p className="text-sm font-medium">Your video will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent History */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2 px-1">
              <History size={14} />
              Recent ({history.length})
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {history.length > 0 ? (
                history.map((item, i) => (
                  <div key={i} className="card p-2 group cursor-pointer overflow-hidden border-transparent hover:border-ide-border transition-all">
                    <div className="aspect-video bg-ide-surface-2 rounded-lg mb-2 relative overflow-hidden">
                      <video src={item.output_url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-sm">
                          <Play size={12} fill="white" />
                        </div>
                      </div>
                    </div>
                    <div className="px-1">
                      <div className="text-[9px] font-bold text-white truncate">{item.prompt}</div>
                      <div className="text-[8px] text-text-muted mt-0.5">{new Date(item.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center card bg-transparent border-dashed">
                  <p className="text-xs text-text-muted">No videos yet. Start generating!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branded Bar */}
      <div className="mt-16 pt-8 border-t border-ide-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-[10px] font-black text-syntax-keyword tracking-[0.2em] uppercase mb-1">Pollinations AI Studio</div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-text-muted font-bold uppercase tracking-wider">
              <span>Image</span>
              <span className="text-syntax-keyword">Video</span>
              <span>Audio</span>
              <span>Chat</span>
              <span>Agents</span>
              <span>Flow</span>
              <span>Gallery</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-[8px] text-text-muted uppercase font-bold mb-0.5">Model Engine</div>
              <div className="text-[9px] text-white font-mono">FLUX · GPT-4O · CLAUDE · GEMINI · DEEPSEEK · GROK · MISTRAL</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
