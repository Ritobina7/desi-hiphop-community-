"use client";

import { allGenres, allSubGenres, allCategories } from "@/lib/data";
import { Genre, SubGenre, PostCategory } from "@/lib/types";

export type PostTypeTab = "all" | "track" | "community";

interface FeedFilterProps {
  postTypeTab: PostTypeTab;
  onTabChange: (tab: PostTypeTab) => void;
  selectedGenres: Genre[];
  selectedSubGenres: SubGenre[];
  onGenreToggle: (g: Genre) => void;
  onSubGenreToggle: (sg: SubGenre) => void;
  selectedCategories: PostCategory[];
  onCategoryToggle: (c: PostCategory) => void;
  onClear: () => void;
}

const TABS: { key: PostTypeTab; label: string }[] = [
  { key: "all", label: "All Posts" },
  { key: "track", label: "Track Discussions" },
  { key: "community", label: "Community" },
];

export default function FeedFilter({
  postTypeTab,
  onTabChange,
  selectedGenres,
  selectedSubGenres,
  onGenreToggle,
  onSubGenreToggle,
  selectedCategories,
  onCategoryToggle,
  onClear,
}: FeedFilterProps) {
  const hasFilters =
    selectedGenres.length > 0 ||
    selectedSubGenres.length > 0 ||
    selectedCategories.length > 0;

  const showGenres = postTypeTab === "all" || postTypeTab === "track";
  const showCategories = postTypeTab === "all" || postTypeTab === "community";

  return (
    <aside className="bg-[#13131f] border border-white/5 rounded-xl p-4">
      {/* Post type tabs */}
      <div className="mb-4">
        <div className="flex flex-col gap-0.5">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                postTypeTab === tab.key
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-white/5 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Filters</h2>
          {hasFilters && (
            <button
              onClick={onClear}
              className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Genre filters */}
        {showGenres && (
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Genre</h3>
            <div className="flex flex-col gap-0.5">
              {allGenres.map((g) => {
                const active = selectedGenres.includes(g as Genre);
                return (
                  <button
                    key={g}
                    onClick={() => onGenreToggle(g as Genre)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
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
        )}

        {/* Sub-genre pills */}
        {showGenres && (
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Sub-Genre</h3>
            <div className="flex flex-wrap gap-1">
              {allSubGenres.map((sg) => {
                const active = selectedSubGenres.includes(sg as SubGenre);
                return (
                  <button
                    key={sg}
                    onClick={() => onSubGenreToggle(sg as SubGenre)}
                    className={`px-2 py-0.5 rounded-full text-xs transition-colors ${
                      active
                        ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                        : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
                    }`}
                  >
                    {sg}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Category filters */}
        {showCategories && (
          <div>
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Category</h3>
            <div className="flex flex-col gap-0.5">
              {allCategories.map((cat) => {
                const active = selectedCategories.includes(cat as PostCategory);
                return (
                  <button
                    key={cat}
                    onClick={() => onCategoryToggle(cat as PostCategory)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                      active
                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                        : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
