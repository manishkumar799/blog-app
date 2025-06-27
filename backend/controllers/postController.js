const asyncHandler = require('express-async-handler');
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require('../services/postService');
const {
  createPostSchema,
  updatePostSchema
} = require('../validators/postValidator');

const getPosts = asyncHandler(async (req, res) => {
  const posts = await getAllPosts();
  res.json(posts);
});

const getPost = asyncHandler(async (req, res) => {
  const post = await getPostById(req.params.id);
  res.json(post);
});

const createNewPost = asyncHandler(async (req, res) => {
  // Validate request body
  const { error } = createPostSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const post = await createPost(req.user.id, req.body);
  res.status(201).json(post);
});

const updateExistingPost = asyncHandler(async (req, res) => {
  // Validate request body
  const { error } = updatePostSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const post = await updatePost(req.user.id, req.params.id, req.body);
  res.json(post);
});

const deleteExistingPost = asyncHandler(async (req, res) => {
  await deletePost(req.user.id, req.params.id);
  res.json({ message: 'Post removed' });
});

module.exports = {
  getPosts,
  getPost,
  createNewPost,
  updateExistingPost,
  deleteExistingPost
};