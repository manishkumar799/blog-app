import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPosts } from '../../store/postsSlice'
import PostCard from './PostCard'

const PostList = () => {
  const dispatch = useDispatch()
  const { posts, loading, error } = useSelector((state) => state.posts)
  
  // Local state for filters and sorting
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const [sortOrder, setSortOrder] = useState('newest') // 'newest', 'oldest'

  useEffect(() => {
    dispatch(fetchPosts())
  }, [dispatch])

  // Get unique authors for filter dropdown
  const authors = useMemo(() => {
    if (!posts) return []
    const uniqueAuthors = [...new Set(posts.map(post => post.author?.username))]
    return uniqueAuthors.filter(Boolean).sort()
  }, [posts])

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    if (!posts) return []
    
    let filtered = posts
    
    // Filter by author
    if (selectedAuthor) {
      filtered = filtered.filter(post => 
        post.author?.username === selectedAuthor
      )
    }
    
    // Sort by date
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt)
      const dateB = new Date(b.createdAt)
      
      if (sortOrder === 'newest') {
        return dateB - dateA // Newest first
      } else {
        return dateA - dateB // Oldest first
      }
    })
    
    return sorted
  }, [posts, selectedAuthor, sortOrder])

  // Clear filters
  const clearFilters = () => {
    setSelectedAuthor('')
    setSortOrder('newest')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Filter skeleton */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-wrap gap-4 animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-48"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        
        {/* Post skeletons */}
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
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={() => dispatch(fetchPosts())}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
        <p className="text-gray-600">Be the first to share your thoughts!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter and Sort Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          {/* Author Filter */}
          <div className="flex items-center space-x-2">
            <label htmlFor="author-filter" className="text-sm font-medium text-gray-700">
              Filter by author:
            </label>
            <select
              id="author-filter"
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All authors</option>
              {authors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Control */}
          <div className="flex items-center space-x-2">
            <label htmlFor="sort-order" className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              id="sort-order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {(selectedAuthor || sortOrder !== 'newest') && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters
            </button>
          )}

          {/* Results Count */}
          <div className="text-sm text-gray-500 ml-auto">
            {filteredAndSortedPosts.length} of {posts.length} posts
          </div>
        </div>
      </div>

      {/* Posts List */}
      {filteredAndSortedPosts.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
          <p className="text-gray-600">Try adjusting your filters to see more results.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredAndSortedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

export default PostList