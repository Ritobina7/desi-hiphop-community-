"use client";

import Link from "next/link";
import { useState } from "react";
import { TrackDiscussionPost } from "@/lib/types";
import { formatNumber, timeAgo } from "@/lib/data";

interface Props {
  post: TrackDiscussionPost;
}

export default function TrackDiscussionCard({ post }: Props) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  function handleLike(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLiked((v) => !v);
    setLikeCount((n) => (liked ? n - 1 : n + 1));
  }

  const inner = (
    <article className="group bg-[#13131f] hover:bg-[#1a1a2e] border border-white/5 hover:border-orange-500/20 rounded-xl pl-0 transition-all duration-200 overflow-hidden cursor-pointer">
      <div className="flex">
        {/* Orange left accent bar */}
        <div className="w-1 flex-shrink-0 bg-orange-500/70 rounded-l-xl" />

        <div className="flex-1 min-w-0 p-4">
          {/* Type label */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs font-semibold text-orange-400/80">🎵 Track Discussion</span>
            {post.lastFmUrl && (
              <span className="flex items-center gap-1 text-xs text-red-400/70">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm-1 5v6l5 3-1 1.732-6-3.464V7h2z" />
                </svg>
                Last.fm
              </span>
            )}
          </div>

          <div className="flex gap-3">
            {/* Cover art */}
            <div
              className={`flex-shrink-0 w-16 h-16 rounded-lg bg-gradient-to-br ${post.coverColor} flex items-center justify-center relative overflow-hidden`}
            >
              <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${post.coverAccent} opacity-80`} />
              <svg className="w-6 h-6 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-bold text-white group-hover:text-orange-400 transition-colors truncate text-sm">
                    {post.trackTitle}
                  </h3>
                  <p className="text-xs text-gray-400 truncate">{post.artistName}</p>
                </div>
                <span className="flex-shrink-0 text-xs text-gray-600">{timeAgo(post.postedAt)}</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                <span className="px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 text-xs font-medium border border-orange-500/20">
                  {post.genre}
                </span>
                {post.subGenre && (
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-gray-400 text-xs border border-white/10">
                    {post.subGenre}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full bg-white/5 text-gray-500 text-xs border border-white/10">
                  {post.duration}
                </span>
              </div>
            </div>
          </div>

          {/* User text */}
          {post.userText && (
            <p className="mt-2.5 text-sm text-gray-400 line-clamp-2">{post.userText}</p>
          )}

          {/* Footer */}
          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                liked ? "text-orange-400" : "text-gray-500 hover:text-orange-400"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill={liked ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{formatNumber(likeCount)}</span>
            </button>

            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {formatNumber(post.commentCount)}
            </span>

            {post.plays > 0 && (
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatNumber(post.plays)}
              </span>
            )}

            {post.lastFmListeners && post.lastFmListeners > 0 ? (
              <span className="flex items-center gap-1 text-xs text-red-400/80">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm-1 5v6l5 3-1 1.732-6-3.464V7h2z" />
                </svg>
                {formatNumber(post.lastFmListeners)}
              </span>
            ) : null}

            {post.ytData?.viewCount && post.ytData.viewCount > 0 ? (
              <span className="flex items-center gap-1 text-xs text-red-500/80">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>{formatNumber(post.ytData.viewCount)}</span>
                <span className="text-gray-600">{post.ytData.label}</span>
              </span>
            ) : null}

            <div className="ml-auto flex items-center gap-1.5">
              <div className={`w-5 h-5 rounded-full ${post.authorColor} flex items-center justify-center text-white text-xs font-bold`}>
                {post.author.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-gray-600">{post.author}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );

  const href = post.trackId
    ? `/tracks/${post.trackId}`
    : `/tracks/${post.id}?artist=${encodeURIComponent(post.artistName)}&track=${encodeURIComponent(post.trackTitle)}`;

  return <Link href={href}>{inner}</Link>;
}
