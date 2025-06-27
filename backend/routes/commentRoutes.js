const express = require('express');
const router = express.Router();
const { getComments, addComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:postId/comments')
  .get(getComments)
  .post(protect, addComment);

module.exports = router;