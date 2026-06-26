"use client";

export const dynamic = "force-dynamic";

import { useState, useCallback, useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useClerkAuth } from "@/hooks/useClerkAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import GameEmulator from "@/components/GameEmulator";
import {
  Search,
  Users,
  Gamepad2,
  Heart,
  Play,
  Grid3X3,
  List,
  Zap,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import {
  GAME_LIBRARY,
  getFavorites,
  toggleFavorite,
  searchGames,
  getGamesByCategory,
  type Game,
  type GameCategory,
} from "@/lib/games";

const CATEGORIES: {
  id: GameCategory | "all";
  label: string;
  icon: typeof Gamepad2;
}[] = [
  { id: "all", label: "All Games", icon: Grid3X3 },
  { id: "retro", label: "Retro", icon: Gamepad2 },
  { id: "arcade", label: "Arcade", icon: Zap },
  { id: "puzzle", label: "Puzzle", icon: Grid3X3 },
  { id: "multiplayer", label: "Multiplayer", icon: Users },
];

export default function GamesPage() {
  const { resolvedColors: T } = useTheme();
  const { isLoaded, isSignedIn } = useClerkAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<GameCategory | "all">(
    "all",
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    return getFavorites();
  });
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const slideTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Games with real cover images for the slideshow (exclude placeholder /games/ paths)
  const slideGames = GAME_LIBRARY.filter(
    (g) => g.coverUrl.startsWith("http") && !g.coverUrl.includes("svg"),
  );

  const prevSlide = () =>
    setSlideIndex((i) => (i - 1 + slideGames.length) % slideGames.length);
  const nextSlide = () => setSlideIndex((i) => (i + 1) % slideGames.length);

  // Auto-advance every 4s, pause when a game is open
  useEffect(() => {
    if (selectedGame) return;
    slideTimer.current = setInterval(nextSlide, 4000);
    return () => {
      if (slideTimer.current) clearInterval(slideTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGame, slideGames.length]);

  // Filter games
  const filteredGames = searchQuery
    ? searchGames(searchQuery)
    : activeCategory === "all"
      ? GAME_LIBRARY
      : getGamesByCategory(activeCategory);

  const handleToggleFav = useCallback((gameId: string) => {
    const isNowFav = toggleFavorite(gameId);
    setFavorites((prev) =>
      isNowFav ? [...prev, gameId] : prev.filter((id) => id !== gameId),
    );
  }, []);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?redirect_url=/games");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: T?.bgColor }}
      >
        <div className="text-center">
          <div className="text-2xl mb-2 animate-pulse">🎮</div>
          <div>Loading Game Cloud...</div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <PageShell title="Sign In">
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <p className="text-sm opacity-60">Please sign in to play games.</p>
          <Link
            href="/sign-in?redirect_url=/games"
            className="px-4 py-2 rounded-lg text-sm font-bold"
            style={{ backgroundColor: "#6366f1", color: "#fff" }}
          >
            Sign In
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Game Cloud"
      subtitle="Play classic retro games and modern HTML5 titles"
      icon="🎮"
    >
      {/* Retro Ticker */}
      <div
        className="w-full bg-black py-1 border-b-2 overflow-hidden flex"
        style={{ borderColor: T.borderColor, color: T.accentColor }}
      >
        <div className="whitespace-nowrap animate-marquee flex gap-12 font-bold uppercase tracking-wider text-[10px]">
          <span>🎮 GAME CLOUD ONLINE // 8 EMULATORS READY</span>
          <span>⚡ NES SNES GENESIS GB GBA ARCADE SUPPORT</span>
          <span>🏆 LEADERBOARDS ACTIVE // MULTIPLAYER ENABLED</span>
          <span>💾 CLOUD SAVES SYNCED ACROSS DEVICES</span>
        </div>
      </div>

      {/* ROM Setup Banner — shown when ROM hosting is not yet configured */}
      {!process.env.NEXT_PUBLIC_ROM_BASE_URL && (
        <div
          className="w-full px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 border-b-2"
          style={{ backgroundColor: "#1a0a00", borderColor: "#ff6600" }}
        >
          <div className="text-lg shrink-0">⚙️</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold" style={{ color: "#ff9933" }}>
              ROM hosting not configured — retro games will show a setup screen
              when launched
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: "#ff993380" }}>
              To enable NES/SNES/Genesis/GB/GBA: create a Supabase Storage
              bucket named <code className="font-mono">roms</code>, upload your
              ROM files, then set{" "}
              <code className="font-mono">NEXT_PUBLIC_ROM_BASE_URL</code> in
              Vercel → Settings → Environment Variables. HTML5 games work
              without any setup.
            </p>
          </div>
        </div>
      )}

      {/* Hero Slideshow */}
      {!selectedGame && slideGames.length > 0 && (
        <div
          className="relative h-[300px] md:h-[420px] overflow-hidden border-b-2 group"
          style={{ borderColor: T.borderColor }}
        >
          {/* Slides */}
          {slideGames.map((game, i) => (
            <div
              key={game.id}
              className="absolute inset-0 transition-opacity duration-700"
              style={{
                opacity: i === slideIndex ? 1 : 0,
                pointerEvents: i === slideIndex ? "auto" : "none",
              }}
            >
              {/* Cover image fills the frame */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={game.coverUrl}
                alt={game.title}
                className="w-full h-full object-cover object-center"
                style={{ filter: "brightness(0.45)" }}
              />
              {/* Gradient overlay bottom → top */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, ${T.bgColor}ee 0%, ${T.bgColor}80 40%, transparent 100%)`,
                }}
              />
              {/* Game info bottom-left */}
              <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-12">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: T.accentColor,
                          color: "#000",
                        }}
                      >
                        {game.platform.toUpperCase()}
                      </span>
                      <span className="text-[10px] opacity-50 font-mono">
                        {game.year}
                      </span>
                      <span
                        className="flex items-center gap-1 text-[10px]"
                        style={{ color: "#fbbf24" }}
                      >
                        <Star size={10} fill="#fbbf24" />
                        {game.rating}
                      </span>
                    </div>
                    <h2
                      className="text-2xl md:text-3xl font-black leading-tight mb-1"
                      style={{ color: T.textColor }}
                    >
                      {game.title}
                    </h2>
                    <p
                      className="text-xs md:text-sm opacity-60 max-w-lg line-clamp-2"
                      style={{ color: T.textMuted }}
                    >
                      {game.description}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedGame(game)}
                    className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
                    style={{ backgroundColor: T.accentColor, color: "#000" }}
                  >
                    <Play size={16} fill="currentColor" />
                    Play Now
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Prev / Next arrows */}
          <button
            onClick={() => {
              prevSlide();
              if (slideTimer.current) {
                clearInterval(slideTimer.current);
                slideTimer.current = setInterval(nextSlide, 4000);
              }
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "#fff" }}
            aria-label="Previous"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => {
              nextSlide();
              if (slideTimer.current) {
                clearInterval(slideTimer.current);
                slideTimer.current = setInterval(nextSlide, 4000);
              }
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "#fff" }}
            aria-label="Next"
          >
            <ChevronRight size={18} />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {slideGames.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIndex(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === slideIndex ? 20 : 6,
                  height: 6,
                  backgroundColor:
                    i === slideIndex ? T.accentColor : "rgba(255,255,255,0.3)",
                }}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Scanlines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background:
                "repeating-linear-gradient(0deg, rgba(0,0,0,0.3), rgba(0,0,0,0.3) 1px, transparent 1px, transparent 3px)",
            }}
          />
        </div>
      )}

      {/* Game Player Overlay */}
      {selectedGame && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: T.bgColor + "f0" }}
        >
          <div className="w-full max-w-6xl mx-4">
            {/* Player Header */}
            <div
              className="flex items-center justify-between p-4 border-2 mb-2"
              style={{ backgroundColor: T.boxBg, borderColor: T.borderColor }}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedGame(null)}
                  className="p-2 border hover:opacity-80"
                  style={{ borderColor: T.borderColor }}
                >
                  ✕
                </button>
                <div>
                  <div className="font-bold" style={{ color: T.headerColor }}>
                    {selectedGame.title}
                  </div>
                  <div className="text-[10px] opacity-60">
                    {selectedGame.platform.toUpperCase()} • {selectedGame.year}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleFav(selectedGame.id)}
                  className="p-2 border hover:opacity-80"
                  style={{
                    borderColor: T.borderColor,
                    color: favorites.includes(selectedGame.id)
                      ? T.accentColor
                      : T.textMuted,
                  }}
                >
                  <Heart
                    size={16}
                    fill={
                      favorites.includes(selectedGame.id)
                        ? T.accentColor
                        : "none"
                    }
                  />
                </button>
              </div>
            </div>

            {/* Game Canvas / Iframe / Emulator */}
            <div
              className="aspect-video border-2 relative overflow-hidden"
              style={{ backgroundColor: "#000", borderColor: T.borderColor }}
            >
              {selectedGame.html5Url ? (
                <div className="w-full h-full relative">
                  <iframe
                    src={selectedGame.html5Url}
                    className="w-full h-full"
                    allow="fullscreen; gamepad"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    referrerPolicy="no-referrer"
                    style={{ border: "none" }}
                  />
                  {/* Overlay for external link */}
                  <a
                    href={selectedGame.html5Url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 opacity-0 hover:opacity-100 transition-opacity"
                    style={{
                      backgroundColor: T.bgColor + "cc",
                      color: T.textColor,
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <ExternalLink size={10} />
                    Open in New Tab
                  </a>
                </div>
              ) : selectedGame.romUrl && selectedGame.platform !== "html5" ? (
                <GameEmulator
                  romUrl={selectedGame.romUrl}
                  platform={selectedGame.platform}
                  title={selectedGame.title}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🎮</div>
                    <p className="text-sm opacity-60 mb-4">
                      No game file available
                    </p>
                    <p className="text-[10px] opacity-40 max-w-md">
                      This game requires a ROM file that hasn&apos;t been added
                      yet.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Game Info Bar */}
            <div
              className="p-3 border-2 border-t-0"
              style={{ backgroundColor: T.boxBg, borderColor: T.borderColor }}
            >
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-4">
                  <span style={{ color: T.textMuted }}>
                    👤 {selectedGame.players} Player
                    {selectedGame.players > 1 ? "s" : ""}
                  </span>
                  <span style={{ color: T.textMuted }}>
                    ⭐ {selectedGame.rating}/5.0
                  </span>
                  <span style={{ color: T.textMuted }}>
                    🏢 {selectedGame.developer}
                  </span>
                </div>
                <div className="flex gap-2">
                  {selectedGame.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 border"
                      style={{ borderColor: T.borderColor, color: T.textMuted }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div
        className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between py-4 border-b"
        style={{ borderColor: T.borderColor }}
      >
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2"
            size={16}
            style={{ color: T.textMuted }}
          />
          <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border bg-transparent text-sm outline-none focus:border-cyan-500/50"
            style={{ borderColor: T.borderColor, color: T.textColor }}
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase border transition-all whitespace-nowrap ${
                  isActive ? "opacity-100" : "opacity-60 hover:opacity-80"
                }`}
                style={{
                  borderColor: isActive ? T.accentColor : T.borderColor,
                  backgroundColor: isActive
                    ? T.accentColor + "10"
                    : "transparent",
                  color: isActive ? T.accentColor : T.textColor,
                }}
              >
                <Icon size={12} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* View Toggle */}
        <div
          className="flex items-center border"
          style={{ borderColor: T.borderColor }}
        >
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 ${viewMode === "grid" ? "opacity-100" : "opacity-40"}`}
            style={{ color: viewMode === "grid" ? T.accentColor : T.textMuted }}
          >
            <Grid3X3 size={16} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 ${viewMode === "list" ? "opacity-100" : "opacity-40"}`}
            style={{ color: viewMode === "list" ? T.accentColor : T.textMuted }}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Games Grid/List */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 py-6"
            : "space-y-2 py-6"
        }
      >
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className={`group relative border overflow-hidden transition-all duration-200 cursor-pointer ${
              viewMode === "grid"
                ? "rounded-xl hover:scale-[1.03] hover:shadow-xl"
                : "flex items-center gap-4 p-3 rounded-xl hover:scale-[1.01]"
            }`}
            style={{
              backgroundColor: T.boxBg,
              borderColor: favorites.includes(game.id)
                ? T.accentColor
                : T.borderColor,
              boxShadow: favorites.includes(game.id)
                ? `0 0 12px ${T.accentColor}30`
                : undefined,
            }}
            onClick={() => setSelectedGame(game)}
          >
            {/* Cover image */}
            <div
              className={`relative overflow-hidden ${
                viewMode === "grid"
                  ? "aspect-[3/4] w-full"
                  : "w-20 h-24 shrink-0 rounded-lg"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={game.coverUrl}
                alt={game.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="267"><rect width="200" height="267" fill="%23111"/><text x="100" y="134" text-anchor="middle" dominant-baseline="middle" fill="%23444" font-size="60">🎮</text></svg>`;
                }}
              />
              {/* Dark gradient at bottom */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: T.accentColor }}
                >
                  <Play size={20} fill="#000" color="#000" />
                </div>
              </div>
              {/* Platform pill — top left */}
              <div
                className="absolute top-2 left-2 px-1.5 py-0.5 text-[8px] font-black uppercase rounded tracking-wider"
                style={{
                  backgroundColor: "rgba(0,0,0,0.75)",
                  color: T.accentColor,
                }}
              >
                {game.platform}
              </div>
              {/* Star rating — top right */}
              <div
                className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-bold"
                style={{
                  backgroundColor: "rgba(0,0,0,0.75)",
                  color: "#fbbf24",
                }}
              >
                <Star size={8} fill="#fbbf24" />
                {game.rating}
              </div>
              {/* Fav heart — bottom right, always visible if fav */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFav(game.id);
                }}
                className={`absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  favorites.includes(game.id)
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
                style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
              >
                <Heart
                  size={14}
                  fill={favorites.includes(game.id) ? T.accentColor : "none"}
                  color={favorites.includes(game.id) ? T.accentColor : "#fff"}
                />
              </button>
            </div>

            {/* Info — grid mode: below cover; list mode: beside cover */}
            <div className={viewMode === "grid" ? "p-3" : "flex-1 min-w-0"}>
              <div
                className="font-bold text-xs leading-tight line-clamp-2 mb-1"
                style={{ color: T.textColor }}
              >
                {game.title}
              </div>
              {viewMode === "list" && (
                <div
                  className="text-[10px] opacity-60 line-clamp-2 mb-1"
                  style={{ color: T.textMuted }}
                >
                  {game.description}
                </div>
              )}
              <div
                className="flex items-center gap-2 text-[9px]"
                style={{ color: T.textMuted }}
              >
                <span className="opacity-50">{game.year}</span>
                <span className="opacity-40">•</span>
                <span className="opacity-50">{game.players}P</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredGames.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">🔍</div>
          <p className="opacity-60">No games found matching your search.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="mt-4 px-4 py-2 border text-sm hover:opacity-80"
            style={{ borderColor: T.borderColor }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </PageShell>
  );
}
