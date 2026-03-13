import { getDesiHipHopTracks, lfmTracksToFeedPosts } from "@/lib/lastfm";
import { seedTrackDiscussionPosts } from "@/lib/data";
import { TrackDiscussionPost } from "@/lib/types";
import FeedPage from "@/components/FeedPage";

export default async function Page() {
  let serverTrackPosts: TrackDiscussionPost[] = seedTrackDiscussionPosts;

  try {
    const lfmData = await getDesiHipHopTracks();
    if (lfmData.tracks.length > 0) {
      serverTrackPosts = lfmTracksToFeedPosts(lfmData.tracks);
    }
  } catch {
    // API unavailable — fall back to seed data silently
  }

  return <FeedPage serverTrackPosts={serverTrackPosts} />;
}
