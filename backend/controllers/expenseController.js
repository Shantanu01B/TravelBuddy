const Expense = require('../models/Expense');
const Trip = require('../models/Trip');

// @desc    Add expense to trip and calculate split
// @route   POST /api/expenses
// @access  Private
const addExpense = async (req, res, next) => {
  try {
    const { tripId, title, category, amount, splitBetween } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const numAmount = Number(amount);
    const splitMembers = Array.isArray(splitBetween) && splitBetween.length > 0 ? splitBetween : [req.user._id];
    const perPerson = Number((numAmount / splitMembers.length).toFixed(2));

    const expense = await Expense.create({
      trip: tripId,
      title,
      category: category || 'Other',
      amount: numAmount,
      paidBy: req.user._id,
      splitBetween: splitMembers,
      perPersonAmount: perPerson
    });

    const populatedExpense = await Expense.findById(expense._id)
      .populate('paidBy', 'name email avatar')
      .populate('splitBetween', 'name email avatar');

    res.status(201).json({
      success: true,
      data: populatedExpense
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get expenses for a trip with summary calculation
// @route   GET /api/expenses/trip/:tripId
// @access  Private
const getTripExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ trip: req.params.tripId })
      .populate('paidBy', 'name email avatar')
      .populate('splitBetween', 'name email avatar')
      .sort({ createdAt: -1 });

    // Calculate total spend
    const totalAmount = expenses.reduce((acc, exp) => acc + exp.amount, 0);

    // Calculate category breakdown
    const categoryTotals = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    res.json({
      success: true,
      summary: {
        totalAmount,
        categoryTotals
      },
      data: expenses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense record not found' });
    }

    await expense.deleteOne();

    res.json({
      success: true,
      message: 'Expense record removed'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addExpense,
  getTripExpenses,
  deleteExpense
};
