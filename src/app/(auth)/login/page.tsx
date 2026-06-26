import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params.error || null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
            lit<span className="text-blue-500">labs</span>
          </h1>
          <p className="text-sm text-zinc-400">Build AI Agents</p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-white/10 bg-white/3 p-8">
          <h2 className="text-lg font-bold mb-6 text-center">Sign In</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 text-sm font-medium mb-4">
              {decodeURIComponent(error.replace(/\+/g, " "))}
            </div>
          )}

          <form method="POST" action="/api/auth/login" className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-zinc-400 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-zinc-400 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </form>

          {/* OAuth Providers */}
          <div className="mt-6 space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#0a0a0f] px-2 text-zinc-400">
                  Or continue with
                </span>
              </div>
            </div>

            <Link
              href="/sign-in"
              className="flex items-center justify-center gap-2 rounded-lg bg-white/5 border border-white/10 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.9 7.26-2.41l-3.57-2.77c-1.04.69-2.37 1.11-3.67 1.11-2.86 0-5.31-1.93-6.2-4.53H2.9v2.84C4.9 21.53 8.2 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.8 13.5c-.23-.69-.36-1.44-.36-2.2s.13-1.51.36-2.2V5.26H2.9A11 11 0 0 0 12 1c3.05 0 5.84 1.15 7.93 3.04l2.66-2.66C20.44 2.66 17.7 1 12 1 5.8 1 5.8 4.5 5.8 7.3v.9z"
                />
              </svg>
              Sign in with Google
            </Link>

            <Link
              href="/sign-in"
              className="flex items-center justify-center gap-2 rounded-lg bg-white/5 border border-white/10 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zm0 22.5c-5.79 0-10.5-4.71-10.5-10.5S6.21 2.5 12 2.5s10.5 4.71 10.5 10.5-4.71 10.5-10.5 10.5z" />
                <path d="M12 5.5c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5 6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5zm0 10.5c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
              </svg>
              Sign in with Apple
            </Link>
          </div>

          <p className="text-center text-xs text-zinc-400 mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-blue-400 underline hover:text-blue-300 transition-colors font-medium">
              Create one
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">
          LiTTree Lab Studios · AI-Powered Platform
        </p>
      </div>
    </div>
  );
}