export type Genre =
  | "Gully Rap"
  | "Punjabi Hip Hop"
  | "Trap"
  | "Bhangra Fusion"
  | "Tamil Hip Hop"
  | "Bengali Hip Hop"
  | "Sufi Rap"
  | "Lo-fi Desi"
  | "Old School";

export type SubGenre =
  | "Desi Trap"
  | "Conscious Rap"
  | "Street Rap"
  | "Mumble Rap"
  | "Boom Bap"
  | "Melodic Rap"
  | "Folk Fusion"
  | "Drill"
  | "Gangsta Rap"
  | "Political Rap";

export type PostCategory = "Events" | "Culture & Debates" | "News & Releases" | "Other";

export interface Artist {
  id: string;
  name: string;
  realName: string;
  origin: string;
  bio: string;
  genres: Genre[];
  followers: number;
  tracks: string[];
  avatarColor: string;
  initials: string;
  verified: boolean;
  yearActive: number;
}

export interface Track {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  genre: Genre;
  subGenre: SubGenre;
  coverColor: string;
  coverAccent: string;
  likes: number;
  commentCount: number;
  plays: number;
  postedAt: string;
  description: string;
  lyrics?: string;
  duration: string;
  album?: string;
  year: number;
  tags: string[];
}

export interface TrackDiscussionPost {
  id: string;
  type: "track";
  trackId?: string;
  trackTitle: string;
  artistName: string;
  genre: Genre;
  subGenre?: SubGenre;
  coverColor: string;
  coverAccent: string;
  duration: string;
  userText: string;
  author: string;
  authorColor: string;
  likes: number;
  commentCount: number;
  plays: number;
  postedAt: string;
  pinned?: boolean;
  tags?: string[];
  album?: string;
  year?: number;
  // Last.fm enrichment (present when sourced from Last.fm API)
  lastFmUrl?: string;
  lastFmListeners?: number;
  // YouTube enrichment
  ytData?: YtData | null;
}

// ── YouTube enrichment ────────────────────────────────────────────────────────

export interface YtData {
  viewCount: number | null;
  videoId: string | null;
  label: string | null; // "🎬 YT Views" | "🎵 YT Audio Views" | "▶️ YT Views"
}

// ── Album groups (serialized for client components) ───────────────────────────

export interface SerializedAlbumTrack {
  id: string;           // lfm-* post id for linking
  title: string;
  artistName: string;   // for /tracks/[id]?artist=...&track=... links
  duration: string;
  playcount: number;
  ytViewCount: number | null;
  ytLabel: string | null;
  isTopTrack: boolean;
}

export interface SerializedAlbumGroup {
  releaseId: string;
  releaseTitle: string;
  releaseType: "Album" | "EP" | "Mixtape" | "Single";
  releaseYear: number | null;
  artistName: string;
  releaseTrackCount: number; // total tracks on the MusicBrainz release
  topTrack: string;          // title of highest-playcount track
  totalPlaycount: number;    // sum of all feed track playcounts
  genre: Genre;
  tracks: SerializedAlbumTrack[]; // feed tracks sorted by playcount desc
}

export interface CommunityPost {
  id: string;
  type: "community";
  title: string;
  body: string;
  category: PostCategory;
  genres: Genre[];
  author: string;
  authorColor: string;
  likes: number;
  commentCount: number;
  postedAt: string;
  pinned: boolean;
  imageUrl?: string;
}

export type FeedItem = TrackDiscussionPost | CommunityPost;

export interface Comment {
  id: string;
  trackId: string;
  author: string;
  authorColor: string;
  content: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
}
