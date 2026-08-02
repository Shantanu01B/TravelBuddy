const Trip = require('../models/Trip');

// @desc    Create a new trip plan
// @route   POST /api/trips
// @access  Private
const createTrip = async (req, res, next) => {
  try {
    const { title, destination, budget, startDate, endDate, notes, members } = req.body;

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
      notes: notes || ''
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

    await trip.deleteOne();

    res.json({
      success: true,
      message: 'Trip plan removed'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTrip,
  getUserTrips,
  updateTrip,
  deleteTrip
};
