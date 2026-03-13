import { Artist, Track, Comment, TrackDiscussionPost, CommunityPost } from "./types";

export const artists: Artist[] = [
  {
    id: "divine",
    name: "DIVINE",
    realName: "Vivian Fernandes",
    origin: "Mumbai, Maharashtra",
    bio: "MC DIVINE, born Vivian Fernandes, is one of India's most prominent street rappers. Rising from the gullies of Kurla, Mumbai, his raw storytelling and authentic street life narratives made him the face of Gully Rap. His track 'Mere Gully Mein' with Naezy inspired the Bollywood film Gully Boy.",
    genres: ["Gully Rap", "Trap"],
    followers: 2400000,
    tracks: ["track-1", "track-2"],
    avatarColor: "from-orange-500 to-red-600",
    initials: "DV",
    verified: true,
    yearActive: 2013,
  },
  {
    id: "raftaar",
    name: "Raftaar",
    realName: "Dilin Nair",
    origin: "Trivandrum, Kerala",
    bio: "Raftaar is one of the most versatile rappers in India, known for his lightning-fast delivery and multilingual flow. He seamlessly switches between Hindi, Punjabi, and English, and has become a mainstream hip hop icon with chart-topping tracks and massive live shows.",
    genres: ["Punjabi Hip Hop", "Trap", "Bhangra Fusion"],
    followers: 3100000,
    tracks: ["track-3", "track-4"],
    avatarColor: "from-purple-500 to-indigo-600",
    initials: "RF",
    verified: true,
    yearActive: 2008,
  },
  {
    id: "krsna",
    name: "Kr$na",
    realName: "Krishna Kaul",
    origin: "New Delhi, Delhi",
    bio: "Kr$na is widely regarded as one of the best lyricists in Indian hip hop. With his intricate wordplay, deep metaphors, and technically superior rap style, he commands respect across the entire underground and mainstream scene. He's known for his legendary diss tracks and cyphers.",
    genres: ["Gully Rap", "Old School"],
    followers: 1800000,
    tracks: ["track-5", "track-6"],
    avatarColor: "from-green-500 to-teal-600",
    initials: "KR",
    verified: true,
    yearActive: 2010,
  },
  {
    id: "brodha-v",
    name: "Brodha V",
    realName: "Vighnesh Shivanand",
    origin: "Bangalore, Karnataka",
    bio: "Brodha V is a Bangalore-based rapper who fuses Kannada, Tamil, Malayalam, and English into his rapid-fire delivery. Considered one of the fastest rappers in India, his intricate tongue-twisters and culturally rich content represent South India's contribution to Desi Hip Hop.",
    genres: ["Tamil Hip Hop", "Old School", "Gully Rap"],
    followers: 950000,
    tracks: ["track-7"],
    avatarColor: "from-yellow-500 to-orange-500",
    initials: "BV",
    verified: true,
    yearActive: 2009,
  },
  {
    id: "seedhe-maut",
    name: "Seedhe Maut",
    realName: "Encore ABJ & Calm",
    origin: "New Delhi, Delhi",
    bio: "Seedhe Maut is the underground duo of Encore ABJ and Calm, known for their punchy punchlines, dark humor, and hyper-local Delhi references. They represent the new wave of independent Indian hip hop, rejecting mainstream aesthetics in favor of raw authenticity.",
    genres: ["Gully Rap", "Trap", "Lo-fi Desi"],
    followers: 720000,
    tracks: ["track-8", "track-9"],
    avatarColor: "from-red-600 to-pink-600",
    initials: "SM",
    verified: true,
    yearActive: 2016,
  },
  {
    id: "prabh-deep",
    name: "Prabh Deep",
    realName: "Prabhjot Singh",
    origin: "New Delhi, Delhi",
    bio: "Prabh Deep is a conscious rapper whose album 'Class-Sikh' is considered a landmark in Indian hip hop. His music blends Sikh philosophy with street experiences, delivering powerful social commentary through his distinctive baritone and introspective lyrics.",
    genres: ["Gully Rap", "Sufi Rap", "Old School"],
    followers: 430000,
    tracks: ["track-10"],
    avatarColor: "from-blue-500 to-cyan-500",
    initials: "PD",
    verified: false,
    yearActive: 2015,
  },
  {
    id: "naezy",
    name: "Naezy",
    realName: "Naved Shaikh",
    origin: "Mumbai, Maharashtra",
    bio: "Naezy, the Baapu, is the co-creator of the Gully Rap movement alongside DIVINE. His track 'Aafat' went viral and helped ignite an entire cultural movement. His raw, unfiltered voice represents the struggles of Mumbai's working-class neighborhoods.",
    genres: ["Gully Rap", "Bhangra Fusion"],
    followers: 680000,
    tracks: ["track-2"],
    avatarColor: "from-amber-500 to-yellow-500",
    initials: "NZ",
    verified: false,
    yearActive: 2013,
  },
  {
    id: "badshah",
    name: "Badshah",
    realName: "Aditya Prateek Singh Sisodia",
    origin: "New Delhi, Delhi",
    bio: "Badshah is the most commercially successful rapper in India, dominating party anthems and Bollywood collaborations. A former member of the duo Mafia Mundeer with Yo Yo Honey Singh, he pivoted to pop-influenced hip hop and has broken numerous streaming records.",
    genres: ["Punjabi Hip Hop", "Bhangra Fusion", "Trap"],
    followers: 8500000,
    tracks: ["track-4"],
    avatarColor: "from-pink-500 to-rose-600",
    initials: "BD",
    verified: true,
    yearActive: 2006,
  },
];

