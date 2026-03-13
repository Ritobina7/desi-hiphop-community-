import { notFound } from "next/navigation";
import Link from "next/link";
import { getCachedAlbumGroups } from "@/lib/cache";
import { formatNumber } from "@/lib/data";
import CommentSection from "@/components/CommentSection";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AlbumPage({ params }: Props) {
  const { id } = await params;

  const group = getCachedAlbumGroups().find((g) => g.releaseId === id);
  if (!group) notFound();

  const totalYtViews = group.tracks.reduce((sum, t) => sum + (t.ytViewCount ?? 0), 0);
  const tracksWithYt = group.tracks.filter((t) => t.ytViewCount && t.ytViewCount > 0).length;

  const typeColor =
    group.releaseType === "Album"
      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
      : group.releaseType === "EP"
      ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
      : group.releaseType === "Mixtape"
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : "bg-gray-500/20 text-gray-400 border-gray-500/30";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Feed
      </Link>

      {/* Album header */}
      <div className="bg-[#13131f] border border-white/5 rounded-2xl overflow-hidden mb-6">
        <div className="h-2 bg-gradient-to-r from-blue-900 to-indigo-950" />
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-5">
            {/* Cover art */}
            <div className="w-full sm:w-40 h-40 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-950 flex items-center justify-center flex-shrink-0 relative">
              <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-400 opacity-80" />
              <svg className="w-14 h-14 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-2xl font-black text-white">{group.releaseTitle}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${typeColor}`}>
                  {group.releaseType}
                </span>
              </div>

              <p className="text-gray-300 text-lg mb-1">{group.artistName}</p>

              {group.releaseYear && (
                <p className="text-sm text-gray-500 mb-3">{group.releaseYear}</p>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-400 text-xs font-medium border border-blue-500/20">
                  {group.genre}
                </span>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-lg font-black text-blue-400">
                    {group.tracks.length}/{group.releaseTrackCount}
                  </div>
                  <div className="text-xs text-gray-500">Tracks in feed</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-lg font-black text-orange-400">
                    {formatNumber(group.totalPlaycount)}
                  </div>
                  <div className="text-xs text-gray-500">Last.fm plays</div>
                </div>
                {totalYtViews > 0 && (
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-lg font-black text-red-400">
                      {formatNumber(totalYtViews)}
                    </div>
                    <div className="text-xs text-gray-500">YT views ({tracksWithYt} tracks)</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Track listing */}
      <div className="bg-[#13131f] border border-white/5 rounded-2xl overflow-hidden mb-6">
        <div className="p-4 border-b border-white/5">
          <h2 className="font-bold text-white text-sm uppercase tracking-wider">Track Listing</h2>
        </div>

        <div className="divide-y divide-white/5">
          {group.tracks.map((track, i) => {
            const href = `/tracks/${track.id}?artist=${encodeURIComponent(track.artistName)}&track=${encodeURIComponent(track.title)}`;
            return (
              <Link key={track.id} href={href}>
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group">
                  {/* # */}
                  <span className="w-6 text-center text-xs text-gray-600 flex-shrink-0 group-hover:hidden">
                    {i + 1}
                  </span>
                  <svg
                    className="w-4 h-4 text-blue-400 flex-shrink-0 hidden group-hover:block"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>

                  {/* Title + fire badge */}
                  <div className="flex-1 min-w-0 flex items-center gap-1.5">
                    <span className="text-sm text-white group-hover:text-blue-400 transition-colors truncate">
                      {track.title}
                    </span>
                    {track.isTopTrack && (
                      <span title="Top track by plays" className="flex-shrink-0 text-sm">🔥</span>
                    )}
                  </div>

                  {/* Duration */}
                  <span className="text-xs text-gray-600 flex-shrink-0 w-10 text-right">
                    {track.duration}
                  </span>

                  {/* Last.fm plays */}
                  <div className="flex-shrink-0 w-20 text-right">
                    {track.playcount > 0 ? (
                      <span className="text-xs text-orange-400/80">
                        {formatNumber(track.playcount)}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-700">—</span>
                    )}
                    <div className="text-xs text-gray-700">plays</div>
                  </div>

                  {/* YT views */}
                  <div className="flex-shrink-0 w-24 text-right">
                    {track.ytViewCount && track.ytViewCount > 0 ? (
                      <>
                        <span className="text-xs text-red-400/80">
                          {formatNumber(track.ytViewCount)}
                        </span>
                        <div className="text-xs text-gray-700">{track.ytLabel}</div>
                      </>
                    ) : (
                      <span className="text-xs text-gray-700">—</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-600">
          <span>{group.releaseTrackCount} total tracks on release · {group.tracks.length} in feed</span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3 text-red-500/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm-1 5v6l5 3-1 1.732-6-3.464V7h2z" />
            </svg>
            Plays via Last.fm
          </span>
        </div>
      </div>

      <CommentSection trackId={`album-${id}`} initialComments={[]} />
    </div>
  );
}
