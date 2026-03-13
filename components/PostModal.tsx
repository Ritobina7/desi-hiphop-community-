"use client";

import { useState, useEffect, useRef } from "react";
import { useFeed } from "@/lib/FeedContext";
import { allGenres, allCategories, AUTHOR_COLORS } from "@/lib/data";
import { Genre, PostCategory, TrackDiscussionPost, CommunityPost } from "@/lib/types";

type Step = "type-select" | "track-form" | "community-form";

const COVER_COLORS = [
  { coverColor: "from-orange-900 to-red-950", coverAccent: "bg-orange-500" },
  { coverColor: "from-purple-900 to-indigo-950", coverAccent: "bg-purple-500" },
  { coverColor: "from-green-900 to-emerald-950", coverAccent: "bg-green-500" },
  { coverColor: "from-blue-900 to-cyan-950", coverAccent: "bg-blue-500" },
  { coverColor: "from-pink-900 to-rose-950", coverAccent: "bg-pink-500" },
];

export default function PostModal() {
  const { modalOpen, closeModal, addPost, showToast, username, setUsername } = useFeed();

  // Step state
  const [step, setStep] = useState<Step>("type-select");

  // Track form
  const [manualTitle, setManualTitle] = useState("");
  const [manualArtist, setManualArtist] = useState("");
  const [trackText, setTrackText] = useState("");
  const [trackGenres, setTrackGenres] = useState<Genre[]>([]);

  // Community form
  const [communityTitle, setCommunityTitle] = useState("");
  const [communityBody, setCommunityBody] = useState("");
  const [communityCategory, setCommunityCategory] = useState<PostCategory | "">("");
  const [communityGenres, setCommunityGenres] = useState<Genre[]>([]);
  const [communityImage, setCommunityImage] = useState<string | null>(null);

  // Shared
  const [usernameInput, setUsernameInput] = useState(username);
  const [showDiscard, setShowDiscard] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync username
  useEffect(() => {
    setUsernameInput(username);
  }, [username]);

  function hasContent(): boolean {
    if (step === "track-form") {
      return !!(trackText || manualTitle || manualArtist);
    }
    if (step === "community-form") {
      return !!(communityTitle || communityBody);
    }
    return false;
  }

  function handleClose() {
    if (hasContent()) {
      setShowDiscard(true);
    } else {
      doClose();
    }
  }

  function doClose() {
    closeModal();
    resetAll();
  }

  function resetAll() {
    setStep("type-select");
    setManualTitle("");
    setManualArtist("");
    setTrackText("");
    setTrackGenres([]);
    setCommunityTitle("");
    setCommunityBody("");
    setCommunityCategory("");
    setCommunityGenres([]);
    setCommunityImage(null);
    setShowDiscard(false);
  }

  function handleTrackSubmit() {
    const finalUsername = usernameInput.trim() || "Anonymous";
    if (usernameInput.trim()) setUsername(usernameInput.trim());

    const colorIdx = Math.floor(Math.random() * AUTHOR_COLORS.length);
    const colorScheme = COVER_COLORS[Math.floor(Math.random() * COVER_COLORS.length)];

    const post: TrackDiscussionPost = {
      id: `tdp-${Date.now()}`,
      type: "track",
      trackId: undefined,
      trackTitle: manualTitle.trim(),
      artistName: manualArtist.trim(),
      genre: trackGenres[0] ?? "Gully Rap",
      coverColor: colorScheme.coverColor,
      coverAccent: colorScheme.coverAccent,
      duration: "—",
      userText: trackText.trim(),
      author: finalUsername,
      authorColor: AUTHOR_COLORS[colorIdx],
      likes: 0,
      commentCount: 0,
      plays: 0,
      postedAt: new Date().toISOString(),
    };

    addPost(post);
    doClose();
    showToast("Your post is live!");
  }

  function handleCommunitySubmit() {
    if (!communityTitle.trim()) return;
    const finalUsername = usernameInput.trim() || "Anonymous";
    if (usernameInput.trim()) setUsername(usernameInput.trim());

    const colorIdx = Math.floor(Math.random() * AUTHOR_COLORS.length);

    const post: CommunityPost = {
      id: `cp-${Date.now()}`,
      type: "community",
      title: communityTitle.trim(),
      body: communityBody.trim(),
      category: (communityCategory as PostCategory) || "Other",
      genres: communityGenres,
      author: finalUsername,
      authorColor: AUTHOR_COLORS[colorIdx],
      likes: 0,
      commentCount: 0,
      postedAt: new Date().toISOString(),
      pinned: false,
      imageUrl: communityImage || undefined,
    };

    addPost(post);
    doClose();
    showToast("Your post is live!");
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCommunityImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function toggleTrackGenre(g: Genre) {
    setTrackGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  }

  function toggleCommunityGenre(g: Genre) {
    setCommunityGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  }

  if (!modalOpen) return null;

  const canTrackPost = manualTitle.trim() && manualArtist.trim() && trackText.trim();

  const canCommunityPost = communityTitle.trim();

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Discard confirmation */}
      {showDiscard && (
        <div className="relative z-10 bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-2">Discard post?</h3>
          <p className="text-sm text-gray-400 mb-5">Your draft will be lost.</p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDiscard(false)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors"
            >
              Keep editing
            </button>
            <button
              onClick={doClose}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-sm text-red-400 hover:bg-red-500/30 transition-colors"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {/* Main modal */}
      {!showDiscard && (
        <div className="relative z-10 bg-[#13131f] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/5 flex-shrink-0">
            <div className="flex items-center gap-3">
              {step !== "type-select" && (
                <button
                  onClick={() => setStep("type-select")}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <h2 className="font-bold text-white">
                {step === "type-select" && "Create a post"}
                {step === "track-form" && "Track Discussion"}
                {step === "community-form" && "Community Post"}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 px-5 py-4 scrollbar-thin">

            {/* ── TYPE SELECT ── */}
            {step === "type-select" && (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-gray-400 mb-1">What do you want to share?</p>
                <button
                  onClick={() => setStep("track-form")}
                  className="group flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/40 hover:bg-orange-500/5 transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    🎵
                  </div>
                  <div>
                    <p className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                      Track Discussion
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">Talk about a specific song</p>
                  </div>
                </button>
                <button
                  onClick={() => setStep("community-form")}
                  className="group flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    💬
                  </div>
                  <div>
                    <p className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                      Community Post
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">Share thoughts, news, debates</p>
                  </div>
                </button>
              </div>
            )}

            {/* ── TRACK FORM ── */}
            {step === "track-form" && (
              <div className="flex flex-col gap-4">
                {/* Track + artist fields */}
                <div className="flex flex-col gap-3">
                  <input
                    autoFocus
                    type="text"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    placeholder="Track name *"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50"
                  />
                  <input
                    type="text"
                    value={manualArtist}
                    onChange={(e) => setManualArtist(e.target.value)}
                    placeholder="Artist name *"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50"
                  />
                </div>

                {/* Text box */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                    What do you want to say about this track?
                  </label>
                  <textarea
                    value={trackText}
                    onChange={(e) => setTrackText(e.target.value)}
                    placeholder="Share your take, breakdown a verse, or just vibe..."
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 resize-none"
                  />
                </div>

                {/* Genre tags */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                    Genre Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {allGenres.map((g) => {
                      const active = trackGenres.includes(g as Genre);
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => toggleTrackGenre(g as Genre)}
                          className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                            active
                              ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                              : "bg-white/5 text-gray-400 border border-white/10 hover:border-white/20"
                          }`}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── COMMUNITY FORM ── */}
            {step === "community-form" && (
              <div className="flex flex-col gap-4">
                {/* Title */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                    Headline <span className="text-red-400">*</span>
                  </label>
                  <input
                    autoFocus
                    type="text"
                    value={communityTitle}
                    onChange={(e) => setCommunityTitle(e.target.value)}
                    placeholder="Give your post a headline..."
                    maxLength={120}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                  />
                  <p className="text-xs text-gray-600 mt-1 text-right">{communityTitle.length}/120</p>
                </div>

                {/* Body */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                    Body
                  </label>
                  <textarea
                    value={communityBody}
                    onChange={(e) => setCommunityBody(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={5}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                    Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {allCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCommunityCategory(cat)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors border text-left ${
                          communityCategory === cat
                            ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                            : "bg-white/5 text-gray-400 border-white/10 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image upload */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                    Image (optional)
                  </label>
                  {communityImage ? (
                    <div className="relative rounded-xl overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={communityImage} alt="Preview" className="w-full h-40 object-cover" />
                      <button
                        onClick={() => setCommunityImage(null)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-24 rounded-xl border-2 border-dashed border-white/10 hover:border-purple-500/30 transition-colors flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-gray-400"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-xs">Upload image</span>
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>

                {/* Genre tags */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                    Genre Tags (optional)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {allGenres.map((g) => {
                      const active = communityGenres.includes(g as Genre);
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => toggleCommunityGenre(g as Genre)}
                          className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                            active
                              ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                              : "bg-white/5 text-gray-400 border border-white/10 hover:border-white/20"
                          }`}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {step !== "type-select" && (
            <div className="px-5 py-4 border-t border-white/5 flex-shrink-0">
              {/* Username field */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                    usernameInput.trim() ? "bg-orange-500" : "bg-gray-700"
                  }`}
                >
                  {usernameInput.trim() ? usernameInput.trim().charAt(0).toUpperCase() : "?"}
                </div>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Your display name..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/40"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-2">
                <button
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={step === "track-form" ? handleTrackSubmit : handleCommunitySubmit}
                  disabled={step === "track-form" ? !canTrackPost : !canCommunityPost}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