export const tracks: Track[] = [
  {
    id: "track-1",
    title: "Jungli Sher",
    artistId: "divine",
    artistName: "DIVINE",
    genre: "Gully Rap",
    subGenre: "Street Rap",
    coverColor: "from-orange-900 to-red-950",
    coverAccent: "bg-orange-500",
    likes: 4821,
    commentCount: 312,
    plays: 1240000,
    postedAt: "2026-03-10T14:30:00Z",
    description:
      "DIVINE's latest anthem about survival and hustle on Mumbai's streets. Hard-hitting bars over a dark trap beat produced by Karan Kanchan.",
    duration: "3:45",
    year: 2025,
    tags: ["Mumbai", "street", "hustle", "trap"],
  },
  {
    id: "track-2",
    title: "Mere Gully Mein",
    artistId: "divine",
    artistName: "DIVINE ft. Naezy",
    genre: "Gully Rap",
    subGenre: "Conscious Rap",
    coverColor: "from-yellow-900 to-orange-950",
    coverAccent: "bg-yellow-500",
    likes: 9340,
    commentCount: 876,
    plays: 8700000,
    postedAt: "2026-03-08T09:00:00Z",
    description:
      "The track that started a revolution. DIVINE and Naezy's raw depiction of life in Kurla and Dharavi became the anthem for an entire generation and inspired the Gully Boy film.",
    duration: "4:02",
    year: 2015,
    album: "Mere Gully Mein (Single)",
    tags: ["iconic", "Mumbai", "gully", "movement", "classic"],
  },
  {
    id: "track-3",
    title: "Swag Mera Desi",
    artistId: "raftaar",
    artistName: "Raftaar",
    genre: "Punjabi Hip Hop",
    subGenre: "Desi Trap",
    coverColor: "from-purple-900 to-indigo-950",
    coverAccent: "bg-purple-500",
    likes: 3210,
    commentCount: 198,
    plays: 2100000,
    postedAt: "2026-03-11T16:00:00Z",
    description:
      "Raftaar brings the heat with a Punjabi-infused trap banger. Rapid-fire English and Hindi bars over 808s that hit harder than a dhol.",
    duration: "3:22",
    year: 2025,
    tags: ["Punjabi", "trap", "swag", "banger"],
  },
  {
    id: "track-4",
    title: "DJ Waala Baaja",
    artistId: "badshah",
    artistName: "Badshah ft. Raftaar",
    genre: "Bhangra Fusion",
    subGenre: "Folk Fusion",
    coverColor: "from-pink-900 to-rose-950",
    coverAccent: "bg-pink-500",
    likes: 7654,
    commentCount: 445,
    plays: 6500000,
    postedAt: "2026-03-09T12:00:00Z",
    description:
      "Badshah and Raftaar join forces for a festival banger that blends traditional bhangra with modern hip hop production. Built for weddings and massive stages.",
    duration: "3:58",
    year: 2025,
    album: "Party Anthems Vol. 3",
    tags: ["bhangra", "party", "fusion", "festival"],
  },
  {
    id: "track-5",
    title: "God Keyboard",
    artistId: "krsna",
    artistName: "Kr$na",
    genre: "Gully Rap",
    subGenre: "Boom Bap",
    coverColor: "from-green-900 to-emerald-950",
    coverAccent: "bg-green-500",
    likes: 5432,
    commentCount: 567,
    plays: 980000,
    postedAt: "2026-03-07T10:00:00Z",
    description:
      "Kr$na dissects the fake rappers in the game with surgical precision. This boom-bap masterpiece showcases why he's considered the best lyricist in Indian hip hop.",
    duration: "4:30",
    year: 2024,
    tags: ["lyrical", "wordplay", "diss", "technical"],
  },
  {
    id: "track-6",
    title: "Prastuti",
    artistId: "krsna",
    artistName: "Kr$na",
    genre: "Old School",
    subGenre: "Conscious Rap",
    coverColor: "from-teal-900 to-green-950",
    coverAccent: "bg-teal-500",
    likes: 3987,
    commentCount: 334,
    plays: 780000,
    postedAt: "2026-03-05T08:00:00Z",
    description:
      "A deeply personal track where Kr$na reflects on his journey from an unknown underground MC to a respected figure in Indian hip hop. Over soulful production by Sez On The Beat.",
    duration: "4:15",
    year: 2023,
    album: "UTHA LO",
    tags: ["conscious", "journey", "introspective", "soulful"],
  },
  {
    id: "track-7",
    title: "Aigiri Nandini",
    artistId: "brodha-v",
    artistName: "Brodha V",
    genre: "Tamil Hip Hop",
    subGenre: "Folk Fusion",
    coverColor: "from-yellow-900 to-amber-950",
    coverAccent: "bg-yellow-400",
    likes: 8901,
    commentCount: 723,
    plays: 15000000,
    postedAt: "2026-03-03T07:00:00Z",
    description:
      "Brodha V's legendary rap version of the Sanskrit hymn Aigiri Nandini became a viral sensation with over 15M views. A masterclass in blending classical tradition with modern hip hop.",
    duration: "5:01",
    year: 2012,
    tags: ["Sanskrit", "classical", "viral", "legendary", "Kannada"],
  },
  {
    id: "track-8",
    title: "Nanchaku",
    artistId: "seedhe-maut",
    artistName: "Seedhe Maut",
    genre: "Gully Rap",
    subGenre: "Drill",
    coverColor: "from-red-900 to-pink-950",
    coverAccent: "bg-red-500",
    likes: 4123,
    commentCount: 389,
    plays: 1100000,
    postedAt: "2026-03-06T11:30:00Z",
    description:
      "Seedhe Maut go hard on this drill-influenced track, with razor-sharp punchlines and Delhi references that hit different if you're from the capital.",
    duration: "3:18",
    year: 2024,
    tags: ["Delhi", "drill", "underground", "punchlines"],
  },
  {
    id: "track-9",
    title: "Maina",
    artistId: "seedhe-maut",
    artistName: "Seedhe Maut",
    genre: "Lo-fi Desi",
    subGenre: "Melodic Rap",
    coverColor: "from-slate-800 to-gray-900",
    coverAccent: "bg-slate-500",
    likes: 6234,
    commentCount: 512,
    plays: 2300000,
    postedAt: "2026-03-01T06:00:00Z",
    description:
      "A rare melodic turn from Seedhe Maut—'Maina' is a nostalgic lo-fi track about longing and city life. Produced by Sez On The Beat with gorgeous ambient textures.",
    duration: "3:42",
    year: 2022,
    album: "Nayaab",
    tags: ["lo-fi", "nostalgic", "melodic", "Sez on the Beat"],
  },
  {
    id: "track-10",
    title: "Class-Sikh",
    artistId: "prabh-deep",
    artistName: "Prabh Deep",
    genre: "Sufi Rap",
    subGenre: "Political Rap",
    coverColor: "from-blue-900 to-cyan-950",
    coverAccent: "bg-blue-500",
    likes: 3456,
    commentCount: 298,
    plays: 650000,
    postedAt: "2026-02-28T09:00:00Z",
    description:
      "The title track from Prabh Deep's debut album—a haunting exploration of Sikh identity, caste politics, and personal faith. Produced by Sez On The Beat. A landmark in Indian hip hop.",
    duration: "4:48",
    year: 2017,
    album: "Class-Sikh",
    tags: ["Sikh", "identity", "political", "conscious", "landmark"],
  },
];

