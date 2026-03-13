import { getDesiHipHopTracks, lfmTracksToFeedPosts } from "@/lib/lastfm";
import { seedTrackDiscussionPosts } from "@/lib/data";
import { TrackDiscussionPost, SerializedAlbumGroup } from "@/lib/types";
import FeedPage from "@/components/FeedPage";

export default async function Page() {
  let serverTrackPosts: TrackDiscussionPost[] = seedTrackDiscussionPosts;
  let serverAlbumGroups: SerializedAlbumGroup[] = [];

  try {
    const lfmData = await getDesiHipHopTracks();
    if (lfmData.tracks.length > 0) {
      serverTrackPosts = lfmTracksToFeedPosts(lfmData.standaloneTracks);
      serverAlbumGroups = lfmData.serializedAlbumGroups;
    }
  } catch {
    // API unavailable — fall back to seed data silently
  }

  return <FeedPage serverTrackPosts={serverTrackPosts} serverAlbumGroups={serverAlbumGroups} />;
}
