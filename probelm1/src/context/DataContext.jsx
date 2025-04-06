import { createContext, useState, useEffect, useContext } from "react";

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState({});
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [topUsers, setTopUsers] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "http://20.244.56.144/evaluation-service/users"
      );
      const data = await response.json();
      setUsers(data.users);
      return data.users;
    } catch (error) {
      console.error("Error fetching users:", error);
      return {};
    }
  };

  const fetchUserPosts = async (userId) => {
    try {
      const response = await fetch(
        `http://20.244.56.144/evaluation-service/users/${userId}/posts`
      );
      const data = await response.json();
      return data.posts || [];
    } catch (error) {
      console.error(`Error fetching posts for user ${userId}:`, error);
      return [];
    }
  };

  const fetchPostComments = async (postId) => {
    try {
      const response = await fetch(
        `http://20.244.56.144/evaluation-service/posts/${postId}/comments`
      );
      const data = await response.json();
      return data.comments || [];
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      return [];
    }
  };

  const initializeData = async () => {
    setLoading(true);

    const usersData = await fetchUsers();

    const userPostCounts = {};
    let allPosts = [];

    for (const userId in usersData) {
      const userPosts = await fetchUserPosts(userId);
      userPostCounts[userId] = userPosts.length;

      const postsWithUserInfo = userPosts.map((post) => ({
        ...post,
        userName: usersData[post.userid],
        commentCount: 0,
        imageUrl: `https://source.unsplash.com/random/300x200?sig=${post.id}`,
      }));

      allPosts = [...allPosts, ...postsWithUserInfo];
    }

    allPosts.sort((a, b) => b.id - a.id);

    const commentsData = {};
    for (const post of allPosts) {
      const postComments = await fetchPostComments(post.id);
      commentsData[post.id] = postComments;
      post.commentCount = postComments.length;
    }

    const topUsersList = Object.entries(userPostCounts)
      .map(([userId, postCount]) => ({
        id: userId,
        name: usersData[userId],
        postCount,
        imageUrl: `https://source.unsplash.com/random/100x100?face&sig=${userId}`,
      }))
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 5);

    const maxComments = Math.max(...allPosts.map((post) => post.commentCount));
    const trendingPostsList = allPosts.filter(
      (post) => post.commentCount === maxComments
    );

    setPosts(allPosts);
    setComments(commentsData);
    setTopUsers(topUsersList);
    setTrendingPosts(trendingPostsList);
    setLoading(false);
  };

  const refreshFeed = async () => {
    const updatedPosts = [];

    for (const userId in users) {
      const userPosts = await fetchUserPosts(userId);

      const postsWithUserInfo = userPosts.map((post) => ({
        ...post,
        userName: users[post.userid],
        commentCount: comments[post.id]?.length || 0,
        imageUrl: `https://source.unsplash.com/random/300x200?sig=${post.id}`,
      }));

      updatedPosts.push(...postsWithUserInfo);
    }

    updatedPosts.sort((a, b) => b.id - a.id);

    setPosts(updatedPosts);
  };

  useEffect(() => {
    initializeData();

    const refreshInterval = setInterval(refreshFeed, 30000);

    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <DataContext.Provider
      value={{
        users,
        posts,
        comments,
        loading,
        topUsers,
        trendingPosts,
        refreshFeed,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
