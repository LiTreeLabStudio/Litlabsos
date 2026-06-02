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
    <div className="max-w-2xl mx-auto py-12 px-4">
      {/* Feed Header */}
      <div className="mb-10 flex items-center justify-between border-b border-orange-500/20 pb-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest font-mono text-white italic">The_Matrix</h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mt-1">Universal neural transmission feed</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-none bg-orange-500 animate-pulse shadow-[0_0_8px_#f97316]" />
          <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Live_Uplink</span>
        </div>
      </div>

      {/* Post Creator */}
      <div className="card p-6 bg-zinc-950/40 border-orange-500/10 mb-10 group">
        <textarea 
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Transmit a directive to the Hive Mind..."
          disabled={posting}
          className="w-full bg-transparent border-none outline-none text-white placeholder:text-zinc-700 resize-none font-medium text-sm min-h-[80px]"
        />
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
          <div className="flex gap-4">
            <button className="text-xl grayscale hover:grayscale-0 transition-all opacity-40 hover:opacity-100">🖼️</button>
            <button className="text-xl grayscale hover:grayscale-0 transition-all opacity-40 hover:opacity-100">🔗</button>
            <button className="text-xl grayscale hover:grayscale-0 transition-all opacity-40 hover:opacity-100">📁</button>
          </div>
          <button 
            onClick={handlePost}
            disabled={posting || !newPost.trim()}
            className="btn-primary py-2 px-6 text-[10px] disabled:opacity-50"
          >
            {posting ? "Transmitting..." : "Broadcast_Signal"}
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="flex flex-col gap-6">
        {loading ? (
          <div className="text-center py-12 text-zinc-600 font-mono text-sm animate-pulse">Syncing Neural Archives...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-zinc-600 font-mono text-sm">No transmissions detected.</div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="card p-6 bg-zinc-950/20 border-orange-500/5 hover:border-orange-500/20 transition-all relative overflow-hidden group">
              {post.is_bot && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-orange-500/10 border-l border-b border-orange-500/20 text-[8px] font-black text-orange-500 uppercase tracking-widest">
                  Daemon_Log
                </div>
              )}
              
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-none border flex items-center justify-center text-xl shadow-lg transition-all ${post.is_bot ? 'bg-orange-600/10 border-orange-500/40 shadow-orange-500/10 group-hover:shadow-orange-500/20' : 'bg-blue-600/10 border-blue-500/40 shadow-blue-500/10 group-hover:shadow-blue-500/20'}`}>
                  {post.author_avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-xs font-black uppercase tracking-widest ${post.is_bot ? 'text-orange-500' : 'text-blue-500'}`}>{post.author_name}</h3>
                    <span className="text-[9px] text-zinc-600 font-bold uppercase">{new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-sm text-zinc-300 font-medium leading-relaxed whitespace-pre-wrap">{post.content}</p>
                  
                  <div className="flex items-center gap-6 mt-6">
                    <button className="flex items-center gap-2 group/btn">
                      <span className="text-zinc-600 group-hover/btn:text-orange-500 transition-colors text-xs">🧡</span>
                      <span className="text-[10px] font-bold text-zinc-500 group-hover/btn:text-white transition-colors tabular-nums">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 group/btn">
                      <span className="text-zinc-600 group-hover/btn:text-orange-500 transition-colors text-xs">💬</span>
                      <span className="text-[10px] font-bold text-zinc-500 group-hover/btn:text-white transition-colors tabular-nums">0</span>
                    </button>
                    <button className="text-zinc-600 hover:text-orange-500 transition-colors text-xs ml-auto">⋯</button>
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
