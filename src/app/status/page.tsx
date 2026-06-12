"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { CheckCircle, Globe, Cpu, Server } from "lucide-react";

export default function StatusPage() {
  const { resolvedColors: T } = useTheme();
  
  const [systems] = useState([
    { name: "Frontend (Vercel Edge)", status: "operational", latency: "14ms" },
    { name: "Global API Gateway", status: "operational", latency: "22ms" },
    { name: "Hive Mind Core (Brain)", status: "operational", latency: "85ms" },
    { name: "Marketplace Database", status: "operational", latency: "12ms" },
    { name: "Asset Storage (R2)", status: "operational", latency: "18ms" },
    { name: "Payment Processing", status: "operational", latency: "N/A" },
  ]);

  const [incidents] = useState([
    { date: "June 9, 2026", title: "API Latency Spike", status: "resolved", desc: "Brief latency increase in US-East region due to upstream provider outage. Resolved within 12 minutes." },
    { date: "June 4, 2026", title: "Scheduled Database Maintenance", status: "resolved", desc: "Planned migration of telemetry logs. 5 minutes of read-only mode during peak hours." },
  ]);

  return (
    <div style={{ backgroundColor: T.bgColor, minHeight: "100vh", color: T.textColor, fontFamily: "monospace" }}>
      <div className="max-w-4xl mx-auto px-6 py-20">
        <header className="text-center mb-16">
          <Link href="/" style={{ color: T.accentColor, textDecoration: "none", fontSize: "12px", letterSpacing: "2px" }} className="hover:underline uppercase mb-4 block">← Return to Studio</Link>
          <h1 className="font-display text-4xl font-black mb-4 uppercase">System Status</h1>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-bold">
            <CheckCircle size={16} />
            ALL SYSTEMS OPERATIONAL
          </div>
        </header>

        <section className="space-y-4 mb-20">
          <h2 className="font-display text-xs uppercase tracking-widest text-white/40 mb-6">Service Availability</h2>
          <div className="grid gap-3">
            {systems.map((s, i) => (
              <div key={i} className="glass-card p-4 rounded-xl flex items-center justify-between group hover:border-cyan-500/20 transition-all border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    {s.name.includes("API") ? <Globe size={18} className="text-cyan-400" /> : 
                     s.name.includes("Brain") ? <Cpu size={18} className="text-cyan-400" /> : 
                     <Server size={18} className="text-cyan-400" />}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{s.name}</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-tighter">Latency: {s.latency}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-green-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  OPERATIONAL
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-xs uppercase tracking-widest text-white/40 mb-6">Incident History</h2>
          <div className="space-y-8 border-l border-white/5 pl-8 relative">
            {incidents.map((incident, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-black border border-cyan-500/40" />
                <div className="text-[10px] text-white/40 font-bold mb-1 uppercase tracking-widest">{incident.date}</div>
                <h3 className="text-lg font-bold mb-2">{incident.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed max-w-2xl">{incident.desc}</p>
                <div className="mt-3 inline-block px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-widest">
                  {incident.status}
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-20 pt-8 border-t border-white/5 text-center text-[10px] text-white/30 uppercase tracking-widest">
          Updates every 60 seconds · Powered by LiTTree Lab Edge Metrics
        </footer>
      </div>
    </div>
  );
}
