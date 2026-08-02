const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide destination name'],
      trim: true
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop'
    },
    description: {
      type: String,
      required: true
    },
    bestTime: {
      type: String,
      default: 'October to March'
    },
    estimatedBudget: {
      type: Number,
      default: 3000
    },
    popularAttractions: {
      type: [String],
      default: []
    },
    category: {
      type: String,
      enum: ['Hill Station', 'Beach', 'Historical', 'Adventure', 'City Break'],
      default: 'Hill Station'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Destination', destinationSchema);
