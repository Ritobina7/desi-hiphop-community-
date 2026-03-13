import { Artist, CommunityPost } from "./types";

export const artists: Artist[] = [
  {
    id: "divine",
    name: "DIVINE",
    realName: "Vivian Fernandes",
    origin: "Mumbai, Maharashtra",
    bio: "MC DIVINE, born Vivian Fernandes, is one of India's most prominent street rappers. Rising from the gullies of Kurla, Mumbai, his raw storytelling and authentic street life narratives made him the face of Gully Rap. His track 'Mere Gully Mein' with Naezy inspired the Bollywood film Gully Boy.",
    genres: ["Gully Rap", "Trap"],
    followers: 2400000,
    tracks: [],
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
    tracks: [],
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
    tracks: [],
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
    tracks: [],
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
    tracks: [],
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
    tracks: [],
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
    tracks: [],
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
    tracks: [],
    avatarColor: "from-pink-500 to-rose-600",
    initials: "BD",
    verified: true,
    yearActive: 2006,
  },
];

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

export function getArtistById(id: string): Artist | undefined {
  return artists.find((a) => a.id === id);
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
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
