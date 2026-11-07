const express = require('express');
const router = express.Router();
const {
  getAIStatus,
  generateAIPlan,
  createTrip,
  getUserTrips,
  getExploreTrips,
  joinTrip,
  leaveTrip,
  updateTrip,
  deleteTrip
} = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

// Gemini AI Status & Generator
router.get('/ai-status', getAIStatus);
router.post('/ai-plan', generateAIPlan);

// Trip Operations & Community Joining
router.post('/', protect, createTrip);
router.get('/', protect, getUserTrips);
router.get('/explore', protect, getExploreTrips);
router.post('/:id/join', protect, joinTrip);
router.post('/:id/leave', protect, leaveTrip);
router.put('/:id', protect, updateTrip);
router.delete('/:id', protect, deleteTrip);

module.exports = router;
