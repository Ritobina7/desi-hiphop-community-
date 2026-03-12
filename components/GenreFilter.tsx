"use client";

import { allGenres, allSubGenres } from "@/lib/data";
import { Genre, SubGenre } from "@/lib/types";

interface GenreFilterProps {
  selectedGenres: Genre[];
  selectedSubGenres: SubGenre[];
  onGenreToggle: (g: Genre) => void;
  onSubGenreToggle: (sg: SubGenre) => void;
  onClear: () => void;
}

export default function GenreFilter({
  selectedGenres,
  selectedSubGenres,
  onGenreToggle,
  onSubGenreToggle,
  onClear,
}: GenreFilterProps) {
  const hasFilters = selectedGenres.length > 0 || selectedSubGenres.length > 0;

  return (
    <aside className="bg-[#13131f] border border-white/5 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-white text-sm uppercase tracking-wider">Filter</h2>
        {hasFilters && (
          <button
            onClick={onClear}
            className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Genres */}
      <div className="mb-5">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Genre</h3>
        <div className="flex flex-col gap-1">
          {allGenres.map((g) => {
            const active = selectedGenres.includes(g as Genre);
            return (
              <button
                key={g}
                onClick={() => onGenreToggle(g as Genre)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-genres */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sub-Genre</h3>
        <div className="flex flex-wrap gap-1.5">
          {allSubGenres.map((sg) => {
            const active = selectedSubGenres.includes(sg as SubGenre);
            return (
              <button
                key={sg}
                onClick={() => onSubGenreToggle(sg as SubGenre)}
                className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                  active
                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                    : "bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-white/20"
                }`}
              >
                {sg}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
