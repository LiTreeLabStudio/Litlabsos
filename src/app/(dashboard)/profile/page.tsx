"use client";
import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

/* ══════════════════════════════════════════════════
   TYPES & CONSTANTS
══════════════════════════════════════════════════ */
interface ProfileData {
  name: string;
  avatarUrl: string;
  coverUrl: string;
  bio: string;
  location: string;
  website: string;
  mood: string;
  interests: string[];
  musicLinks: { platform: "spotify" | "youtube" | "soundcloud" | "apple"; url: string; label: string }[];
  videoLinks: { platform: "youtube" | "vimeo"; url: string; label: string }[];
  socialLinks: { platform: "twitter" | "discord" | "github" | "instagram" | "linkedin"; url: string; label: string }[];
  badges: string[];
  friendCount: number;
  profileViews: number;
  agentCount: number;
}

const EMOJI_MOODS = ["😊", "😎", "🚀", "🔥", "💪", "🎮", "🎯", "🌟", "💡", "🎭", "🤖", "⚡"];
const INTEREST_OPTIONS = ["AI", "Coding", "Music", "Gaming", "Design", "Writing", "Crypto", "Fitness", "Art", "Photography", "Movies", "Travel", "Cooking", "Reading", "Podcasts", "Sports"];
const BADGE_OPTIONS = ["Early Adopter", "Agent Builder", "Community Star", "Open Source", "Pro Member", "Top Contributor", "Viral Post", "Power User"];

