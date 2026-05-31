"use client";
import Link from "next/link";
import { useState } from "react";

const STATS = [
  { value: "Open Source", label: "Core Platform" },
  { value: "5min", label: "To First Agent" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "24/7", label: "Agent Runtime" },
];

const FEATURES = [
  { icon: "🤖", title: "AI Agent Builder", desc: "Create custom AI agents with a no-code interface. Define behavior, set skills, and deploy in minutes." },
  { icon: "💬", title: "Smart Chat", desc: "Chat with purpose-built agents for coding, writing, research, and analysis." },
  { icon: "🔗", title: "Integrations", desc: "Connect your agents to Discord, Telegram, Slack, and more." },
  { icon: "⚡", title: "Workflow Builder", desc: "Chain agents together into powerful automations. Multi-step task orchestration made simple." },
  { icon: "🏪", title: "Agent Marketplace", desc: "Browse and deploy pre-built agents from the community." },
  { icon: "👥", title: "Community", desc: "Connect with other builders. Share wins and discover new blueprints." },
];

const STEPS = [
  { step: "1", title: "Define", desc: "Name your agent, choose a personality, and set its core skills." },
  { step: "2", title: "Build", desc: "Configure tools, connect integrations, and define workflows." },
  { step: "3", title: "Deploy", desc: "Go live instantly. Your agent works 24/7." },
];

const FILES = [
  { type: "Images", ext: "PNG, JPG, WebP, GIF, SVG", emoji: "IMG" },
  { type: "Video", ext: "MP4, WebM, MOV", emoji: "VID" },
  { type: "Audio", ext: "MP3, WAV, OGG", emoji: "AUD" },
  { type: "Documents", ext: "PDF, CSV, JSON, MD", emoji: "DOC" },
];

const navItems = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "/gallery", label: "Explore" },
  { href: "/login", label: "Log in" },
];

