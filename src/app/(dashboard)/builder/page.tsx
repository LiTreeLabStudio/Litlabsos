"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";

// Simple Identicon Generator based on name for that developer feel
function Identicon({ name, size = 64 }: { name: string; size?: number }) {
  const hash = name.split("").reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0);
  const color = `hsl(${Math.abs(hash) % 360}, 50%, 40%)`;
  return (
    <div 
      style={{ backgroundColor: color, width: size, height: size }} 
      className="rounded-sm flex items-center justify-center text-white font-black text-xl border border-white/10 shrink-0"
    >
      {name.charAt(0).toUpperCase() || "?"}
    </div>
  );
}

const PERSONALITIES = [
  { id: "friendly", label: "Friendly & Warm" },
  { id: "professional", label: "Professional" },
  { id: "witty", label: "Witty & Fun" },
  { id: "analytical", label: "Analytical" },
  { id: "creative", label: "Creative & Bold" },
  { id: "mentor", label: "Patient Mentor" },
];

const SKILLS = [
  { id: "coding", label: "Coding" },
  { id: "writing", label: "Writing" },
  { id: "social", label: "Social" },
  { id: "data", label: "Data" },
  { id: "support", label: "Support" },
  { id: "research", label: "Research" },
];

export default function BuilderPage() {
  const [name, setName] = useState("new-agent-instance");
  const [description, setDescription] = useState("");
  const [personality, setPersonality] = useState("professional");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["coding"]);
  const [publishing, setPublishing] = useState(false);

  function toggleSkill(id: string) {
    setSelectedSkills(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  }

  // Live Configuration Object
  const config = {
    metadata: {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      created_at: new Date().toISOString().split('T')[0],
      compiler: "LitLabs-v2.5"
    },
    traits: {
      personality,
      temperature: 0.7,
      stream: true
    },
    capabilities: selectedSkills,
    instructions: description || "Listening for specific directives..."
  };

  async function handlePublish() {
    setPublishing(true);
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, personality, skills: selectedSkills }),
      });
      if (!res.ok) throw new Error("Deployment failed");
      alert("Agent deployed successfully to the neural mesh.");
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="min-h-screen bg-ide-bg font-sans selection:bg-white/10">
      <Navbar />

      <main className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
        
        {/* LEFT PANEL: CONFIGURATION INSPECTOR */}
        <section className="w-full lg:w-[45%] border-r border-ide-border flex flex-col bg-ide-surface/20 overflow-y-auto custom-scrollbar">
          <header className="px-6 py-3 border-b border-ide-border bg-ide-surface/50 backdrop-blur-md flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-zinc-600" />
              <h1 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Agent Inspector</h1>
            </div>
            <button 
              onClick={handlePublish} 
              disabled={publishing || !name.trim()} 
              className="btn btn-primary h-7 px-4 text-[10px] font-bold uppercase tracking-wider"
            >
              {publishing ? "Deploying..." : "Push to Mesh"}
            </button>
          </header>

          <div className="p-8 space-y-10 max-w-xl mx-auto w-full">
            {/* Header / Avatar */}
            <div className="flex items-center gap-6 bg-ide-surface/40 p-4 rounded border border-ide-border">
              <Identicon name={name} size={64} />
              <div className="flex-1 min-w-0">
                <label className="block text-[9px] font-black uppercase text-zinc-500 mb-1 tracking-widest">Instance ID</label>
                <input 
                  className="w-full bg-transparent border-none p-0 font-code text-xl text-white outline-none focus:ring-0 placeholder:text-zinc-800" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="agent-name"
                />
              </div>
            </div>

            {/* Directives */}
            <div className="space-y-3">
              <label className="block text-[9px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
                <span className="text-orange-500">01</span> System Directives
              </label>
              <textarea 
                className="input min-h-[160px] font-code leading-relaxed text-sm bg-black/40 border-ide-border" 
                placeholder="Describe the agent's primary mission, logic, and operational boundaries..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Personality */}
              <div className="space-y-4">
                <label className="block text-[9px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
                  <span className="text-orange-500">02</span> Personality
                </label>
                <div className="grid grid-cols-1 gap-1">
                  {PERSONALITIES.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setPersonality(p.id)}
                      className={`group w-full text-left px-3 py-2 rounded text-[11px] font-medium transition-all border ${
                        personality === p.id 
                          ? 'bg-zinc-800 text-white border-zinc-600 shadow-lg' 
                          : 'text-zinc-500 hover:text-zinc-300 border-transparent hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{p.label}</span>
                        {personality === p.id && <div className="w-1 h-1 rounded-full bg-orange-500" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <label className="block text-[9px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
                  <span className="text-orange-500">03</span> Capabilities
                </label>
                <div className="grid grid-cols-1 gap-1">
                  {SKILLS.map(s => {
                    const active = selectedSkills.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        onClick={() => toggleSkill(s.id)}
                        className={`w-full text-left px-3 py-2 rounded text-[11px] font-medium transition-all border ${
                          active 
                            ? 'bg-zinc-800 text-white border-zinc-600 shadow-lg' 
                            : 'text-zinc-500 hover:text-zinc-300 border-transparent hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{s.label}</span>
                          <span className={`text-[9px] font-bold ${active ? 'text-orange-500' : 'text-zinc-800'}`}>
                            {active ? "ACTIVE" : "VOID"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT PANEL: SOURCE PREVIEW */}
        <section className="hidden lg:flex flex-1 bg-ide-bg flex-col relative overflow-hidden">
          <header className="px-6 py-3 border-b border-ide-border bg-ide-surface/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                <svg className="w-3 h-3 text-zinc-700" fill="currentColor" viewBox="0 0 24 24"><path d="M13 1.47l-8 5.333v10.4l8 5.333 8-5.333V6.804l-8-5.334zM6.667 16.4V7.601L13 3.379l6.333 4.222V16.4L13 20.621 6.667 16.4z"/></svg>
                agent-config.json
              </h2>
            </div>
            <div className="text-[9px] font-code text-zinc-800 tracking-tighter">PREVIEW_MODE_ACTIVE</div>
          </header>

          <div className="flex-1 overflow-auto p-10 font-code text-sm leading-relaxed custom-scrollbar">
            <pre className="text-zinc-400 whitespace-pre">
{JSON.stringify(config, null, 2)}
            </pre>
          </div>

          <footer className="px-6 py-3 bg-ide-surface/30 border-t border-ide-border flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
             <div className="text-[9px] font-code text-zinc-600 tracking-tight uppercase">
               System Ready. Awaiting neural synchronization.
             </div>
          </footer>
        </section>

      </main>
    </div>
  );
}
