"use client"

import { useState } from "react"
import { useData } from "../context/DataContext"
import { MessageCircle, Heart, Share2 } from "lucide-react"

const PostCard = ({ post }) => {
  const { comments } = useData()
  const [showComments, setShowComments] = useState(false)
  const [liked, setLiked] = useState(false)

  const postComments = comments[post.id] || []

  const toggleComments = () => {
    setShowComments(!showComments)
  }

  const toggleLike = () => {
    setLiked(!liked)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <img
            src={`https://source.unsplash.com/random/100x100?face&sig=${post.userid}`}
            alt={post.userName}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h3 className="font-semibold">{post.userName}</h3>
            <p className="text-gray-500 text-sm">Post #{post.id}</p>
          </div>
        </div>

        <p className="mb-4">{post.content}</p>

        <img
          src={post.imageUrl || "/placeholder.svg"}
          alt="Post content"
          className="w-full h-48 object-cover rounded-md"
        />

        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-1 ${liked ? "text-red-500" : "text-gray-500"} hover:text-red-500`}
          >
            <Heart size={18} fill={liked ? "currentColor" : "none"} />
            <span>{liked ? "Liked" : "Like"}</span>
          </button>

          <button onClick={toggleComments} className="flex items-center gap-1 text-gray-500 hover:text-blue-500">
            <MessageCircle size={18} />
            <span>{post.commentCount} Comments</span>
          </button>

          <button className="flex items-center gap-1 text-gray-500 hover:text-green-500">
            <Share2 size={18} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {showComments && postComments.length > 0 && (
        <div className="bg-gray-50 p-4 border-t border-gray-100">
          <h4 className="font-medium mb-2">Comments</h4>
          <div className="space-y-3">
            {postComments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-2">
                <img
                  src={`https://source.unsplash.com/random/100x100?face&sig=${comment.id}`}
                  alt="Commenter"
                  className="w-8 h-8 rounded-full mt-1"
                />
                <div className="bg-white p-2 rounded-lg shadow-sm flex-1">
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PostCard

