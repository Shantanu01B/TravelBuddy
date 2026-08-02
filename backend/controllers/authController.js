const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RideRequest = require('../models/RideRequest');
const RidePost = require('../models/RidePost');
const { calculateTrustScore, evaluateBadges } = require('../utils/trustScore');
const { uploadImage } = require('../utils/cloudinary');

const MALE_AVATAR = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop';
const FEMALE_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'travelbuddy_super_secret_jwt_key_2026_placement', {
    expiresIn: '30d'
  });
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, gender, organization, vehicle, bio, avatar } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const selectedGender = gender || 'Male';
    const defaultAvatar = avatar || (selectedGender === 'Female' ? FEMALE_AVATAR : MALE_AVATAR);

    const user = await User.create({
      name,
      email,
      password,
      gender: selectedGender,
      organization: organization || 'General Commuter',
      vehicle: vehicle || { makeModel: '', licensePlate: '', type: 'None', capacity: 1 },
      bio: bio || 'Loves traveling and meeting new commuters!',
      avatar: defaultAvatar,
      trustScore: 85,
      rewardPoints: 50,
      badges: ['Verified Commuter'],
      completedRides: 0,
      totalRides: 0,
      cancelledRides: 0,
      reviewsCount: 0,
      carbonSaved: 0
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          gender: user.gender,
          organization: user.organization,
          vehicle: user.vehicle,
          bio: user.bio,
          avatar: user.avatar,
          trustScore: user.trustScore,
          rewardPoints: user.rewardPoints,
          badges: user.badges,
          completedRides: 0,
          totalRides: 0,
          carbonSaved: 0,
          token: generateToken(user._id)
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          gender: user.gender,
          organization: user.organization,
          vehicle: user.vehicle,
          bio: user.bio,
          avatar: user.avatar,
          trustScore: user.trustScore,
          rewardPoints: user.rewardPoints,
          badges: user.badges,
          completedRides: user.completedRides || 0,
          totalRides: user.totalRides || 0,
          carbonSaved: user.carbonSaved || 0,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Calculate 100% Real-Time Completed Rides from MongoDB Database
      const realCompletedRides = await RideRequest.countDocuments({
        $or: [{ driver: user._id }, { passenger: user._id }],
        status: 'completed'
      });

      const realTotalRequests = await RideRequest.countDocuments({
        $or: [{ driver: user._id }, { passenger: user._id }]
      });

      const realOfferedRides = await RidePost.countDocuments({ driver: user._id });
      const realTotalRides = Math.max(user.totalRides || 0, realCompletedRides, realTotalRequests + realOfferedRides);

      const realCarbonSaved = Number((realCompletedRides * 2.5).toFixed(1));

      user.completedRides = realCompletedRides;
      user.totalRides = realTotalRides;
      user.carbonSaved = realCarbonSaved;

      const newTrustScore = calculateTrustScore({
        averageRating: user.averageRating || 5.0,
        totalRides: user.totalRides,
        completedRides: user.completedRides,
        cancelledRides: user.cancelledRides || 0,
        reviewsCount: user.reviewsCount || 0
      });

      user.trustScore = newTrustScore;
      user.badges = evaluateBadges(user);
      await user.save();

      res.json({
        success: true,
        data: user
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.gender = req.body.gender || user.gender;
      user.organization = req.body.organization || user.organization;
      user.bio = req.body.bio || user.bio;
      user.avatar = req.body.avatar || user.avatar;

      if (req.body.vehicle) {
        user.vehicle = {
          ...user.vehicle,
          ...req.body.vehicle
        };
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          gender: updatedUser.gender,
          organization: updatedUser.organization,
          vehicle: updatedUser.vehicle,
          bio: updatedUser.bio,
          avatar: updatedUser.avatar,
          trustScore: updatedUser.trustScore,
          rewardPoints: updatedUser.rewardPoints,
          badges: updatedUser.badges,
          completedRides: updatedUser.completedRides,
          totalRides: updatedUser.totalRides,
          carbonSaved: updatedUser.carbonSaved,
          token: generateToken(updatedUser._id)
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

const uploadAvatarFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload' });
    }

    const uploadedUrl = await uploadImage(req.file.buffer, 'travelbuddy/avatars');
    const user = await User.findById(req.user._id);
    if (user) {
      user.avatar = uploadedUrl;
      await user.save();

      res.json({
        success: true,
        avatar: uploadedUrl,
        message: 'Profile photo uploaded successfully!'
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  uploadAvatarFile
};
