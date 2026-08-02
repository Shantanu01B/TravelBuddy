const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  toggleLikePost,
  addComment
} = require('../controllers/communityController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getPosts);
router.post('/', protect, createPost);
router.put('/:id/like', protect, toggleLikePost);
router.post('/:id/comments', protect, addComment);

module.exports = router;
