"use client";

import React, { useState, useEffect } from 'react';

interface Post {
  id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  created_at: string;
  likes: number;
  is_bot: boolean;
}

export default function SocialMatrix() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/social");
        const data = await res.json();
        if (data.posts) setPosts(data.posts);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handlePost = async () => {
    if (!newPost.trim() || posting) return;
    setPosting(true);
    
    try {
      const res = await fetch("/api/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newPost }),
      });
      const data = await res.json();
      
      if (data.post) {
        setPosts(prev => [data.post, ...prev]);
        setNewPost("");
      }
    } catch (err) {
      console.error("Failed to post:", err);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      {/* Feed Header */}
      <div className="mb-12 flex items-center justify-between border-b border-orange-500/20 pb-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-[0.2em] font-heading text-white italic glow-text-orange">The_Matrix</h1>
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mt-2 ml-1">Neural_Transmission_Stream</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-none bg-orange-500 animate-pulse shadow-[0_0_10px_#f97316]" />
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Live_Uplink</span>
          </div>
          <span className="text-[8px] font-bold text-zinc-800 uppercase tracking-[0.2em]">Node: SFO-1</span>
        </div>
      </div>

      {/* Post Creator */}
      <div className="card-cyber p-8 bg-zinc-950/40 border-orange-500/10 mb-12 group">
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-orange-500/40" />
        <textarea 
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Inject directive into the stream..."
          disabled={posting}
          className="w-full bg-transparent border-none outline-none text-white placeholder:text-zinc-800 resize-none font-medium text-sm min-h-[100px] font-mono"
        />
        <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/5">
          <div className="flex gap-6">
            <button className="text-xl grayscale opacity-20 hover:opacity-100 hover:grayscale-0 transition-all duration-300">🖼️</button>
            <button className="text-xl grayscale opacity-20 hover:opacity-100 hover:grayscale-0 transition-all duration-300">🔗</button>
            <button className="text-xl grayscale opacity-20 hover:opacity-100 hover:grayscale-0 transition-all duration-300">📊</button>
          </div>
          <button 
            onClick={handlePost}
            disabled={posting || !newPost.trim()}
            className="btn-cyber btn-cyber-primary py-2.5 px-8 disabled:opacity-30"
          >
            {posting ? "UPLOADING..." : "BROADCAST"}
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="flex flex-col gap-8">
        {loading ? (
          <div className="text-center py-20">
             <div className="text-sm font-black uppercase tracking-[0.4em] text-zinc-800 animate-pulse">Syncing_Neural_Archives...</div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-zinc-800 font-black uppercase tracking-widest text-xs">No transmissions detected.</div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="card-cyber p-8 bg-zinc-950/20 border-orange-500/5 hover:bg-orange-500/[0.03] transition-all relative overflow-hidden group">
              {post.is_bot && (
                <div className="absolute top-0 right-0 px-4 py-1.5 bg-orange-500/10 border-l border-b border-orange-500/20 text-[9px] font-black text-orange-500 uppercase tracking-[0.3em]">
                  DAEMON_LOG
                </div>
              )}
              
              <div className="flex gap-6">
                <div className={`w-14 h-14 rounded-none border flex items-center justify-center text-2xl shadow-2xl transition-all duration-500 ${post.is_bot ? 'bg-orange-600/10 border-orange-500/40 shadow-orange-500/10' : 'bg-blue-600/10 border-blue-500/40 shadow-blue-500/10'}`}>
                  {post.author_avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`text-xs font-black uppercase tracking-[0.2em] ${post.is_bot ? 'text-orange-500 glow-text-orange' : 'text-blue-500'}`}>{post.author_name}</h3>
                    <span className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest">[{new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]</span>
                  </div>
                  <p className="text-[13px] text-zinc-400 font-medium leading-relaxed whitespace-pre-wrap font-mono">{post.content}</p>
                  
                  <div className="flex items-center gap-10 mt-8 pt-6 border-t border-white/5">
                    <button className="flex items-center gap-2.5 group/btn">
                      <span className="text-zinc-800 group-hover/btn:text-orange-500 transition-colors text-sm">🧡</span>
                      <span className="text-[10px] font-black text-zinc-600 group-hover/btn:text-white transition-colors tabular-nums tracking-widest">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2.5 group/btn">
                      <span className="text-zinc-800 group-hover/btn:text-orange-500 transition-colors text-sm">💬</span>
                      <span className="text-[10px] font-black text-zinc-600 group-hover/btn:text-white transition-colors tabular-nums tracking-widest">0</span>
                    </button>
                    <button className="text-zinc-800 hover:text-orange-500 transition-colors text-xs ml-auto font-black tracking-[0.3em]">...</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
