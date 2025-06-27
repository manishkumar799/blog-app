import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PostCard = ({ post }) => {
  const { user } = useSelector((state) => state.auth)
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Truncate content for preview
  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-semibold">
                {post.author?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {post.author?.username || 'Unknown Author'}
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
          {user?.id === post.author?.id && (
            <div className="flex space-x-2">
              <Link
                to={`/edit-post/${post.id}`}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Edit
              </Link>
            </div>
          )}
        </div>
        
        <Link to={`/posts/${post.id}`} className="block">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            {truncateContent(post.content)}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
              Read more →
            </span>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>
                {post.Comments?.length || 0} comments
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default PostCard