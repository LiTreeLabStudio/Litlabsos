"use client";
import Link from "next/link";

export default function HomeHub() {
  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="max-w-5xl mx-auto px-4 py-20">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f97316]/10 border border-[#f97316]/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#f97316] animate-pulse" />
            <span className="text-xs font-medium text-[#f97316]">AI Agent Platform</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            LitLabs
          </h1>
          <p className="text-lg text-[#71717a] max-w-xl mx-auto mb-8">
            Build, deploy, and manage custom AI agents. One clean platform for your entire AI workflow.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/dashboard" className="btn btn-primary">
              Get Started
            </Link>
            <Link href="/builder" className="btn btn-secondary">
              Build an Agent
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          <Link href="/chat" className="card p-6 group">
            <div className="w-10 h-10 rounded-xl bg-[#f97316]/10 flex items-center justify-center text-xl mb-3">💬</div>
            <h3 className="text-base font-semibold text-white mb-1 group-hover:text-[#f97316] transition-colors">AI Chat</h3>
            <p className="text-sm text-[#71717a]">Talk to your AI assistant. Get help, run commands, automate tasks.</p>
          </Link>
          <Link href="/builder" className="card p-6 group">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-xl mb-3">🛠️</div>
            <h3 className="text-base font-semibold text-white mb-1 group-hover:text-[#f97316] transition-colors">Agent Builder</h3>
            <p className="text-sm text-[#71717a]">Create custom AI agents with personality, skills, and behaviors.</p>
          </Link>
          <Link href="/marketplace" className="card p-6 group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-xl mb-3">🔧</div>
            <h3 className="text-base font-semibold text-white mb-1 group-hover:text-[#f97316] transition-colors">Marketplace</h3>
            <p className="text-sm text-[#71717a]">Browse and deploy pre-built agents for any use case.</p>
          </Link>
        </div>

        {/* Stats */}
        <div className="card p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-white">5+</div>
            <div className="text-xs text-[#71717a] mt-1">Active Agents</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">99.9%</div>
            <div className="text-xs text-[#71717a] mt-1">Uptime</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">1.4K</div>
            <div className="text-xs text-[#71717a] mt-1">Interactions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">24/7</div>
            <div className="text-xs text-[#71717a] mt-1">Monitoring</div>
          </div>
        </div>
      </div>
    </div>
  );
}