// Seed community posts
export const seedCommunityPosts: CommunityPost[] = [
  {
    id: "cp-1",
    type: "community",
    title: "March Concert Calendar 2026",
    body: "Here's every confirmed Desi Hip Hop show happening this month. Save the dates!\n\n• Mar 14 — DIVINE Live, Mumbai (NSCI Dome)\n• Mar 15 — Raftaar x Badshah, New Delhi (Jawaharlal Nehru Stadium)\n• Mar 19 — Seedhe Maut, Bangalore (Phoenix Marketcity Amphitheatre)\n• Mar 21 — Kr$na, Hyderabad (Hitex Exhibition Centre)\n• Mar 22 — Brodha V Homecoming, Bangalore (NIMHANS Convention Centre)\n• Mar 28 — Prabh Deep, Chandigarh (TagD)\n\nDM me if you need ticketing links. Most shows still have seats available. Bangalore especially — do NOT sleep on Brodha V in his home city.",
    category: "Events",
    genres: ["Gully Rap", "Punjabi Hip Hop", "Tamil Hip Hop"],
    author: "GigAlert",
    authorColor: "bg-emerald-500",
    likes: 1243,
    commentCount: 87,
    postedAt: "2026-03-11T10:00:00Z",
    pinned: true,
  },
  {
    id: "cp-2",
    type: "community",
    title: "Is mumble rap really rap? The case for and against",
    body: "Every few months this debate resurfaces and the community splits. So let's actually hash it out.\n\nFOR: Music evolves. Tone and vibe are as valid as lyrical content. The emotion in delivery IS the message. Restricting 'real rap' to technical bars is gatekeeping.\n\nAGAINST: Hindi and Urdu are dense, poetic languages. Using them to mumble over a trap beat while saying nothing is a waste of the tongue. The greats — Kr$na, DIVINE, Brodha V — prove you can have both.\n\nMY TAKE: There's room for both lanes. The issue isn't mumble rap existing, it's when labels push it at the expense of funding artists who actually have something to say.\n\nDrop your hot takes below.",
    category: "Culture & Debates",
    genres: ["Trap", "Gully Rap", "Old School"],
    author: "BarScholar",
    authorColor: "bg-violet-500",
    likes: 892,
    commentCount: 214,
    postedAt: "2026-03-10T08:30:00Z",
    pinned: false,
  },
  {
    id: "cp-3",
    type: "community",
    title: "Seedhe Maut drops surprise EP — first thoughts",
    body: "Dropped at midnight with zero promo. Classic Seedhe Maut. The EP is called 'Zabt' (5 tracks, ~18 mins).\n\nInitial takes after two full listens:\n\nTrack 1 'Maahol' opens with a 30-second acapella from Calm that's already being compared to his best work. Sets the tone perfectly.\n\nTrack 3 'Kaanch' features Prabh Deep and it's the best collab either of them has put out in years — the chemistry is unreal.\n\nTrack 5 'Jawab' closes the EP on a surprisingly emotional note. Encore ABJ sounds more vulnerable than we've ever heard him.\n\nOnly gripe: production on track 2 felt rushed. But everything else is a 9/10. Sez On The Beat continues to be the GOAT producer in this scene.\n\nWhat are your initial reactions?",
    category: "News & Releases",
    genres: ["Gully Rap", "Lo-fi Desi", "Trap"],
    author: "UndergroundWatcher",
    authorColor: "bg-rose-500",
    likes: 678,
    commentCount: 143,
    postedAt: "2026-03-09T07:00:00Z",
    pinned: false,
  },
];

