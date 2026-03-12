import Link from "next/link";
import { Artist } from "@/lib/types";
import { formatNumber } from "@/lib/data";

export default function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <Link href={`/artists/${artist.id}`}>
      <div className="group bg-[#13131f] hover:bg-[#1a1a2e] border border-white/5 hover:border-orange-500/30 rounded-xl p-5 transition-all duration-200 cursor-pointer">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className={`w-14 h-14 rounded-full bg-gradient-to-br ${artist.avatarColor} flex items-center justify-center text-white font-black text-lg flex-shrink-0`}
          >
            {artist.initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-white group-hover:text-orange-400 transition-colors truncate">
                {artist.name}
              </h3>
              {artist.verified && (
                <svg className="w-4 h-4 text-orange-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <p className="text-sm text-gray-400 truncate">{artist.origin}</p>
          </div>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {artist.genres.slice(0, 2).map((g) => (
            <span
              key={g}
              className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 text-xs border border-orange-500/20"
            >
              {g}
            </span>
          ))}
        </div>

        {/* Bio snippet */}
        <p className="text-xs text-gray-500 line-clamp-2 mb-4">{artist.bio}</p>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">
            <span className="text-white font-semibold">{formatNumber(artist.followers)}</span> followers
          </span>
          <span className="text-gray-400">
            Active since{" "}
            <span className="text-white font-semibold">{artist.yearActive}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
