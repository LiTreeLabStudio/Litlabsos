import { loginAction } from "./actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-bg p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold gradient-text mb-2">
            LITLABS
          </h1>
          <p className="text-text-muted text-sm font-code tracking-widest">
            AI-NATIVE WORKSPACE
          </p>
        </div>
        <div className="card">
          <h2 className="font-heading text-xl font-semibold mb-6 text-center">
            Welcome Back
          </h2>

          <LoginForm errorMessage={searchParams.then(p => p.error)} />
        </div>
      </div>
    </div>
  );
}

function LoginForm({
  errorMessage,
}: {
  errorMessage: Promise<string | undefined>;
}) {
  // Use the form with server action — works without JavaScript
  return (
    <form action={loginAction} method="POST" className="space-y-4">
      <div>
        <label className="block text-text-secondary text-sm mb-1">Email</label>
        <input
          className="input"
          type="email"
          name="email"
          required
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-text-secondary text-sm mb-1">
          Password
        </label>
        <input
          className="input"
          type="password"
          name="password"
          required
          placeholder="••••••••"
        />
      </div>

      <ErrorMessage promise={errorMessage} />

      <button type="submit" className="btn-primary w-full">
        Sign In
      </button>

      <div className="text-center mt-4">
        <a
          href="/register"
          className="text-neon-cyan text-sm hover:underline"
        >
          Don&apos;t have an account? Register
        </a>
      </div>
    </form>
  );
}

async function ErrorMessage({ promise }: { promise: Promise<string | undefined> }) {
  const error = await promise;
  if (!error) return null;
  return (
    <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 text-sm">
      {error}
    </div>
  );
}