// Convert tracks to TrackDiscussionPost format for the feed
export function trackToDiscussionPost(t: Track): TrackDiscussionPost {
  return {
    id: `tdp-${t.id}`,
    type: "track",
    trackId: t.id,
    trackTitle: t.title,
    artistName: t.artistName,
    genre: t.genre,
    subGenre: t.subGenre,
    coverColor: t.coverColor,
    coverAccent: t.coverAccent,
    duration: t.duration,
    userText: t.description,
    author: "Community",
    authorColor: "bg-orange-500",
    likes: t.likes,
    commentCount: t.commentCount,
    plays: t.plays,
    postedAt: t.postedAt,
    tags: t.tags,
    album: t.album,
    year: t.year,
  };
}

export const seedTrackDiscussionPosts: TrackDiscussionPost[] = tracks.map(trackToDiscussionPost);

export const comments: Comment[] = [
  {
    id: "c1",
    trackId: "track-1",
    author: "GullyHead99",
    authorColor: "bg-orange-500",
    content:
      "This track goes CRAZY. That line about the streets never sleeping—felt it in my bones. DIVINE is on another level right now.",
    createdAt: "2026-03-10T16:45:00Z",
    likes: 234,
  },
  {
    id: "c2",
    trackId: "track-1",
    author: "MumbaiMC",
    authorColor: "bg-red-500",
    content:
      "Karan Kanchan's production here is insane. Those 808s are hitting different. DIVINE over trap beats just works every time.",
    createdAt: "2026-03-10T17:30:00Z",
    likes: 189,
  },
  {
    id: "c3",
    trackId: "track-1",
    author: "StreetSoundz",
    authorColor: "bg-yellow-500",
    content:
      "Man came back harder after the hiatus. This proves why he's still the GOAT of Gully Rap. Nobody touches DIVINE in his lane.",
    createdAt: "2026-03-11T08:00:00Z",
    likes: 156,
  },
  {
    id: "c4",
    trackId: "track-2",
    author: "DeshiHipHopFan",
    authorColor: "bg-blue-500",
    content:
      "This track literally changed my life. I discovered Desi Hip Hop because of this. Before this, I didn't even know Indian street rap was a thing.",
    createdAt: "2026-03-08T10:00:00Z",
    likes: 876,
  },
  {
    id: "c5",
    trackId: "track-2",
    author: "KurlaKid",
    authorColor: "bg-green-500",
    content:
      "Grew up near Kurla. This track is documentary-level real. Every word hits different when you've actually lived those streets.",
    createdAt: "2026-03-08T11:30:00Z",
    likes: 743,
  },
  {
    id: "c6",
    trackId: "track-2",
    author: "RapScholar",
    authorColor: "bg-purple-500",
    content:
      "The cultural impact of this track cannot be overstated. It created an entire genre, an entire movement, inspired a whole film. Historic.",
    createdAt: "2026-03-08T14:00:00Z",
    likes: 654,
  },
  {
    id: "c7",
    trackId: "track-5",
    author: "LyricalGenius",
    authorColor: "bg-emerald-500",
    content:
      "I've analyzed every bar three times and I'm still finding new layers. Kr$na's wordplay density is unreal. This is what separates real MCs from clout chasers.",
    createdAt: "2026-03-07T12:00:00Z",
    likes: 432,
  },
  {
    id: "c8",
    trackId: "track-5",
    author: "TechRapFan",
    authorColor: "bg-cyan-500",
    content:
      "The double entendres in verse 2 alone deserve a PhD thesis. Nobody in India comes close to Kr$na technically. Period.",
    createdAt: "2026-03-07T13:30:00Z",
    likes: 389,
  },
  {
    id: "c9",
    trackId: "track-7",
    author: "ClassicalFusion",
    authorColor: "bg-amber-500",
    content:
      "As someone trained in Carnatic music, this gave me chills. The way Brodha V adapts the meter of the original Sanskrit text to hip hop flow is GENIUS.",
    createdAt: "2026-03-03T09:00:00Z",
    likes: 1203,
  },
  {
    id: "c10",
    trackId: "track-7",
    author: "BangaloreBeats",
    authorColor: "bg-rose-500",
    content:
      "South India's contribution to Desi Hip Hop doesn't get talked about enough. Brodha V has been holding it down for years. Respect!",
    createdAt: "2026-03-03T10:00:00Z",
    likes: 876,
  },
  {
    id: "c11",
    trackId: "track-8",
    author: "DelhiDriller",
    authorColor: "bg-red-600",
    content:
      "Seedhe Maut on drill is just insane. The punchlines hit harder than anything in UK drill. Delhi drill movement needs more recognition.",
    createdAt: "2026-03-06T13:00:00Z",
    likes: 234,
  },
  {
    id: "c12",
    trackId: "track-9",
    author: "LoFiListener",
    authorColor: "bg-slate-500",
    content:
      "This is the track that made me cry in public on the metro. Seedhe Maut showing their softer side while still maintaining that underground edge. Masterpiece.",
    createdAt: "2026-03-01T08:00:00Z",
    likes: 567,
  },
  {
    id: "c13",
    trackId: "track-10",
    author: "ConsciousHead",
    authorColor: "bg-indigo-500",
    content:
      "Class-Sikh is the most important Indian hip hop album ever made. Prabh Deep addresses things nobody else dares to. Timeless art.",
    createdAt: "2026-02-28T10:00:00Z",
    likes: 456,
  },
  {
    id: "c14",
    trackId: "track-3",
    author: "PunjabiPride",
    authorColor: "bg-violet-500",
    content:
      "Raftaar's speed on this is insane. Counted the syllables—dude is rapping at like 12 syllables per second during the second verse. Jaw-dropping.",
    createdAt: "2026-03-11T18:00:00Z",
    likes: 178,
  },
  {
    id: "c15",
    trackId: "track-6",
    author: "SezOnTheBeat",
    authorColor: "bg-lime-500",
    content:
      "Sez On The Beat's production on this entire album is so cinematic. Prastuti especially—that piano loop with the strings is everything. Timeless combo.",
    createdAt: "2026-03-05T10:00:00Z",
    likes: 312,
  },
];

