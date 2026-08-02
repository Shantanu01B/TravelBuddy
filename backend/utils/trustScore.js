/**
 * Calculates a clean, fair Trust Score (0 to 100) for commuters & drivers.
 * 
 * Formula Breakdown:
 * 1. Average Rating Component (40 pts): (averageRating / 5) * 40
 * 2. Completion Rate Component (30 pts): If totalRides > 0 ? (completedRides / totalRides) * 30 : 30
 * 3. Low Cancellation Component (20 pts): If totalRides > 0 ? (1 - (cancelledRides / totalRides)) * 20 : 20
 * 4. Review Volume Bonus (10 pts): Math.min(10, reviewsCount * 2)
 */
const calculateTrustScore = ({
  averageRating = 5.0,
  totalRides = 0,
  completedRides = 0,
  cancelledRides = 0,
  reviewsCount = 0
}) => {
  const ratingScore = (Math.min(5, Math.max(1, averageRating)) / 5) * 40;

  const completionScore = totalRides > 0
    ? (Math.min(totalRides, completedRides) / totalRides) * 30
    : 30;

  const cancellationScore = totalRides > 0
    ? Math.max(0, (1 - (cancelledRides / totalRides))) * 20
    : 20;

  const reviewBonus = Math.min(10, reviewsCount * 2);

  const rawScore = ratingScore + completionScore + cancellationScore + reviewBonus;
  return Math.min(100, Math.max(10, Math.round(rawScore)));
};

const evaluateBadges = (user) => {
  const badges = ['Verified Commuter'];
  
  if (user.trustScore >= 85) badges.push('Trusted Driver');
  if (user.completedRides >= 5) fontPush(badges, 'Frequent Traveler');
  if (user.carbonSaved >= 10) fontPush(badges, 'Eco Rider');
  if (user.averageRating >= 4.8 && user.reviewsCount >= 3) fontPush(badges, 'Top Rated Commuter');

  return [...new Set(badges)];
};

function fontPush(arr, item) {
  if (!arr.includes(item)) arr.push(item);
}

module.exports = {
  calculateTrustScore,
  evaluateBadges
};
