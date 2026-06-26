/**
 * Game Cloud System for LiTTree Lab Studios
 * Browser-based gaming with retro emulators and HTML5 games
 *
 * ROM hosting: set NEXT_PUBLIC_ROM_BASE_URL to your Supabase Storage or R2 bucket URL.
 * Example: https://<project>.supabase.co/storage/v1/object/public/roms
 * Upload ROM files to that bucket with the exact filenames used below.
 * If the env var is not set, roms will fall back to /public/roms/ (local dev only).
 */

const ROM_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_ROM_BASE_URL) ||
  "/roms";

function rom(filename: string): string {
  if (filename.startsWith("http://") || filename.startsWith("https://")) {
    return filename;
  }
  // URL encode the filename to handle spaces and special characters safely
  const encodedFilename = encodeURIComponent(filename).replace(/%2F/g, "/");
  return `${ROM_BASE}/${encodedFilename}`;
}

export type GameCategory = "retro" | "arcade" | "puzzle" | "multiplayer";
export type GamePlatform = "nes" | "snes" | "genesis" | "gb" | "gba" | "html5";

export interface Game {
  id: string;
  title: string;
  description: string;
  category: GameCategory;
  platform: GamePlatform;
  coverUrl: string;
  romUrl?: string;
  html5Url?: string;
  year: number;
  developer: string;
  players: number;
  rating: number;
  tags: string[];
}

export interface SaveState {
  id: string;
  gameId: string;
  userId: string;
  stateData: string;
  createdAt: number;
  name: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  timestamp: number;
}

