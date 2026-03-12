"use client";

import { FeedProvider } from "@/lib/FeedContext";
import Navbar from "./Navbar";
import PostModal from "./PostModal";
import Toast from "./Toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FeedProvider>
      <Navbar />
      <main className="pt-16">{children}</main>
      <PostModal />
      <Toast />
    </FeedProvider>
  );
}
