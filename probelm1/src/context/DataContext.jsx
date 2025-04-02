"use client"

import { createContext, useState, useEffect, useContext } from "react"

const DataContext = createContext()

export const useData = () => useContext(DataContext)

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState({})
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState({})
  const [loading, setLoading] = useState(true)
  const [topUsers, setTopUsers] = useState([])
  const [trendingPosts, setTrendingPosts] = useState([])

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://20.244.56.144/evaluation-service/users")
      const data = await response.json()
      setUsers(data.users)
      return data.users
    } catch (error) {
      console.error("Error fetching users:", error)
      return {}
    }
  }

  // Fetch posts for a specific user
  const fetchUserPosts = async (userId) => {
    try {
      const response = await fetch(`http://20.244.56.144/evaluation-service/users/${userId}/posts`)
      const data = await response.json()
      return data.posts || []
    } catch (error) {
      console.error(`Error fetching posts for user ${userId}:`, error)
      return []
    }
  }

  // Fetch comments for a specific post
  const fetchPostComments = async (postId) => {
    try {
      const response = await fetch(`http://20.244.56.144/evaluation-service/posts/${postId}/comments`)
      const data = await response.json()
      return data.comments || []
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error)
      return []
    }
  }

  // Initialize data
  const initializeData = async () => {
    setLoading(true)

    // Fetch all users
    const usersData = await fetchUsers()

    // Track post counts for each user
    const userPostCounts = {}
    let allPosts = []

    // Fetch posts for each user
    for (const userId in usersData) {
      const userPosts = await fetchUserPosts(userId)
      userPostCounts[userId] = userPosts.length

      // Add user info to each post
      const postsWithUserInfo = userPosts.map((post) => ({
        ...post,
        userName: usersData[post.userid],
        commentCount: 0,
        imageUrl: `https://source.unsplash.com/random/300x200?sig=${post.id}`,
      }))

      allPosts = [...allPosts, ...postsWithUserInfo]
    }

    // Sort posts by ID (assuming higher ID means newer post)
    allPosts.sort((a, b) => b.id - a.id)

    // Fetch comments for each post and update comment counts
    const commentsData = {}
    for (const post of allPosts) {
      const postComments = await fetchPostComments(post.id)
      commentsData[post.id] = postComments
      post.commentCount = postComments.length
    }

    // Find top 5 users with most posts
    const topUsersList = Object.entries(userPostCounts)
      .map(([userId, postCount]) => ({
        id: userId,
        name: usersData[userId],
        postCount,
        imageUrl: `https://source.unsplash.com/random/100x100?face&sig=${userId}`,
      }))
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 5)

    // Find trending posts (posts with maximum comments)
    const maxComments = Math.max(...allPosts.map((post) => post.commentCount))
    const trendingPostsList = allPosts.filter((post) => post.commentCount === maxComments)

    setPosts(allPosts)
    setComments(commentsData)
    setTopUsers(topUsersList)
    setTrendingPosts(trendingPostsList)
    setLoading(false)
  }

  // Refresh feed periodically
  const refreshFeed = async () => {
    // This would be more efficient in a real app by only fetching new data
    const updatedPosts = []

    for (const userId in users) {
      const userPosts = await fetchUserPosts(userId)

      const postsWithUserInfo = userPosts.map((post) => ({
        ...post,
        userName: users[post.userid],
        commentCount: comments[post.id]?.length || 0,
        imageUrl: `https://source.unsplash.com/random/300x200?sig=${post.id}`,
      }))

      updatedPosts.push(...postsWithUserInfo)
    }

    // Sort posts by ID (assuming higher ID means newer post)
    updatedPosts.sort((a, b) => b.id - a.id)

    setPosts(updatedPosts)
  }

  useEffect(() => {
    initializeData()

    // Set up periodic refresh for feed
    const refreshInterval = setInterval(refreshFeed, 30000) // Refresh every 30 seconds

    return () => clearInterval(refreshInterval)
  }, [])

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
  )
}

