import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-dark text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/8 bg-brand-dark/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-extrabold tracking-tight text-white">
            Lit<span className="gradient-text">Labs</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link href="/#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Features</Link>
            <Link href="/gallery" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Explore</Link>
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
            About <span className="gradient-text">LitLabs</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            We&apos;re building the future of AI agent creation — making it accessible to everyone, from solo developers to enterprise teams.
          </p>
        </div>

        <div className="space-y-12">
          <section className="glass-panel p-8">
            <h2 className="text-2xl font-bold mb-4 font-heading">Our Mission</h2>
            <p className="text-zinc-400 leading-relaxed">
              LitLabs exists to democratize AI agent development. We believe that creating intelligent, task-specific AI agents should be as simple as having a conversation — not require a PhD in machine learning. Our platform handles the infrastructure, the complexity, and the heavy lifting so you can focus on what your agents actually do.
            </p>
          </section>

          <section className="glass-panel p-8">
            <h2 className="text-2xl font-bold mb-4 font-heading">What We Believe</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                { title: "Simplicity First", desc: "Powerful doesn't mean complex. We strip away the noise and give you clean, intuitive tools." },
                { title: "Open & Transparent", desc: "Our core platform is open source. We build in the open and welcome community contributions." },
                { title: "Privacy Respected", desc: "Your data is yours. We don't train on your content, and we give you full control over your agents." },
                { title: "Built for Scale", desc: "Whether you need one agent or a thousand, LitLabs scales with you seamlessly." },
              ].map((item) => (
                <div key={item.title}>
                  <h3 className="font-bold text-brand-orange mb-2">{item.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel p-8">
            <h2 className="text-2xl font-bold mb-4 font-heading">The Team</h2>
            <p className="text-zinc-400 leading-relaxed">
              LitLabs is built by a small, passionate team of engineers, designers, and AI researchers. We're based globally and united by the belief that AI should be a tool for everyone, not just the tech elite. Founded in 2025, we're just getting started.
            </p>
          </section>

          <section className="glass-panel p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 font-heading">Get in Touch</h2>
            <p className="text-zinc-400 mb-6">Have questions, feedback, or want to collaborate? We'd love to hear from you.</p>
            <a href="mailto:hello@litlabs.net" className="btn-primary">hello@litlabs.net</a>
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
