const YT_BASE = "https://www.googleapis.com/youtube/v3/";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface YtVideoData {
  viewCount: number;
  videoId: string;
  videoTitle: string;
  isOfficialVideo: boolean;
  isAudioOnly: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function normalizeStr(s: string): string {
  return s
    .toLowerCase()
    .replace(/\$/g, "s")          // Kr$na → krsna
    .replace(/[/\\|]+/g, " ")     // PAPER KAMA / PAPER CUTS → split on slash
    .replace(/[^a-z0-9\s]/g, "")  // strip remaining special chars
    .replace(/\s+/g, " ")
    .trim();
}

function bigramDice(a: string, b: string): number {
  const na = normalizeStr(a);
  const nb = normalizeStr(b);
  if (na === nb) return 1;
  if (na.length < 2 || nb.length < 2) return 0;
  const bigrams = (s: string) =>
    Array.from({ length: s.length - 1 }, (_, i) => s.slice(i, i + 2));
  const ab = bigrams(na);
  const bb = bigrams(nb);
  const bMap = new Map<string, number>();
  for (const g of bb) bMap.set(g, (bMap.get(g) ?? 0) + 1);
  let hit = 0;
  for (const g of ab) {
    const c = bMap.get(g) ?? 0;
    if (c > 0) { hit++; bMap.set(g, c - 1); }
  }
  return (2 * hit) / (ab.length + bb.length);
}

export function getYtLabel(
  data: Pick<YtVideoData, "isOfficialVideo" | "isAudioOnly">
): string {
  if (data.isOfficialVideo) return "🎬 YT Views";
  if (data.isAudioOnly) return "🎵 YT Audio Views";
  return "▶️ YT Views";
}

// ── Internal response types ───────────────────────────────────────────────────

interface YtSearchResponse {
  items?: Array<{
    id: { videoId: string };
    snippet: { title: string; channelTitle: string };
  }>;
}

interface YtVideoStatsResponse {
  items?: Array<{
    statistics: { viewCount: string };
  }>;
}

// ── Fetch wrapper ─────────────────────────────────────────────────────────────

async function ytFetch<T>(path: string): Promise<T | null> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(`${YT_BASE}${path}&key=${encodeURIComponent(key)}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// ── Public function ───────────────────────────────────────────────────────────

/**
 * Search YouTube for the best matching video for a track, then fetch its
 * view count. Returns null if no confident match is found (score < 2) or
 * if YOUTUBE_API_KEY is not set.
 *
 * Scoring per video result:
 *   +2  title contains normalised artist name
 *   +2  title contains normalised track name
 *   +3  channel name ≥70% similar to artist name
 *   +1  title contains "official video"
 *   +1  title contains "official audio" or "lyric"
 *   -3  title contains "remix" or "cover"
 */
export async function getYouTubeViews(
  artist: string,
  track: string
): Promise<YtVideoData | null> {
  if (!process.env.YOUTUBE_API_KEY) return null;

  const q = encodeURIComponent(`${artist} ${track} official`);
  const searchData = await ytFetch<YtSearchResponse>(
    `search?part=snippet&q=${q}&type=video&maxResults=3`
  );
  if (!searchData?.items?.length) return null;

  const normArtist = normalizeStr(artist);
  const normTrack = normalizeStr(track);

  let bestVideo: {
    videoId: string;
    videoTitle: string;
    score: number;
  } | null = null;

  for (const item of searchData.items) {
    const title = item.snippet.title;
    const normTitle = normalizeStr(title);
    let score = 0;
    if (normTitle.includes(normArtist)) {
      score += 2;
    } else {
      // Partial match: first word of artist name (if meaningful length)
      const firstWord = normArtist.split(" ")[0];
      if (firstWord.length >= 4 && normTitle.includes(firstWord)) score += 1;
    }
    if (normTitle.includes(normTrack)) score += 2;
    if (bigramDice(artist, item.snippet.channelTitle) >= 0.7) score += 3;
    if (normTitle.includes("official video")) score += 1;
    if (normTitle.includes("official audio") || normTitle.includes("lyric")) score += 1;
    if (normTitle.includes("remix") || normTitle.includes("cover")) score -= 3;

    if (score >= 1 && (!bestVideo || score > bestVideo.score)) {
      bestVideo = { videoId: item.id.videoId, videoTitle: title, score };
    }
  }
  if (!bestVideo) return null;

  // Separate fetch for view count statistics
  const statsData = await ytFetch<YtVideoStatsResponse>(
    `videos?part=statistics&id=${bestVideo.videoId}`
  );
  const viewCountStr = statsData?.items?.[0]?.statistics?.viewCount;
  if (!viewCountStr) return null;

  const normTitle = normalizeStr(bestVideo.videoTitle);
  return {
    viewCount: parseInt(viewCountStr, 10),
    videoId: bestVideo.videoId,
    videoTitle: bestVideo.videoTitle,
    isOfficialVideo: normTitle.includes("official video"),
    isAudioOnly: normTitle.includes("official audio") || normTitle.includes("lyric"),
  };
}
