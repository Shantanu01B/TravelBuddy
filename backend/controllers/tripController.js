const Trip = require('../models/Trip');
const { generateTripPlanWithGemini } = require('../services/geminiService');

// @desc    Check Gemini API connection status
// @route   GET /api/trips/ai-status
// @access  Public
const getAIStatus = async (req, res) => {
  const isApiKeyConfigured = Boolean(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY.trim() !== '' &&
    process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE'
  );

  res.json({
    success: true,
    geminiConnected: isApiKeyConfigured,
    model: 'gemini-3.5-flash'
  });
};

// @desc    Generate an AI-powered trip itinerary and budget plan via Gemini
// @route   POST /api/trips/ai-plan
// @access  Public / Private
const generateAIPlan = async (req, res, next) => {
  try {
    const { destination, days, budget, travelers, travelStyle, interests } = req.body;

    if (!destination || !destination.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a destination for your trip plan' });
    }

    const plan = await generateTripPlanWithGemini({
      destination: destination.trim(),
      days: Number(days) || 3,
      budget: Number(budget) || 5000,
      travelers: Number(travelers) || 2,
      travelStyle: travelStyle || 'Balanced',
      interests: interests || ''
    });

    const isApiKeyConfigured = Boolean(
      process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY.trim() !== '' &&
      process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE'
    );

    res.json({
      success: true,
      data: plan,
      geminiConnected: isApiKeyConfigured
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new trip plan
// @route   POST /api/trips
// @access  Private
const createTrip = async (req, res, next) => {
  try {
    const { title, destination, budget, startDate, endDate, notes, members, aiPlan } = req.body;

    const memberList = Array.isArray(members) ? members : [];
    if (!memberList.includes(req.user._id.toString())) {
      memberList.push(req.user._id);
    }

    const trip = await Trip.create({
      title,
      destination,
      budget: Number(budget),
      startDate,
      endDate,
      creator: req.user._id,
      members: memberList,
      notes: notes || '',
      aiPlan: aiPlan || null
    });

    const populatedTrip = await Trip.findById(trip._id)
      .populate('creator', 'name email avatar')
      .populate('members', 'name email avatar organization');

    res.status(201).json({
      success: true,
      data: populatedTrip
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's trips
// @route   GET /api/trips
// @access  Private
const getUserTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({
      $or: [{ creator: req.user._id }, { members: req.user._id }]
    })
      .populate('creator', 'name email avatar')
      .populate('members', 'name email avatar organization')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: trips
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update trip status or info
// @route   PUT /api/trips/:id
// @access  Private
const updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    if (trip.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this trip' });
    }

    trip.title = req.body.title || trip.title;
    trip.destination = req.body.destination || trip.destination;
    trip.budget = req.body.budget ? Number(req.body.budget) : trip.budget;
    trip.startDate = req.body.startDate || trip.startDate;
    trip.endDate = req.body.endDate || trip.endDate;
    trip.status = req.body.status || trip.status;
    trip.notes = req.body.notes !== undefined ? req.body.notes : trip.notes;
    if (req.body.aiPlan !== undefined) {
      trip.aiPlan = req.body.aiPlan;
    }

    const updatedTrip = await trip.save();

    res.json({
      success: true,
      data: updatedTrip
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Private
const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    if (trip.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this trip' });
    }

    await Trip.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Trip plan deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAIStatus,
  generateAIPlan,
  createTrip,
  getUserTrips,
  updateTrip,
  deleteTrip
};
