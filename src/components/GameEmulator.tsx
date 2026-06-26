"use client";

import { useEffect, useState } from "react";

/**
 * EmulatorJS-powered game emulator.
 * Supports: NES, SNES, Genesis/Mega Drive, Game Boy, GBA
 *
 * The emulator bootstrap is served from /emulator?core=X&rom=Y&title=Z
 * (a real Next.js route) so the page can load cdn.emulatorjs.org scripts
 * without hitting browser CSP restrictions on data: URIs.
 *
 * ROMs are loaded from NEXT_PUBLIC_ROM_BASE_URL (Supabase Storage, R2, etc.)
 */

const CORE_MAP: Record<string, string> = {
  nes: "nestopia",
  snes: "snes9x",
  genesis: "genesis_plus_gx",
  gb: "gambatte",
  gba: "mgba",
};

interface GameEmulatorProps {
  romUrl: string;
  platform: "nes" | "snes" | "genesis" | "gb" | "gba" | "html5";
  title?: string;
  onError?: (error: string) => void;
}

export default function GameEmulator({
  romUrl,
  platform,
  title = "Game",
  onError,
}: GameEmulatorProps) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const core = CORE_MAP[platform];

  useEffect(() => {
    if (!core) {
      const msg = `${platform.toUpperCase()} emulator is not supported.`;
      setErrorMsg(msg);
      setStatus("error");
      onError?.(msg);
      return;
    }

    setStatus("loading");
    setErrorMsg(null);

    // HEAD check — verify ROM is reachable before booting emulator
    fetch(romUrl, { method: "HEAD" })
      .then((res) => {
        if (!res.ok) throw new Error(`ROM not found (HTTP ${res.status})`);
        setStatus("ready");
      })
      .catch((err: unknown) => {
        const msg =
          err instanceof Error
            ? err.message
            : "ROM file not found or inaccessible.";
        setErrorMsg(
          `Could not load ROM: ${msg}\n\nUpload the ROM to your Supabase Storage bucket and set NEXT_PUBLIC_ROM_BASE_URL in your Vercel environment variables.`,
        );
        setStatus("error");
        onError?.(msg);
      });
  }, [romUrl, platform, core, onError]);

  if (status === "error" || !core) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-center p-6 max-w-sm">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-red-400 text-sm font-bold mb-3">ROM Not Loaded</p>
          <p className="text-white/50 text-xs whitespace-pre-line leading-relaxed">
            {errorMsg}
          </p>
          <div className="mt-4 p-3 rounded border border-white/10 text-left">
            <p className="text-white/40 text-[10px] font-mono leading-relaxed">
              1. Go to Supabase Storage → create bucket &quot;roms&quot;
              <br />
              2. Upload your ROM file (e.g. smb1.nes)
              <br />
              3. Set
              NEXT_PUBLIC_ROM_BASE_URL=https://&lt;project&gt;.supabase.co/storage/v1/object/public/roms
              <br />
              4. Redeploy — the emulator will load automatically
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">🎮</div>
          <p className="text-white/60 text-sm">Checking ROM...</p>
        </div>
      </div>
    );
  }

  // Build the emulator URL pointing to our real Next.js route
  const params = new URLSearchParams({
    core,
    rom: romUrl,
    title,
  });
  const emulatorUrl = `/emulator?${params.toString()}`;

  return (
    <div className="w-full h-full relative bg-black">
      <iframe
        src={emulatorUrl}
        className="w-full h-full border-0"
        allow="autoplay; fullscreen; gamepad"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock"
        title={title}
      />
    </div>
  );
}