// Demo game library - in production, this would come from a database
export const GAME_LIBRARY: Game[] = [
  // NES Games
  {
    id: "smb1",
    title: "Super Mario Bros.",
    description:
      "The classic platformer that started it all. Save Princess Peach across 8 worlds.",
    category: "retro",
    platform: "nes",
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/en/0/03/Super_Mario_Bros._box.png",
    romUrl: rom("smb1.nes"),
    year: 1985,
    developer: "Nintendo",
    players: 2,
    rating: 4.9,
    tags: ["platformer", "classic", "mario"],
  },
  {
    id: "tetris-nes",
    title: "Tetris",
    description:
      "The legendary falling-block puzzle. Clear lines, beat your high score.",
    category: "puzzle",
    platform: "nes",
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/en/7/7d/Tetris_NES_cover.jpg",
    romUrl: rom("tetris.nes"),
    year: 1989,
    developer: "Nintendo",
    players: 2,
    rating: 4.8,
    tags: ["puzzle", "classic", "addictive"],
  },
  {
    id: "mega-man-2",
    title: "Mega Man 2",
    description:
      "Robot master mayhem. Take down Dr. Wily's eight fortress bosses.",
    category: "retro",
    platform: "nes",
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/en/a/a5/Mega_Man_2_cover.jpg",
    romUrl: rom("megaman2.nes"),
    year: 1988,
    developer: "Capcom",
    players: 1,
    rating: 4.8,
    tags: ["action", "platformer", "classic"],
  },
  {
    id: "contra-nes",
    title: "Contra",
    description: "Run-and-gun co-op action. 30 lives code recommended.",
    category: "arcade",
    platform: "nes",
    coverUrl: "https://upload.wikimedia.org/wikipedia/en/7/72/Contra_cover.jpg",
    romUrl: rom("contra.nes"),
    year: 1988,
    developer: "Konami",
    players: 2,
    rating: 4.7,
    tags: ["shooter", "co-op", "action"],
  },
  // SNES Games
  {
    id: "smw",
    title: "Super Mario World",
    description:
      "Mario's greatest SNES adventure across Dinosaur Land with Yoshi.",
    category: "retro",
    platform: "snes",
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/en/3/32/Super_Mario_World_Coverart.png",
    romUrl: rom("smw.smc"),
    year: 1991,
    developer: "Nintendo",
    players: 2,
    rating: 4.9,
    tags: ["platformer", "mario", "classic"],
  },
  {
    id: "smb3-snes",
    title: "BS Super Mario Collection 3",
    description:
      "Play the legendary Super Mario Bros. 3 with enhanced 16-bit SNES graphics.",
    category: "retro",
    platform: "snes",
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/en/a/a5/Super_Mario_Bros._3_coverart.png",
    romUrl: rom("BS Mario Collection 3 (J).smc"),
    year: 1993,
    developer: "Nintendo",
    players: 2,
    rating: 4.9,
    tags: ["platformer", "mario", "classic", "snes"],
  },
  {
    id: "zelda-lttp",
    title: "The Legend of Zelda: A Link to the Past",
    description: "The definitive Zelda adventure. Light and Dark World await.",
    category: "retro",
    platform: "snes",
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/en/5/5e/The_Legend_of_Zelda_A_Link_to_the_Past_SNES_Game_Cover.jpg",
    romUrl: rom("zelda-lttp.smc"),
    year: 1991,
    developer: "Nintendo",
    players: 1,
    rating: 4.9,
    tags: ["adventure", "rpg", "zelda"],
  },
  {
    id: "sf2-snes",
    title: "Street Fighter II Turbo",
    description: "The legendary 1v1 fighter. Choose your champion.",
    category: "arcade",
    platform: "snes",
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/en/5/59/Street_fighter_2_turbo.jpg",
    romUrl: rom("sf2turbo.smc"),
    year: 1993,
    developer: "Capcom",
    players: 2,
    rating: 4.7,
    tags: ["fighting", "arcade", "classic"],
  },
  // Genesis Games
  {
    id: "sonic1",
    title: "Sonic the Hedgehog",
    description: "Blast through Green Hill Zone at supersonic speed.",
    category: "retro",
    platform: "genesis",
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/en/b/ba/Sonic_the_Hedgehog_1_Genesis_box_art.jpg",
    romUrl: rom("sonic1.bin"),
    year: 1991,
    developer: "Sega",
    players: 1,
    rating: 4.7,
    tags: ["platformer", "speed", "sonic"],
  },
  {
    id: "sonic2",
    title: "Sonic the Hedgehog 2",
    description: "Sonic and Tails team up. Includes 2-player split-screen.",
    category: "retro",
    platform: "genesis",
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/en/2/2d/Sonic_the_Hedgehog_2.jpg",
    romUrl: rom("sonic2.bin"),
    year: 1992,
    developer: "Sega",
    players: 2,
    rating: 4.8,
    tags: ["platformer", "speed", "sonic", "co-op"],
  },
  {
    id: "streets-of-rage",
    title: "Streets of Rage 2",
    description: "Brawl through the city streets. Co-op beat-em-up classic.",
    category: "arcade",
    platform: "genesis",
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/en/5/56/Streets_of_Rage_2.jpg",
    romUrl: rom("sor2.bin"),
    year: 1992,
    developer: "Sega",
    players: 2,
    rating: 4.8,
    tags: ["beat-em-up", "co-op", "action"],
  },
  // Game Boy
  {
    id: "pokemon-red",
    title: "Pokémon Red",
    description: "Gotta catch 'em all. Begin your journey in Pallet Town.",
    category: "retro",
    platform: "gb",
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/en/a/af/Pokemon_Red_Version_box_art.jpg",
    romUrl: rom("pokemon-red.gb"),
    year: 1996,
    developer: "Game Freak",
    players: 1,
    rating: 4.8,
    tags: ["rpg", "pokemon", "classic"],
  },
  {
    id: "tetris-gb",
    title: "Tetris (Game Boy)",
    description: "The Game Boy launch title that sold 35 million copies.",
    category: "puzzle",
    platform: "gb",
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/en/4/4a/GameBoyTetris.jpg",
    romUrl: rom("tetris.gb"),
    year: 1989,
    developer: "Nintendo",
    players: 2,
    rating: 4.9,
    tags: ["puzzle", "classic", "addictive"],
  },
  // GBA
  {
    id: "pokemon-emerald",
    title: "Pokémon Emerald",
    description:
      "The definitive GBA Pokémon experience. Battle the Battle Frontier.",
    category: "retro",
    platform: "gba",
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Pok%C3%A9mon_Emerald_Version_box_art.png/220px-Pok%C3%A9mon_Emerald_Version_box_art.png",
    romUrl: rom("pokemon-emerald.gba"),
    year: 2004,
    developer: "Game Freak",
    players: 1,
    rating: 4.9,
    tags: ["rpg", "pokemon", "classic"],
  },
  {
    id: "metroid-fusion",
    title: "Metroid Fusion",
    description: "Samus faces the X Parasites aboard the BSL research station.",
    category: "retro",
    platform: "gba",
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/en/2/2e/Metroid_Fusion_box_art.jpg",
    romUrl: rom("metroid-fusion.gba"),
    year: 2002,
    developer: "Nintendo",
    players: 1,
    rating: 4.7,
    tags: ["action", "adventure", "metroidvania"],
  },
  // HTML5 Games
  {
    id: "2048",
    title: "2048",
    description:
      "Slide tiles and combine numbers to reach the elusive 2048 tile.",
    category: "puzzle",
    platform: "html5",
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/2048_logo.svg/1200px-2048_logo.svg.png",
    html5Url: "https://play2048.co/",
    year: 2014,
    developer: "Gabriele Cirulli",
    players: 1,
    rating: 4.5,
    tags: ["puzzle", "numbers", "minimalist"],
  },
  {
    id: "hextris",
    title: "Hextris",
    description: "Fast-paced hexagon block-stacking with color matching.",
    category: "puzzle",
    platform: "html5",
    coverUrl: "/images/hextris.png",
    html5Url: "https://hextris.github.io/hextris/",
    year: 2014,
    developer: "Logan Engstrom",
    players: 1,
    rating: 4.3,
    tags: ["puzzle", "fast", "reaction"],
  },
  {
    id: "tetris-html5",
    title: "Tetris Online",
    description:
      "The official Tetris — same great game, direct in your browser.",
    category: "puzzle",
    platform: "html5",
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/en/7/7d/Tetris_NES_cover.jpg",
    html5Url: "https://tetris.com/play-tetris",
    year: 1984,
    developer: "Tetris Company",
    players: 1,
    rating: 4.8,
    tags: ["puzzle", "classic", "blocks"],
  },
  {
    id: "pacman-html5",
    title: "Pac-Man",
    description: "Eat dots, dodge ghosts. The original arcade maze game.",
    category: "arcade",
    platform: "html5",
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Pacman.svg/800px-Pacman.svg.png",
    html5Url: "https://pacman.live/",
    year: 1980,
    developer: "Namco",
    players: 1,
    rating: 4.9,
    tags: ["arcade", "classic", "maze"],
  },
  {
    id: "sudoku",
    title: "Sudoku",
    description: "Fill the 9×9 grid so every row, column, and box has 1–9.",
    category: "puzzle",
    platform: "html5",
    coverUrl: "/images/sudoku.png",
    html5Url: "https://sudoku.com/",
    year: 2004,
    developer: "Various",
    players: 1,
    rating: 4.4,
    tags: ["puzzle", "numbers", "logic"],
  },
];

