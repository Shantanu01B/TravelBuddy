const express = require('express');
const router = express.Router();
const {
  createReview,
  getUserReviews,
  getMySubmittedReviews
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/my-submitted', protect, getMySubmittedReviews);
router.get('/user/:userId', getUserReviews);

module.exports = router;
