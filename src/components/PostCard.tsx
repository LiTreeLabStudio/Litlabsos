"use client";

import React, { useState } from 'react';
import Image from 'next/image';

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

export default function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [showComments, setShowComments] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <div className="bg-zinc-950/80 border border-white/10 rounded-xl overflow-hidden shadow-lg relative">
      {post.is_bot && (
        <div className="absolute top-4 right-4 px-2 py-0.5 bg-orange-600/20 border border-orange-500/50 text-[10px] font-bold text-orange-400 rounded-md">
          Bot
        </div>
      )}
      
      {/* Post Header */}
      <div className="p-4 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xl shadow-md ${post.is_bot ? 'bg-zinc-900 border-orange-500/50' : 'bg-zinc-900 border-blue-500/50'}`}>
          {post.author_avatar}
        </div>
        <div>
          <h3 className="text-[14px] font-bold text-white hover:underline cursor-pointer">{post.author_name}</h3>
          <div className="text-[11px] text-zinc-500 font-medium">
            {new Date(post.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })} • 🌎
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-[14px] text-zinc-300 whitespace-pre-wrap">{post.content}</p>
      </div>
      
      {/* Media Attachment */}
      {post.media_url && (
        <div className="w-full relative h-64 sm:h-80 lg:h-96 bg-black border-y border-zinc-800">
          <Image 
            src={post.media_url} 
            alt="Post Attachment" 
            fill
            className="object-cover" 
          />
        </div>
      )}

      {/* Engagement Stats */}
      <div className="px-4 py-2 flex items-center justify-between text-[12px] text-zinc-500 border-b border-zinc-800/60">
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white">👍</span>
          {likesCount > 0 && <span>{likesCount}</span>}
        </div>
        <div className="flex gap-3 hover:underline cursor-pointer">
          <span>0 Comments</span>
          <span>0 Shares</span>
        </div>
      </div>

      {/* Action Buttons (Facebook style) */}
      <div className="px-2 py-1 flex items-center justify-between">
        <button 
          onClick={toggleLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md hover:bg-zinc-900 transition-colors text-[13px] font-semibold ${liked ? 'text-blue-500' : 'text-zinc-400'}`}
        >
          <span className="text-lg">👍</span> Like
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md hover:bg-zinc-900 transition-colors text-[13px] font-semibold text-zinc-400"
        >
          <span className="text-lg">💬</span> Comment
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md hover:bg-zinc-900 transition-colors text-[13px] font-semibold text-zinc-400">
          <span className="text-lg">🔗</span> Share
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="p-4 bg-zinc-900/30 border-t border-zinc-800/60">
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full border border-blue-500/40 bg-zinc-900 flex items-center justify-center text-sm shrink-0">👤</div>
            <div className="flex-1 bg-zinc-800/50 rounded-2xl px-3 py-1.5 flex items-center">
              <input 
                className="w-full bg-transparent border-none text-[13px] text-white focus:outline-none placeholder:text-zinc-500"
                placeholder="Write a comment..."
              />
              <div className="flex gap-2 text-zinc-500 pl-2">
                <span className="cursor-pointer hover:text-white">😀</span>
                <span className="cursor-pointer hover:text-white">📷</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
