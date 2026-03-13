const MB_BASE = "https://musicbrainz.org/ws/2/";
const USER_AGENT = "DesiHipHopCommunity/1.0 (contact@desihiphopapp.example)";

// ── Public types ──────────────────────────────────────────────────────────────

export interface MbReleaseData {
  releaseId: string;
  releaseTitle: string;
  releaseType: "Album" | "EP" | "Mixtape" | "Single";
  releaseYear: number | null;
  trackCount: number;
}

// ── Internal MusicBrainz response shapes ──────────────────────────────────────

interface MbRelease {
  id: string;
  title: string;
  date?: string;
  "track-count": number;
  "release-group": {
    id: string;
    title: string;
    "primary-type"?: string;
    "secondary-types"?: string[];
  };
}

interface MbRecording {
  id: string;
  score: number;
  title: string;
  "first-release-date"?: string;
  "artist-credit": Array<{
    name?: string;
    artist: { id: string; name: string };
  }>;
  releases?: MbRelease[];
}

interface MbRecordingSearchResponse {
  count: number;
  recordings: MbRecording[];
}

interface MbReleaseTrack {
  position: number;
  title: string;
  length: number | null;
}

interface MbReleaseResponse {
  id: string;
  title: string;
  media: Array<{ tracks: MbReleaseTrack[] }>;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeForSearch(s: string): string {
  return s
    .toLowerCase()
    .replace(/\$/, "s")
    .replace(/\bfeat\.?\s+.*/gi, "")
    .replace(/\bft\.?\s+.*/gi, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Sørensen–Dice coefficient on character bigrams */
function stringSimilarity(a: string, b: string): number {
  const na = normalizeForSearch(a);
  const nb = normalizeForSearch(b);
  if (na === nb) return 1;
  if (!na || !nb) return 0;

  const bigrams = (s: string): string[] => {
    const result: string[] = [];
    for (let i = 0; i < s.length - 1; i++) result.push(s.slice(i, i + 2));
    return result;
  };

  const ab = bigrams(na);
  const bb = bigrams(nb);
  if (ab.length === 0 || bb.length === 0) return 0;

  const bMap = new Map<string, number>();
  for (const g of bb) bMap.set(g, (bMap.get(g) ?? 0) + 1);

  let intersection = 0;
  for (const g of ab) {
    const count = bMap.get(g) ?? 0;
    if (count > 0) {
      intersection++;
      bMap.set(g, count - 1);
    }
  }

  return (2 * intersection) / (ab.length + bb.length);
}

function mapReleaseType(
  primaryType?: string,
  secondaryTypes?: string[]
): MbReleaseData["releaseType"] {
  if (secondaryTypes?.includes("Mixtape/Street")) return "Mixtape";
  if (primaryType === "Album") return "Album";
  if (primaryType === "EP") return "EP";
  return "Single";
}

function parseYear(dateStr?: string): number | null {
  if (!dateStr) return null;
  const y = parseInt(dateStr.slice(0, 4), 10);
  return Number.isFinite(y) && y > 1900 ? y : null;
}

function formatMsDuration(ms: number): string {
  const secs = Math.floor(ms / 1000);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ── Core fetch wrapper ────────────────────────────────────────────────────────

async function mbFetch<T>(path: string): Promise<T | null> {
  const url = `${MB_BASE}${path}`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// ── Public API functions ──────────────────────────────────────────────────────

/**
 * Search MusicBrainz for the release a track belongs to.
 * Returns null if no confident match is found (≥70% similarity on both
 * artist and track name).
 */
export async function searchRelease(
  artist: string,
  track: string
): Promise<MbReleaseData | null> {
  const artistQ = encodeURIComponent(`"${normalizeForSearch(artist)}"`);
  const trackQ = encodeURIComponent(`"${normalizeForSearch(track)}"`);

  const data = await mbFetch<MbRecordingSearchResponse>(
    `recording?query=artist:${artistQ}+recording:${trackQ}&limit=3&fmt=json`
  );

  if (!data?.recordings?.length) return null;

  // Find the first recording where both artist and track name are ≥70% similar
  let bestRecording: MbRecording | null = null;
  for (const rec of data.recordings) {
    const recArtist =
      rec["artist-credit"]?.[0]?.name ??
      rec["artist-credit"]?.[0]?.artist?.name ??
      "";
    const artistSim = stringSimilarity(artist, recArtist);
    const trackSim = stringSimilarity(track, rec.title);

    if (artistSim >= 0.7 && trackSim >= 0.7) {
      bestRecording = rec;
      break;
    }
  }

  if (!bestRecording?.releases?.length) return null;

  // Prefer the release that has a typed release-group (not a compilation)
  const release =
    bestRecording.releases.find((r) => r["release-group"]?.["primary-type"]) ??
    bestRecording.releases[0];

  const rg = release["release-group"];
  const year =
    parseYear(release.date) ??
    parseYear(bestRecording["first-release-date"]);

  return {
    releaseId: release.id,
    releaseTitle: rg?.title ?? release.title,
    releaseType: mapReleaseType(rg?.["primary-type"], rg?.["secondary-types"]),
    releaseYear: year,
    trackCount: release["track-count"],
  };
}

/**
 * Fetch the full tracklist for a MusicBrainz release.
 */
export async function getReleaseTracklist(
  releaseId: string
): Promise<Array<{ position: number; title: string; duration: string }>> {
  const data = await mbFetch<MbReleaseResponse>(
    `release/${releaseId}?inc=recordings&fmt=json`
  );

  if (!data?.media?.length) return [];

  return data.media
    .flatMap((m) => m.tracks)
    .map((t) => ({
      position: t.position,
      title: t.title,
      duration: t.length ? formatMsDuration(t.length) : "—",
    }));
}
