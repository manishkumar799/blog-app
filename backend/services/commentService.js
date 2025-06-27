const { Comment, Post, User } = require('../models');

const getCommentsByPost = async (postId) => {
  const post = await Post.findByPk(postId);
  if (!post) {
    throw new Error('Post not found');
  }

  return await Comment.findAll({
    where: { postId },
    include: {
      model: User,
      as: 'user',
      attributes: ['id', 'username']
    }
  });
};

const addCommentToPost = async (userId, postId, content) => {
  const post = await Post.findByPk(postId);
  if (!post) {
    throw new Error('Post not found');
  }

  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }

  return await Comment.create({
    content,
    postId,
    userId,
    commenterName: user.username
  });
};

module.exports = {
  getCommentsByPost,
  addCommentToPost
};