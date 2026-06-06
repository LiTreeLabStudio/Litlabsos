import Link from "next/link";

const SKILLS = [
  "Python", "Claude API", "GPT-4 / OpenAI", "Gemini API", "LLM Integration", 
  "AI Agent Architecture", "FastAPI", "Next.js", "TypeScript", "Node.js", 
  "PostgreSQL", "Docker", "API Design", "Workflow Automation", "Telegram Bot API", 
  "Web Scraping", "Data Pipelines", "Vercel", "CI/CD", "Linux", 
  "Cron / Scheduling", "Monitoring", "Git"
];

const PROJECTS = [
  {
    title: "Litbit — Autonomous AI Agent Platform",
    desc: "Multi-server AI agent system with automatic failover. NemoClaw (brain, port 8081) + Little Bit Master (orchestrator, port 8080). Routes between PC Director, local inference, and Gemini direct. Self-monitoring with health checks and auto-restart. Built for reliability when the PC is offline.",
    tags: ["Python", "FastAPI", "Gemini API", "SSH Tunneling", "System Architecture", "Self-Healing"]
  },
  {
    title: "Opportunity & Airdrop Scanner System",
    desc: "Three automated web scanners running on schedule via cron. Searches for freelance gigs, airdrops, testnet rewards, referral bonuses, and learn-to-earn programs. Gemini 2.5 Flash with Google Search grounding. Deduplication, structured output, Telegram delivery. Runs daily without supervision.",
    tags: ["Python", "Gemini Search", "Telegram Bot API", "Cron", "Web Scraping", "Automation"]
  },
  {
    title: "Health Monitor — Self-Healing Infrastructure",
    desc: "Monitors all services every 5 minutes. Checks NemoClaw, LittleBitMaster, SSH tunnel, scanner cron jobs, disk space, and memory. Auto-restarts failed services via companion script. Telegram alerts with cooldown logic to prevent spam. Logs everything.",
    tags: ["Bash", "Cron", "Monitoring", "Alerting", "DevOps"]
  },
  {
    title: "Code Watcher — Git Auto-Deploy Pipeline",
    desc: "Watches a git remote for changes. On new commits: pulls, runs build/deploy commands, sends Telegram notification. Hash-based change detection prevents duplicate deployments. Designed for zero-downtime updates to production services.",
    tags: ["Bash", "Git", "CI/CD", "Deployment", "Automation"]
  }
];

const STATS = [
  { value: "4", label: "Production Systems" },
  { value: "3", label: "Automated Scanners" },
  { value: "24/7", label: "Monitoring Uptime" },
  { value: "<2hrs", label: "Auto-Recovery Time" },
];

