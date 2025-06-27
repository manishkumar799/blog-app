import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchPosts } from '../store/postsSlice'
import PostCard from '../components/posts/PostCard'

const Profile = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { posts, loading } = useSelector((state) => state.posts)
  const [userPosts, setUserPosts] = useState([])

  useEffect(() => {
    dispatch(fetchPosts())
  }, [dispatch])

  useEffect(() => {
    if (posts && user) {
      const filteredPosts = posts.filter(post => post.author.id === user.id)
      setUserPosts(filteredPosts)
    }
  }, [posts, user])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-indigo-600 font-bold text-2xl">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user?.username}
            </h1>
            <p className="text-gray-600">
              {user?.email}
            </p>
            <p className="text-sm text-gray-500">
              Member since {formatDate(user?.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <div className="flex space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {userPosts.length}
              </div>
              <div className="text-sm text-gray-600">Posts</div>
            </div>
          </div>
          
          <Link
            to="/create-post"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create New Post
          </Link>
        </div>
      </div>

      {/* User Posts */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Your Posts
        </h2>
        
        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : userPosts.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-4">Start sharing your thoughts with the community!</p>
            <Link
              to="/create-post"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Write Your First Post
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {userPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile