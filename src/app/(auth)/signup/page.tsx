"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Signup failed");
      }

      router.push("/login?signedup=true");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark p-6 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-brand-orange/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-brand-magenta/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-extrabold tracking-tight text-white">
            Lit<span className="gradient-text">Labs</span>
          </Link>
          <p className="text-sm text-zinc-500 mt-2">Create your free account</p>
        </div>

        {/* Card */}
        <div className="glass-panel p-8">
          <h2 className="text-lg font-bold mb-6 text-center">Get Started</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 text-sm font-medium mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-zinc-400 mb-1.5">
                Name
              </label>
              <input
                id="name"
                className="input"
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-zinc-400 mb-1.5">
                Email
              </label>
              <input
                id="email"
                className="input"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-zinc-400 mb-1.5">
                Password
              </label>
              <input
                id="password"
                className="input"
                type="password"
                name="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Min 8 characters"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs text-zinc-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-orange hover:text-brand-orange-light font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">
          LitLabs v3.0 · AI-Powered Platform
        </p>
      </div>
    </div>
  );
}