export const STORAGE_KEYS = {
  saveStates: "litlabs-game-saves",
  lastPlayed: "litlabs-game-last",
  favorites: "litlabs-game-favs",
};

export function loadSaveStates(gameId: string): SaveState[] {
  if (typeof window === "undefined") return [];
  try {
    const allSaves = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.saveStates) || "{}",
    );
    return allSaves[gameId] || [];
  } catch {
    return [];
  }
}

export function saveGameState(
  gameId: string,
  state: Omit<SaveState, "id" | "createdAt">,
): void {
  if (typeof window === "undefined") return;
  try {
    const allSaves = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.saveStates) || "{}",
    );
    const gameSaves = allSaves[gameId] || [];
    const newSave: SaveState = {
      ...state,
      id: `save_${Date.now()}`,
      createdAt: Date.now(),
    };
    allSaves[gameId] = [...gameSaves, newSave].slice(-5); // Keep last 5 saves
    localStorage.setItem(STORAGE_KEYS.saveStates, JSON.stringify(allSaves));
  } catch {
    // Ignore storage errors
  }
}

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites) || "[]");
  } catch {
    return [];
  }
}

export function toggleFavorite(gameId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const favs = getFavorites();
    const isFav = favs.includes(gameId);
    const newFavs = isFav
      ? favs.filter((id) => id !== gameId)
      : [...favs, gameId];
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(newFavs));
    return !isFav;
  } catch {
    return false;
  }
}

export function getGamesByCategory(category: GameCategory): Game[] {
  return GAME_LIBRARY.filter((g) => g.category === category);
}

export function getGamesByPlatform(platform: GamePlatform): Game[] {
  return GAME_LIBRARY.filter((g) => g.platform === platform);
}

export function searchGames(query: string): Game[] {
  const q = query.toLowerCase();
  return GAME_LIBRARY.filter(
    (g) =>
      g.title.toLowerCase().includes(q) ||
      g.description.toLowerCase().includes(q) ||
      g.tags.some((t) => t.toLowerCase().includes(q)),
  );
}

export function getGameById(id: string): Game | undefined {
  return GAME_LIBRARY.find((g) => g.id === id);
}
