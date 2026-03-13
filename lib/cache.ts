/**
 * Reads the static music cache from public/data/music-cache.json.
 * The file is generated at build time by scripts/fetchMusicData.ts.
 * Falls back to empty arrays gracefully if the file doesn't exist yet.
 */

import { readFileSync } from "fs";
import { join } from "path";
import type { EnrichedLfmTrack } from "./lastfm";
import type { SerializedAlbumGroup } from "./types";

interface MusicCache {
  generatedAt: string;
  tracks: EnrichedLfmTrack[];
  albumGroups: SerializedAlbumGroup[];
}

function loadCache(): MusicCache {
  try {
    const filePath = join(process.cwd(), "public", "data", "music-cache.json");
    const raw = readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as MusicCache;
  } catch {
    return { generatedAt: new Date().toISOString(), tracks: [], albumGroups: [] };
  }
}

// Loaded once at module initialization — stays in memory for the lifetime
// of the server instance. ISR re-runs will reload the module with fresh data.
const cache = loadCache();

export function getCachedTracks(): EnrichedLfmTrack[] {
  return cache.tracks;
}

export function getCachedAlbumGroups(): SerializedAlbumGroup[] {
  return cache.albumGroups;
}

/** Returns how many minutes ago the cache was generated (for display). */
export function getCacheAge(): { minutes: number; display: string } {
  const generated = new Date(cache.generatedAt);
  const ms = Date.now() - generated.getTime();
  const minutes = Math.floor(ms / 60_000);
  const hours = Math.floor(minutes / 60);
  const display =
    minutes < 1
      ? "just now"
      : minutes < 60
      ? `${minutes}m ago`
      : `${hours}h ago`;
  return { minutes, display };
}
