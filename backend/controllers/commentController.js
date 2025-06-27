const asyncHandler = require('express-async-handler');
const {
  getCommentsByPost,
  addCommentToPost
} = require('../services/commentService');
const { commentSchema } = require('../validators/commentValidator');

const getComments = asyncHandler(async (req, res) => {
  const comments = await getCommentsByPost(req.params.postId);
  res.json(comments);
});

const addComment = asyncHandler(async (req, res) => {
  // Validate request body
  const { error } = commentSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const comment = await addCommentToPost(
    req.user.id,
    req.params.postId,
    req.body.content
  );
  res.status(201).json(comment);
});

module.exports = {
  getComments,
  addComment
};