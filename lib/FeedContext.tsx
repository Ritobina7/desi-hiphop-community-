"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { FeedItem, TrackDiscussionPost, CommunityPost } from "./types";
import { seedTrackDiscussionPosts, seedCommunityPosts } from "./data";

interface FeedContextValue {
  posts: FeedItem[];
  addPost: (post: FeedItem) => void;
  username: string;
  setUsername: (name: string) => void;
  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  getExistingTrackPost: (trackId: string) => TrackDiscussionPost | undefined;
}

const FeedContext = createContext<FeedContextValue | null>(null);

const INITIAL_POSTS: FeedItem[] = [
  ...seedCommunityPosts,
  ...seedTrackDiscussionPosts,
];

export function FeedProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<FeedItem[]>(INITIAL_POSTS);
  const [username, setUsernameState] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hydrate username from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("dhh_username");
    if (saved) setUsernameState(saved);
  }, []);

  const setUsername = useCallback((name: string) => {
    setUsernameState(name);
    localStorage.setItem("dhh_username", name);
  }, []);

  const addPost = useCallback((post: FeedItem) => {
    setPosts((prev) => [post, ...prev]);
  }, []);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const getExistingTrackPost = useCallback(
    (trackId: string): TrackDiscussionPost | undefined => {
      const thirtyDaysAgo = new Date("2026-03-12T00:00:00Z");
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return posts.find(
        (p): p is TrackDiscussionPost =>
          p.type === "track" &&
          p.trackId === trackId &&
          new Date(p.postedAt) >= thirtyDaysAgo
      );
    },
    [posts]
  );

  return (
    <FeedContext.Provider
      value={{
        posts,
        addPost,
        username,
        setUsername,
        modalOpen,
        openModal,
        closeModal,
        toastMessage,
        showToast,
        getExistingTrackPost,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
}

export function useFeed() {
  const ctx = useContext(FeedContext);
  if (!ctx) throw new Error("useFeed must be used within FeedProvider");
  return ctx;
}
