"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

/* ══════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════ */
interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    badge?: string;
  };
  content: string;
  image?: string;
  music?: { title: string; platform: string };
  video?: { title: string; thumbnail: string };
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  isLiked: boolean;
  isSaved: boolean;
}

interface Story {
  id: string;
  name: string;
  avatar: string;
  hasStory: boolean;
  isViewed: boolean;
}

/* ══════════════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════════════ */
const STORIES: Story[] = [
  { id: "1", name: "You", avatar: "🔥", hasStory: true, isViewed: false },
  { id: "2", name: "PixelQueen", avatar: "👸", hasStory: true, isViewed: false },
  { id: "3", name: "CodeWizard", avatar: "🧙", hasStory: true, isViewed: true },
  { id: "4", name: "DataNinja", avatar: "🥷", hasStory: false, isViewed: true },
  { id: "5", name: "SocialButterfly", avatar: "🦋", hasStory: true, isViewed: false },
  { id: "6", name: "LitTreeCeo", avatar: "🚀", hasStory: true, isViewed: true },
];

const POSTS: Post[] = [
  {
    id: "1",
    author: { name: "PixelQueen", avatar: "👸", badge: "Agent Builder" },
    content: "Just built my first AI agent in 5 minutes! The LitLabs builder is absolutely incredible. No coding required — just describe what you want and it handles the rest. 🚀 #AI #LitLabs #NoCode",
    likes: 42,
    comments: 8,
    shares: 3,
    timestamp: "2h ago",
    isLiked: false,
    isSaved: false,
  },
  {
    id: "2",
    author: { name: "CodeWizard42", avatar: "🧙", badge: "Early Adopter" },
    content: "Director agent is INSANE. Automated my entire deployment pipeline. It breaks down tasks, delegates to specialists, and puts everything together. This is the future! 🔥",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop",
    likes: 89,
    comments: 15,
    shares: 12,
    timestamp: "5h ago",
    isLiked: true,
    isSaved: true,
  },
  {
    id: "3",
    author: { name: "DataNinja", avatar: "🥷", badge: "Community Star" },
    content: "Data Slayer predicted my sales with 94% accuracy. The predictive analytics are next level. I've been using it for a week and already seeing results. 📊",
    music: { title: "Coding Vibes Playlist", platform: "spotify" },
    likes: 67,
    comments: 11,
    shares: 5,
    timestamp: "1d ago",
    isLiked: false,
    isSaved: true,
  },
  {
    id: "4",
    author: { name: "SocialButterfly", avatar: "🦋" },
    content: "Social Dominator grew my following by 300% in a week. It's like having a full-time social media manager that never sleeps. LEGENDARY. 🎭",
    video: { title: "How I grew 10K followers", thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=300&fit=crop" },
    likes: 134,
    comments: 22,
    shares: 18,
    timestamp: "2d ago",
    isLiked: true,
    isSaved: false,
  },
];

/* ══════════════════════════════════════════════════
   STORY CIRCLE COMPONENT
══════════════════════════════════════════════════ */
function StoriesRow() {
  return (
    <div className="card p-4 mb-6 overflow-hidden">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {STORIES.map((story) => (
          <div key={story.id} className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group">
            <div className={`w-16 h-16 rounded-full p-[3px] transition-all group-hover:scale-105 ${story.isViewed ? "bg-white/20" : "bg-gradient-to-br from-[var(--accent)] to-purple-500"}`}>
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-2xl">{story.avatar}</div>
            </div>
            <span className="text-[10px] font-bold text-text-muted group-hover:text-white transition-colors truncate w-16 text-center">{story.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   CREATE POST BOX
══════════════════════════════════════════════════ */
function CreatePostBox() {
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) return;
    setPosting(true);
    // TODO: Post to API
    await new Promise(r => setTimeout(r, 1000));
    setContent("");
    setPosting(false);
  };

  return (
    <div className="card p-6 mb-6">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent)] to-purple-500 flex items-center justify-center text-lg font-bold shrink-0">ME</div>
        <div className="flex-1">
          <textarea
            className="input w-full min-h-[80px] resize-none text-base"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={1000}
          />
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2">
              {[
                { icon: "📷", label: "Photo" },
                { icon: "🎥", label: "Video" },
                { icon: "🎵", label: "Music" },
                { icon: "📍", label: "Location" },
              ].map((item) => (
                <button key={item.label} className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-lg transition-colors" title={item.label}>
                  {item.icon}
                </button>
              ))}
            </div>
            <button className="btn-primary px-6 py-2 text-xs font-bold uppercase tracking-widest" onClick={handlePost} disabled={posting || !content.trim()}>
              {posting ? "POSTING..." : "POST"}
            </button>
          </div>
          <div className="text-right text-[10px] text-text-muted mt-2">{content.length}/1000</div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   POST CARD COMPONENT
══════════════════════════════════════════════════ */
function PostCard({ post, onLike, onSave }: { post: Post; onLike: (id: string) => void; onSave: (id: string) => void }) {
  const [liked, setLiked] = useState(post.isLiked);
  const [saved, setSaved] = useState(post.isSaved);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    onLike(post.id);
  };

  const handleSave = () => {
    setSaved(!saved);
    onSave(post.id);
  };

  return (
    <div className="card p-6 mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">{post.author.avatar}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">{post.author.name}</span>
            {post.author.badge && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[var(--accent)]/20 text-[var(--accent)] uppercase tracking-wider">{post.author.badge}</span>
            )}
          </div>
          <span className="text-xs text-text-muted">{post.timestamp}</span>
        </div>
        <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-lg transition-colors">⋯</button>
      </div>

      {/* Content */}
      <p className="text-sm text-text-secondary leading-relaxed mb-4">{post.content}</p>

      {/* Media */}
      {post.image && (
        <div className="rounded-xl overflow-hidden mb-4">
          <img src={post.image} alt="Post image" className="w-full h-auto" />
        </div>
      )}
      {post.music && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 mb-4">
          <span className="text-3xl">🎵</span>
          <div className="flex-1">
            <p className="text-sm font-bold">{post.music.title}</p>
            <p className="text-xs text-text-muted">{post.music.platform}</p>
          </div>
          <button className="w-10 h-10 rounded-full bg-[var(--accent)] text-black flex items-center justify-center">▶</button>
        </div>
      )}
      {post.video && (
        <div className="rounded-xl overflow-hidden mb-4 relative">
          <img src={post.video.thumbnail} alt="Video" className="w-full aspect-video object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <button className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-3xl hover:scale-110 transition-transform">▶</button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-xs font-bold">{post.video.title}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${liked ? "text-red-400" : "text-text-muted hover:bg-white/5"}`}>
          <span>{liked ? "❤️" : "🤍"}</span>
          <span className="text-xs font-bold">{likes}</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-text-muted hover:bg-white/5 transition-colors">
          <span>💬</span>
          <span className="text-xs font-bold">{post.comments}</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-text-muted hover:bg-white/5 transition-colors">
          <span>↗️</span>
          <span className="text-xs font-bold">{post.shares}</span>
        </button>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors">
          <span className={`text-lg transition-transform ${saved ? "scale-125" : "hover:scale-110"}`}>{saved ? "🔖" : "📤"}</span>
        </button>
      </div>

      {/* Quick Comment */}
      <div className="flex gap-3 mt-4 pt-4 border-t border-white/5">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm">ME</div>
        <div className="flex-1 flex gap-2">
          <input className="input flex-1 text-xs py-2" placeholder="Write a comment..." />
          <button className="btn-primary px-4 py-2 text-xs">SEND</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SIDEBAR WIDGET
══════════════════════════════════════════════════ */
function SidebarWidget({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="card p-6 mb-6">
      <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2 mb-4">
        <span>{icon}</span> {title}
      </h3>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SUGGESTED FRIENDS
══════════════════════════════════════════════════ */
const SUGGESTED_FRIENDS = [
  { name: "DevGuru", avatar: "👨‍💻", mutual: 12 },
  { name: "AIBoss", avatar: "🤖", mutual: 8 },
  { name: "TechQueen", avatar: "👑", mutual: 5 },
];

/* ══════════════════════════════════════════════════
   TRENDING TOPICS
══════════════════════════════════════════════════ */
const TRENDING = [
  { topic: "#AIAgents", posts: "2.4K posts" },
  { topic: "#LitLabs", posts: "1.8K posts" },
  { topic: "#NoCode", posts: "956 posts" },
  { topic: "#BuildIt", posts: "723 posts" },
];

/* ══════════════════════════════════════════════════
   MAIN FEED PAGE
══════════════════════════════════════════════════ */
export default function SocialFeedPage() {
  const [posts, setPosts] = useState(POSTS);
  const [feedFilter, setFeedFilter] = useState<"all" | "friends" | "agents">("all");

  const handleLike = (id: string) => {
    // TODO: Call API
    console.log("Liked:", id);
  };

  const handleSave = (id: string) => {
    // TODO: Call API
    console.log("Saved:", id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* ═══ LEFT SIDEBAR ═══ */}
        <div className="lg:w-72 shrink-0 space-y-6 hidden lg:block">

          {/* Profile Quick View */}
          <div className="card p-6 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-purple-500 flex items-center justify-center text-3xl font-bold mx-auto mb-4">ME</div>
            <h3 className="font-bold text-lg mb-1">You</h3>
            <p className="text-xs text-text-muted mb-4">AI Agent Builder</p>
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10">
              <div>
                <div className="font-heading text-xl font-bold text-[var(--accent)]">42</div>
                <div className="text-[9px] text-text-muted uppercase tracking-widest">FRIENDS</div>
              </div>
              <div>
                <div className="font-heading text-xl font-bold text-[var(--accent)]">12</div>
                <div className="text-[9px] text-text-muted uppercase tracking-widest">AGENTS</div>
              </div>
              <div>
                <div className="font-heading text-xl font-bold text-[var(--accent)]">133K</div>
                <div className="text-[9px] text-text-muted uppercase tracking-widest">VIEWS</div>
              </div>
            </div>
            <Link href="/profile" className="btn-secondary w-full mt-4 py-2 text-xs font-bold uppercase tracking-widest">VIEW PROFILE</Link>
          </div>

          {/* Suggested Friends */}
          <SidebarWidget title="People You May Know" icon="👥">
            <div className="space-y-4">
              {SUGGESTED_FRIENDS.map((f) => (
                <div key={f.name} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xl">{f.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{f.name}</p>
                    <p className="text-[10px] text-text-muted">{f.mutual} mutual friends</p>
                  </div>
                  <button className="btn-secondary px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest">ADD</button>
                </div>
              ))}
            </div>
            <button className="text-xs font-bold text-text-muted hover:text-white mt-4">SEE ALL</button>
          </SidebarWidget>

          {/* Trending */}
          <SidebarWidget title="Trending" icon="📈">
            <div className="space-y-3">
              {TRENDING.map((t) => (
                <div key={t.topic} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                  <p className="text-sm font-bold text-[var(--accent)]">{t.topic}</p>
                  <p className="text-[10px] text-text-muted">{t.posts}</p>
                </div>
              ))}
            </div>
          </SidebarWidget>
        </div>

        {/* ═══ MAIN FEED ═══ */}
        <div className="flex-1 min-w-0">

          {/* Feed Filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
            {([
              { id: "all", label: "🌐 ALL POSTS" },
              { id: "friends", label: "👥 FRIENDS" },
              { id: "agents", label: "🤖 AGENTS" },
            ] as const).map(f => (
              <button
                key={f.id}
                onClick={() => setFeedFilter(f.id)}
                className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                  feedFilter === f.id ? "bg-[var(--accent)] text-black" : "bg-white/5 text-text-muted hover:bg-white/10"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Stories */}
          <StoriesRow />

          {/* Create Post */}
          <CreatePostBox />

          {/* Posts */}
          <div>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onLike={handleLike} onSave={handleSave} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center py-8">
            <button className="btn-secondary px-8 py-3 text-xs font-bold uppercase tracking-widest">LOAD MORE</button>
          </div>
        </div>

        {/* ═══ RIGHT SIDEBAR ═══ */}
        <div className="lg:w-72 shrink-0 space-y-6 hidden xl:block">

          {/* Quick Links */}
          <SidebarWidget title="Quick Links" icon="🔗">
            <div className="space-y-2">
              {[
                { icon: "🛠", label: "Build Agent", href: "/builder" },
                { icon: "🏛", label: "Browse Gallery", href: "/gallery" },
                { icon: "💬", label: "Agent Chat", href: "/agent-chat" },
                { icon: "📊", label: "Analytics", href: "/dashboard" },
              ].map(link => (
                <Link key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <span className="text-xl">{link.icon}</span>
                  <span className="text-sm font-bold">{link.label}</span>
                </Link>
              ))}
            </div>
          </SidebarWidget>

          {/* Agent Showcase */}
          <SidebarWidget title="Top Agents" icon="🤖">
            <div className="space-y-3">
              {[
                { icon: "🎯", name: "Director", useCount: 1234 },
                { icon: "🏆", name: "Champion", useCount: 987 },
                { icon: "👨‍💻", name: "Code Champ", useCount: 856 },
              ].map(agent => (
                <div key={agent.name} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                  <span className="text-2xl">{agent.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{agent.name}</p>
                    <p className="text-[10px] text-text-muted">{agent.useCount.toLocaleString()} uses</p>
                  </div>
                  <button className="btn-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest">TRY</button>
                </div>
              ))}
            </div>
          </SidebarWidget>

          {/* Copyright */}
          <div className="text-center text-[10px] text-text-muted pt-4">
            <p>© 2026 LitLabs. All rights reserved.</p>
            <p className="mt-1">Made with 🔥 by LiTreeCeo</p>
          </div>
        </div>
      </div>
    </div>
  );
}