const PROCESS = [
  { step: "1", title: "Discovery", desc: "I learn your problem, your stack, and your goals. No assumptions — just questions." },
  { step: "2", title: "Architecture", desc: "I design the solution with error handling, scalability, and maintainability built in from day one." },
  { step: "3", title: "Build & Ship", desc: "Clean code, clear commits, daily updates. You always know where things stand." },
  { step: "4", title: "Handoff", desc: "Documented, tested, and maintainable. You own it. I'm available for support." },
];

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-orange-500/30 overflow-x-hidden hud-scanlines">
      {/* Global Background FX */}
      <div className="fixed inset-0 hud-grid opacity-10 pointer-events-none z-0" />
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 shadow-[0_0_15px_rgba(234,88,12,0.5)] z-50" />
      <div className="fixed top-[10%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-orange-600/5 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-black text-white tracking-widest uppercase italic glow-text-orange font-mono">
            Larry.B
          </div>
          <div className="flex items-center gap-6 text-[10px] font-black tracking-widest uppercase">
             <a href="#work" className="hidden md:block text-zinc-500 hover:text-orange-500 transition-colors">Work</a>
             <a href="#skills" className="hidden md:block text-zinc-500 hover:text-orange-500 transition-colors">Capabilities</a>
             <a href="#contact" className="hidden md:block text-zinc-500 hover:text-orange-500 transition-colors">Contact</a>
             <Link href="/login" className="px-4 py-2 border border-white/10 hover:border-orange-500/50 text-zinc-400 hover:text-orange-500 transition-all ml-4">
               System_Login
             </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="max-w-6xl mx-auto px-6 pt-32 pb-24 md:pt-48 md:pb-32">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse"></span>
            <span className="text-xs font-bold text-green-400 tracking-wide uppercase">Available for freelance work</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.1] mb-8 drop-shadow-2xl">
            I build AI-powered systems that run <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 glow-text-orange italic">autonomously</span> &mdash; and make money on autopilot.
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl leading-relaxed mb-12 font-medium">
            AI Developer specializing in autonomous agents, LLM integration, and self-healing infrastructure. Python. FastAPI. Next.js. Docker. Deployed and running 24/7.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="mailto:highlife4real1989@gmail.com" className="bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-widest px-8 py-4 text-center transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]">
              &rarr; Let&apos;s Talk
            </a>
            <a href="#work" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-widest px-8 py-4 text-center transition-all">
              See what I&apos;ve built
            </a>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="border-y border-white/5 bg-zinc-950/50 py-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <h2 className="text-xs font-black text-orange-500 uppercase tracking-[0.3em] mb-4">What I work with</h2>
            <h3 className="text-3xl md:text-4xl font-black text-white mb-12 tracking-tight">Skills & Technologies</h3>
            
            <div className="flex flex-wrap gap-3">
              {SKILLS.map(skill => (
                <div key={skill} className="px-5 py-3 bg-black border border-white/10 text-sm font-bold text-zinc-300 hover:border-orange-500/50 hover:text-orange-400 transition-colors shadow-lg cursor-default">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="py-20 border-b border-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {STATS.map(stat => (
                <div key={stat.label} className="flex flex-col gap-2">
                  <div className="text-4xl md:text-5xl font-black text-white tracking-tighter">{stat.value}</div>
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="work" className="py-24 relative">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-xs font-black text-orange-500 uppercase tracking-[0.3em] mb-4">What I&apos;ve built</h2>
            <h3 className="text-3xl md:text-4xl font-black text-white mb-16 tracking-tight">Featured Projects</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {PROJECTS.map((project, idx) => (
                <div key={idx} className="bg-zinc-950/80 border border-white/10 p-8 md:p-10 hover:border-orange-500/30 transition-colors group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  <h4 className="text-xl md:text-2xl font-black text-white mb-4 group-hover:text-orange-400 transition-colors leading-tight">
                    {project.title}
                  </h4>
                  <p className="text-zinc-400 leading-relaxed mb-8 text-sm md:text-base">
                    {project.desc}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold px-3 py-1 bg-white/5 text-zinc-300 border border-white/5 uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESS SECTION */}
        <section className="py-24 bg-zinc-950/50 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-xs font-black text-orange-500 uppercase tracking-[0.3em] mb-4">How I work</h2>
            <h3 className="text-3xl md:text-4xl font-black text-white mb-16 tracking-tight">My Process</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {PROCESS.map(p => (
                <div key={p.step} className="relative">
                  <div className="text-6xl font-black text-white/5 absolute -top-8 -left-4 pointer-events-none select-none italic">{p.step}</div>
                  <h4 className="text-lg font-bold text-white mb-3 relative z-10">{p.title}</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed relative z-10">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA / CONTACT */}
        <section id="contact" className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,#f9731610,transparent_50%)] pointer-events-none" />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-xs font-black text-orange-500 uppercase tracking-[0.3em] mb-4">Get in touch</h2>
            <h3 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter italic glow-text-orange">
              Let&apos;s build something
            </h3>
            <p className="text-lg text-zinc-400 mb-12 max-w-2xl mx-auto">
              Available for freelance projects, consulting, and long-term contracts. AI integration, automation, web apps &mdash; let&apos;s talk.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <a href="mailto:highlife4real1989@gmail.com" className="bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-widest px-10 py-5 w-full sm:w-auto text-center transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                Email Me
              </a>
            </div>
            <div className="mt-12 text-zinc-500 font-mono text-xs">
              highlife4real1989@gmail.com
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-8 text-center bg-black">
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">&copy; 2026 Larry B.</p>
        <p className="text-[9px] text-zinc-700 uppercase tracking-widest">Built with Python, FastAPI, and too much coffee.</p>
      </footer>
    </div>
  );
}