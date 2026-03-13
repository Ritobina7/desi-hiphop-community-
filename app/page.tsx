import { lfmTracksToFeedPosts } from "@/lib/lastfm";
import { getCachedTracks, getCachedAlbumGroups, getCacheAge } from "@/lib/cache";
import { TrackDiscussionPost, SerializedAlbumGroup } from "@/lib/types";
import FeedPage from "@/components/FeedPage";

export const revalidate = 3600;

export default async function Page() {
  const cachedTracks = getCachedTracks();
  const cachedAlbumGroups = getCachedAlbumGroups();
  const cacheAge = getCacheAge();

  const serverTrackPosts: TrackDiscussionPost[] =
    cachedTracks.length > 0 ? lfmTracksToFeedPosts(cachedTracks) : [];

  const serverAlbumGroups: SerializedAlbumGroup[] = cachedAlbumGroups;

  return (
    <FeedPage
      serverTrackPosts={serverTrackPosts}
      serverAlbumGroups={serverAlbumGroups}
      cacheAge={cacheAge}
    />
  );
}
