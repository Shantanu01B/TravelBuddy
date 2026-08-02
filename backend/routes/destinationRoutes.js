const express = require('express');
const router = express.Router();
const {
  getDestinations,
  createDestination,
  deleteDestination
} = require('../controllers/destinationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getDestinations);
router.post('/', protect, adminOnly, createDestination);
router.delete('/:id', protect, adminOnly, deleteDestination);

module.exports = router;
