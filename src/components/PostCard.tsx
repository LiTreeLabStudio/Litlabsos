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
    // TODO: Wire up to /api/social/likes
  };

  return (
    <div className="card-cyber p-8 bg-zinc-950/20 border-orange-500/5 hover:bg-orange-500/[0.03] transition-all relative overflow-hidden group mb-6">
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
          <p className="text-[13px] text-zinc-400 font-medium leading-relaxed whitespace-pre-wrap font-mono mb-4">{post.content}</p>
          
          {post.media_url && (
            <div className="mb-4 rounded-none border border-white/5 overflow-hidden bg-black/40 relative h-64">
              <Image 
                src={post.media_url} 
                alt="Neural Transmission Media" 
                fill
                className="object-cover opacity-80 hover:opacity-100 transition-opacity" 
              />
            </div>
          )}

          <div className="flex items-center gap-10 mt-8 pt-6 border-t border-white/5">
            <button 
              onClick={toggleLike}
              className="flex items-center gap-2.5 group/btn"
            >
              <span className={`text-sm transition-colors ${liked ? 'text-orange-500' : 'text-zinc-800 group-hover/btn:text-orange-500'}`}>
                {liked ? '🧡' : '🤍'}
              </span>
              <span className="text-[10px] font-black text-zinc-600 group-hover/btn:text-white transition-colors tabular-nums tracking-widest">{likesCount}</span>
            </button>
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2.5 group/btn"
            >
              <span className="text-zinc-800 group-hover/btn:text-orange-500 transition-colors text-sm">💬</span>
              <span className="text-[10px] font-black text-zinc-600 group-hover/btn:text-white transition-colors tabular-nums tracking-widest">0</span>
            </button>
            <button className="flex items-center gap-2.5 group/btn">
              <span className="text-zinc-800 group-hover/btn:text-orange-500 transition-colors text-sm">🔗</span>
            </button>
            <button className="text-zinc-800 hover:text-orange-500 transition-colors text-xs ml-auto font-black tracking-[0.3em]">...</button>
          </div>

          {showComments && (
            <div className="mt-6 pt-6 border-t border-white/5 animate-in fade-in slide-in-from-top-2">
              <div className="flex gap-4 mb-4">
                <div className="w-8 h-8 rounded-none border border-blue-500/40 bg-blue-600/10 flex items-center justify-center text-xs">⚡</div>
                <input 
                  className="flex-1 bg-zinc-900/40 border border-white/5 rounded-none px-4 py-2 text-xs text-white focus:outline-none focus:border-orange-500/40 font-mono"
                  placeholder="Inject response into thread..."
                />
              </div>
              <div className="text-[9px] font-black text-zinc-800 uppercase tracking-widest text-center py-4 italic">End_Of_Transmission_Thread</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
