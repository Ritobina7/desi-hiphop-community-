import { TrackDiscussionPost, Genre, YtData, SerializedAlbumGroup, SerializedAlbumTrack } from "./types";
import { MbReleaseData, searchRelease, delay } from "./musicbrainz";
import { getYouTubeViews, getYtLabel } from "./youtube";

const BASE = "http://ws.audioscrobbler.com/2.0/";

// ── Response types ────────────────────────────────────────────────────────────

export interface LfmImage {
  "#text": string;
  size: "small" | "medium" | "large" | "extralarge" | "mega";
}

/** Shape returned by tag.getTopTracks */
export interface LfmTagTrack {
  name: string;
  duration: string; // seconds as string, often "0"
  mbid: string;
  url: string;
  artist: { name: string; mbid: string; url: string };
  image: LfmImage[];
  "@attr": { rank: string };
}

/** Shape returned by track.getInfo */
export interface LfmTrackInfo {
  name: string;
  mbid?: string;
  url: string;
  duration: string; // milliseconds as string
  listeners: string;
  playcount: string;
  artist: { name: string; mbid?: string; url: string };
  album?: { artist: string; title: string; mbid?: string; url: string; image: LfmImage[] };
  toptags: { tag: Array<{ name: string; url: string }> };
  wiki?: { published: string; summary: string; content: string };
}

/** Shape returned by artist.getInfo */
export interface LfmArtistInfo {
  name: string;
  mbid?: string;
  url: string;
  image: LfmImage[];
  stats: { listeners: string; playcount: string };
  similar: {
    artist: Array<{ name: string; url: string; image: LfmImage[] }>;
  };
  tags: { tag: Array<{ name: string; url: string }> };
  bio: { links: unknown; published: string; summary: string; content: string };
}

/** Enriched track returned by getDesiHipHopTracks */
export interface EnrichedLfmTrack {
  id: string;           // "lfm-krsna-god-keyboard"
  title: string;        // original title from Last.fm
  artistName: string;   // original artist name from Last.fm
  playcount: number;
  listeners: number;
  tags: string[];       // from track.getInfo toptags
  coverArt: string | null;
  sourceTags: string[]; // which DHH tags this track was found under
  url: string;
  duration: string;     // formatted "m:ss"
  mbData: MbReleaseData | null; // MusicBrainz release info (null = unmatched)
  ytData: YtData | null;        // YouTube view count enrichment
  genre: Genre;                 // inferred from tags
}

/** A release (Album/EP/Mixtape) with 2+ tracks present in the feed */
export interface AlbumGroup {
  releaseId: string;
  releaseTitle: string;
  releaseType: "Album" | "EP" | "Mixtape" | "Single";
  releaseYear: number | null;
  artistName: string;
  trackCount: number;          // total tracks on the release (from MusicBrainz)
  tracks: EnrichedLfmTrack[];  // tracks from our feed belonging to this release
  topTrack: string;            // highest-playcount track title
}

