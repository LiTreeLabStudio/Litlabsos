"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { Calendar, User, ArrowRight, Rss } from "lucide-react";

export default function BlogPage() {
  const { resolvedColors: T } = useTheme();

  const posts = [
    {
      id: "post_1",
      title: "The Rise of Distributed AI: Orchestrating Agents on the Edge",
      excerpt: "Why the future of AI isn't centralized monoliths, but distributed swarms running locally on user hardware.",
      author: "Larry B",
      date: "June 10, 2026",
      category: "Architecture"
    },
    {
      id: "post_2",
      title: "Gemini 2.5 Flash: Benchmarking Latency in Multi-Node Workflows",
      excerpt: "A deep dive into the performance metrics of our latest neural core integration.",
      author: "Jarvis",
      date: "June 08, 2026",
      category: "Performance"
    },
    {
      id: "post_3",
      title: "Monetizing Your AI: Marketplace Strategies for Creators",
      excerpt: "How to build, package, and list your first autonomous agent node for passive LBC income.",
      author: "Social Dominator",
      date: "June 05, 2026",
      category: "Growth"
    }
  ];

  return (
    <div style={{ backgroundColor: T.bgColor, minHeight: "100vh", color: T.textColor, fontFamily: "monospace" }}>
      <div className="max-w-4xl mx-auto px-6 py-20">
        <header className="flex justify-between items-end mb-16 border-b border-white/5 pb-8">
          <div>
            <h1 className="font-display text-5xl font-black mb-4 uppercase">Hive Changelog</h1>
            <p className="text-white/40 text-sm uppercase tracking-[0.2em]">Insights, Updates & Neural Dispatches</p>
          </div>
          <Link href="#" className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest hover:underline mb-2">
            Subscribe <Rss size={14} />
          </Link>
        </header>

        <div className="space-y-12">
          {posts.map(post => (
            <article key={post.id} className="group cursor-pointer">
              <div className="flex gap-4 items-center text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">
                <span className="flex items-center gap-1.5"><Calendar size={12} /> {post.date}</span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span className="flex items-center gap-1.5 text-cyan-400/60"><User size={12} /> {post.author}</span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span className="text-white/40">{post.category}</span>
              </div>
              <h2 className="text-2xl font-bold mb-4 group-hover:text-cyan-400 transition-colors leading-tight">{post.title}</h2>
              <p className="text-white/50 text-sm leading-relaxed mb-6">{post.excerpt}</p>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                Read Sequence <ArrowRight size={14} />
              </div>
            </article>
          ))}
        </div>

        <footer className="mt-20 pt-8 border-t border-white/5 flex justify-center">
           <button className="btn btn-ghost text-[10px] font-bold uppercase tracking-widest border border-white/5 hover:border-cyan-500/20 transition-all">
              Load Previous Dispatches
           </button>
        </footer>
      </div>
    </div>
  );
}
