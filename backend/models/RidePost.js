const mongoose = require('mongoose');

const routeStopSchema = new mongoose.Schema({
  stopName: {
    type: String,
    required: true,
    trim: true
  },
  pickupPoint: {
    type: String,
    default: '',
    trim: true
  },
  stopOrder: {
    type: Number,
    required: true
  }
});

const ridePostSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    vehicleType: {
      type: String,
      enum: ['Bike', 'Car', 'Scooter', 'Auto Share', 'Cab Share'],
      required: true
    },
    vehicleName: {
      type: String,
      default: 'Vehicle'
    },
    source: {
      type: String,
      required: [true, 'Please provide a source location'],
      trim: true
    },
    destination: {
      type: String,
      required: [true, 'Please provide a destination location'],
      trim: true
    },
    routeStops: {
      type: [routeStopSchema],
      required: true,
      validate: [val => val.length >= 2, 'Ride must contain at least 2 route stops']
    },
    date: {
      type: String,
      required: [true, 'Please specify travel date']
    },
    time: {
      type: String,
      required: [true, 'Please specify travel time']
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 1
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 0
    },
    pricePerSeat: {
      type: Number,
      required: true,
      min: 0
    },
    community: {
      type: String,
      default: 'General Commuter'
    },
    rideType: {
      type: String,
      enum: ['One Time', 'Daily', 'Weekly'],
      default: 'One Time'
    },
    status: {
      type: String,
      enum: ['active', 'filled', 'completed', 'cancelled'],
      default: 'active'
    },
    description: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Helper method to check if pickup and drop stops match in order
ridePostSchema.methods.matchesRoute = function (pickupLocation, dropLocation) {
  const stops = this.routeStops.map(s => s.stopName.toLowerCase());
  const pickupLower = pickupLocation.toLowerCase();
  const dropLower = dropLocation.toLowerCase();

  const pickupIndex = stops.findIndex(s => s.includes(pickupLower));
  const dropIndex = stops.findIndex(s => s.includes(dropLower));

  return pickupIndex !== -1 && dropIndex !== -1 && pickupIndex < dropIndex;
};

module.exports = mongoose.model('RidePost', ridePostSchema);