/* ══════════════════════════════════════════════════
   IMAGE UPLOAD COMPONENT
══════════════════════════════════════════════════ */
function ImageUpload({
  currentUrl,
  onUpload,
  label,
  aspectRatio = "aspect-square",
}: {
  currentUrl: string;
  onUpload: (url: string) => void;
  label: string;
  aspectRatio?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "profile");
    try {
      const res = await fetch("/api/upload", { method: "POST", credentials: "include", body: formData });
      const data = await res.json();
      if (data.url) onUpload(data.url);
    } catch { /* ignore */ }
    setUploading(false);
  }, [onUpload]);

  return (
    <div
      className={`relative ${aspectRatio} rounded-xl border-2 border-dashed cursor-pointer transition-all overflow-hidden group`}
      style={{ borderColor: dragging ? "var(--accent)" : "rgba(255,255,255,0.15)" }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
      onClick={() => inputRef.current?.click()}
    >
      {currentUrl ? (
        <img src={currentUrl} alt={label} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-white/5">
          <span className="text-4xl opacity-40">{uploading ? "⏳" : "📷"}</span>
          <span className="text-xs text-white/50 font-bold uppercase tracking-widest">{uploading ? "UPLOADING..." : label}</span>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <span className="text-xs font-bold uppercase tracking-widest text-white">{currentUrl ? "REPLACE" : "UPLOAD"}</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MUSIC PLAYER COMPONENT
══════════════════════════════════════════════════ */
function MusicPlayer({ links }: { links: ProfileData["musicLinks"] }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const platformIcon: Record<string, string> = {
    spotify: "🎵",
    youtube: "🎬",
    soundcloud: "☁️",
    apple: "🍎",
  };

  return (
    <div className="rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
          <span>🎧</span> MUSIC PLAYER
        </h3>
        <button
          onClick={() => setPlaying(!playing)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110"
          style={{ background: playing ? "var(--accent)" : "rgba(255,255,255,0.1)", color: playing ? "#000" : "#fff" }}
        >
          {playing ? "⏸" : "▶"}
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-4">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: "var(--accent)" }} />
      </div>

      {/* Track info */}
      <div className="text-center mb-4">
        <p className="text-sm font-bold uppercase tracking-tight">{links[0]?.label || "No track selected"}</p>
        <p className="text-xs text-text-muted">{links[0]?.platform.toUpperCase() || "Select music below"}</p>
      </div>

      {/* Music links */}
      {links.length > 0 ? (
        <div className="space-y-2">
          {links.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <span className="text-xl">{platformIcon[link.platform]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold uppercase tracking-tight truncate">{link.label}</p>
                <p className="text-[10px] text-text-muted">{link.platform}</p>
              </div>
              <span className="text-xs text-text-muted">▶</span>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-xs text-text-muted text-center py-4 opacity-50">No music linked yet. Add your favorites below!</p>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   VIDEO GALLERY COMPONENT
══════════════════════════════════════════════════ */
function VideoGallery({ links }: { links: ProfileData["videoLinks"] }) {
  const getEmbedUrl = (url: string) => {
    // Handle YouTube
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    // Handle Vimeo
    const vmMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vmMatch) return `https://player.vimeo.com/video/${vmMatch[1]}`;
    return url;
  };

  return (
    <div className="rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2 mb-4">
        <span>🎬</span> VIDEO GALLERY
      </h3>

      {links.length > 0 ? (
        <div className="space-y-3">
          {links.map((link, i) => (
            <div key={i} className="rounded-lg overflow-hidden border border-white/10">
              <div className="aspect-video">
                <iframe
                  src={getEmbedUrl(link.url)}
                  className="w-full h-full"
                  allowFullScreen
                  title={link.label}
                />
              </div>
              <div className="p-2 bg-white/5">
                <p className="text-xs font-bold">{link.label}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-text-muted text-center py-8 opacity-50">No videos linked. Embed YouTube or Vimeo!</p>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   COMMENT SECTION (MySpace style)
══════════════════════════════════════════════════ */
interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
}

function CommentSection({ comments, onAdd }: { comments: Comment[]; onAdd: (text: string) => void }) {
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);

  const handlePost = async () => {
    if (!newComment.trim()) return;
    setPosting(true);
    await onAdd(newComment);
    setNewComment("");
    setPosting(false);
  };

  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/10 p-6">
      <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2 mb-6">
        <span>💬</span> COMMENT WALL <span className="ml-2 text-[10px] opacity-50">({comments.length})</span>
      </h3>

      {/* Add comment */}
      <div className="flex gap-3 mb-6 pb-6 border-b border-white/10">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent)] to-purple-500 flex items-center justify-center text-sm font-bold shrink-0">ME</div>
        <div className="flex-1">
          <textarea
            className="input w-full min-h-[60px] text-sm"
            placeholder="Leave a comment on this profile..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] text-text-muted">{newComment.length}/500</span>
            <button className="btn-primary px-6 py-2 text-xs" onClick={handlePost} disabled={posting || !newComment.trim()}>
              {posting ? "POSTING..." : "POST COMMENT"}
            </button>
          </div>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-lg shrink-0">{c.avatar}</div>
            <div className="flex-1 bg-white/[0.03] rounded-lg p-4 border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold">{c.author}</span>
                <span className="text-[10px] text-text-muted">{c.timestamp}</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{c.text}</p>
              <div className="flex gap-4 mt-3">
                <button className="text-[10px] font-bold text-text-muted hover:text-[var(--accent)] uppercase tracking-widest">LIKE</button>
                <button className="text-[10px] font-bold text-text-muted hover:text-white uppercase tracking-widest">REPLY</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   EDIT MODAL
══════════════════════════════════════════════════ */
function EditModal({
  profile,
  onSave,
  onClose,
}: {
  profile: ProfileData;
  onSave: (data: Partial<ProfileData>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<ProfileData>(profile);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  };

  const addMusicLink = () => {
    setForm({ ...form, musicLinks: [...form.musicLinks, { platform: "spotify", url: "", label: "New Track" }] });
  };

  const addVideoLink = () => {
    setForm({ ...form, videoLinks: [...form.videoLinks, { platform: "youtube", url: "", label: "New Video" }] });
  };

  const addSocialLink = () => {
    setForm({ ...form, socialLinks: [...form.socialLinks, { platform: "twitter", url: "", label: "Handle" }] });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/20 p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl font-bold uppercase tracking-tight">EDIT PROFILE</h2>
          <button onClick={onClose} className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">✕</button>
        </div>

        <div className="space-y-8">
          {/* Avatar & Cover */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2 block">AVATAR</label>
              <ImageUpload currentUrl={form.avatarUrl} onUpload={(url) => setForm({ ...form, avatarUrl: url })} label="Upload Avatar" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2 block">COVER IMAGE</label>
              <ImageUpload currentUrl={form.coverUrl} onUpload={(url) => setForm({ ...form, coverUrl: url })} label="Upload Cover" aspectRatio="aspect-[3/1]" />
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2 block">DISPLAY NAME</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2 block">BIO</label>
              <textarea className="input min-h-[100px]" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} maxLength={300} />
              <p className="text-right text-[10px] text-text-muted mt-1">{form.bio.length}/300</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2 block">LOCATION</label>
                <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, Country" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2 block">MOOD</label>
                <div className="flex gap-2 flex-wrap">
                  {EMOJI_MOODS.map((m) => (
                    <button key={m} onClick={() => setForm({ ...form, mood: m })} className={`w-10 h-10 rounded-lg text-xl transition-all ${form.mood === m ? "bg-[var(--accent)] scale-110" : "bg-white/5 hover:bg-white/10"}`}>{m}</button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2 block">WEBSITE</label>
              <input className="input" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://yoursite.com" />
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3 block">INTERESTS</label>
            <div className="flex gap-2 flex-wrap">
              {INTEREST_OPTIONS.map((opt) => (
                <button key={opt} onClick={() => {
                  const interests = form.interests.includes(opt) ? form.interests.filter(i => i !== opt) : [...form.interests, opt];
                  setForm({ ...form, interests });
                }} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${form.interests.includes(opt) ? "bg-[var(--accent)] text-black" : "bg-white/5 text-text-muted hover:bg-white/10"}`}>{opt}</button>
              ))}
            </div>
          </div>

          {/* Music Links */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3 block">MUSIC LINKS</label>
            <div className="space-y-3">
              {form.musicLinks.map((link, i) => (
                <div key={i} className="flex gap-2">
                  <select className="input w-32" value={link.platform} onChange={(e) => {
                    const links = [...form.musicLinks]; links[i] = { ...links[i], platform: e.target.value as any }; setForm({ ...form, musicLinks: links });
                  }}>
                    <option value="spotify">Spotify</option>
                    <option value="youtube">YouTube</option>
                    <option value="soundcloud">SoundCloud</option>
                    <option value="apple">Apple Music</option>
                  </select>
                  <input className="input flex-1" value={link.url} onChange={(e) => {
                    const links = [...form.musicLinks]; links[i] = { ...links[i], url: e.target.value }; setForm({ ...form, musicLinks: links });
                  }} placeholder="https://..." />
                  <input className="input w-32" value={link.label} onChange={(e) => {
                    const links = [...form.musicLinks]; links[i] = { ...links[i], label: e.target.value }; setForm({ ...form, musicLinks: links });
                  }} placeholder="Track name" />
                  <button onClick={() => setForm({ ...form, musicLinks: form.musicLinks.filter((_, j) => j !== i) })} className="px-3 text-red-400 hover:text-red-300">✕</button>
                </div>
              ))}
              <button onClick={addMusicLink} className="btn-secondary text-xs px-4 py-2">+ ADD MUSIC</button>
            </div>
          </div>

          {/* Video Links */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3 block">VIDEO LINKS</label>
            <div className="space-y-3">
              {form.videoLinks.map((link, i) => (
                <div key={i} className="flex gap-2">
                  <select className="input w-32" value={link.platform} onChange={(e) => {
                    const links = [...form.videoLinks]; links[i] = { ...links[i], platform: e.target.value as any }; setForm({ ...form, videoLinks: links });
                  }}>
                    <option value="youtube">YouTube</option>
                    <option value="vimeo">Vimeo</option>
                  </select>
                  <input className="input flex-1" value={link.url} onChange={(e) => {
                    const links = [...form.videoLinks]; links[i] = { ...links[i], url: e.target.value }; setForm({ ...form, videoLinks: links });
                  }} placeholder="https://..." />
                  <input className="input w-32" value={link.label} onChange={(e) => {
                    const links = [...form.videoLinks]; links[i] = { ...links[i], label: e.target.value }; setForm({ ...form, videoLinks: links });
                  }} placeholder="Video title" />
                  <button onClick={() => setForm({ ...form, videoLinks: form.videoLinks.filter((_, j) => j !== i) })} className="px-3 text-red-400 hover:text-red-300">✕</button>
                </div>
              ))}
              <button onClick={addVideoLink} className="btn-secondary text-xs px-4 py-2">+ ADD VIDEO</button>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3 block">SOCIAL LINKS</label>
            <div className="space-y-3">
              {form.socialLinks.map((link, i) => (
                <div key={i} className="flex gap-2">
                  <select className="input w-32" value={link.platform} onChange={(e) => {
                    const links = [...form.socialLinks]; links[i] = { ...links[i], platform: e.target.value as any }; setForm({ ...form, socialLinks: links });
                  }}>
                    <option value="twitter">X / Twitter</option>
                    <option value="discord">Discord</option>
                    <option value="github">GitHub</option>
                    <option value="instagram">Instagram</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                  <input className="input flex-1" value={link.url} onChange={(e) => {
                    const links = [...form.socialLinks]; links[i] = { ...links[i], url: e.target.value }; setForm({ ...form, socialLinks: links });
                  }} placeholder="https://..." />
                  <button onClick={() => setForm({ ...form, socialLinks: form.socialLinks.filter((_, j) => j !== i) })} className="px-3 text-red-400 hover:text-red-300">✕</button>
                </div>
              ))}
              <button onClick={addSocialLink} className="btn-secondary text-xs px-4 py-2">+ ADD SOCIAL LINK</button>
            </div>
          </div>

          {/* Badges */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3 block">BADGES</label>
            <div className="flex gap-2 flex-wrap">
              {BADGE_OPTIONS.map((badge) => (
                <button key={badge} onClick={() => {
                  const badges = form.badges.includes(badge) ? form.badges.filter(b => b !== badge) : [...form.badges, badge];
                  setForm({ ...form, badges });
                }} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${form.badges.includes(badge) ? "bg-[var(--accent)] text-black" : "bg-white/5 text-text-muted hover:bg-white/10"}`}>{badge}</button>
              ))}
            </div>
          </div>

          <button onClick={handleSave} className="btn-primary w-full py-4 text-sm font-bold uppercase tracking-widest" disabled={saving}>
            {saving ? "SAVING..." : "SAVE PROFILE"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN PROFILE PAGE
══════════════════════════════════════════════════ */
export default function ProfilePage() {
  const { user } = useAuth();
  const { accentColor, setAccentColor } = useTheme();

  const [profile, setProfile] = useState<ProfileData>({
    name: user?.name || "Your Name",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=litlabs",
    coverUrl: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1200&h=400&fit=crop",
    bio: "Building the future of AI agents. LitLabs lets anyone create, customize, and deploy AI agents — no coding required.",
    location: "San Francisco, CA",
    website: "https://yoursite.com",
    mood: "🚀",
    interests: ["AI", "Coding", "Design"],
    musicLinks: [
      { platform: "spotify", url: "https://open.spotify.com/track/example", label: "Coding Vibes" },
      { platform: "youtube", url: "https://www.youtube.com/watch?v=example", label: "Lo-Fi Beats" },
    ],
    videoLinks: [
      { platform: "youtube", url: "https://www.youtube.com/watch?v=example", label: "My Introduction Video" },
    ],
    socialLinks: [
      { platform: "twitter", url: "https://x.com/yourhandle", label: "@yourhandle" },
      { platform: "github", url: "https://github.com/yourhandle", label: "yourhandle" },
    ],
    badges: ["Early Adopter", "Agent Builder"],
    friendCount: 42,
    profileViews: 133742,
    agentCount: 6,
  });

  const [comments] = useState<Comment[]>([
    { id: "1", author: "CodeWizard42", avatar: "🧙", text: "Director agent is INSANE. Automated my entire deployment pipeline 🔥", timestamp: "2 hours ago" },
    { id: "2", author: "PixelQueen", avatar: "👸", text: "Just built my first agent in 5 minutes. This is the future fr fr", timestamp: "5 hours ago" },
    { id: "3", author: "DataNinja", avatar: "🥷", text: "Data Slayer predicted my sales with 94% accuracy. I'm shook.", timestamp: "1 day ago" },
    { id: "4", author: "SocialButterfly", avatar: "🦋", text: "Social Dominator grew my following by 300% in a week. LEGENDARY.", timestamp: "2 days ago" },
  ]);

  const [editing, setEditing] = useState(false);

  const handleSaveProfile = async (data: Partial<ProfileData>) => {
    setProfile({ ...profile, ...data });
    // TODO: Save to API
  };

  const handleAddComment = async (text: string) => {
    // TODO: Save to API
    console.log("New comment:", text);
  };

  const handleAddInterest = (interest: string) => {
    if (!profile.interests.includes(interest)) {
      setProfile({ ...profile, interests: [...profile.interests, interest] });
    }
  };

  const socialIcon: Record<string, string> = {
    twitter: "🐦", github: "💻", discord: "🎮", instagram: "📷", linkedin: "💼",
  };

  return (
    <div className="min-h-screen pb-20">
      {/* ═══ COVER IMAGE ═══ */}
      <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden">
        <img src={profile.coverUrl} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 flex gap-2">
          <button onClick={() => setEditing(true)} className="btn-primary px-6 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <span>✏️</span> EDIT PROFILE
          </button>
          <button className="btn-secondary px-6 py-2 text-xs font-bold uppercase tracking-widest">SHARE</button>
        </div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 -mt-16 relative z-10">

          {/* ═══ LEFT SIDEBAR (Profile Card) ═══ */}
          <div className="lg:w-80 shrink-0 space-y-6">

            {/* Profile Card */}
            <div className="card bg-gradient-to-br from-white/[0.08] to-white/[0.02] border-white/10 p-6 text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <img src={profile.avatarUrl} alt={profile.name} className="w-32 h-32 rounded-2xl border-4 object-cover mx-auto" style={{ borderColor: "var(--accent)" }} />
                <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-black" title="Online" />
              </div>

              <h1 className="font-heading text-2xl font-bold uppercase tracking-tight mb-1">{profile.name}</h1>
              <p className="text-xs text-text-muted mb-2">{profile.location}</p>

              {/* Mood */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-2xl">{profile.mood}</span>
                <span className="text-sm text-text-secondary">Feeling {profile.mood}</span>
              </div>

              {/* Website */}
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--accent)] hover:underline mb-4 block truncate">
                  🌐 {profile.website}
                </a>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-white/10">
                <div className="text-center">
                  <div className="font-heading text-2xl font-bold text-[var(--accent)]">{profile.friendCount}</div>
                  <div className="text-[10px] text-text-muted uppercase tracking-widest">FRIENDS</div>
                </div>
                <div className="text-center">
                  <div className="font-heading text-2xl font-bold text-[var(--accent)]">{profile.profileViews.toLocaleString()}</div>
                  <div className="text-[10px] text-text-muted uppercase tracking-widest">VIEWS</div>
                </div>
                <div className="text-center">
                  <div className="font-heading text-2xl font-bold text-[var(--accent)]">{profile.agentCount}</div>
                  <div className="text-[10px] text-text-muted uppercase tracking-widest">AGENTS</div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2 mt-6">
                <button className="btn-primary px-6 py-3 text-xs font-bold uppercase tracking-widest w-full">MESSAGE</button>
                <button className="btn-secondary px-6 py-3 text-xs font-bold uppercase tracking-widest w-full">ADD FRIEND</button>
              </div>
            </div>

            {/* Bio */}
            <div className="card p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2 mb-4">
                <span>📝</span> ABOUT ME
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">{profile.bio}</p>
            </div>

            {/* Interests */}
            <div className="card p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2 mb-4">
                <span>🎯</span> INTERESTS
              </h3>
              <div className="flex gap-2 flex-wrap">
                {profile.interests.map((interest) => (
                  <span key={interest} className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30">{interest}</span>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="card p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2 mb-4">
                <span>🔗</span> CONNECT
              </h3>
              <div className="space-y-2">
                {profile.socialLinks.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <span className="text-xl">{socialIcon[link.platform]}</span>
                    <span className="text-xs font-bold">{link.platform.toUpperCase()}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="card p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2 mb-4">
                <span>🏆</span> BADGES
              </h3>
              <div className="flex gap-2 flex-wrap">
                {profile.badges.map((badge) => (
                  <span key={badge} className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30">{badge}</span>
                ))}
              </div>
            </div>
          </div>

          {/* ═══ MAIN CONTENT AREA ═══ */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Status Update */}
            <div className="card p-6">
              <div className="flex gap-3">
                <img src={profile.avatarUrl} alt="You" className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="flex gap-2 mb-2">
                    <button className="px-4 py-2 rounded-lg text-xs font-bold bg-white/5 text-text-muted hover:bg-white/10 transition-colors">📝 POST STATUS</button>
                    <button className="px-4 py-2 rounded-lg text-xs font-bold bg-white/5 text-text-muted hover:bg-white/10 transition-colors">📷 ADD PHOTO</button>
                    <button className="px-4 py-2 rounded-lg text-xs font-bold bg-white/5 text-text-muted hover:bg-white/10 transition-colors">🎥 ADD VIDEO</button>
                  </div>
                  <textarea className="input w-full min-h-[60px]" placeholder={`What's on your mind, ${profile.name}?`} />
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex gap-2">
                      <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">😊</button>
                      <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">📍</button>
                      <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">📷</button>
                    </div>
                    <button className="btn-primary px-6 py-2 text-xs font-bold uppercase tracking-widest">POST</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Music Player */}
            {profile.musicLinks.length > 0 && <MusicPlayer links={profile.musicLinks} />}

            {/* Photo Gallery */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
                  <span>📸</span> PHOTO GALLERY
                </h3>
                <button className="text-xs font-bold text-text-muted hover:text-white uppercase tracking-widest">VIEW ALL →</button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="aspect-square rounded-lg bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center text-2xl hover:scale-105 transition-transform cursor-pointer border border-white/5">
                    {["🎯", "🏆", "👨‍💻", "🎭", "📊", "✍️", "🔥", "⚡", "🎮", "🎨", "🚀", "💎"][i]}
                  </div>
                ))}
              </div>
              <button className="btn-secondary w-full mt-4 py-3 text-xs font-bold uppercase tracking-widest">+ ADD PHOTOS</button>
            </div>

            {/* Video Gallery */}
            {profile.videoLinks.length > 0 && <VideoGallery links={profile.videoLinks} />}

            {/* My Agents */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
                  <span>🤖</span> MY AGENTS
                </h3>
                <button className="text-xs font-bold text-text-muted hover:text-white uppercase tracking-widest">BROWSE →</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: "🎯", name: "Director", status: "online" },
                  { icon: "🏆", name: "Champion", status: "online" },
                  { icon: "👨‍💻", name: "Code Champ", status: "online" },
                  { icon: "🎭", name: "Social Dom", status: "away" },
                ].map((agent) => (
                  <div key={agent.name} className="rounded-xl bg-white/5 p-4 text-center hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                    <div className="text-4xl mb-3">{agent.icon}</div>
                    <div className="font-bold text-sm uppercase tracking-tight">{agent.name}</div>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span className={`w-2 h-2 rounded-full ${agent.status === "online" ? "bg-green-500" : "bg-yellow-500"}`} />
                      <span className="text-[10px] text-text-muted uppercase tracking-widest">{agent.status.toUpperCase()}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-primary w-full mt-4 py-3 text-xs font-bold uppercase tracking-widest">+ BUILD NEW AGENT</button>
            </div>

            {/* Comments */}
            <CommentSection comments={comments} onAdd={handleAddComment} />

          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <EditModal profile={profile} onSave={handleSaveProfile} onClose={() => setEditing(false)} />
      )}
    </div>
  );
}