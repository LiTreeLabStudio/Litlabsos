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
    id: "litbit",
    title: "Litbit — Autonomous AI Agent Platform",
    desc: "Multi-server AI agent system with automatic failover. NemoClaw (brain, port 8081) + Little Bit Master (orchestrator, port 8080). Routes between PC Director, local inference, and Gemini direct. Self-monitoring with health checks and auto-restart. Built for reliability when the PC is offline.",
    tags: ["Python", "FastAPI", "Gemini API", "SSH Tunneling", "System Architecture", "Self-Healing"]
  },
  {
    id: "scanner",
    title: "Opportunity & Airdrop Scanner System",
    desc: "Three automated web scanners running on schedule via cron. Searches for freelance gigs, airdrops, testnet rewards, referral bonuses, and learn-to-earn programs. Gemini 2.5 Flash with Google Search grounding. Deduplication, structured output, Telegram delivery. Runs daily without supervision.",
    tags: ["Python", "Gemini Search", "Telegram Bot API", "Cron", "Web Scraping", "Automation"]
  },
  {
    id: "monitor",
    title: "Health Monitor — Self-Healing Infrastructure",
    desc: "Monitors all services every 5 minutes. Checks NemoClaw, LittleBitMaster, SSH tunnel, scanner cron jobs, disk space, and memory. Auto-restarts failed services via companion script. Telegram alerts with cooldown logic to prevent spam. Logs everything.",
    tags: ["Bash", "Cron", "Monitoring", "Alerting", "DevOps"]
  },
  {
    id: "watcher",
    title: "Code Watcher — Git Auto-Deploy Pipeline",
    desc: "Watches a git remote for changes. On new commits: pulls, runs build/deploy commands, sends Telegram notification. Hash-based change detection prevents duplicate deployments. Designed for zero-downtime updates to production services.",
    tags: ["Bash", "Git", "CI/CD", "Deployment", "Automation"]
  }
];

const STATS = [
  { value: "04", label: "Production Systems" },
  { value: "03", label: "Automated Scanners" },
  { value: "24/7", label: "Monitoring Uptime" },
  { value: "<2hr", label: "Recovery Time" },
];

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-ide-bg text-text-primary selection:bg-white/10 font-sans">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-ide-border bg-ide-bg/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-600 rounded-sm flex items-center justify-center">
              <span className="text-black font-black text-xs">L</span>
            </div>
            <span className="text-sm font-bold tracking-tight font-code text-white">Larry.B</span>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center gap-4 text-[11px] font-medium text-text-secondary uppercase tracking-wider">
               <a href="#work" className="hover:text-white transition-colors">/work</a>
               <a href="#skills" className="hover:text-white transition-colors">/capabilities</a>
               <a href="#contact" className="hover:text-white transition-colors">/contact</a>
             </div>
             <Link href="/login" className="btn btn-primary px-4 py-1.5 h-8 uppercase text-[10px] font-bold tracking-widest">
               Execute_Login
             </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 pt-32 pb-24 border-b border-ide-border">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-green-500/5 border border-green-500/20 rounded-sm mb-10">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-green-500 tracking-widest uppercase">System_Available_For_Freelance</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-8 max-w-5xl leading-[1.1]">
            Engineering autonomous systems that <span className="text-orange-500 font-code underline underline-offset-8 decoration-orange-500/30">execute</span> while you sleep.
          </h1>
          
          <p className="text-lg text-text-secondary max-w-2xl leading-relaxed mb-12 font-medium">
            Lead Architect at LitLabs. Specializing in autonomous agent orchestration, self-healing infrastructure, and high-density data pipelines.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="mailto:highlife4real1989@gmail.com" className="btn btn-primary px-8 py-3 text-sm font-bold uppercase tracking-widest">
              Contact_Me
            </a>
            <a href="#work" className="btn btn-secondary px-8 py-3 text-sm font-bold uppercase tracking-widest">
              View_Source
            </a>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="border-b border-ide-border bg-ide-surface/30">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {STATS.map(stat => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <div className="text-3xl font-bold text-white font-code tracking-tighter">{stat.value}</div>
                  <div className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="work" className="max-w-7xl mx-auto px-6 py-24 space-y-16">
          <div>
            <h2 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-4">Output / Projects</h2>
            <h3 className="text-3xl font-bold text-white tracking-tight">Technical Showcases</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-1">
            {PROJECTS.map((project) => (
              <div key={project.id} className="group flex flex-col md:flex-row gap-8 p-8 border border-ide-border hover:bg-ide-surface/50 transition-all duration-200">
                <div className="md:w-1/3 space-y-4">
                  <h4 className="text-xl font-bold text-white group-hover:text-orange-500 transition-colors">
                    {project.title}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-text-secondary text-[9px] font-bold uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="md:w-2/3">
                  <p className="text-text-secondary leading-relaxed font-code text-sm">
                    {project.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="bg-ide-surface/20 border-y border-ide-border py-24">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-4">Core_Competencies</h2>
            <h3 className="text-3xl font-bold text-white mb-12 tracking-tight">Technology Stack</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {SKILLS.map(skill => (
                <div key={skill} className="px-4 py-3 bg-ide-bg border border-ide-border text-[11px] font-bold text-text-secondary hover:border-orange-500/50 hover:text-white transition-all cursor-default font-code">
                  <span className="text-orange-500/50 mr-2">&gt;</span>{skill}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA / CONTACT */}
        <section id="contact" className="max-w-7xl mx-auto px-6 py-32 text-center">
          <h2 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-6">Final_Init</h2>
          <h3 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight max-w-4xl mx-auto">
            Ready to scale your <span className="font-code text-orange-500">neural infrastructure?</span>
          </h3>
          <p className="text-lg text-text-secondary mb-12 max-w-2xl mx-auto">
            Currently accepting high-intensity projects involving AI orchestration and workflow automation.
          </p>
          <div className="flex justify-center">
            <a href="mailto:highlife4real1989@gmail.com" className="btn btn-primary px-12 py-4 text-sm font-bold uppercase tracking-[0.2em]">
              Initialize_Channel
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-ide-border py-10 bg-ide-bg px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">&copy; 2026 Larry B. / HIVE MIND PLATFORM</p>
          <div className="flex gap-8 text-[9px] font-bold text-text-muted uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Terms_of_Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
