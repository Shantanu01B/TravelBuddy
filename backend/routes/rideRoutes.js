const express = require('express');
const router = express.Router();
const {
  createRide,
  searchRides,
  getRideById,
  getMyOfferedRides,
  deleteRide
} = require('../controllers/rideController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createRide);
router.get('/search', searchRides);
router.get('/my-offered', protect, getMyOfferedRides);
router.get('/:id', getRideById);
router.delete('/:id', protect, deleteRide);

module.exports = router;
