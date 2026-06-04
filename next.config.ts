import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,

  // Note: Next.js 16 removes many old top-level config keys.
  // The major built-in default improvements in v16 include:
  // - React Compiler enabled by default
  // - Turbopack for dev (stable)
  // - Improved caching with Cache Components
  // - Server Actions stable

  // Custom security response headers via config
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
