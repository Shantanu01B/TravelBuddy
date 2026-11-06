const express = require('express');
const router = express.Router();
const {
  getAIStatus,
  generateAIPlan,
  createTrip,
  getUserTrips,
  updateTrip,
  deleteTrip
} = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

// Gemini AI Status & Generator
router.get('/ai-status', getAIStatus);
router.post('/ai-plan', generateAIPlan);

// Standard Trip Operations
router.post('/', protect, createTrip);
router.get('/', protect, getUserTrips);
router.put('/:id', protect, updateTrip);
router.delete('/:id', protect, deleteTrip);

module.exports = router;
