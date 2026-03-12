import { notFound } from "next/navigation";
import Link from "next/link";
import { getTrackById, getArtistById, getCommentsByTrackId, formatNumber, timeAgo } from "@/lib/data";
import CommentSection from "@/components/CommentSection";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TrackPage({ params }: Props) {
  const { id } = await params;
  const track = getTrackById(id);
  if (!track) notFound();

  const artist = getArtistById(track.artistId);
  const trackComments = getCommentsByTrackId(id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Feed
      </Link>

      {/* Track hero */}
      <div className="bg-[#13131f] border border-white/5 rounded-2xl overflow-hidden mb-6">
        {/* Top color band */}
        <div className={`h-2 bg-gradient-to-r ${track.coverColor}`} />

        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-5">
            {/* Cover */}
            <div
              className={`w-full sm:w-40 h-40 rounded-xl bg-gradient-to-br ${track.coverColor} flex items-center justify-center flex-shrink-0 relative`}
            >
              <div className={`absolute top-2 right-2 w-4 h-4 rounded-full ${track.coverAccent} opacity-80`} />
              <svg className="w-14 h-14 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-black text-white mb-1">{track.title}</h1>

              {/* Artist link */}
              <Link
                href={artist ? `/artists/${artist.id}` : "#"}
                className="inline-flex items-center gap-2 mb-3 hover:text-orange-400 transition-colors group"
              >
                {artist && (
                  <div
                    className={`w-6 h-6 rounded-full bg-gradient-to-br ${artist.avatarColor} flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {artist.initials}
                  </div>
                )}
                <span className="text-gray-300 group-hover:text-orange-400">{track.artistName}</span>
                {artist?.verified && (
                  <svg className="w-3.5 h-3.5 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </Link>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2.5 py-1 rounded-full bg-orange-500/15 text-orange-400 text-xs font-medium border border-orange-500/20">
                  {track.genre}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/5 text-gray-400 text-xs border border-white/10">
                  {track.subGenre}
                </span>
                {track.album && (
                  <span className="px-2.5 py-1 rounded-full bg-white/5 text-gray-400 text-xs border border-white/10">
                    {track.album}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-full bg-white/5 text-gray-400 text-xs border border-white/10">
                  {track.year}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/5 text-gray-400 text-xs border border-white/10">
                  {track.duration}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Plays", value: formatNumber(track.plays) },
                  { label: "Likes", value: formatNumber(track.likes) },
                  { label: "Comments", value: formatNumber(track.commentCount) },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-lg font-black text-orange-400">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-5 pt-5 border-t border-white/5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">About this track</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{track.description}</p>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {track.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full bg-white/5 text-gray-500 text-xs border border-white/10"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Posted time */}
          <p className="mt-4 text-xs text-gray-600">Posted {timeAgo(track.postedAt)}</p>
        </div>
      </div>

      {/* Comments */}
      <CommentSection trackId={id} initialComments={trackComments} />
    </div>
  );
}
