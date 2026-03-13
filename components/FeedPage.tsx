"use client";

import { useState, useMemo } from "react";
import { artists, formatNumber, seedTrackDiscussionPosts, seedCommunityPosts, SEED_TRACK_POST_IDS } from "@/lib/data";
import { Genre, SubGenre, PostCategory, FeedItem, TrackDiscussionPost, CommunityPost, SerializedAlbumGroup } from "@/lib/types";
import { useFeed } from "@/lib/FeedContext";
import TrackDiscussionCard from "@/components/TrackDiscussionCard";
import CommunityPostCard from "@/components/CommunityPostCard";
import AlbumCard from "@/components/AlbumCard";
import FeedFilter, { PostTypeTab } from "@/components/FeedFilter";
import Link from "next/link";

const SORT_OPTIONS = ["Recent", "Most Liked", "Most Discussed"] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

interface Props {
  serverTrackPosts: TrackDiscussionPost[];
  serverAlbumGroups: SerializedAlbumGroup[];
  cacheAge?: { minutes: number; display: string };
}

export default function FeedPage({ serverTrackPosts, serverAlbumGroups, cacheAge }: Props) {
  const { posts: contextPosts } = useFeed();

  const [postTypeTab, setPostTypeTab] = useState<PostTypeTab>("all");
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [selectedSubGenres, setSelectedSubGenres] = useState<SubGenre[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<PostCategory[]>([]);
  const [sort, setSort] = useState<SortOption>("Recent");
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  function toggleGenre(g: Genre) {
    setSelectedGenres((p) => (p.includes(g) ? p.filter((x) => x !== g) : [...p, g]));
  }
  function toggleSubGenre(sg: SubGenre) {
    setSelectedSubGenres((p) => (p.includes(sg) ? p.filter((x) => x !== sg) : [...p, sg]));
  }
  function toggleCategory(c: PostCategory) {
    setSelectedCategories((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));
  }
  function clearFilters() {
    setSelectedGenres([]);
    setSelectedSubGenres([]);
    setSelectedCategories([]);
  }

  // Build the unified post list:
  // 1. User-created posts from context (strip out seed track posts since serverTrackPosts replaces them)
  // 2. Server-fetched Last.fm track posts (or seed fallback if API is unavailable)
  // 3. Seed community posts are part of contextPosts and flow through untouched
  const allPosts: FeedItem[] = useMemo(() => {
    const userCreatedPosts = contextPosts.filter((p) => !SEED_TRACK_POST_IDS.has(p.id));
    return [...userCreatedPosts, ...serverTrackPosts];
  }, [contextPosts, serverTrackPosts]);

  const fromLastFm = serverTrackPosts !== seedTrackDiscussionPosts && serverTrackPosts.length > 0;

  const filteredPosts = useMemo(() => {
    let result = [...allPosts];

    if (postTypeTab === "track") {
      result = result.filter((p): p is TrackDiscussionPost => p.type === "track");
    } else if (postTypeTab === "community") {
      result = result.filter((p): p is CommunityPost => p.type === "community");
    }

    if (selectedGenres.length > 0 || selectedSubGenres.length > 0) {
      result = result.filter((p) => {
        if (p.type === "track") {
          const genreMatch = selectedGenres.length === 0 || selectedGenres.includes(p.genre);
          const subGenreMatch =
            selectedSubGenres.length === 0 ||
            (p.subGenre !== undefined && selectedSubGenres.includes(p.subGenre));
          return genreMatch && subGenreMatch;
        }
        if (p.type === "community" && selectedGenres.length > 0) {
          return p.genres.some((g) => selectedGenres.includes(g));
        }
        return true;
      });
    }

    if (selectedCategories.length > 0) {
      result = result.filter((p) => {
        if (p.type === "community") return selectedCategories.includes(p.category);
        return true;
      });
    }

    // Pinned posts always float to the top
    const pinned = result.filter(
      (p) => (p.type === "community" && p.pinned) || (p.type === "track" && p.pinned)
    );
    const rest = result.filter(
      (p) => !((p.type === "community" && p.pinned) || (p.type === "track" && p.pinned))
    );

    switch (sort) {
      case "Most Liked":
        rest.sort((a, b) => b.likes - a.likes);
        break;
      case "Most Discussed":
        rest.sort((a, b) => b.commentCount - a.commentCount);
        break;
      default:
        rest.sort(
          (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
        );
    }

    return [...pinned, ...rest];
  }, [allPosts, postTypeTab, selectedGenres, selectedSubGenres, selectedCategories, sort]);

  const filteredAlbumGroups = useMemo(() => {
    if (postTypeTab === "community") return [];
    if (selectedGenres.length === 0) return serverAlbumGroups;
    return serverAlbumGroups.filter((g) => selectedGenres.includes(g.genre));
  }, [serverAlbumGroups, postTypeTab, selectedGenres]);

  const topArtists = [...artists].sort((a, b) => b.followers - a.followers).slice(0, 4);
  const activeFiltersCount =
    selectedGenres.length + selectedSubGenres.length + selectedCategories.length;

  const trackCount = allPosts.filter((p) => p.type === "track").length;
  const communityCount = allPosts.filter((p) => p.type === "community").length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex gap-6">
        {/* Left sidebar */}
        <div className="hidden lg:block w-52 flex-shrink-0">
          <div className="sticky top-20">
            <FeedFilter
              postTypeTab={postTypeTab}
              onTabChange={setPostTypeTab}
              selectedGenres={selectedGenres}
              selectedSubGenres={selectedSubGenres}
              onGenreToggle={toggleGenre}
              onSubGenreToggle={toggleSubGenre}
              selectedCategories={selectedCategories}
              onCategoryToggle={toggleCategory}
              onClear={clearFilters}
            />
          </div>
        </div>

        {/* Main feed */}
        <div className="flex-1 min-w-0">
          {/* Source badge */}
          {fromLastFm && (
            <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
              <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm-1 5v6l5 3-1 1.732-6-3.464V7h2z" />
              </svg>
              Track discussions sourced live from Last.fm
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white transition-colors"
                onClick={() => setShowMobileFilter(!showMobileFilter)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
                Filter
                {activeFiltersCount > 0 && (
                  <span className="ml-1 w-4 h-4 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              <span className="text-gray-500 text-sm">{filteredPosts.length} posts</span>
            </div>
            <div className="flex items-center gap-1 bg-[#13131f] border border-white/5 rounded-lg p-1">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSort(opt)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    sort === opt ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile filter */}
          {showMobileFilter && (
            <div className="lg:hidden mb-4">
              <FeedFilter
                postTypeTab={postTypeTab}
                onTabChange={setPostTypeTab}
                selectedGenres={selectedGenres}
                selectedSubGenres={selectedSubGenres}
                onGenreToggle={toggleGenre}
                onSubGenreToggle={toggleSubGenre}
                selectedCategories={selectedCategories}
                onCategoryToggle={toggleCategory}
                onClear={clearFilters}
              />
            </div>
          )}

          {/* Active filter chips */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedGenres.map((g) => (
                <span key={g} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs border border-orange-500/30">
                  {g}
                  <button onClick={() => toggleGenre(g)} className="hover:text-white ml-0.5">×</button>
                </span>
              ))}
              {selectedSubGenres.map((sg) => (
                <span key={sg} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs border border-orange-500/30">
                  {sg}
                  <button onClick={() => toggleSubGenre(sg)} className="hover:text-white ml-0.5">×</button>
                </span>
              ))}
              {selectedCategories.map((c) => (
                <span key={c} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs border border-purple-500/30">
                  {c}
                  <button onClick={() => toggleCategory(c)} className="hover:text-white ml-0.5">×</button>
                </span>
              ))}
            </div>
          )}

          {/* Album groups */}
          {filteredAlbumGroups.length > 0 && (
            <div className="mb-5">
              <h2 className="text-xs font-semibold text-blue-400/70 uppercase tracking-wider mb-2">
                💿 Albums & EPs in Feed
              </h2>
              <div className="space-y-3">
                {filteredAlbumGroups.map((group) => (
                  <AlbumCard key={group.releaseId} group={group} />
                ))}
              </div>
            </div>
          )}

          {/* Feed */}
          <div className="space-y-3">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <p>No posts match your filters.</p>
                <button onClick={clearFilters} className="mt-2 text-orange-400 hover:underline text-sm">
                  Clear filters
                </button>
              </div>
            ) : (
              filteredPosts.map((post) => {
                if (post.type === "track") {
                  return <TrackDiscussionCard key={post.id} post={post as TrackDiscussionPost} />;
                }
                return <CommunityPostCard key={post.id} post={post as CommunityPost} />;
              })
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="hidden xl:block w-64 flex-shrink-0">
          <div className="sticky top-20 space-y-4">
            {/* Community stats */}
            <div className="bg-[#13131f] border border-white/5 rounded-xl p-4">
              <h2 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Community</h2>
              <div className="space-y-2">
                {[
                  { label: "Track discussions", value: trackCount },
                  { label: "Community posts", value: communityCount },
                  {
                    label: "Data source",
                    value: fromLastFm ? "Last.fm" : "Mock data",
                    highlight: fromLastFm,
                  },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{stat.label}</span>
                    <span className={`font-semibold ${"highlight" in stat && stat.highlight ? "text-red-400" : "text-orange-400"}`}>
                      {stat.value}
                    </span>
                  </div>
                ))}
                {cacheAge && fromLastFm && (
                  <div className="flex items-center justify-between text-sm pt-1 border-t border-white/5 mt-1">
                    <span className="text-gray-600">Last updated</span>
                    <span className="text-gray-500 text-xs">{cacheAge.display}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Top artists */}
            <div className="bg-[#13131f] border border-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-white text-xs uppercase tracking-wider">Top Artists</h2>
                <Link href="/artists" className="text-xs text-orange-400 hover:text-orange-300">
                  See all
                </Link>
              </div>
              <div className="space-y-2">
                {topArtists.map((artist) => (
                  <Link key={artist.id} href={`/artists/${artist.id}`}>
                    <div className="flex items-center gap-3 hover:bg-white/5 rounded-lg p-1.5 -mx-1.5 transition-colors group">
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${artist.avatarColor} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                        {artist.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <p className="font-medium text-xs text-white group-hover:text-orange-400 transition-colors truncate">
                            {artist.name}
                          </p>
                          {artist.verified && (
                            <svg className="w-3 h-3 text-orange-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{formatNumber(artist.followers)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Trending tags */}
            <div className="bg-[#13131f] border border-white/5 rounded-xl p-4">
              <h2 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Trending Tags</h2>
              <div className="flex flex-wrap gap-1.5">
                {["Mumbai", "Delhi", "underground", "classic", "bhangra", "trap", "conscious", "lyrical", "viral"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full bg-white/5 text-gray-400 text-xs border border-white/10 hover:border-orange-500/30 hover:text-orange-400 cursor-pointer transition-colors"
                    >
                      #{tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
