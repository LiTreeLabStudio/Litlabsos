"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import { Image as ImageIcon, Sparkles, Wand2, Download, Share2 } from "lucide-react";

export default function ImageGeneratorPage() {
  const { resolvedColors: T } = useTheme();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    
    try {
       const res = await fetch("/api/image/generate", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ prompt: prompt.trim() }),
       });
       const data = await res.json();
       if (data.success) {
          setResultImage(data.fileUrl || data.thumbUrl);
       }
    } catch {
       // fallback
    } finally {
       setIsGenerating(false);
    }
  };

  return (
    <div style={{ backgroundColor: T.bgColor, minHeight: "100vh", color: T.textColor, fontFamily: "monospace" }}>
      <div className="max-w-6xl mx-auto px-6 py-20">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
             <Wand2 size={14} className="animate-pulse" />
             Neural Imaging Node
          </div>
          <h1 className="font-display text-5xl font-black mb-4 uppercase">AI Image Generator</h1>
          <p className="text-white/50 text-sm leading-relaxed max-w-2xl">
            Direct interface to Pixel Forge. Generate high-fidelity 360° worlds and cinematic conceptual art using natural language.
          </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
           <div className="lg:col-span-4 space-y-6">
              <div className="glass-card p-6 rounded-2xl border border-white/10">
                 <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">Neural Prompt</label>
                 <textarea 
                   value={prompt}
                   onChange={e => setPrompt(e.target.value)}
                   placeholder="Describe your vision (e.g. 'A futuristic floating city above a purple ocean')..."
                   className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-xs outline-none focus:border-cyan-500/40 transition-all resize-none mb-4"
                 />
                 <button 
                   onClick={handleGenerate}
                   disabled={!prompt.trim() || isGenerating}
                   className="btn btn-primary w-full py-4 font-bold uppercase flex items-center justify-center gap-2"
                   style={{ background: T.linkColor, color: "white" }}
                 >
                   {isGenerating ? "Synthesizing..." : "Initialize Generation"}
                   {!isGenerating && <Sparkles size={16} />}
                 </button>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
                 <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Parameters</div>
                 <div className="space-y-3">
                    {["High Fidelity", "Cinema 4D Render", "Octane Lights", "8K Resolution"].map(p => (
                       <div key={p} className="flex items-center justify-between text-[10px]">
                          <span className="text-white/60">{p}</span>
                          <span className="text-cyan-400 font-bold uppercase">Active</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="lg:col-span-8">
              <div className="relative aspect-video rounded-3xl overflow-hidden glass-card border border-white/10 flex items-center justify-center bg-black/40 group">
                 {resultImage ? (
                    <>
                       <Image src={resultImage} alt="Generated result" className="w-full h-full object-cover" width={800} height={450} unoptimized />
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <button className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all">
                             <Download size={20} />
                          </button>
                          <button className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all">
                             <Share2 size={20} />
                          </button>
                       </div>
                    </>
                 ) : (
                    <div className="text-center space-y-4 px-12">
                       <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
                          <ImageIcon size={32} className="text-white/20" />
                       </div>
                       <h3 className="text-lg font-bold text-white/40">Viewport Standby</h3>
                       <p className="text-xs text-white/20 max-w-xs mx-auto italic">
                          {isGenerating ? "Awaiting neural feedback sequence... generation usually takes 30-60 seconds." : "Enter a prompt and click generate to visualize your concept."}
                       </p>
                    </div>
                 )}
                 
                 {isGenerating && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                       <div className="flex flex-col items-center gap-4">
                          <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                          <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.3em] animate-pulse">Neural Pathing in Progress</div>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
