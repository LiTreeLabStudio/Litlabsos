"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import { Globe, User, Mail, ExternalLink, Music } from "lucide-react";

export default function TeamPage() {
  const { resolvedColors: T } = useTheme();

  const team = [
    {
      name: "Larry B",
      role: "Lead Architect & CEO",
      bio: "Visionary behind the Hive Mind. Specialized in autonomic AI loops and high-performance system orchestration.",
      avatar: "https://github.com/Litree-Ceo.png",
      links: { github: "https://github.com/Litree-Ceo", twitter: "#", linkedin: "#", spotify: "https://open.spotify.com/user/31qrpfn62mbpjdz32mbnbpwiwad4?si=jp4WImbgQZGKjlMpigyfCw" }
    },
    {
      name: "Jarvis",
      role: "Master Agent (AI)",
      bio: "The primary orchestrator of the LitLabs ecosystem. Manages multi-node synchronization and task dispatching.",
      avatar: "/agents/director.png",
      links: { github: "#" }
    },
    {
      name: "NemoClaw",
      role: "Neural Brain (AI)",
      bio: "High-latency decision engine and primary interface for long-form reasoning and strategic planning.",
      avatar: "/agents/champion.png",
      links: { github: "#" }
    }
  ];

  return (
    <div style={{ backgroundColor: T.bgColor, minHeight: "100vh", color: T.textColor, fontFamily: "monospace" }}>
      <div className="max-w-6xl mx-auto px-6 py-20">
        <header className="text-center mb-20">
          <p className="section-eyebrow" style={{ justifyContent: "center", marginBottom: "16px" }}>The Minds Behind the Hive</p>
          <h1 className="font-display text-5xl font-black mb-6 uppercase tracking-tight">Team & Identity</h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed">
            We are a hybrid team of human architects and autonomous AI agents building the next generation of decentralized intelligence.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {team.map((m, i) => (
            <div key={i} className="glass-card p-8 rounded-3xl border border-white/5 group hover:border-cyan-500/30 transition-all flex flex-col items-center text-center">
              <div className="relative w-32 h-32 mb-6">
                <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10 group-hover:border-cyan-400 transition-colors">
                   <Image src={m.avatar} alt={m.name} fill className="object-cover" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1">{m.name}</h3>
              <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4">{m.role}</p>
              <p className="text-sm text-white/50 leading-relaxed mb-6 flex-1">{m.bio}</p>
              <div className="flex gap-4">
                {m.links.github && (
                  <a href={m.links.github} target="_blank" rel="noopener noreferrer">
                    <Globe size={18} className="text-white/30 hover:text-white transition-colors" />
                  </a>
                )}
                {m.links.twitter && (
                  <a href={m.links.twitter !== "#" ? m.links.twitter : undefined}>
                    <Mail size={18} className="text-white/30 hover:text-white transition-colors" />
                  </a>
                )}
                {m.links.spotify && (
                  <a href={m.links.spotify} target="_blank" rel="noopener noreferrer" title="Architect Spotify">
                    <Music size={18} className="text-white/30 hover:text-white transition-colors" />
                  </a>
                )}
                {m.links.linkedin && (
                   <User size={18} className="text-white/30 hover:text-white cursor-pointer" />
                )}
              </div>
            </div>
          ))}
        </div>

        <section className="py-20 border-t border-white/5">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold uppercase tracking-widest mb-4">Open Positions</h2>
            <p className="text-white/40 text-xs uppercase tracking-[0.3em]">Help us engineer the edge</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { role: "Senior Autonomic Engineer", type: "Full-Time", location: "Remote / Edge", tech: "Rust, Go, WebAssembly" },
              { role: "Agent Prompt Architect", type: "Contract", location: "Remote", tech: "LLM Tuning, Python, JSON-LD" },
              { role: "Full-Stack Hive Designer", type: "Full-Time", location: "Remote", tech: "Next.js, Tailwind, WebGL" },
              { role: "Neural Link Researcher", type: "Full-Time", location: "On-Site (Hive Core)", tech: "PyTorch, CUDA, Distributed Systems" },
            ].map((job, i) => (
              <div key={i} className="glass-card p-6 rounded-2xl border border-white/5 hover:border-cyan-500/20 transition-all flex flex-col group">
                 <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-white/90">{job.role}</h3>
                    <span className="text-[9px] font-bold px-2 py-1 rounded bg-white/5 text-white/40 uppercase">{job.type}</span>
                 </div>
                 <div className="text-[10px] text-cyan-400 font-mono mb-4 uppercase tracking-widest">{job.location}</div>
                 <p className="text-[11px] text-white/40 mb-6 flex-1">Stack: {job.tech}</p>
                 <button className="btn btn-ghost w-full text-[10px] font-bold uppercase border border-white/5 group-hover:border-cyan-500/40 group-hover:text-cyan-400">
                    Neural Apply →
                 </button>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 border-t border-white/5 text-center">
          <h2 className="font-display text-3xl font-bold mb-6">Join the Swarm</h2>
          <p className="text-white/60 max-w-xl mx-auto mb-10 text-sm leading-relaxed uppercase tracking-wide">
            We are always looking for high-latency thinkers and high-throughput developers to help expand the Hive.
          </p>
          <Link href="mailto:highlife4real1989@gmail.com" className="btn btn-primary px-10 py-4 font-bold inline-flex items-center gap-2">
            View Open Roles <ExternalLink size={16} />
          </Link>
        </section>
      </div>
    </div>
  );
}
