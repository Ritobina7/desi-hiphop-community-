import { notFound } from "next/navigation";
import Link from "next/link";
import { formatNumber } from "@/lib/data";
import { getTrackInfo, stripHtml } from "@/lib/lastfm";
import CommentSection from "@/components/CommentSection";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ artist?: string; track?: string }>;
}

const COVER_PALETTE = [
  { coverColor: "from-orange-900 to-red-950", coverAccent: "bg-orange-500" },
  { coverColor: "from-purple-900 to-indigo-950", coverAccent: "bg-purple-500" },
  { coverColor: "from-green-900 to-emerald-950", coverAccent: "bg-green-500" },
  { coverColor: "from-blue-900 to-cyan-950", coverAccent: "bg-blue-500" },
];

export default async function TrackPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { artist: artistParam, track: trackParam } = await searchParams;

  if (!artistParam || !trackParam) notFound();

  const lfmInfo = await getTrackInfo(artistParam, trackParam).catch(() => null);
  if (!lfmInfo) notFound();

  const lfmPlays = lfmInfo.playcount ? parseInt(lfmInfo.playcount, 10) : 0;
  const lfmListeners = lfmInfo.listeners ? parseInt(lfmInfo.listeners, 10) : 0;
  const lfmDescription = lfmInfo.wiki?.summary ? stripHtml(lfmInfo.wiki.summary) : null;
  const lfmTags = lfmInfo.toptags?.tag?.map((t) => t.name).filter(Boolean) ?? [];
  const palette = COVER_PALETTE[Math.abs(id.length) % COVER_PALETTE.length];

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

      <div className="bg-[#13131f] border border-white/5 rounded-2xl overflow-hidden mb-6">
        <div className={`h-2 bg-gradient-to-r ${palette.coverColor}`} />
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-5">
            <div
              className={`w-full sm:w-40 h-40 rounded-xl bg-gradient-to-br ${palette.coverColor} flex items-center justify-center flex-shrink-0 relative`}
            >
              <div className={`absolute top-2 right-2 w-4 h-4 rounded-full ${palette.coverAccent} opacity-80`} />
              <svg className="w-14 h-14 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-2xl font-black text-white">{lfmInfo.name}</h1>
                <span className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-full px-2 py-0.5">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm-1 5v6l5 3-1 1.732-6-3.464V7h2z" />
                  </svg>
                  Last.fm
                </span>
              </div>

              <p className="text-gray-300 mb-3">{lfmInfo.artist.name}</p>

              {lfmTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {lfmTags.slice(0, 4).map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-full bg-orange-500/15 text-orange-400 text-xs font-medium border border-orange-500/20">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {lfmPlays > 0 && (
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-lg font-black text-orange-400">{formatNumber(lfmPlays)}</div>
                    <div className="text-xs text-gray-500">Plays</div>
                  </div>
                )}
                {lfmListeners > 0 && (
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-lg font-black text-red-400">{formatNumber(lfmListeners)}</div>
                    <div className="text-xs text-gray-500">Listeners</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {lfmDescription && (
            <div className="mt-5 pt-5 border-t border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">About this track</h3>
                <span className="text-xs text-red-400/60">· via Last.fm</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{lfmDescription}</p>
            </div>
          )}

          {lfmTags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {lfmTags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-full bg-white/5 text-gray-500 text-xs border border-white/10">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <CommentSection trackId={id} initialComments={[]} />
    </div>
  );
}