const explorerFeatures = ["3 Active Agents", "Smart Chat", "Community Access", "1GB Storage", "Image and Document Upload"];
const architectFeatures = ["Unlimited Agents", "Multi-Agent Workflows", "Marketplace Access", "Priority Compute", "50GB Storage", "All Integrations", "All File Types", "API Access"];
const commanderFeatures = ["Everything in Pro", "Dedicated Infrastructure", "SLA and Support", "Custom Training", "Unlimited Storage", "SSO and Admin"];
const fileTypes = ["PNG", "JPG", "MP4", "PDF", "CSV", "JSON", "MP3", "SVG"];

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <nav className="sticky top-0 z-50 border-b border-white/8 bg-brand-dark/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-extrabold tracking-tight text-white">Lit<span className="gradient-text">Labs</span></Link>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Pricing</a>
            <Link href="/gallery" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Explore</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block text-sm font-semibold text-zinc-300 hover:text-white transition-colors">Log in</Link>
            <Link href="/signup" className="btn-primary text-sm">Get Started</Link>
            <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? "X" : "M"}</button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-white/8 bg-brand-dark p-4">
            <div className="flex flex-col gap-1">
              {navItems.map(item => (
                <a key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">{item.label}</a>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main id="main-content">
        <section className="relative overflow-hidden px-4 pt-24 pb-28 sm:pt-32 sm:pb-36">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[500px] w-[500px] rounded-full bg-brand-orange/8 blur-[180px]" />
          </div>
          <div className="pointer-events-none absolute top-1/4 right-1/4">
            <div className="h-[300px] w-[300px] rounded-full bg-brand-magenta/6 blur-[150px]" />
          </div>
          <div className="relative mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange/20 bg-brand-orange/8 px-4 py-1.5 text-xs font-bold text-brand-orange uppercase tracking-widest mb-8">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              Now in Public Beta
            </div>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl font-heading">
              Build AI Agents<br />
              <span className="gradient-text">That Actually Work</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-400 leading-relaxed sm:text-xl">
              Your all-in-one platform to create, deploy, and manage custom AI agents. Build automations, connect tools, and scale your workflow.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup" className="btn-primary text-base px-10 py-4 w-full sm:w-auto">Start Building - It&apos;s Free</Link>
              <Link href="/gallery" className="btn-secondary text-base px-10 py-4 w-full sm:w-auto">Explore Agents</Link>
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              <span className="text-xs text-zinc-600 font-medium">Supports:</span>
              {fileTypes.map(t => (
                <span key={t} className="file-type-badge bg-white/5 text-zinc-400 border border-white/8">{t}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/5 bg-white/[0.02]">
          <div className="mx-auto grid max-w-5xl grid-cols-2 sm:grid-cols-4 divide-x divide-white/5">
            {STATS.map(s => (
              <div key={s.label} className="py-8 px-4 text-center">
                <div className="text-2xl font-extrabold gradient-text sm:text-3xl">{s.value}</div>
                <div className="mt-1 text-xs font-medium text-zinc-500 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="px-4 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-extrabold sm:text-4xl font-heading">Everything You Need</h2>
              <p className="mx-auto max-w-lg text-zinc-400">Powerful tools to build, deploy, and manage your AI workforce.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(f => (
                <div key={f.title} className="card group">
                  <div className="mb-4 text-4xl group-hover:scale-110 transition-transform">{f.icon}</div>
                  <h3 className="mb-2 text-lg font-bold">{f.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 px-4 py-24 sm:py-32 bg-white/[0.01]">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-extrabold sm:text-4xl font-heading">All Your Files, <span className="gradient-text">Supported</span></h2>
              <p className="text-zinc-400">Upload and manage images, videos, audio, and documents.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FILES.map(f => (
                <div key={f.type} className="glass-panel p-5 text-center">
                  <div className="text-2xl mb-3">{f.emoji}</div>
                  <h3 className="font-bold text-sm mb-1">{f.type}</h3>
                  <p className="text-xs text-zinc-500">{f.ext}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="px-4 py-24 sm:py-32">
          <div className="mx-auto max-w-5xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-extrabold sm:text-4xl font-heading">How It Works</h2>
              <p className="text-zinc-400">Three steps to your first AI agent</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              {STEPS.map((item, idx) => (
                <div key={item.step} className="text-center relative">
                  {idx < 2 && (
                    <div className="hidden sm:block absolute top-6 left-[60%] w-[80%] h-px bg-gradient-to-r from-brand-orange/30 to-brand-magenta/30" />
                  )}
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold font-heading relative">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-orange to-brand-magenta opacity-15" />
                    <span className="gradient-text relative">{item.step}</span>
                  </div>
                  <h3 className="mb-2 text-lg font-bold">{item.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="border-t border-white/5 px-4 py-24 sm:py-32 bg-white/[0.01]">
          <div className="mx-auto max-w-5xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-extrabold sm:text-4xl font-heading">Simple Pricing</h2>
              <p className="text-zinc-400">Free to start. Scale when you&apos;re ready.</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3 items-start">
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-8">
                <h3 className="text-lg font-bold mb-1">Explorer</h3>
                <p className="text-sm text-zinc-400 mb-6">Perfect for trying things out.</p>
                <div className="mb-6"><span className="text-4xl font-extrabold">$0</span><span className="text-sm text-zinc-500">/forever</span></div>
                <ul className="space-y-3 mb-8">
                  {explorerFeatures.map(f => (<li key={f} className="flex items-center gap-3 text-sm text-zinc-300"><span className="text-green-400 font-bold">*</span> {f}</li>))}
                </ul>
                <Link href="/signup" className="btn-secondary w-full text-center">Get Started Free</Link>
              </div>
              <div className="rounded-2xl p-8 relative order-first lg:order-none glow-orange">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-brand-orange/10 to-brand-magenta/5 pointer-events-none" />
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-orange to-brand-magenta px-4 py-1 text-xs font-bold text-white">Most Popular</div>
                <h3 className="text-lg font-bold mb-1 mt-1 relative">Architect</h3>
                <p className="text-sm text-zinc-400 mb-6 relative">Full power for serious builders.</p>
                <div className="mb-6 relative"><span className="text-4xl font-extrabold">$19</span><span className="text-sm text-zinc-500">/month</span></div>
                <ul className="space-y-3 mb-8 relative">
                  {architectFeatures.map(f => (<li key={f} className="flex items-center gap-3 text-sm text-zinc-300"><span className="text-brand-orange font-bold">*</span> {f}</li>))}
                </ul>
                <Link href="/signup" className="btn-primary w-full text-center relative">Start Pro Trial</Link>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-8">
                <h3 className="text-lg font-bold mb-1">Commander</h3>
                <p className="text-sm text-zinc-400 mb-6">For teams and organizations.</p>
                <div className="mb-6"><span className="text-4xl font-extrabold">Custom</span></div>
                <ul className="space-y-3 mb-8">
                  {commanderFeatures.map(f => (<li key={f} className="flex items-center gap-3 text-sm text-zinc-300"><span className="text-brand-magenta font-bold">*</span> {f}</li>))}
                </ul>
                <a href="mailto:hello@litlabs.net" className="btn-secondary w-full text-center">Contact Sales</a>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 px-4 py-24 sm:py-32 bg-white/[0.02]">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-extrabold sm:text-4xl font-heading">Ready to Build?</h2>
            <p className="mb-8 text-zinc-400">Join builders creating the future of AI automation.</p>
            <Link href="/signup" className="btn-primary text-base px-10 py-4 inline-block">Get Started Free</Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 px-4 py-10 mt-auto" role="contentinfo">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <div className="text-lg font-extrabold tracking-tight">Lit<span className="gradient-text">Labs</span></div>
            <div className="mt-1 text-xs text-zinc-500">(c) 2026 LitLabs. All rights reserved.</div>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-zinc-500">
            <Link href="/gallery" className="hover:text-white transition-colors">Explore</Link>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