/** Full result from the DHH pipeline */
export interface DesiHipHopData {
  tracks: EnrichedLfmTrack[];          // all 20 tracks (for feed, ordered by playcount)
  standaloneTracks: EnrichedLfmTrack[]; // singles + tracks whose release has <2 entries in feed
  albumGroups: AlbumGroup[];           // releases with 2+ tracks in the feed
  serializedAlbumGroups: SerializedAlbumGroup[]; // client-safe serialized form
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Strip HTML tags and Last.fm read-more links from wiki/bio text */
export function stripHtml(html: string): string {
  return html
    .replace(/<a[^>]*>\s*Read more on Last\.fm\s*\.?\s*<\/a>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Convert seconds string → "m:ss" */
export function formatDurationSecs(secs: string): string {
  const n = parseInt(secs, 10);
  if (!n || n <= 0) return "—";
  const m = Math.floor(n / 60);
  const s = n % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Convert milliseconds string → "m:ss" */
export function formatDurationMs(ms: string): string {
  const n = parseInt(ms, 10);
  if (!n || n <= 0) return "—";
  return formatDurationSecs(String(Math.floor(n / 1000)));
}

/** Pick the best available image URL from a Last.fm image array */
export function getArtistImage(
  images: LfmImage[],
  prefer: LfmImage["size"] = "extralarge"
): string {
  const priority: LfmImage["size"][] = [prefer, "extralarge", "mega", "large", "medium", "small"];
  for (const size of priority) {
    const hit = images.find((i) => i.size === size && i["#text"]);
    if (hit) return hit["#text"];
  }
  return "";
}

/**
 * Normalize a track/artist name for dedup comparison:
 * "Kr$na" → "krsna", "Jungli Sher (feat. MC Altaf)" → "jungli sher"
 */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/\$/, "s")                      // Kr$na → krsna
    .replace(/\bfeat\.?\s+[^)]+/gi, "")      // feat. X or feat X
    .replace(/\bft\.?\s+[^)]+/gi, "")        // ft. X or ft X
    .replace(/\([^)]*\)/g, "")               // remove anything in ()
    .replace(/[^a-z0-9\s]/g, "")             // strip remaining special chars
    .replace(/\s+/g, " ")
    .trim();
}

/** Create a stable ID from artist + title */
function makeId(artist: string, title: string): string {
  const a = normalize(artist).replace(/\s+/g, "-");
  const t = normalize(title).replace(/\s+/g, "-");
  return `lfm-${a}-${t}`.replace(/-{2,}/g, "-").replace(/-$/, "");
}

// ── Core fetch wrapper ─────────────────────────────────────────────────────────

async function lfmFetch<T>(params: Record<string, string>): Promise<T | null> {
  const key = process.env.LASTFM_API_KEY;
  if (!key) {
    // No key set — callers fall back to mock data
    return null;
  }

  const url = new URL(BASE);
  Object.entries({ ...params, api_key: key, format: "json" }).forEach(([k, v]) =>
    url.searchParams.set(k, v)
  );

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 }, // cache for 1 hour
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (typeof data === "object" && data !== null && "error" in data) return null;
    return data as T;
  } catch {
    return null;
  }
}

// ── Public API functions ───────────────────────────────────────────────────────

export async function getTagTopTracks(tag: string, limit = 10): Promise<LfmTagTrack[]> {
  const data = await lfmFetch<{ tracks: { track: LfmTagTrack[] } }>({
    method: "tag.getTopTracks",
    tag,
    limit: String(limit),
  });
  const raw = data?.tracks?.track;
  if (!Array.isArray(raw)) return [];
  return raw;
}

export async function getTrackInfo(
  artist: string,
  track: string
): Promise<LfmTrackInfo | null> {
  const data = await lfmFetch<{ track: LfmTrackInfo }>({
    method: "track.getInfo",
    artist,
    track,
  });
  return data?.track ?? null;
}

export async function getArtistInfo(artist: string): Promise<LfmArtistInfo | null> {
  const data = await lfmFetch<{ artist: LfmArtistInfo }>({
    method: "artist.getInfo",
    artist,
  });
  return data?.artist ?? null;
}

// ── Multi-tag fetch for home feed ─────────────────────────────────────────────

const DESI_TAGS = [
  "desi hip hop",
  "indian hip hop",
  "hindi rap",
  "gully rap",
  "punjabi hip hop",
  "desi rap",
  "indian rap",
  "mumbai rap",
  "delhi rap",
  "tamil rap",
  "bengali rap",
  "trap hindi",
  "underground indian hip hop",
  "desi trap",
] as const;

// How many deduped candidates to enrich with track.getInfo before final sort
const ENRICH_LIMIT = 40;

// Delay between MusicBrainz requests (ms) — MusicBrainz rate limit is 1 req/sec
const MB_DELAY_MS = 1100;

