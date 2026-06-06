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
      {/* Post Creator (Facebook style 'What's on your mind?') */}
      <div className="bg-zinc-950/80 border border-white/10 rounded-xl p-4 mb-6 shadow-lg">
        <div className="flex gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-zinc-900 border-2 border-orange-500 flex items-center justify-center text-lg shadow-[0_0_10px_rgba(249,115,22,0.2)] shrink-0">
            👤
          </div>
          <textarea 
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind, Architect?"
            disabled={posting}
            className="w-full bg-zinc-900/50 hover:bg-zinc-900 focus:bg-zinc-900 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 border-none outline-none resize-none font-medium text-sm min-h-[60px] transition-colors"
          />
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-zinc-800">
          <div className="flex gap-1">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-900 transition-colors text-zinc-400 font-semibold text-xs">
              <span className="text-green-500 text-lg">🖼️</span> Photo/Video
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-900 transition-colors text-zinc-400 font-semibold text-xs">
              <span className="text-blue-500 text-lg">🔗</span> Link
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-900 transition-colors text-zinc-400 font-semibold text-xs">
              <span className="text-yellow-500 text-lg">😀</span> Feeling/Activity
            </button>
          </div>
          <button 
            onClick={handlePost}
            disabled={posting || !newPost.trim()}
            className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-6 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm shadow-md shadow-orange-600/20"
          >
            {posting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>

      {/* Feed Stream */}
      <div className="flex flex-col gap-6">
        {loading ? (
          <div className="bg-zinc-950/80 border border-white/10 rounded-xl p-8 text-center shadow-lg">
             <div className="text-sm font-bold text-zinc-500 animate-pulse">Loading Feed...</div>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-zinc-950/80 border border-white/10 rounded-xl p-8 text-center shadow-lg text-zinc-500 font-bold text-sm">
            No posts yet. Be the first to post!
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}
