const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPost,
  createNewPost,
  updateExistingPost,
  deleteExistingPost
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getPosts)
  .post(protect, createNewPost);

router.route('/:id')
  .get(getPost)
  .put(protect, updateExistingPost)
  .delete(protect, deleteExistingPost);

module.exports = router;