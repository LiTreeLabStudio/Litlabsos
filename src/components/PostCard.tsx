"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

interface Post {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  media_url?: string;
  created_at: string;
  likes_count: number;
  is_bot: boolean;
  comments_count?: number;
}

interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author_name?: string;
  author_avatar?: string;
}

export default function PostCard({ post }: { post: Post }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsCount, setCommentsCount] = useState(post.comments_count ?? 0);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const commentInputRef = useRef<HTMLInputElement>(null);

  const isOwnPost = user?.id === post.author_id;

  // Fetch like status on mount (silently)
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const fetchLikeStatus = async () => {
      try {
        const res = await fetch(`/api/social/like?post_id=${post.id}`, {
          credentials: "include",
        });
        if (res.ok && !cancelled) {
          const data = await res.json();
          setLiked(data.liked);
          setLikesCount(data.likes_count);
        }
      } catch {
        // ignore
      }
    };
    fetchLikeStatus();
    return () => { cancelled = true; };
  }, [user, post.id]);

  // Fetch follow status on mount
  useEffect(() => {
    if (!user || isOwnPost) return;
    const fetchFollowStatus = async () => {
      try {
        const res = await fetch(`/api/social/follow?user_id=${post.author_id}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setIsFollowing(data.isFollowing);
        }
      } catch {
        // ignore
      }
    };
    fetchFollowStatus();
  }, [user, post.author_id, isOwnPost]);

  const toggleLike = async () => {
    if (loadingLike) return;
    setLoadingLike(true);
    try {
      if (liked) {
        const res = await fetch(`/api/social/like?post_id=${post.id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setLiked(false);
          setLikesCount(data.likes_count);
        }
      } else {
        const res = await fetch("/api/social/like", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ post_id: post.id }),
        });
        if (res.ok) {
          const data = await res.json();
          setLiked(true);
          setLikesCount(data.likes_count);
        }
      }
    } catch {
      // silently fail
    } finally {
      setLoadingLike(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/social/comments?post_id=${post.id}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments ?? []);
        setCommentsCount(data.comments?.length ?? 0);
      }
    } catch {
      // silently fail
    }
  };

  const handleCommentSectionToggle = () => {
    const next = !showComments;
    setShowComments(next);
    if (next && comments.length === 0) {
      fetchComments();
    }
    // Focus input when opening (preventScroll stops page jump)
    if (next) {
      setTimeout(() => commentInputRef.current?.focus({ preventScroll: true }), 100);
    }
  };

  const submitComment = async () => {
    if (!commentText.trim() || submittingComment) return;
    setSubmittingComment(true);
    try {
      const res = await fetch("/api/social/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          post_id: post.id,
          content: commentText.trim(),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [...prev, data.comment]);
        setCommentsCount((prev) => prev + 1);
        setCommentText("");
      }
    } catch {
      // silently fail
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleFollowToggle = async () => {
    if (followLoading) return;
    setFollowLoading(true);
    try {
      if (isFollowing) {
        const res = await fetch(`/api/social/follow?following_id=${post.author_id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) setIsFollowing(false);
      } else {
        const res = await fetch("/api/social/follow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ following_id: post.author_id }),
        });
        if (res.ok) setIsFollowing(true);
      }
    } catch {
      // silently fail
    } finally {
      setFollowLoading(false);
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-zinc-950/80 border border-white/10 rounded-xl overflow-hidden shadow-lg relative">
      {post.is_bot && (
        <div className="absolute top-4 right-4 px-2 py-0.5 bg-orange-600/20 border border-orange-500/50 text-[10px] font-bold text-orange-400 rounded-md z-10">
          Bot
        </div>
      )}

      {/* Post Header */}
      <div className="p-4 flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xl shadow-md shrink-0 ${
            post.is_bot
              ? "bg-zinc-900 border-orange-500/50"
              : "bg-zinc-900 border-blue-500/50"
          }`}
        >
          {post.author_avatar}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-bold text-white hover:underline cursor-pointer truncate">
            {post.author_name}
          </h3>
          <div className="text-[11px] text-zinc-500 font-medium">
            {formatTime(post.created_at)} • 🌎
          </div>
        </div>
        {/* Follow button — shown on posts from other users */}
        {user && !isOwnPost && (
          <button
            onClick={handleFollowToggle}
            disabled={followLoading}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-colors shrink-0 ${
              isFollowing
                ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border border-zinc-700"
                : "bg-orange-600 text-white hover:bg-orange-500 border border-orange-500"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        )}
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
      {likesCount > 0 || commentsCount > 0 ? (
        <div className="px-4 py-2 flex items-center justify-between text-[12px] text-zinc-500 border-b border-zinc-800/60">
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white">
              👍
            </span>
            {likesCount > 0 && <span>{likesCount}</span>}
          </div>
          <div className="flex gap-3">
            {commentsCount > 0 && (
              <span
                className="hover:underline cursor-pointer"
                onClick={handleCommentSectionToggle}
              >
                {commentsCount} Comment{commentsCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      ) : null}

      {/* Action Buttons */}
      <div className="px-2 py-1 flex items-center justify-between">
        <button
          onClick={toggleLike}
          disabled={loadingLike || !user}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md hover:bg-zinc-900 transition-colors text-[13px] font-semibold ${
            liked ? "text-blue-500" : "text-zinc-400"
          } ${!user ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <span className="text-lg">{liked ? "👍" : "👍"}</span>{" "}
          <span className={liked ? "text-blue-400" : ""}>{liked ? "Liked" : "Like"}</span>
        </button>
        <button
          onClick={handleCommentSectionToggle}
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
        <div className="border-t border-zinc-800/60">
          {/* Existing Comments */}
          {comments.length > 0 && (
            <div className="p-3 space-y-3 max-h-80 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <div className="w-8 h-8 rounded-full border border-blue-500/40 bg-zinc-900 flex items-center justify-center text-sm shrink-0">
                    {comment.author_avatar || "👤"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-zinc-800/50 rounded-2xl px-3 py-2">
                      <div className="text-[12px] font-bold text-zinc-300">
                        {comment.author_name || "User"}
                      </div>
                      <div className="text-[13px] text-white break-words">
                        {comment.content}
                      </div>
                    </div>
                    <div className="text-[10px] text-zinc-500 ml-3 mt-0.5">
                      {formatTime(comment.created_at)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comment Input */}
          {user && (
            <div className="p-3 pt-0">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full border border-blue-500/40 bg-zinc-900 flex items-center justify-center text-sm shrink-0">
                  👤
                </div>
                <div className="flex-1 bg-zinc-800/50 rounded-2xl px-3 py-1.5 flex items-center">
                  <input
                    ref={commentInputRef}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submitComment();
                    }}
                    className="w-full bg-transparent border-none text-[13px] text-white focus:outline-none placeholder:text-zinc-500"
                    placeholder="Write a comment..."
                    disabled={submittingComment}
                  />
                  <button
                    onClick={submitComment}
                    disabled={!commentText.trim() || submittingComment}
                    className="ml-2 text-orange-500 hover:text-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-bold transition-colors shrink-0"
                  >
                    {submittingComment ? "..." : "Post"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
