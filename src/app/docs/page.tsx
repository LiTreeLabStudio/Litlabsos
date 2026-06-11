"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { Book, Code, Terminal, Zap, Shield, Share2, Layers } from "lucide-react";

export default function DocsPage() {
  const { resolvedColors: T } = useTheme();
  
  const sections = [
    {
      title: "Getting Started",
      icon: <Zap size={18} />,
      items: ["Introduction", "Quick Start", "Architecture Overview"]
    },
    {
      title: "Core Concepts",
      icon: <Layers size={18} />,
      items: ["Agents & Nodes", "Hive Mind Orchestration", "Local vs. Cloud Edge"]
    },
    {
      title: "API Reference",
      icon: <Terminal size={18} />,
      items: ["Authentication", "Agent API", "Telemetry Streams", "Webhooks"]
    },
    {
      title: "Guides",
      icon: <Code size={18} />,
      items: ["Building Your First Agent", "Custom System Prompts", "Deploying to Production"]
    },
    {
      title: "Security",
      icon: <Shield size={18} />,
      items: ["Data Privacy", "SOC 2 Compliance", "Encryption Standards"]
    }
  ];

  return (
    <div style={{ backgroundColor: T.bgColor, minHeight: "100vh", color: T.textColor, fontFamily: "monospace" }}>
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        <aside className="w-full md:w-64 border-r border-white/5 p-6 bg-black/20">
          <Link href="/" className="font-display font-black text-lg tracking-tighter mb-10 block uppercase">
            ⚡ LitLabs Docs
          </Link>
          
          <div className="space-y-8">
            {sections.map((section, i) => (
              <div key={i}>
                <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">
                  {section.icon}
                  {section.title}
                </div>
                <ul className="space-y-2">
                  {section.items.map((item, j) => (
                    <li key={j}>
                      <button className="text-xs text-white/60 hover:text-cyan-400 transition-colors text-left">
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 md:p-16 max-w-4xl">
          <div className="mb-12">
            <h1 className="font-display text-4xl font-black mb-4 uppercase">Developer Introduction</h1>
            <p className="text-white/60 text-lg leading-relaxed">
              Welcome to the Hive Mind documentation. LitLabs is an autonomous agent orchestration platform designed for high-performance, low-latency AI deployment on the edge.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-cyan-500/20 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Code className="text-cyan-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">SDK & Integration</h3>
              <p className="text-sm text-white/50 mb-4">Connect your existing applications to the Hive Mind via our lightweight TypeScript SDK.</p>
              <code className="block p-3 rounded bg-black/40 text-[10px] text-cyan-400 border border-white/5">
                npm install @litlabs/sdk
              </code>
            </div>
            <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-cyan-500/20 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Terminal className="text-cyan-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">CLI Tools</h3>
              <p className="text-sm text-white/50 mb-4">Manage deployments and monitor telemetry directly from your terminal.</p>
              <code className="block p-3 rounded bg-black/40 text-[10px] text-cyan-400 border border-white/5">
                npx litlabs-cli login
              </code>
            </div>
          </div>

          <article className="prose prose-invert prose-cyan max-w-none">
            <h2 className="text-2xl font-bold mb-4">Why LitLabs?</h2>
            <p className="text-white/70 leading-relaxed mb-6">
              Most AI platforms are built as centralized monoliths. LitLabs is different. We leverage a <strong>distributed agent architecture</strong> that runs on the edge, ensuring your data never leaves your network while still benefiting from global Hive intelligence.
            </p>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <CheckCircle className="text-cyan-400 shrink-0" size={18} />
                <span className="text-sm text-white/70"><strong>Sub-15ms Latency:</strong> Optimized for real-time human-agent interaction.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="text-cyan-400 shrink-0" size={18} />
                <span className="text-sm text-white/70"><strong>Autonomous Orchestration:</strong> Agents can call other agents, forming complex swarms.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="text-cyan-400 shrink-0" size={18} />
                <span className="text-sm text-white/70"><strong>Volcanic Cyber UI:</strong> Built-in dashboard with real-time telemetry and task tracking.</span>
              </li>
            </ul>
          </article>
        </main>
      </div>
    </div>
  );
}

function CheckCircle({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}