export async function getDesiHipHopTracks(): Promise<DesiHipHopData> {
  // ── Phase 1: fetch all 14 tag track lists in parallel ─────────────────────
  const tagResults = await Promise.all(
    DESI_TAGS.map((tag) =>
      getTagTopTracks(tag, 10)
        .then((tracks) => ({ tag, tracks }))
        .catch(() => ({ tag, tracks: [] as LfmTagTrack[] }))
    )
  );

  const rawCount = tagResults.reduce((sum, r) => sum + r.tracks.length, 0);

  // ── Phase 2: deduplicate by normalized key ─────────────────────────────────
  const groups = new Map<
    string,
    { track: LfmTagTrack; sourceTags: string[]; bestRank: number }
  >();

  for (const { tag, tracks } of tagResults) {
    for (const t of tracks) {
      const key = normalize(t.artist.name) + "|" + normalize(t.name);
      const rank = parseInt(t["@attr"].rank, 10) || 999;
      const existing = groups.get(key);

      if (!existing) {
        groups.set(key, { track: t, sourceTags: [tag], bestRank: rank });
      } else {
        if (!existing.sourceTags.includes(tag)) existing.sourceTags.push(tag);
        if (rank < existing.bestRank) {
          existing.track = t;
          existing.bestRank = rank;
        }
      }
    }
  }

  const uniqueCount = groups.size;
  console.log(
    `Last.fm fetch complete: ${rawCount} raw tracks → ${uniqueCount} unique tracks after dedup (${rawCount - uniqueCount} duplicates removed)`
  );

  // ── Phase 3: enrich top candidates with track.getInfo ─────────────────────
  const candidates = Array.from(groups.values())
    .sort((a, b) => a.bestRank - b.bestRank)
    .slice(0, ENRICH_LIMIT);

  const lfmEnriched = await Promise.all(
    candidates.map(async ({ track, sourceTags }) => {
      const info = await getTrackInfo(track.artist.name, track.name).catch(() => null);

      const playcount = info?.playcount ? parseInt(info.playcount, 10) : 0;
      const listeners = info?.listeners ? parseInt(info.listeners, 10) : 0;
      const tags = info?.toptags?.tag?.map((t) => t.name).filter(Boolean) ?? [];
      const coverArt =
        (info?.album?.image ? getArtistImage(info.album.image) : "") ||
        (track.image?.length ? getArtistImage(track.image) : "") ||
        null;
      const duration = info?.duration
        ? formatDurationMs(info.duration)
        : formatDurationSecs(track.duration);

      return {
        id: makeId(track.artist.name, track.name),
        title: info?.name ?? track.name,
        artistName: info?.artist.name ?? track.artist.name,
        playcount,
        listeners,
        tags,
        coverArt: coverArt || null,
        sourceTags,
        url: info?.url ?? track.url,
        duration,
        mbData: null as MbReleaseData | null, // filled in Phase 4
        ytData: null as YtData | null,        // filled in Phase 5
        genre: inferGenre([...tags, ...sourceTags]),
      } satisfies EnrichedLfmTrack;
    })
  );

  // Sort by playcount and take top 20 before hitting MusicBrainz
  const top20 = lfmEnriched.sort((a, b) => b.playcount - a.playcount).slice(0, 20);

  // ── Phase 4: enrich with MusicBrainz (sequential, 1s between requests) ────
  for (let i = 0; i < top20.length; i++) {
    if (i > 0) await delay(MB_DELAY_MS);
    top20[i].mbData = await searchRelease(top20[i].artistName, top20[i].title).catch(
      () => null
    );
  }

  // ── Phase 5: enrich with YouTube view counts (sequential, skip if cached) ─
  const YT_DELAY_MS = 200;
  for (let i = 0; i < top20.length; i++) {
    const t0 = Date.now();
    const ytResult = await getYouTubeViews(top20[i].artistName, top20[i].title).catch(() => null);
    if (ytResult) {
      top20[i].ytData = {
        viewCount: ytResult.viewCount,
        videoId: ytResult.videoId,
        label: getYtLabel(ytResult),
      };
    }
    const elapsed = Date.now() - t0;
    if (i < top20.length - 1 && elapsed > 100) await delay(YT_DELAY_MS);
  }

  // ── Phase 6: group by releaseId ───────────────────────────────────────────
  const releaseMap = new Map<string, EnrichedLfmTrack[]>();
  for (const track of top20) {
    if (!track.mbData) continue;
    const rid = track.mbData.releaseId;
    const group = releaseMap.get(rid) ?? [];
    group.push(track);
    releaseMap.set(rid, group);
  }

  const albumGroups: AlbumGroup[] = [];
  const albumReleasIds = new Set<string>();

  for (const [releaseId, groupTracks] of releaseMap) {
    if (groupTracks.length < 2) continue; // only form a group if 2+ tracks

    albumReleasIds.add(releaseId);
    const sorted = [...groupTracks].sort((a, b) => b.playcount - a.playcount);
    const rep = groupTracks[0]; // representative for release metadata

    albumGroups.push({
      releaseId,
      releaseTitle: rep.mbData!.releaseTitle,
      releaseType: rep.mbData!.releaseType,
      releaseYear: rep.mbData!.releaseYear,
      artistName: sorted[0].artistName,
      trackCount: rep.mbData!.trackCount,
      tracks: sorted,
      topTrack: sorted[0].title,
    });
  }

  const standaloneTracks = top20.filter(
    (t) => !t.mbData || !albumReleasIds.has(t.mbData.releaseId)
  );

  // ── Serialize album groups for client components ───────────────────────────
  const serializedAlbumGroups: SerializedAlbumGroup[] = albumGroups.map((g) => {
    const sorted = [...g.tracks].sort((a, b) => b.playcount - a.playcount);
    const topTitle = sorted[0]?.title ?? "";
    const serializedTracks: SerializedAlbumTrack[] = sorted.map((t) => ({
      id: t.id,
      title: t.title,
      artistName: t.artistName,
      duration: t.duration,
      playcount: t.playcount,
      ytViewCount: t.ytData?.viewCount ?? null,
      ytLabel: t.ytData?.label ?? null,
      isTopTrack: t.title === topTitle,
    }));
    return {
      releaseId: g.releaseId,
      releaseTitle: g.releaseTitle,
      releaseType: g.releaseType,
      releaseYear: g.releaseYear,
      artistName: g.artistName,
      releaseTrackCount: g.trackCount,
      topTrack: g.topTrack,
      totalPlaycount: sorted.reduce((sum, t) => sum + t.playcount, 0),
      genre: sorted[0]?.genre ?? "Gully Rap",
      tracks: serializedTracks,
    };
  });

  // ── Sanity check log ──────────────────────────────────────────────────────
  const mbEnrichedCount = top20.filter((t) => t.mbData !== null).length;
  const unmatchedCount = top20.length - mbEnrichedCount;
  const ytHit = top20.filter((t) => t.ytData !== null);
  const ytMiss = top20.filter((t) => t.ytData === null);
  const ytSorted = [...ytHit].sort(
    (a, b) => (b.ytData?.viewCount ?? 0) - (a.ytData?.viewCount ?? 0)
  );
  const topYt = ytSorted[0];
  const groupLines = albumGroups.map(
    (g) => `  ${g.artistName} - ${g.releaseTitle} (${g.releaseType}, ${g.tracks.length} tracks)`
  );
  const ytLines = ytSorted.slice(0, 5).map(
    (t) =>
      `  ${t.artistName} - ${t.title}: ${(t.ytData!.viewCount! / 1_000_000).toFixed(1)}M ${t.ytData!.label}`
  );
  const ytMissLines = ytMiss.map((t) => `  ${t.artistName} - ${t.title}`);
  console.log(
    [
      `── Step 3 Sanity Check ───────────────────────────`,
      `MusicBrainz: ${mbEnrichedCount} matched, ${unmatchedCount} unmatched`,
      `YouTube: ${ytHit.length} with views, ${ytMiss.length} without`,
      ytHit.length > 0
        ? `Top 5 by YT views:\n${ytLines.join("\n")}`
        : `Top by YT views: none`,
      ytMiss.length > 0
        ? `No YT match:\n${ytMissLines.join("\n")}`
        : `No YT match: none`,
      `Album groups: ${albumGroups.length}`,
      albumGroups.length > 0 ? `Groups:\n${groupLines.join("\n")}` : `Groups: none`,
      `─────────────────────────────────────────────────`,
    ].join("\n")
  );

  return { tracks: top20, standaloneTracks, albumGroups, serializedAlbumGroups };
}