export function getTrackById(id: string): Track | undefined {
  return tracks.find((t) => t.id === id);
}

export function getArtistById(id: string): Artist | undefined {
  return artists.find((a) => a.id === id);
}

export function getCommentsByTrackId(trackId: string): Comment[] {
  return comments.filter((c) => c.trackId === trackId);
}

export function getTracksByArtistId(artistId: string): Track[] {
  return tracks.filter((t) => t.artistId === artistId);
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export function timeAgo(dateStr: string): string {
  const now = new Date("2026-03-12T00:00:00Z");
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export const allGenres = [
  "Gully Rap",
  "Punjabi Hip Hop",
  "Trap",
  "Bhangra Fusion",
  "Tamil Hip Hop",
  "Bengali Hip Hop",
  "Sufi Rap",
  "Lo-fi Desi",
  "Old School",
] as const;

export const allSubGenres = [
  "Desi Trap",
  "Conscious Rap",
  "Street Rap",
  "Mumble Rap",
  "Boom Bap",
  "Melodic Rap",
  "Folk Fusion",
  "Drill",
  "Gangsta Rap",
  "Political Rap",
] as const;

/** IDs of the seed track posts — used by FeedPage to filter them out when
 *  server-fetched Last.fm tracks are available, avoiding duplication. */
export const SEED_TRACK_POST_IDS = new Set(seedTrackDiscussionPosts.map((p) => p.id));

export const allCategories = [
  "Events",
  "Culture & Debates",
  "News & Releases",
  "Other",
] as const;

export const AUTHOR_COLORS = [
  "bg-orange-500",
  "bg-red-500",
  "bg-purple-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-emerald-500",
  "bg-indigo-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-teal-500",
];
