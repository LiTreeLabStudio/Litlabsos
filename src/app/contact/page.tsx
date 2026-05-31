import Link from "next/link";

export default function ContactPage() {
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
            <Link href="/about" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">About</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors">Log in</Link>
            <Link href="/signup" className="btn-primary text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-20 sm:py-28">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading mb-6">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            Have a question, feedback, or want to partner with us? Drop us a line.
          </p>
        </div>

        <div className="space-y-8">
          {/* Email */}
          <div className="glass-panel p-8 text-center">
            <div className="text-4xl mb-4">📧</div>
            <h2 className="text-xl font-bold mb-2">Email Us</h2>
            <p className="text-zinc-400 mb-4">Best for general inquiries, support, and partnerships.</p>
            <a href="mailto:hello@litlabs.net" className="btn-primary">
              hello@litlabs.net
            </a>
          </div>

          {/* Quick links */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card text-center">
              <div className="text-3xl mb-3">💡</div>
              <h3 className="font-bold mb-1">Feature Request?</h3>
              <p className="text-sm text-zinc-400 mb-3">We build based on your feedback.</p>
              <a href="mailto:hello@litlabs.net?subject=Feature%20Request" className="text-brand-orange text-sm font-semibold hover:text-brand-orange-light transition-colors">
                Suggest a feature →
              </a>
            </div>
            <div className="card text-center">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-bold mb-1">Partnership?</h3>
              <p className="text-sm text-zinc-400 mb-3">Let&apos;s explore working together.</p>
              <a href="mailto:hello@litlabs.net?subject=Partnership" className="text-brand-magenta text-sm font-semibold hover:text-brand-magenta-light transition-colors">
                Reach out →
              </a>
            </div>
          </div>

          {/* FAQ */}
          <div className="glass-panel p-8">
            <h2 className="text-xl font-bold mb-6 font-heading">Quick Answers</h2>
            <div className="space-y-5">
              {[
                { q: "Is LitLabs free to use?", a: "Yes! Our Explorer tier is free forever with 3 active agents and full core features." },
                { q: "Can I upload my own files?", a: "Absolutely. We support images (PNG, JPG, WebP, GIF, SVG), video (MP4, WebM, MOV), audio (MP3, WAV), and documents (PDF, CSV, JSON)." },
                { q: "How do I get support?", a: "Email us at hello@litlabs.net. Pro and Commander users get priority response." },
              ].map((faq) => (
                <div key={faq.q}>
                  <h3 className="font-semibold text-sm mb-1">{faq.q}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
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
