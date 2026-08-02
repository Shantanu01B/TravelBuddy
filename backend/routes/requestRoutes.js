const express = require('express');
const router = express.Router();
const {
  createRideRequest,
  updateRequestStatus,
  completeRideRequest,
  getMyBookedRequests,
  getMyDriverRequests
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createRideRequest);
router.get('/my-booked', protect, getMyBookedRequests);
router.get('/my-requests', protect, getMyDriverRequests);
router.put('/:id/status', protect, updateRequestStatus);
router.put('/:id/complete', protect, completeRideRequest);

module.exports = router;
