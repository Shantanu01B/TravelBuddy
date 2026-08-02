const express = require('express');
const router = express.Router();
const {
  createTrip,
  getUserTrips,
  updateTrip,
  deleteTrip
} = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createTrip);
router.get('/', protect, getUserTrips);
router.put('/:id', protect, updateTrip);
router.delete('/:id', protect, deleteTrip);

module.exports = router;
