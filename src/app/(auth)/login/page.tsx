export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params.error || null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-ide-bg p-6 relative overflow-hidden font-sans">
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-sm bg-ide-surface-2 border border-ide-border flex items-center justify-center shadow-sm mb-4">
            <span className="text-white font-code font-bold text-xl">L</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1 font-code">
            Execute_Login
          </h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest font-code">Initialize secure connection</p>
        </div>

        {/* Card */}
        <div className="rounded-sm border border-ide-border bg-ide-surface/40 p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-sm p-3 text-xs font-bold font-code mb-6 uppercase tracking-wider">
              ERR: {decodeURIComponent(error.replace(/\+/g, " "))}
            </div>
          )}

          <form method="POST" action="/api/auth/login" className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 font-code">
                Identity_Link
              </label>
              <input
                id="email"
                className="input font-code text-xs"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="node@network.local"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 font-code">
                Encryption_Key
              </label>
              <input
                id="password"
                className="input font-code text-xs"
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full py-3 text-[10px] font-black uppercase tracking-widest mt-4">
              Authorize_Access
            </button>
          </form>
        </div>

        <p className="text-center text-[9px] text-zinc-600 mt-8 font-code uppercase tracking-widest">
          LitLabs v3.0 // Autonomous Engineering
        </p>
      </div>
    </div>
  );
}
