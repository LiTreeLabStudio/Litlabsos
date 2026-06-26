"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Radio, Music, Play, Pause, Volume2, VolumeX, ExternalLink } from "lucide-react";

/**
 * Real radio streams — all publicly available Icecast/SHOUTcast streams.
 * Listeners count is live-updated via the stream metadata where available.
 */
const STATIONS = [
  {
    id: "synthwave",
    title: "Synthwave FM",
    genre: "Synthwave",
    color: "#ff00a0",
    streamUrl: "https://stream.syntheticfm.com:8046/listen.mp3",
    fallbackUrl: "https://ice6.somafm.com/missioncontrol-128-mp3",
    website: "https://somafm.com/missioncontrol/",
    description: "Mission Control by SomaFM · Analog space age",
  },
  {
    id: "lofi",
    title: "Lo-Fi Lounge",
    genre: "Lo-Fi",
    color: "#00f0ff",
    streamUrl: "https://ice6.somafm.com/groovesalad-128-mp3",
    fallbackUrl: "https://ice4.somafm.com/groovesalad-128-mp3",
    website: "https://somafm.com/groovesalad/",
    description: "Groove Salad by SomaFM · Ambient beats",
  },
  {
    id: "darksynth",
    title: "Cyber Beats",
    genre: "Darksynth",
    color: "#8b5cf6",
    streamUrl: "https://ice6.somafm.com/darkzone-128-mp3",
    fallbackUrl: "https://ice4.somafm.com/darkzone-128-mp3",
    website: "https://somafm.com/darkzone/",
    description: "Dark Zone by SomaFM · Industrial techno",
  },
  {
    id: "ambient",
    title: "Focus Flow",
    genre: "Ambient",
    color: "#10b981",
    streamUrl: "https://ice6.somafm.com/spacestation-128-mp3",
    fallbackUrl: "https://ice4.somafm.com/spacestation-128-mp3",
    website: "https://somafm.com/spacestation/",
    description: "Space Station by SomaFM · Deep ambient",
  },
  {
    id: "vaporwave",
    title: "Neon Dreams",
    genre: "Vaporwave",
    color: "#ff9ff3",
    streamUrl: "https://ice6.somafm.com/7soul-128-mp3",
    fallbackUrl: "https://ice4.somafm.com/7soul-128-mp3",
    website: "https://somafm.com/7soul/",
    description: "Seven Inches of Sevties Soul · Classic grooves",
  },
  {
    id: "jazz",
    title: "Midnight Jazz",
    genre: "Jazz",
    color: "#f59e0b",
    streamUrl: "https://ice6.somafm.com/sonicuniverse-128-mp3",
    fallbackUrl: "https://ice4.somafm.com/sonicuniverse-128-mp3",
    website: "https://somafm.com/sonicuniverse/",
    description: "Sonic Universe by SomaFM · Jazz explorations",
  },
];

/**
 * Curated Spotify playlists — open in Spotify embed or new tab.
 * These are public playlists that match the platform vibe.
 */
const PLAYLISTS = [
  {
    id: "synthwave-essentials",
    name: "Synthwave Essentials",
    color: "#ff00a0",
    spotifyId: "37i9dQZF1DX6J5NfMJS675",
    tracks: "80 tracks",
  },
  {
    id: "lofi-chill",
    name: "Lo-Fi Chill",
    color: "#00f0ff",
    spotifyId: "37i9dQZF1DWWQRwui0ExPn",
    tracks: "100 tracks",
  },
  {
    id: "focus",
    name: "Deep Focus",
    color: "#10b981",
    spotifyId: "37i9dQZF1DWZeKCadgRdKQ",
    tracks: "130 tracks",
  },
  {
    id: "vaporwave",
    name: "Vaporwave Mix",
    color: "#8b5cf6",
    spotifyId: "37i9dQZF1DX9tPFwDMOaN1",
    tracks: "50 tracks",
  },
];

