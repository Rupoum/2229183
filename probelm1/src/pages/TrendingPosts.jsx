import { useData } from "../context/DataContext";
import PostCard from "../components/PostCard";
import { TrendingUp } from "lucide-react";

const TrendingPosts = () => {
  // const { trendingPosts, loading } = useData();

  const trendingPosts = [
    {
      id: 1,
      userName: "Alic",
      content: "Exploring",
      commentCount: 15,
      imageUrl: "vjbhbnklkm",
    },
  ];

  const loading = false;
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <TrendingUp size={24} className="text-blue-600 mr-2" />
        <h1 className="text-2xl font-bold">Trending Posts</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Most Commented Posts</h2>
        <p className="text-gray-600 mb-6">
          {trendingPosts.length > 0
            ? `These posts have the highest number of comments (${trendingPosts[0].commentCount} comments each).`
            : "No trending posts found."}
        </p>
      </div>

      <div className="space-y-6">
        {trendingPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default TrendingPosts;
