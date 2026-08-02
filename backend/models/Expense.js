const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please provide expense title'],
      trim: true
    },
    category: {
      type: String,
      enum: ['Hotel', 'Food', 'Fuel', 'Shopping', 'Other'],
      default: 'Other'
    },
    amount: {
      type: Number,
      required: [true, 'Please enter amount'],
      min: 0
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    splitBetween: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    perPersonAmount: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Expense', expenseSchema);
