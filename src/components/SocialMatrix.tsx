"use client";

import React, { useState, useEffect } from 'react';
import PostCard from './PostCard';

interface Post {
  id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  media_url?: string;
  created_at: string;
  likes_count: number;
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
    <div className="w-full">
      {/* Post Creator */}
      <div className="card-cyber p-8 bg-zinc-950/40 border-orange-500/10 mb-10 group relative">
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-orange-500/40" />
        <textarea 
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Inject neural directive into the stream..."
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

      {/* Feed Stream */}
      <div className="flex flex-col gap-0">
        {loading ? (
          <div className="text-center py-20">
             <div className="text-sm font-black uppercase tracking-[0.4em] text-zinc-800 animate-pulse">Syncing_Neural_Archives...</div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-zinc-800 font-black uppercase tracking-widest text-xs">No transmissions detected.</div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}
