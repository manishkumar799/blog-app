import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchPostById,
  deletePost,
  clearCurrentPost,
} from "../store/postsSlice";
import {
  fetchCommentsByPost,
  createComment,
  deleteComment,
  selectCommentsByPost,
  clearPostComments,
} from "../store/commentsSlice";

const PostDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPost, loading, error, deleteLoading } = useSelector(
    (state) => state.posts
  );
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { comments, loading: commentsLoading } = useSelector((state) =>
    selectCommentsByPost(state, id)
  );

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(id));
      dispatch(fetchCommentsByPost(id));
    }

    return () => {
      dispatch(clearCurrentPost());
      dispatch(clearPostComments(id));
    };
  }, [id, dispatch]);

  const handleDelete = async () => {
    try {
      await dispatch(deletePost(id)).unwrap();
      toast.success("Post deleted successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error || "Failed to delete post");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentContent.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please login to comment");
      return;
    }

    setCommentLoading(true);
    try {
      await dispatch(
        createComment({ postId: id, content: commentContent.trim() })
      ).unwrap();
      setCommentContent("");
      toast.success("Comment added successfully!");
    } catch (error) {
      toast.error(error || "Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await dispatch(deleteComment({ postId: id, commentId })).unwrap();
        toast.success("Comment deleted successfully!");
      } catch (error) {
        toast.error(error || "Failed to delete comment");
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentPost) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 mb-4">{error || "Post not found"}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }
  const isAuthor = user?.id === currentPost.author?.id;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Post Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-semibold text-lg">
                  {currentPost.commenterName?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {currentPost.commenterName || "Unknown Author"}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(currentPost.createdAt)}
                  {currentPost.updatedAt !== currentPost.createdAt && (
                    <span className="ml-2">(edited)</span>
                  )}
                </p>
              </div>
            </div>

            {isAuthor && (
              <div className="flex items-center space-x-3">
                <Link
                  to={`/edit-post/${currentPost.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-red-600 hover:text-red-800 font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {currentPost.title}
          </h1>
        </div>

        {/* Post Content */}
        <div className="p-6">
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {currentPost.content}
            </div>
          </div>
        </div>

        {/* Post Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{comments.length} comments</span>
              <span>•</span>
              <span>Published {formatDate(currentPost.createdAt)}</span>
            </div>

            <Link
              to="/"
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              ← Back to Posts
            </Link>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Post
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Comments ({comments.length})
        </h3>

        {/* Comment Form */}
        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="mb-4">
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Add a comment
              </label>
              <textarea
                id="comment"
                rows={4}
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Write your comment here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                disabled={commentLoading}
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {commentContent.length}/500 characters
              </span>
              <button
                type="submit"
                disabled={
                  commentLoading ||
                  !commentContent.trim() ||
                  commentContent.length > 500
                }
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {commentLoading ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg mb-8">
            <p className="text-gray-600 mb-4">
              Sign in to join the conversation
            </p>
            <div className="space-x-4">
              <Link
                to="/login"
                className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="inline-block border border-indigo-600 text-indigo-600 px-4 py-2 rounded hover:bg-indigo-50 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}

        {/* Comments List */}
        {commentsLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div className="space-y-1">
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No comments yet</p>
            <p className="text-gray-400">
              Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-medium text-sm">
                        {comment.commenterName?.charAt(0).toUpperCase() || "A"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {comment.commenterName || "Anonymous"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>

                  {user && user.id === comment.author?.id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                      title="Delete comment"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="ml-11">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
