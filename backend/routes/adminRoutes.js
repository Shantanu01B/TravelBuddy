const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllUsers,
  getAllRides,
  deleteUser
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/stats', protect, adminOnly, getStats);
router.get('/users', protect, adminOnly, getAllUsers);
router.get('/rides', protect, adminOnly, getAllRides);
router.delete('/users/:id', protect, adminOnly, deleteUser);

module.exports = router;
