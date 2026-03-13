import { notFound } from "next/navigation";
import Link from "next/link";
import { getArtistById, getTracksByArtistId, formatNumber } from "@/lib/data";
import { getArtistInfo, stripHtml, getArtistImage } from "@/lib/lastfm";
import TrackCard from "@/components/TrackCard";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ArtistPage({ params }: Props) {
  const { id } = await params;
  const artist = getArtistById(id);
  if (!artist) notFound();

  const artistTracks = getTracksByArtistId(id);

  // Enrich with Last.fm data (graceful fallback if unavailable)
  const lfmArtist = await getArtistInfo(artist.name).catch(() => null);
  const lfmBio = lfmArtist?.bio?.summary ? stripHtml(lfmArtist.bio.summary) : null;
  const lfmImageUrl = lfmArtist ? getArtistImage(lfmArtist.image) : "";
  const lfmListeners = lfmArtist?.stats?.listeners ? parseInt(lfmArtist.stats.listeners, 10) : null;
  const lfmPlays = lfmArtist?.stats?.playcount ? parseInt(lfmArtist.stats.playcount, 10) : null;
  const similarArtists = lfmArtist?.similar?.artist?.slice(0, 5) ?? [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        href="/artists"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Artists
      </Link>

      {/* Profile header */}
      <div className="relative rounded-2xl overflow-hidden mb-8">
        {/* Banner */}
        <div className={`h-40 bg-gradient-to-r ${artist.avatarColor} opacity-30`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />

        {/* Content */}
        <div className="relative px-6 pb-6 -mt-16 flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div
            className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${artist.avatarColor} flex items-center justify-center text-white font-black text-2xl border-4 border-[#0a0a0f] flex-shrink-0`}
          >
            {artist.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-white">{artist.name}</h1>
              {artist.verified && (
                <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <p className="text-sm text-gray-400 mb-1">{artist.realName} · {artist.origin}</p>
            <div className="flex flex-wrap gap-1.5">
              {artist.genres.map((g) => (
                <span
                  key={g}
                  className="px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 text-xs border border-orange-500/20"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-6 text-center flex-shrink-0">
            <div>
              <div className="text-xl font-black text-white">{formatNumber(artist.followers)}</div>
              <div className="text-xs text-gray-500">Followers</div>
            </div>
            {lfmListeners && (
              <div>
                <div className="text-xl font-black text-red-400">{formatNumber(lfmListeners)}</div>
                <div className="text-xs text-gray-500">LFM Listeners</div>
              </div>
            )}
            <div>
              <div className="text-xl font-black text-white">{artistTracks.length}</div>
              <div className="text-xs text-gray-500">Tracks</div>
            </div>
            <div>
              <div className="text-xl font-black text-white">{artist.yearActive}</div>
              <div className="text-xs text-gray-500">Since</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* About */}
        <div className="lg:col-span-1">
          <div className="bg-[#13131f] border border-white/5 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-white text-sm uppercase tracking-wider">About</h2>
              {lfmArtist && (
                <span className="flex items-center gap-1 text-xs text-red-400/70">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm-1 5v6l5 3-1 1.732-6-3.464V7h2z" />
                  </svg>
                  Last.fm
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{lfmBio || artist.bio}</p>

            {lfmPlays && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-red-400/70">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm-1 5v6l5 3-1 1.732-6-3.464V7h2z" />
                </svg>
                {formatNumber(lfmPlays)} total plays on Last.fm
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Real Name</span>
                  <span className="text-white font-medium">{artist.realName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Origin</span>
                  <span className="text-white font-medium text-right ml-4">{artist.origin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Active Since</span>
                  <span className="text-white font-medium">{artist.yearActive}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Verified</span>
                  <span className={artist.verified ? "text-orange-400 font-medium" : "text-gray-400"}>
                    {artist.verified ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            {/* Similar artists from Last.fm */}
            {similarArtists.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Similar Artists</h3>
                <div className="flex flex-col gap-1.5">
                  {similarArtists.map((sim) => (
                    <span key={sim.name} className="text-sm text-gray-400 truncate">
                      {sim.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tracks */}
        <div className="lg:col-span-2">
          <h2 className="font-bold text-white text-sm uppercase tracking-wider mb-3">
            Tracks ({artistTracks.length})
          </h2>
          {artistTracks.length === 0 ? (
            <p className="text-gray-500 text-sm">No tracks yet.</p>
          ) : (
            <div className="space-y-3">
              {artistTracks.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
