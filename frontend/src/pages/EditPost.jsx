import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPostById, clearCurrentPost } from '../store/postsSlice'
import PostForm from '../components/posts/PostForm'

const EditPost = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentPost, loading, error } = useSelector((state) => state.posts)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(id))
    }
    
    return () => {
      dispatch(clearCurrentPost())
    }
  }, [id, dispatch])

  useEffect(() => {
    // Check if user is the author of the post
    if (currentPost && user && currentPost.author.id !== user.id) {
      navigate('/')
    }
  }, [currentPost, user, navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    )
  }

  if (!currentPost) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-700 mb-4">Post not found</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    )
  }

  return <PostForm post={currentPost} isEditing={true} />
}

export default EditPost