/**
 * Build-time script: runs the full music data pipeline and writes a static
 * JSON cache to public/data/music-cache.json.
 *
 * Run: npm run fetch-music
 * Called automatically by the "prebuild" npm script.
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

// Load .env.local before any API calls so keys are available.
// process.env is read lazily inside each API function, so setting it here
// (before calling getDesiHipHopTracks) is sufficient.
try {
  const envRaw = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
  for (const line of envRaw.split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.+)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
} catch {
  // No .env.local — assume env vars are already in the environment (Vercel, CI)
}

import { getDesiHipHopTracks } from "../lib/lastfm";

async function main() {
  console.log("Building music cache…");

  const data = await getDesiHipHopTracks();

  if (data.tracks.length === 0) {
    console.warn(
      "Warning: pipeline returned 0 tracks. " +
        "Check that LASTFM_API_KEY and YOUTUBE_API_KEY are set."
    );
  }

  const cache = {
    generatedAt: new Date().toISOString(),
    tracks: data.standaloneTracks,
    albumGroups: data.serializedAlbumGroups,
  };

  const dir = join(process.cwd(), "public", "data");
  mkdirSync(dir, { recursive: true });

  const filePath = join(dir, "music-cache.json");
  const json = JSON.stringify(cache, null, 2);
  writeFileSync(filePath, json, "utf-8");

  const sizeKb = Math.round(Buffer.byteLength(json, "utf-8") / 1024);
  console.log(
    [
      "Cache built successfully:",
      `  Generated at: ${cache.generatedAt}`,
      `  Tracks: ${cache.tracks.length}`,
      `  Album groups: ${cache.albumGroups.length}`,
      `  Cache file size: ${sizeKb} KB`,
    ].join("\n")
  );
}

main().catch((err) => {
  console.error("Failed to build music cache:", err);
  process.exit(1);
});
