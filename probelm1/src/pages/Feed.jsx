"use client";

import { useData } from "../context/DataContext";
import PostCard from "../components/PostCard";
import { RefreshCw } from "lucide-react";

const Feed = () => {
  const { posts, loading, refreshFeed } = useData();

  const handleRefresh = () => {
    refreshFeed();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Latest Posts</h1>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <RefreshCw size={18} />
          Refresh Feed
        </button>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
