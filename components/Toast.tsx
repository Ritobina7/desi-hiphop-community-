"use client";

import { useFeed } from "@/lib/FeedContext";

export default function Toast() {
  const { toastMessage } = useFeed();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-2.5 bg-[#1e1e2e] border border-orange-500/30 rounded-xl px-4 py-3 shadow-2xl shadow-black/40">
        <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
        <span className="text-sm font-medium text-white">{toastMessage}</span>
      </div>
    </div>
  );
}
