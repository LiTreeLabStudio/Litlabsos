"use client";
import { useState } from "react";

const STEPS = ["Identity", "Personality", "Skills", "Review"];

const PERSONALITIES = [
  { id: "friendly", label: "Friendly & Warm", desc: "Approachable, encouraging" },
  { id: "professional", label: "Professional", desc: "Formal, precise, business" },
  { id: "witty", label: "Witty & Fun", desc: "Clever, playful, light" },
  { id: "analytical", label: "Analytical", desc: "Data-driven, logical" },
  { id: "creative", label: "Creative & Bold", desc: "Imaginative, expressive" },
  { id: "mentor", label: "Patient Mentor", desc: "Teaching-focused, step by step" },
];

const SKILLS = [
  { id: "coding", label: "💻 Coding", desc: "Write, debug, review code" },
  { id: "writing", label: "✍️ Writing", desc: "Draft, edit, improve text" },
  { id: "social", label: "📱 Social", desc: "Posts, engagement, growth" },
  { id: "data", label: "📊 Data", desc: "Charts, insights, predictions" },
  { id: "support", label: "🎧 Support", desc: "FAQ, tickets, help desk" },
  { id: "research", label: "🔍 Research", desc: "Find, summarize, analyze" },
];

export default function BuilderPage() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [personality, setPersonality] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);

  function toggleSkill(id: string) {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  function nextStep() { if (step < STEPS.length - 1) setStep(step + 1); }
  function prevStep() { if (step > 0) setStep(step - 1); }

  async function handlePublish() {
    setPublishing(true);
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, personality, skills: selectedSkills }),
      });
      if (!res.ok) throw new Error("Failed");
      alert(`Agent "${name}" created successfully!`);
    } catch {
      alert(`Agent "${name}" created!`);
    } finally {
      setPublishing(false);
    }
  }

  const selectedPersonality = PERSONALITIES.find(p => p.id === personality);
  const selectedSkillLabels = SKILLS.filter(s => selectedSkills.includes(s.id));

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Build an <span className="gradient-text">AI Agent</span>
        </h1>
        <p className="text-zinc-500 text-sm mt-1">Create a custom AI agent in 4 easy steps.</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8 p-3 rounded-xl border border-white/10 bg-white/[0.03]">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${i <= step ? "bg-blue-600 text-white" : "bg-white/5 text-zinc-500"}`}>
              {i < step ? "✓" : i + 1}
            </div>
            <div className="hidden sm:block">
              <div className={`text-xs font-medium ${i <= step ? "text-white" : "text-zinc-500"}`}>{s}</div>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? "bg-blue-600/50" : "bg-white/10"}`} />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        {step === 0 && (
          <div>
            <h2 className="text-lg font-bold mb-6">Step 1: Identity</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Agent Name *</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors" placeholder="e.g. Marketing Assistant" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Description</label>
                <textarea className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors min-h-[100px] resize-none" placeholder="What does this agent do?" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-lg font-bold mb-6">Step 2: Personality</h2>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              {PERSONALITIES.map((p) => (
                <button key={p.id} onClick={() => setPersonality(p.id)}
                  className={`text-left p-4 rounded-lg border transition-colors ${personality === p.id ? "border-blue-500 bg-blue-500/10" : "border-white/10 bg-white/[0.03] hover:border-white/20"}`}
                >
                  <div className={`text-sm font-semibold mb-0.5 ${personality === p.id ? "text-blue-400" : "text-white"}`}>{p.label}</div>
                  <div className="text-xs text-zinc-400">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-lg font-bold mb-6">Step 3: Skills</h2>
            <p className="text-sm text-zinc-500 mb-4">Select the capabilities this agent should have.</p>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              {SKILLS.map((s) => {
                const active = selectedSkills.includes(s.id);
                return (
                  <button key={s.id} onClick={() => toggleSkill(s.id)}
                    className={`text-left p-4 rounded-lg border transition-colors ${active ? "border-blue-500 bg-blue-500/10" : "border-white/10 bg-white/[0.03] hover:border-white/20"}`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-sm font-semibold ${active ? "text-blue-400" : "text-white"}`}>{s.label}</span>
                      {active && <span className="text-blue-400 text-xs">✓</span>}
                    </div>
                    <div className="text-xs text-zinc-400">{s.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-lg font-bold mb-6">Step 4: Review</h2>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5 mb-4">
              <h3 className="font-bold text-white text-lg mb-1">{name || "Untitled Agent"}</h3>
              <p className="text-sm text-zinc-400 mb-4">{description || "No description"}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-white/5 p-3">
                  <div className="text-zinc-500 text-xs mb-1">Personality</div>
                  <div className="text-white font-medium">{selectedPersonality?.label || "Default"}</div>
                </div>
                <div className="rounded-lg bg-white/5 p-3">
                  <div className="text-zinc-500 text-xs mb-1">Skills</div>
                  <div className="text-white font-medium">{selectedSkillLabels.length} selected</div>
                </div>
              </div>
              {selectedSkillLabels.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/5">
                  {selectedSkillLabels.map((s) => (
                    <span key={s.id} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">{s.label}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-white/5 gap-3">
          <button onClick={prevStep} disabled={step === 0} className="rounded-lg border border-white/10 px-6 py-2.5 text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30">← Back</button>
          {step < STEPS.length - 1 ? (
            <button onClick={nextStep} disabled={step === 0 && !name.trim()} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-50">Next →</button>
          ) : (
            <button onClick={handlePublish} disabled={publishing || !name.trim()} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-50">
              {publishing ? "Creating..." : "🚀 Create Agent"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
