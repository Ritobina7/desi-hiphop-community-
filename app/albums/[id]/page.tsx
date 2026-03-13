"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import { formatNumber } from "@/lib/data";

// Albums are server-only data — we read them via a client-side fetch from
// the search params, but since getDesiHipHopTracks is server-only, we
// surface album detail via a lightweight client page that receives the
// releaseId and redirects back to the artist/tracks.
//
// For now this page shows a "not yet available" state with a back link.
// The full album detail page will be wired up once album data is accessible
// via a stable API route.

interface Props {
  params: Promise<{ id: string }>;
}

export default function AlbumPage({ params }: Props) {
  const { id } = use(params);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-8 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to feed
      </Link>

      <div className="bg-[#13131f] border border-white/5 rounded-xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Album Detail</h1>
        <p className="text-gray-500 text-sm mb-1">Release ID: <span className="text-gray-400 font-mono text-xs">{id}</span></p>
        <p className="text-gray-600 text-sm mt-4">
          Full album detail pages are coming soon. In the meantime, browse individual tracks from the feed.
        </p>
        <Link
          href="/"
          className="inline-block mt-6 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/30 transition-colors border border-blue-500/30"
        >
          Back to feed
        </Link>
      </div>
    </div>
  );
}