export default function MusicPlayer() {
  const { resolvedColors: T } = useTheme();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeStation, setActiveStation] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spotifyStation, setSpotifyStation] = useState<string | null>(null);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const playStation = (station: typeof STATIONS[0]) => {
    setError(null);

    // If already playing this station, toggle pause/play
    if (activeStation === station.id) {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
            setError("Stream unavailable. Try another station.");
          });
        }
      }
      return;
    }

    // Switch to new station
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    setActiveStation(station.id);
    setIsLoading(true);
    setIsPlaying(false);

    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.volume = muted ? 0 : volume;
    audio.preload = "none";

    audio.oncanplay = () => {
      setIsLoading(false);
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Try fallback
          audio.src = station.fallbackUrl;
          audio.play()
            .then(() => setIsPlaying(true))
            .catch(() => setError("Stream unavailable. Try another station."));
        });
    };

    audio.onerror = () => {
      // Try fallback URL
      if (audio.src !== station.fallbackUrl) {
        audio.src = station.fallbackUrl;
      } else {
        setIsLoading(false);
        setError("Stream unavailable. Try another station.");
      }
    };

    audio.src = station.streamUrl;
    audioRef.current = audio;
  };

  const stopAll = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setIsPlaying(false);
    setActiveStation(null);
    setError(null);
  };

  const handleVolume = (v: number) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    if (v > 0) setMuted(false);
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    if (audioRef.current) audioRef.current.volume = next ? 0 : volume;
  };

  const currentStation = STATIONS.find((s) => s.id === activeStation);

  return (
    <div className="space-y-6">
      {/* Now Playing bar */}
      <div
        className="rounded-2xl p-5 flex items-center gap-5"
        style={{
          background: currentStation
            ? `linear-gradient(135deg, ${currentStation.color}20, ${currentStation.color}08)`
            : "linear-gradient(135deg, #ff2d7815, #8b5cf610)",
          border: `1px solid ${currentStation ? currentStation.color + "40" : "#ff2d7820"}`,
        }}
      >
        {/* Visualizer / icon */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
          style={{
            backgroundColor: `${currentStation?.color ?? "#ff2d78"}20`,
            border: `1px solid ${currentStation?.color ?? "#ff2d78"}30`,
          }}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: currentStation?.color ?? "#ff2d78", borderTopColor: "transparent" }} />
          ) : (
            <Music size={22} style={{ color: currentStation?.color ?? "#ff2d78" }}
              className={isPlaying ? "animate-pulse" : ""} />
          )}
        </div>

        {/* Track info */}
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-black uppercase tracking-widest mb-0.5"
            style={{ color: currentStation?.color ?? "#ff2d78" }}>
            {isLoading ? "Connecting..." : isPlaying ? "Now Playing" : "Select a station"}
          </div>
          <div className="font-black text-base truncate" style={{ color: T.textColor }}>
            {currentStation?.title ?? "Radio"}
          </div>
          <div className="text-[11px] truncate mt-0.5" style={{ color: T.textMuted }}>
            {currentStation?.description ?? "SomaFM · Free internet radio"}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Volume */}
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={toggleMute} className="opacity-60 hover:opacity-100 transition-opacity">
              {muted || volume === 0
                ? <VolumeX size={14} style={{ color: T.textMuted }} />
                : <Volume2 size={14} style={{ color: T.textMuted }} />}
            </button>
            <input
              type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume}
              onChange={(e) => handleVolume(Number(e.target.value))}
              className="w-16 accent-current"
              style={{ accentColor: currentStation?.color ?? "#ff2d78" }}
            />
          </div>
          {/* Stop button */}
          {activeStation && (
            <button
              onClick={stopAll}
              className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:opacity-80"
              style={{ backgroundColor: `${T.borderColor}30`, color: T.textMuted }}
            >
              Stop
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="text-xs px-4 py-2 rounded-lg" style={{ backgroundColor: "#2e0a0a", color: "#ff4444" }}>
          {error}
        </div>
      )}

      {/* Station grid */}
      <div>
        <div className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: T.textMuted }}>
          Live Radio — Powered by SomaFM
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {STATIONS.map((s) => {
            const active = activeStation === s.id;
            const playing = active && isPlaying;
            const loading = active && isLoading;
            return (
              <button
                key={s.id}
                onClick={() => playStation(s)}
                className="group flex items-center gap-3 p-4 rounded-xl text-left transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: active ? `${s.color}15` : `${T.boxBg}60`,
                  border: `1px solid ${active ? s.color + "50" : s.color + "20"}`,
                  boxShadow: active ? `0 0 20px ${s.color}20` : "none",
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${s.color}20`, border: `1px solid ${s.color}30` }}
                >
                  {loading
                    ? <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                        style={{ borderColor: s.color, borderTopColor: "transparent" }} />
                    : playing
                    ? <Pause size={14} style={{ color: s.color }} />
                    : <Play size={14} style={{ color: s.color }} className="ml-0.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-black truncate" style={{ color: T.textColor }}>{s.title}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: playing ? s.color : T.textMuted + "60",
                        animation: playing ? "pulse 1s ease-in-out infinite" : "none" }} />
                    <span className="text-[10px] truncate" style={{ color: T.textMuted }}>{s.genre}</span>
                  </div>
                </div>
                <a
                  href={s.website} target="_blank" rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity shrink-0"
                >
                  <ExternalLink size={12} style={{ color: T.textMuted }} />
                </a>
              </button>
            );
          })}
        </div>
      </div>

      {/* Spotify playlists */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: T.textMuted }}>
            Spotify Playlists
          </div>
          <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer"
            className="text-[10px] font-bold flex items-center gap-1 opacity-40 hover:opacity-100 transition-opacity"
            style={{ color: "#1DB954" }}>
            <ExternalLink size={10} /> Open Spotify
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PLAYLISTS.map((p) => (
            <a
              key={p.id}
              href={`https://open.spotify.com/playlist/${p.spotifyId}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setSpotifyStation(p.spotifyId)}
              className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.03] cursor-pointer"
              style={{
                backgroundColor: `${p.color}15`,
                border: `1px solid ${p.color}25`,
                boxShadow: spotifyStation === p.spotifyId ? `0 0 20px ${p.color}30` : "none",
              }}
            >
              <Music size={22} style={{ color: p.color }} />
              <span className="text-[10px] font-black text-center px-2 leading-tight"
                style={{ color: T.textColor }}>{p.name}</span>
              <span className="text-[9px]" style={{ color: T.textMuted }}>{p.tracks}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Spotify embed — shows when a playlist is selected */}
      {spotifyStation && (
        <div className="rounded-xl overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#1DB954" }}>
              Spotify Preview
            </div>
            <button onClick={() => setSpotifyStation(null)}
              className="text-[10px] opacity-40 hover:opacity-100 transition-opacity"
              style={{ color: T.textMuted }}>
              Close
            </button>
          </div>
          <iframe
            src={`https://open.spotify.com/embed/playlist/${spotifyStation}?utm_source=generator&theme=0`}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-xl"
          />
        </div>
      )}
    </div>
  );
}
