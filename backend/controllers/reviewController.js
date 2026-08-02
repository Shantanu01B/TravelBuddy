const Review = require('../models/Review');
const User = require('../models/User');
const { calculateTrustScore, evaluateBadges } = require('../utils/trustScore');

const createReview = async (req, res, next) => {
  try {
    const { rideId, revieweeId, rating, comment, role } = req.body;

    if (!revieweeId || !rating) {
      return res.status(400).json({ success: false, message: 'Reviewee ID and Rating are required' });
    }

    if (revieweeId.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot rate yourself' });
    }

    // Check if user has ALREADY submitted a review for this ride and reviewee
    const existingReview = await Review.findOne({
      ride: rideId,
      reviewer: req.user._id,
      reviewee: revieweeId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a rating for this commuter for this ride.'
      });
    }

    const review = await Review.create({
      ride: rideId,
      reviewer: req.user._id,
      reviewee: revieweeId,
      rating: Number(rating),
      comment: comment || 'Great commuter!',
      role: role || 'driver'
    });

    // Recalculate Reviewee's Average Rating & Trust Score
    const reviewee = await User.findById(revieweeId);
    if (reviewee) {
      const allReviews = await Review.find({ reviewee: revieweeId });
      const totalRatingSum = allReviews.reduce((acc, r) => acc + r.rating, 0);
      const newAverageRating = Number((totalRatingSum / allReviews.length).toFixed(1));

      reviewee.averageRating = newAverageRating;
      reviewee.reviewsCount = allReviews.length;

      reviewee.trustScore = calculateTrustScore({
        averageRating: reviewee.averageRating,
        totalRides: reviewee.totalRides,
        completedRides: reviewee.completedRides,
        cancelledRides: reviewee.cancelledRides,
        reviewsCount: reviewee.reviewsCount
      });

      reviewee.badges = evaluateBadges(reviewee);
      await reviewee.save();
    }

    res.status(201).json({
      success: true,
      data: review,
      message: 'Rating submitted successfully!'
    });
  } catch (error) {
    next(error);
  }
};

const getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name avatar trustScore organization')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

const getMySubmittedReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ reviewer: req.user._id }).select('ride reviewee');
    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getUserReviews,
  getMySubmittedReviews
};
