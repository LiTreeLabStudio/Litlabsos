"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import AuthLayout from "@/components/AuthLayout";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password, rememberMe ? 30 : 7);
    } catch (err) {
      const msg = (err as Error)?.message || "Unknown";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setForgotMsg("");
    setForgotLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      setForgotMsg(data.message || "If this email exists, a reset link has been sent.");
    } catch (err) {
      const msg = (err as Error)?.message || "Unknown";
      setForgotMsg("Something went wrong. Try again.");
      console.error("forgot-password error:", msg);
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <AuthLayout>
      <h2 className="font-heading text-xl font-semibold mb-6 text-center">Welcome Back</h2>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-text-secondary text-sm mb-1">Email</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-text-secondary text-sm mb-1">Password</label>
          <div className="relative">
            <input
              className="input pr-12"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-neon-cyan transition-colors text-sm"
              tabIndex={-1}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-cyber-border bg-cyber-surface accent-neon-cyan"
            />
            <span className="text-text-secondary text-sm">Remember me</span>
          </label>
          <button
            type="button"
            onClick={() => { setForgotOpen(true); setForgotMsg(""); setForgotEmail(""); }}
            className="text-neon-cyan text-sm hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
          {loading && (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-cyber-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-cyber-surface px-3 text-text-muted">or</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Link href="/register" className="btn-secondary w-full text-center">
          Don&apos;t have an account? <span className="text-neon-cyan font-semibold">Register</span>
        </Link>
        <Link href="/gallery" className="text-text-muted text-sm text-center hover:text-neon-purple transition-colors">
          Try agents without signing in →
        </Link>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20 text-xs text-text-secondary">
        <strong className="text-neon-cyan">First time?</strong> Go to{" "}
        <code className="bg-cyber-surface-2 px-1 rounded">/register</code> to set up your admin
        account, then add the env vars to Vercel.
      </div>

      {/* Forgot Password Modal */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card w-full max-w-sm relative">
            <button
              onClick={() => setForgotOpen(false)}
              className="absolute top-3 right-3 text-text-muted hover:text-text-primary text-lg leading-none"
            >
              ✕
            </button>
            <h3 className="font-heading text-lg font-semibold mb-1">Reset Password</h3>
            <p className="text-text-secondary text-sm mb-4">
              Enter your email and we&apos;ll send you a reset link.
            </p>
            {forgotMsg ? (
              <div className="bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan rounded-lg p-3 text-sm">
                {forgotMsg}
              </div>
            ) : (
              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <label className="block text-text-secondary text-sm mb-1">Email</label>
                  <input
                    className="input"
                    type="email"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                  />
                </div>
                <button type="submit" className="btn-primary w-full" disabled={forgotLoading}>
                  {forgotLoading ? "Sending…" : "Send Reset Link"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
