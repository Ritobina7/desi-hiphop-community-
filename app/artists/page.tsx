import { artists } from "@/lib/data";
import ArtistCard from "@/components/ArtistCard";

export default function ArtistsPage() {
  const sorted = [...artists].sort((a, b) => b.followers - a.followers);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">
          Artist <span className="text-orange-400">Discovery</span>
        </h1>
        <p className="text-gray-400">
          Explore the voices behind Desi Hip Hop — from gully legends to underground icons.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Artists", value: artists.length.toString() },
          { label: "Verified", value: artists.filter((a) => a.verified).length.toString() },
          { label: "Cities", value: [...new Set(artists.map((a) => a.origin.split(",")[1]?.trim() || a.origin))].length.toString() },
          { label: "Genres covered", value: [...new Set(artists.flatMap((a) => a.genres))].length.toString() },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#13131f] border border-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-orange-400">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Artist grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sorted.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  );
}
