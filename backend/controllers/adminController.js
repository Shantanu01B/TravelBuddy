const User = require('../models/User');
const RidePost = require('../models/RidePost');
const RideRequest = require('../models/RideRequest');
const Trip = require('../models/Trip');
const Destination = require('../models/Destination');
const Post = require('../models/Post');

// @desc    Get dashboard statistics for admin
// @route   GET /api/admin/stats
// @access  Private Admin
const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeRides = await RidePost.countDocuments({ status: 'active' });
    const completedRides = await RidePost.countDocuments({ status: 'completed' });
    const totalRequests = await RideRequest.countDocuments();
    const totalTrips = await Trip.countDocuments();
    const totalDestinations = await Destination.countDocuments();
    const totalPosts = await Post.countDocuments();

    // Total CO2 saved sum across all users
    const users = await User.find({}, 'carbonSaved');
    const totalCarbonSaved = users.reduce((acc, u) => acc + (u.carbonSaved || 0), 0);

    res.json({
      success: true,
      data: {
        totalUsers,
        activeRides,
        completedRides,
        totalRequests,
        totalTrips,
        totalDestinations,
        totalPosts,
        totalCarbonSaved: Number(totalCarbonSaved.toFixed(1))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all ride posts
// @route   GET /api/admin/rides
// @access  Private Admin
const getAllRides = async (req, res, next) => {
  try {
    const rides = await RidePost.find()
      .populate('driver', 'name email organization')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: rides.length,
      data: rides
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Admin account cannot be deleted' });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User account removed'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getAllUsers,
  getAllRides,
  deleteUser
};
