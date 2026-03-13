"use client";

import Link from "next/link";
import { SerializedAlbumGroup } from "@/lib/types";
import { formatNumber } from "@/lib/data";

interface Props {
  group: SerializedAlbumGroup;
}

export default function AlbumCard({ group }: Props) {
  const totalYtViews = group.tracks.reduce((sum, t) => sum + (t.ytViewCount ?? 0), 0);

  return (
    <Link href={`/albums/${group.releaseId}`}>
      <article className="group bg-[#13131f] hover:bg-[#1a1a2e] border border-white/5 hover:border-blue-500/20 rounded-xl pl-0 transition-all duration-200 overflow-hidden cursor-pointer">
        <div className="flex">
          {/* Blue left accent bar */}
          <div className="w-1 flex-shrink-0 bg-blue-500/70 rounded-l-xl" />

          <div className="flex-1 min-w-0 p-4">
            {/* Type label */}
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-xs font-semibold text-blue-400/80">
                💿 {group.releaseType}
              </span>
              {group.releaseYear && (
                <span className="text-xs text-gray-600">{group.releaseYear}</span>
              )}
            </div>

            <div className="flex gap-3">
              {/* Cover placeholder */}
              <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gradient-to-br from-blue-900 to-indigo-950 flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-400 opacity-80" />
                <svg className="w-6 h-6 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
                </svg>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors truncate text-sm">
                  {group.releaseTitle}
                </h3>
                <p className="text-xs text-gray-400 truncate">{group.artistName}</p>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-xs font-medium border border-blue-500/20">
                    {group.genre}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-gray-500 text-xs border border-white/10">
                    {group.tracks.length}/{group.releaseTrackCount} tracks
                  </span>
                </div>
              </div>
            </div>

            {/* Top track */}
            <div className="mt-2.5 flex items-center gap-1.5">
              <span className="text-xs text-gray-600">🔥 Most discussed:</span>
              <span className="text-xs text-gray-300 truncate">{group.topTrack}</span>
            </div>

            {/* Track list preview */}
            <div className="mt-2 space-y-0.5">
              {group.tracks.slice(0, 3).map((t) => (
                <div key={t.id} className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="truncate flex-1">{t.title}</span>
                  {t.ytViewCount && t.ytViewCount > 0 ? (
                    <span className="flex-shrink-0 text-red-500/70">
                      {formatNumber(t.ytViewCount)} {t.ytLabel}
                    </span>
                  ) : (
                    <span className="flex-shrink-0">{formatNumber(t.playcount)} plays</span>
                  )}
                </div>
              ))}
              {group.tracks.length > 3 && (
                <p className="text-xs text-gray-600 mt-0.5">+{group.tracks.length - 3} more</p>
              )}
            </div>

            {/* Footer stats */}
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatNumber(group.totalPlaycount)} total plays
              </span>

              {totalYtViews > 0 && (
                <span className="flex items-center gap-1.5 text-sm text-red-500/70">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  {formatNumber(totalYtViews)} YT views
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
