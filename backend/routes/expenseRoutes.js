const express = require('express');
const router = express.Router();
const {
  addExpense,
  getTripExpenses,
  deleteExpense
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addExpense);
router.get('/trip/:tripId', protect, getTripExpenses);
router.delete('/:id', protect, deleteExpense);

module.exports = router;
