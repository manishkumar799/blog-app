// store/commentsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { commentsAPI } from '../services/api'

// Async thunks
export const fetchCommentsByPost = createAsyncThunk(
  'comments/fetchByPost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await commentsAPI.getByPost(postId)
      return { postId, comments: response.data }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments')
    }
  }
)

export const createComment = createAsyncThunk(
  'comments/create',
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const response = await commentsAPI.create(postId, { content })
      return { postId, comment: response.data }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create comment')
    }
  }
)

export const deleteComment = createAsyncThunk(
  'comments/delete',
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      await commentsAPI.delete(postId, commentId)
      return { postId, commentId }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete comment')
    }
  }
)

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    commentsByPost: {}, // { postId: { comments: [], loading: false, error: null } }
    loading: false,
    error: null
  },
  reducers: {
    clearCommentsError: (state) => {
      state.error = null
    },
    clearPostComments: (state, action) => {
      const postId = action.payload
      delete state.commentsByPost[postId]
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch comments by post
      .addCase(fetchCommentsByPost.pending, (state, action) => {
        const postId = action.meta.arg
        if (!state.commentsByPost[postId]) {
          state.commentsByPost[postId] = { comments: [], loading: false, error: null }
        }
        state.commentsByPost[postId].loading = true
        state.commentsByPost[postId].error = null
      })
      .addCase(fetchCommentsByPost.fulfilled, (state, action) => {
        const { postId, comments } = action.payload
        state.commentsByPost[postId].comments = comments
        state.commentsByPost[postId].loading = false
        state.commentsByPost[postId].error = null
      })
      .addCase(fetchCommentsByPost.rejected, (state, action) => {
        const postId = action.meta.arg
        state.commentsByPost[postId].loading = false
        state.commentsByPost[postId].error = action.payload
      })
      
      // Create comment
      .addCase(createComment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload
        if (state.commentsByPost[postId]) {
          state.commentsByPost[postId].comments.unshift(comment) // Add to beginning
        }
        state.loading = false
        state.error = null
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Delete comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { postId, commentId } = action.payload
        if (state.commentsByPost[postId]) {
          state.commentsByPost[postId].comments = state.commentsByPost[postId].comments.filter(
            comment => comment.id !== commentId
          )
        }
      })
  }
})

export const { clearCommentsError, clearPostComments } = commentsSlice.actions

// Selectors
export const selectCommentsByPost = (state, postId) => 
  state.comments.commentsByPost[postId] || { comments: [], loading: false, error: null }

export const selectCommentsLoading = (state) => state.comments.loading
export const selectCommentsError = (state) => state.comments.error

export default commentsSlice.reducer