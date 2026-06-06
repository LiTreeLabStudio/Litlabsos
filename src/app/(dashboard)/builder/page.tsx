"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";

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
  { id: "coding", label: "Coding", icon: "💻", desc: "Write, debug, review code" },
  { id: "writing", label: "Writing", icon: "✍️", desc: "Draft, edit, improve text" },
  { id: "social", label: "Social", icon: "📱", desc: "Posts, engagement, growth" },
  { id: "data", label: "Data", icon: "📊", desc: "Charts, insights, predictions" },
  { id: "support", label: "Support", icon: "🎧", desc: "FAQ, tickets, help desk" },
  { id: "research", label: "Research", icon: "🔍", desc: "Find, summarize, analyze" },
];

export default function BuilderPage() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [personality, setPersonality] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);

  function toggleSkill(id: string) {
    setSelectedSkills(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
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
    } catch {
      // Fallback
    } finally {
      setPublishing(false);
    }
  }

  const selectedPersonality = PERSONALITIES.find(p => p.id === personality);
  const selectedSkillLabels = SKILLS.filter(s => selectedSkills.includes(s.id));

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Build an Agent</h1>
          <p className="text-[#71717a]">Create a custom AI agent with personality and skills.</p>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                i < step ? "bg-[#22c55e] text-white" : i === step ? "bg-[#f97316] text-black" : "bg-[#1a1a1a] text-[#555]"
              }`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i <= step ? "text-white" : "text-[#555]"}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? "bg-[#22c55e]" : "bg-[#1a1a1a]"}`} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="card p-8 min-h-[400px]">
          {step === 0 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Agent Identity</h2>
                <p className="text-sm text-[#71717a]">Give your agent a name and describe what it does.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Name *</label>
                <input className="input" placeholder="e.g. Marketing Assistant" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Description</label>
                <textarea className="input min-h-[120px] resize-none" placeholder="What will this agent do? What tasks will it handle?" value={description} onChange={e => setDescription(e.target.value)} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Personality</h2>
                <p className="text-sm text-[#71717a]">Choose how your agent communicates.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PERSONALITIES.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPersonality(p.id)}
                    className={`text-left p-4 rounded-xl border transition-all ${
                      personality === p.id
                        ? "border-[#f97316] bg-[#f97316]/5"
                        : "border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#333]"
                    }`}
                  >
                    <div className={`text-sm font-semibold mb-1 ${personality === p.id ? "text-[#f97316]" : "text-white"}`}>{p.label}</div>
                    <div className="text-xs text-[#71717a]">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Skills</h2>
                <p className="text-sm text-[#71717a]">Select the capabilities this agent should have.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SKILLS.map(s => {
                  const active = selectedSkills.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleSkill(s.id)}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        active
                          ? "border-[#f97316] bg-[#f97316]/5"
                          : "border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#333]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-semibold ${active ? "text-[#f97316]" : "text-white"}`}>{s.icon} {s.label}</span>
                        {active && <div className="w-2 h-2 rounded-full bg-[#f97316]" />}
                      </div>
                      <div className="text-xs text-[#71717a]">{s.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Review & Deploy</h2>
                <p className="text-sm text-[#71717a]">Check everything looks good before deploying.</p>
              </div>
              <div className="p-6 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]">
                <h3 className="text-xl font-bold text-white mb-1">{name || "Unnamed Agent"}</h3>
                <p className="text-sm text-[#71717a] mb-4">{description || "No description"}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[#555]">Personality:</span>
                    <span className="text-white ml-2">{selectedPersonality?.label || "Default"}</span>
                  </div>
                  <div>
                    <span className="text-[#555]">Skills:</span>
                    <span className="text-white ml-2">{selectedSkillLabels.length} selected</span>
                  </div>
                </div>
                {selectedSkillLabels.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#1a1a1a]">
                    {selectedSkillLabels.map(s => (
                      <span key={s.id} className="badge badge-orange">{s.icon} {s.label}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-[#1a1a1a]">
            <button onClick={prevStep} disabled={step === 0} className="btn btn-secondary disabled:opacity-0">
              Back
            </button>
            {step < STEPS.length - 1 ? (
              <button onClick={nextStep} disabled={step === 0 && !name.trim()} className="btn btn-primary disabled:opacity-30">
                Continue
              </button>
            ) : (
              <button onClick={handlePublish} disabled={publishing || !name.trim()} className="btn btn-primary disabled:opacity-30">
                {publishing ? "Deploying..." : "Deploy Agent"}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
