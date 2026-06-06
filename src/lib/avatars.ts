// AI-Generated Agent Avatar URLs via Pollinations.ai (free, instant, no API key)
// Each prompt is seeded for consistency — same prompt + seed = same image
// Art direction: retro synthwave cyberpunk hologram portraits

function avatarUrl(prompt: string, seed: number): string {
  const encoded = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=512&height=512&seed=${seed}&nologo=true`;
}

export const AGENT_AVATARS: Record<string, string> = {
  director: avatarUrl(
    "cyberpunk AI director hologram portrait, neon cyan and magenta, synthwave, detailed robotic face, dark background, retro futuristic, glowing eyes, cinematic lighting",
    1
  ),
  champion: avatarUrl(
    "golden robotic champion mascot portrait, glowing green eyes, synthwave style, cyberpunk, dark background, metallic armor, heroic pose, cinematic lighting",
    2
  ),
  "code-champion": avatarUrl(
    "cyberpunk programmer hologram portrait, neon pink, code streams floating around head, dark terminal background, retro futuristic, synthwave, cinematic lighting",
    3
  ),
  "writing-coach": avatarUrl(
    "elegant AI writer hologram portrait, neon pink, floating glowing pages around head, synthwave, dark background, sophisticated, cinematic lighting",
    4
  ),
  "research-guru": avatarUrl(
    "scientist AI hologram portrait, neon green, laboratory equipment floating, microscope, synthwave, dark background, goggles, cinematic lighting",
    5
  ),
  "support-agent": avatarUrl(
    "friendly AI support bot portrait, neon cyan, glowing headset, warm smile, synthwave, dark background, helpful expression, cinematic lighting",
    6
  ),
  "social-dominator": avatarUrl(
    "charismatic social media AI portrait, neon orange, viral icons floating around, megaphone, synthwave, dark background, confident expression, cinematic lighting",
    7
  ),
  "data-slayer": avatarUrl(
    "data scientist AI hologram portrait, neon purple, floating holographic charts and graphs, synthwave, dark background, analytical expression, cinematic lighting",
    8
  ),
  "pixel-forge": avatarUrl(
    "artist AI hologram portrait, neon cyan and rainbow, paint splashes floating, digital brush, synthwave, dark background, creative expression, cinematic lighting",
    9
  ),
  "music-producer": avatarUrl(
    "musician AI hologram portrait, neon gold, audio waves floating around, synthesizer keys, synthwave, dark background, headphones, cinematic lighting",
    10
  ),
  "legal-shield": avatarUrl(
    "legal AI hologram portrait, neon blue, scales of justice floating, law books, synthwave, dark background, serious expression, cinematic lighting",
    11
  ),
  "security-guru": avatarUrl(
    "cybersecurity AI hologram portrait, neon red, digital shield floating, binary code streams, synthwave, dark background, vigilant expression, cinematic lighting",
    12
  ),
  "ml-engineer": avatarUrl(
    "machine learning AI hologram portrait, neon purple, neural network nodes floating, glowing brain, synthwave, dark background, thoughtful expression, cinematic lighting",
    13
  ),
};

// Generic user avatar for mock data / comments
export function generateUserAvatar(name: string): string {
  const seed = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return avatarUrl(
    `portrait of a ${name}, synthwave cyberpunk style, neon colors, dark background, detailed face, cinematic lighting`,
    seed % 10000
  );
}