// ── Converter: EnrichedLfmTrack → feed posts ──────────────────────────────────

const COVER_PALETTE = [
  { coverColor: "from-orange-900 to-red-950", coverAccent: "bg-orange-500" },
  { coverColor: "from-purple-900 to-indigo-950", coverAccent: "bg-purple-500" },
  { coverColor: "from-green-900 to-emerald-950", coverAccent: "bg-green-500" },
  { coverColor: "from-blue-900 to-cyan-950", coverAccent: "bg-blue-500" },
  { coverColor: "from-pink-900 to-rose-950", coverAccent: "bg-pink-500" },
  { coverColor: "from-yellow-900 to-amber-950", coverAccent: "bg-yellow-400" },
  { coverColor: "from-teal-900 to-green-950", coverAccent: "bg-teal-500" },
  { coverColor: "from-red-900 to-pink-950", coverAccent: "bg-red-500" },
  { coverColor: "from-slate-800 to-gray-900", coverAccent: "bg-slate-500" },
] as const;

const TAG_GENRE_MAP: Record<string, Genre> = {
  "desi hip hop": "Gully Rap",
  "indian hip hop": "Gully Rap",
  "hindi rap": "Gully Rap",
  "gully rap": "Gully Rap",
  "hindi music": "Gully Rap",
  "punjabi hip hop": "Punjabi Hip Hop",
  punjabi: "Punjabi Hip Hop",
  bhangra: "Bhangra Fusion",
  "bhangra fusion": "Bhangra Fusion",
  trap: "Trap",
  "desi trap": "Trap",
  "trap hindi": "Trap",
  "hip-hop": "Gully Rap",
  "hip hop": "Gully Rap",
  rap: "Gully Rap",
  "tamil hip hop": "Tamil Hip Hop",
  "tamil rap": "Tamil Hip Hop",
  "bengali rap": "Bengali Hip Hop",
  sufi: "Sufi Rap",
  "lo-fi": "Lo-fi Desi",
  "old school hip hop": "Old School",
};

function inferGenre(tagNames: string[]): Genre {
  for (const tag of tagNames) {
    const mapped = TAG_GENRE_MAP[tag.toLowerCase()];
    if (mapped) return mapped;
  }
  return "Gully Rap";
}

export function lfmTracksToFeedPosts(lfmTracks: EnrichedLfmTrack[]): TrackDiscussionPost[] {
  return lfmTracks.map((t, i) => {
    const palette = COVER_PALETTE[i % COVER_PALETTE.length];

    return {
      id: t.id,
      type: "track" as const,
      trackId: undefined,
      trackTitle: t.title,
      artistName: t.artistName,
      genre: t.genre,
      coverColor: palette.coverColor,
      coverAccent: palette.coverAccent,
      duration: t.duration,
      userText: "",
      author: "Last.fm",
      authorColor: "bg-red-600",
      likes: 0,
      commentCount: 0,
      plays: t.playcount,
      postedAt: new Date().toISOString(),
      lastFmUrl: t.url,
      lastFmListeners: t.listeners,
      ytData: t.ytData,
    };
  });
}
