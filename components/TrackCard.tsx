"use client";

import Link from "next/link";
import { Track } from "@/lib/types";
import { formatNumber, timeAgo } from "@/lib/data";
import { useState } from "react";

interface TrackCardProps {
  track: Track;
  latestComment?: string;
}

export default function TrackCard({ track, latestComment }: TrackCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(track.likes);

  function handleLike(e: React.MouseEvent) {
    e.preventDefault();
    if (liked) {
      setLiked(false);
      setLikeCount((n) => n - 1);
    } else {
      setLiked(true);
      setLikeCount((n) => n + 1);
    }
  }

  return (
    <Link href={`/tracks/${track.id}`}>
      <article className="group bg-[#13131f] hover:bg-[#1a1a2e] border border-white/5 hover:border-orange-500/30 rounded-xl p-4 transition-all duration-200 cursor-pointer">
        <div className="flex gap-4">
          {/* Cover art */}
          <div
            className={`flex-shrink-0 w-20 h-20 rounded-lg bg-gradient-to-br ${track.coverColor} flex items-center justify-center relative overflow-hidden`}
          >
            <div className={`absolute top-1 right-1 w-3 h-3 rounded-full ${track.coverAccent} opacity-80`} />
            <svg className="w-8 h-8 text-white/40" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-bold text-white group-hover:text-orange-400 transition-colors truncate">
                  {track.title}
                </h3>
                <p className="text-sm text-gray-400 truncate">{track.artistName}</p>
              </div>
              <span className="flex-shrink-0 text-xs text-gray-500">{timeAgo(track.postedAt)}</span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 text-xs font-medium border border-orange-500/20">
                {track.genre}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/5 text-gray-400 text-xs border border-white/10">
                {track.subGenre}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/5 text-gray-500 text-xs border border-white/10">
                {track.duration}
              </span>
            </div>

            {/* Description */}
            <p className="mt-2 text-sm text-gray-400 line-clamp-2">{track.description}</p>

            {/* Latest comment */}
            {latestComment && (
              <div className="mt-2 pl-2 border-l-2 border-orange-500/30">
                <p className="text-xs text-gray-500 italic line-clamp-1">"{latestComment}"</p>
              </div>
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                {formatNumber(track.commentCount)}
              </span>

              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {formatNumber(track.plays)}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
