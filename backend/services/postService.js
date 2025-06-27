const { Post, User, Comment } = require('../models');

const getAllPosts = async () => {
  return await Post.findAll({
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'username']
      },
      {
        model: Comment,
        include: {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }
      }
    ],
    order: [['createdAt', 'DESC']]
  });
};

const getPostById = async (postId) => {
  const post = await Post.findByPk(postId, {
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'username']
      },
      {
        model: Comment,
        include: {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }
      }
    ]
  });

  if (!post) {
    throw new Error('Post not found');
  }

  return post;
};

const createPost = async (userId, { title, content }) => {
  return await Post.create({
    title,
    content,
    authorId: userId
  });
};

const updatePost = async (userId, postId, { title, content }) => {
  const post = await Post.findByPk(postId);

  if (!post) {
    throw new Error('Post not found');
  }

  if (post.authorId !== userId) {
    throw new Error('Not authorized to update this post');
  }

  post.title = title || post.title;
  post.content = content || post.content;

  await post.save();
  return post;
};

const deletePost = async (userId, postId) => {
  const post = await Post.findByPk(postId);

  if (!post) {
    throw new Error('Post not found');
  }

  if (post.authorId !== userId) {
    throw new Error('Not authorized to delete this post');
  }

  await post.destroy();
  return { message: 'Post removed' };
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};