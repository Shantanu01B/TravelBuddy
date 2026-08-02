const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: [
        'request',
        'accepted',
        'rejected',
        'completed',
        'ride_request',
        'ride_accepted',
        'ride_rejected',
        'badge_earned',
        'trip_reminder',
        'general'
      ],
      default: 'general'
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
