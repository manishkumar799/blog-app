import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import PostList from '../components/posts/PostList'

const Home = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to BlogApp
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover stories, thinking, and expertise from writers
        </p>
        
        {isAuthenticated && (
          <div className="mb-8">
            <Link
              to="/create-post"
              className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-200 font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Write a Post
            </Link>
          </div>
        )}
      </div>

      {/* Welcome Message for New Users */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-indigo-900 mb-2">
              Join Our Community
            </h2>
            <p className="text-indigo-700 mb-4">
              Sign up today to start sharing your stories and connect with like-minded people.
            </p>
            <div className="space-x-4">
              <Link
                to="/signup"
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-200"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="inline-block border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Posts Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Recent Posts</h2>
          <div className="text-sm text-gray-500">
            Latest stories from our community
          </div>
        </div>
        <PostList />
      </div>
    </div>
  )
}

export default Home