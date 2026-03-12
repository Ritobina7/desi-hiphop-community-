"use client";

import { useState } from "react";
import { Comment } from "@/lib/types";
import { timeAgo, formatNumber } from "@/lib/data";

interface CommentSectionProps {
  trackId: string;
  initialComments: Comment[];
}

const COLORS = [
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
];

export default function CommentSection({ trackId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [text, setText] = useState("");
  const [username, setUsername] = useState("");
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const author = username.trim() || "Anonymous";
    const colorIndex = Math.floor(Math.random() * COLORS.length);
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      trackId,
      author,
      authorColor: COLORS[colorIndex],
      content: text.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    setComments((prev) => [newComment, ...prev]);
    setText("");
  }

  function toggleLike(id: string) {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setComments((cs) =>
          cs.map((c) => (c.id === id ? { ...c, likes: c.likes - 1 } : c))
        );
      } else {
        next.add(id);
        setComments((cs) =>
          cs.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
        );
      }
      return next;
    });
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-4">
        Discussion <span className="text-gray-500 font-normal text-base">({comments.length})</span>
      </h2>

      {/* Post form */}
      <form onSubmit={handleSubmit} className="mb-6 bg-[#13131f] border border-white/10 rounded-xl p-4">
        <div className="flex gap-3 mb-3">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your name (optional)"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-colors"
          />
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your thoughts on this track..."
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
        />
        <div className="flex justify-end mt-3">
          <button
            type="submit"
            disabled={!text.trim()}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Post Comment
          </button>
        </div>
      </form>

      {/* Comments list */}
      <div className="space-y-3">
        {comments.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-8">
            No comments yet. Be the first to drop knowledge!
          </p>
        )}
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-[#13131f] border border-white/5 rounded-xl p-4 group"
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-full ${comment.authorColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
              >
                {comment.author.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-white">{comment.author}</span>
                  <span className="text-xs text-gray-500">{timeAgo(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{comment.content}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => toggleLike(comment.id)}
                    className={`flex items-center gap-1 text-xs transition-colors ${
                      likedIds.has(comment.id)
                        ? "text-orange-400"
                        : "text-gray-500 hover:text-orange-400"
                    }`}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill={likedIds.has(comment.id) ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    {formatNumber(comment.likes)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
