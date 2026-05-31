import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-brand-dark text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/8 bg-brand-dark/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-extrabold tracking-tight text-white">
            Lit<span className="gradient-text">Labs</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link href="/gallery" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Explore</Link>
            <Link href="/about" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Contact</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors">Log in</Link>
            <Link href="/signup" className="btn-primary text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-20 sm:py-28">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading mb-6">
            <span className="gradient-text">Documentation</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Everything you need to know to build, deploy, and manage AI agents on LitLabs.
          </p>
        </div>

        <div className="space-y-8">
          {/* Getting Started */}
          <section className="glass-panel p-8">
            <h2 className="text-2xl font-bold mb-6 font-heading">
              <span className="text-brand-orange">01.</span> Getting Started
            </h2>
            <div className="space-y-4 text-zinc-400 leading-relaxed">
              <p><strong className="text-white">Create an account</strong> — Sign up free at <Link href="/signup" className="text-brand-orange hover:text-brand-orange-light">litlabs.net/signup</Link>. No credit card required.</p>
              <p><strong className="text-white">Build your first agent</strong> — From your dashboard, click &quot;New Agent&quot;. Give it a name, choose a personality, and set its skills.</p>
              <p><strong className="text-white">Deploy</strong> — Hit deploy and your agent is live. Chat with it directly or connect it to Discord, Telegram, or Slack.</p>
            </div>
          </section>

          {/* Agent Builder */}
          <section className="glass-panel p-8">
            <h2 className="text-2xl font-bold mb-6 font-heading">
              <span className="text-brand-orange">02.</span> Agent Builder
            </h2>
            <div className="space-y-4 text-zinc-400 leading-relaxed">
              <p>The Agent Builder is a no-code interface where you define:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong className="text-white">Personality</strong> — How your agent communicates (professional, casual, creative, analytical).</li>
                <li><strong className="text-white">Skills</strong> — What your agent can do (coding, writing, research, data analysis).</li>
                <li><strong className="text-white">Knowledge</strong> — Upload documents, images, or connect data sources to give your agent context.</li>
                <li><strong className="text-white">Tools</strong> — Connect external services like APIs, webhooks, and integrations.</li>
              </ul>
            </div>
          </section>

          {/* File Support */}
          <section className="glass-panel p-8">
            <h2 className="text-2xl font-bold mb-6 font-heading">
              <span className="text-brand-orange">03.</span> Supported File Types
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { cat: "Images", formats: "PNG, JPG, JPEG, WebP, GIF, SVG, AVIF, ICO" },
                { cat: "Video", formats: "MP4, WebM, MOV, M4V" },
                { cat: "Audio", formats: "MP3, WAV, OGG, AAC, FLAC" },
                { cat: "Documents", formats: "PDF, CSV, JSON, MD, TXT, XML" },
              ].map((f) => (
                <div key={f.cat} className="card">
                  <h3 className="font-bold text-sm mb-1">{f.cat}</h3>
                  <p className="text-xs text-zinc-500">{f.formats}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-zinc-500 mt-4">Free tier: 1GB total storage. Pro: 50GB. Commander: Unlimited.</p>
          </section>

          {/* API */}
          <section className="glass-panel p-8">
            <h2 className="text-2xl font-bold mb-6 font-heading">
              <span className="text-brand-orange">04.</span> API Access
            </h2>
            <div className="space-y-4 text-zinc-400 leading-relaxed">
              <p>Pro and Commander users get full API access to manage agents programmatically.</p>
              <div className="bg-black/40 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <div className="text-zinc-500"># Create an agent via API</div>
                <div className="text-brand-orange">POST https://litlabs.net/api/v1/agents</div>
                <div className="text-zinc-300">Authorization: Bearer {'<your-api-key>'}</div>
              </div>
              <p className="text-sm">Full API documentation coming soon. For early access, email <a href="mailto:hello@litlabs.net" className="text-brand-orange">hello@litlabs.net</a>.</p>
            </div>
          </section>

          {/* Pricing */}
          <section className="glass-panel p-8">
            <h2 className="text-2xl font-bold mb-6 font-heading">
              <span className="text-brand-orange">05.</span> Pricing
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { name: "Explorer", price: "$0/forever", features: ["3 agents", "1GB storage", "Community support"] },
                { name: "Architect", price: "$19/month", features: ["Unlimited agents", "50GB storage", "API access", "Priority support"] },
                { name: "Commander", price: "Custom", features: ["Everything in Pro", "Unlimited storage", "SLA", "SSO & Admin"] },
              ].map((tier) => (
                <div key={tier.name} className="card">
                  <h3 className="font-bold">{tier.name}</h3>
                  <div className="text-xl font-extrabold gradient-text my-2">{tier.price}</div>
                  <ul className="space-y-1">
                    {tier.features.map((f) => (
                      <li key={f} className="text-xs text-zinc-400">✓ {f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 py-10 mt-auto" role="contentinfo">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <div className="text-lg font-extrabold tracking-tight">
              Lit<span className="gradient-text">Labs</span>
            </div>
            <div className="mt-1 text-xs text-zinc-500">© 2026 LitLabs. All rights reserved.</div>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-zinc-500">
            <Link href="/gallery" className="hover:text-white transition-colors">Explore</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
