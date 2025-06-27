import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { postsAPI } from '../services/api'

// Async thunks for posts operations
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await postsAPI.getAll()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch posts')
    }
  }
)

export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await postsAPI.getById(postId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch post')
    }
  }
)

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await postsAPI.create(postData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post')
    }
  }
)

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ id, postData }, { rejectWithValue }) => {
    try {
      const response = await postsAPI.update(id, postData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update post')
    }
  }
)

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId, { rejectWithValue }) => {
    try {
      await postsAPI.delete(postId)
      return postId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete post')
    }
  }
)

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    currentPost: null,
    loading: false,
    error: null,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentPost: (state) => {
      state.currentPost = null
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false
        state.posts = action.payload.posts || action.payload
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch single post
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false
        state.currentPost = action.payload.post || action.payload
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create post
      .addCase(createPost.pending, (state) => {
        state.createLoading = true
        state.error = null
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.createLoading = false
        state.posts.unshift(action.payload.post || action.payload)
      })
      .addCase(createPost.rejected, (state, action) => {
        state.createLoading = false
        state.error = action.payload
      })
      // Update post
      .addCase(updatePost.pending, (state) => {
        state.updateLoading = true
        state.error = null
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.updateLoading = false
        const updatedPost = action.payload.post || action.payload
        const index = state.posts.findIndex(post => post.id === updatedPost.id)
        if (index !== -1) {
          state.posts[index] = updatedPost
        }
        state.currentPost = updatedPost
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.updateLoading = false
        state.error = action.payload
      })
      // Delete post
      .addCase(deletePost.pending, (state) => {
        state.deleteLoading = true
        state.error = null
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.deleteLoading = false
        state.posts = state.posts.filter(post => post.id !== action.payload)
        if (state.currentPost?.id === action.payload) {
          state.currentPost = null
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.deleteLoading = false
        state.error = action.payload
      })
  }
})

export const { clearError, clearCurrentPost, setCurrentPost } = postsSlice.actions
export default postsSlice.reducer