"use client";

import { useState } from "react";
import { CommunityPost } from "@/lib/types";
import { formatNumber, timeAgo } from "@/lib/data";

const CATEGORY_COLORS: Record<string, string> = {
  "Events": "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  "Culture & Debates": "bg-violet-500/15 text-violet-400 border-violet-500/20",
  "News & Releases": "bg-blue-500/15 text-blue-400 border-blue-500/20",
  "Other": "bg-gray-500/15 text-gray-400 border-gray-500/20",
};

interface Props {
  post: CommunityPost;
}

export default function CommunityPostCard({ post }: Props) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [expanded, setExpanded] = useState(false);

  const isLong = post.body.length > 280;
  const bodyPreview = isLong && !expanded ? post.body.slice(0, 280) + "…" : post.body;

  return (
    <article className="group bg-[#13131f] hover:bg-[#1a1a2e] border border-white/5 hover:border-purple-500/20 rounded-xl overflow-hidden transition-all duration-200">
      <div className="flex">
        {/* Purple left accent bar */}
        <div className="w-1 flex-shrink-0 bg-purple-500/70 rounded-l-xl" />

        <div className="flex-1 min-w-0 p-4">
          {/* Header row */}
          <div className="flex items-start gap-2 mb-2 flex-wrap">
            <span className="text-xs font-semibold text-purple-400/80">💬 Community</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS["Other"]
              }`}
            >
              {post.category}
            </span>
            {post.pinned && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/20">
                📌 Pinned
              </span>
            )}
            <span className="ml-auto text-xs text-gray-600 flex-shrink-0">{timeAgo(post.postedAt)}</span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors leading-snug mb-2">
            {post.title}
          </h3>

          {/* Image */}
          {post.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.imageUrl}
              alt=""
              className="w-full h-40 object-cover rounded-lg mb-2"
            />
          )}

          {/* Body */}
          {post.body && (
            <div>
              <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
                {bodyPreview}
              </p>
              {isLong && (
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="text-xs text-purple-400 hover:text-purple-300 mt-1 transition-colors"
                >
                  {expanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          )}

          {/* Genre tags */}
          {post.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {post.genres.slice(0, 3).map((g) => (
                <span
                  key={g}
                  className="px-2 py-0.5 rounded-full bg-white/5 text-gray-500 text-xs border border-white/10"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={() => {
                setLiked((v) => !v);
                setLikeCount((n) => (liked ? n - 1 : n + 1));
              }}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                liked ? "text-purple-400" : "text-gray-500 hover:text-purple-400"
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
}
