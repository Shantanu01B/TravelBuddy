const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Male'
    },
    organization: {
      type: String,
      default: 'General Commuter',
      trim: true
    },
    vehicle: {
      makeModel: { type: String, default: '' },
      licensePlate: { type: String, default: '' },
      type: { type: String, enum: ['Bike', 'Car', 'Scooter', 'None'], default: 'None' },
      capacity: { type: Number, default: 1 }
    },
    bio: {
      type: String,
      default: 'Loves traveling and meeting new commuters!'
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop'
    },
    averageRating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5
    },
    trustScore: {
      type: Number,
      default: 75,
      min: 0,
      max: 100
    },
    rewardPoints: {
      type: Number,
      default: 50
    },
    badges: {
      type: [String],
      default: ['Verified Commuter']
    },
    completedRides: {
      type: Number,
      default: 0
    },
    totalRides: {
      type: Number,
      default: 0
    },
    cancelledRides: {
      type: Number,
      default: 0
    },
    reviewsCount: {
      type: Number,
      default: 0
    },
    carbonSaved: {
      type: Number,
      default: 0.0
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
