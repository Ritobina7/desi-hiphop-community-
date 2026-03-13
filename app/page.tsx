import { lfmTracksToFeedPosts } from "@/lib/lastfm";
import { getCachedTracks, getCachedAlbumGroups, getCacheAge } from "@/lib/cache";
import { seedTrackDiscussionPosts } from "@/lib/data";
import { TrackDiscussionPost, SerializedAlbumGroup } from "@/lib/types";
import FeedPage from "@/components/FeedPage";

// ISR: regenerate this page in the background every hour.
// On each regeneration, prebuild has already refreshed the cache file,
// so getCached* calls return the latest data without hitting any API.
export const revalidate = 3600;

export default async function Page() {
  const cachedTracks = getCachedTracks();
  const cachedAlbumGroups = getCachedAlbumGroups();
  const cacheAge = getCacheAge();

  const serverTrackPosts: TrackDiscussionPost[] =
    cachedTracks.length > 0
      ? lfmTracksToFeedPosts(cachedTracks)
      : seedTrackDiscussionPosts;

  const serverAlbumGroups: SerializedAlbumGroup[] = cachedAlbumGroups;

  return (
    <FeedPage
      serverTrackPosts={serverTrackPosts}
      serverAlbumGroups={serverAlbumGroups}
      cacheAge={cacheAge}
    />
  );
}
