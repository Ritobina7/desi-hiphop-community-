"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useFeed } from "@/lib/FeedContext";
import { CommunityPost } from "@/lib/types";
import { formatNumber, timeAgo } from "@/lib/data";

const CATEGORY_COLORS: Record<string, string> = {
  "Events": "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  "Culture & Debates": "bg-violet-500/15 text-violet-400 border-violet-500/20",
  "News & Releases": "bg-blue-500/15 text-blue-400 border-blue-500/20",
  "Other": "bg-gray-500/15 text-gray-400 border-gray-500/20",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default function CommunityPostPage({ params }: Props) {
  const { id } = use(params);
  const { posts } = useFeed();

  const post = posts.find((p) => p.id === id && p.type === "community") as CommunityPost | undefined;

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likes ?? 0);

  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Feed
      </Link>

      <article className="bg-[#13131f] border border-white/5 rounded-2xl overflow-hidden">
        <div className="w-full h-1.5 bg-purple-500/70" />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-xs font-semibold text-purple-400/80">💬 Community</span>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
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
            <span className="ml-auto text-xs text-gray-500">{timeAgo(post.postedAt)}</span>
          </div>

          <h1 className="text-2xl font-black text-white leading-snug mb-4">{post.title}</h1>

          {/* Author */}
          <div className="flex items-center gap-2 mb-5">
            <div className={`w-7 h-7 rounded-full ${post.authorColor} flex items-center justify-center text-white text-xs font-bold`}>
              {post.author.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-gray-400">{post.author}</span>
          </div>

          {/* Image */}
          {post.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.imageUrl}
              alt=""
              className="w-full rounded-xl mb-5 object-cover max-h-80"
            />
          )}

          {/* Body */}
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{post.body}</p>

          {/* Genre tags */}
          {post.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-5">
              {post.genres.map((g) => (
                <span
                  key={g}
                  className="px-2.5 py-1 rounded-full bg-white/5 text-gray-500 text-xs border border-white/10"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center gap-4 mt-6 pt-5 border-t border-white/5">
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
              {formatNumber(post.commentCount)} comments
            </span>
          </div>
        </div>
      </article>
    </div>
  );
}
