const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Review = require('../models/Review');
const User = require('../models/User');
const { calculateTrustScore, evaluateBadges } = require('./trustScore');

dotenv.config({ path: path.join(__dirname, '../.env') });

const cleanupDuplicateReviews = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/travelbuddy');
    console.log('Connected to DB for review cleanup...');

    const users = await User.find();

    for (const user of users) {
      const userReviews = await Review.find({ reviewee: user._id }).sort({ createdAt: 1 });

      if (userReviews.length > 1) {
        const seenPairs = new Set();
        const toDeleteIds = [];

        for (const rev of userReviews) {
          const key = `${rev.reviewer.toString()}_${rev.ride.toString()}`;
          if (seenPairs.has(key)) {
            toDeleteIds.push(rev._id);
          } else {
            seenPairs.add(key);
          }
        }

        if (toDeleteIds.length > 0) {
          await Review.deleteMany({ _id: { $in: toDeleteIds } });
          console.log(`Deleted ${toDeleteIds.length} duplicate reviews for user: ${user.name}`);
        }
      }

      // Recalculate User Metrics
      const remaining = await Review.find({ reviewee: user._id });
      const sum = remaining.reduce((acc, r) => acc + r.rating, 0);

      user.reviewsCount = remaining.length;
      user.averageRating = remaining.length > 0 ? Number((sum / remaining.length).toFixed(1)) : 5.0;

      user.trustScore = calculateTrustScore({
        averageRating: user.averageRating,
        totalRides: user.totalRides,
        completedRides: user.completedRides,
        cancelledRides: user.cancelledRides,
        reviewsCount: user.reviewsCount
      });

      user.badges = evaluateBadges(user);
      await user.save();

      console.log(`Updated user ${user.name}: Reviews Count = ${user.reviewsCount}, Average Rating = ${user.averageRating}, Trust Score = ${user.trustScore}`);
    }

    console.log('Duplicate reviews cleanup finished successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Cleanup Error:', err.message);
    process.exit(1);
  }
};

cleanupDuplicateReviews();
