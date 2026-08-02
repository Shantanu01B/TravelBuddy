const RideRequest = require('../models/RideRequest');
const RidePost = require('../models/RidePost');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { calculateTrustScore, evaluateBadges } = require('../utils/trustScore');

const createRideRequest = async (req, res, next) => {
  try {
    const { rideId, pickupStop, dropStop, seatsRequested } = req.body;

    const ride = await RidePost.findById(rideId).populate('driver');
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride post not found' });
    }

    if (ride.driver._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot request your own offered ride' });
    }

    if (ride.availableSeats < seatsRequested) {
      return res.status(400).json({ success: false, message: 'Not enough available seats for this request' });
    }

    const existingReq = await RideRequest.findOne({
      ride: rideId,
      passenger: req.user._id,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingReq) {
      return res.status(400).json({ success: false, message: 'You already have an active request for this ride' });
    }

    // Pro-Rated Intermediate Stop Price Calculation
    const routeStops = ride.routeStops || [];
    const pickupIndex = routeStops.findIndex(s => s.stopName.toLowerCase() === pickupStop.toLowerCase());
    const dropIndex = routeStops.findIndex(s => s.stopName.toLowerCase() === dropStop.toLowerCase());

    if (pickupIndex === -1 || dropIndex === -1 || pickupIndex >= dropIndex) {
      return res.status(400).json({ success: false, message: 'Invalid pickup or drop stop selection' });
    }

    const totalLegs = Math.max(1, routeStops.length - 1);
    const passengerLegs = dropIndex - pickupIndex;
    const pricePerLeg = ride.pricePerSeat / totalLegs;
    const calculatedPricePerSeat = Math.max(10, Math.round(pricePerLeg * passengerLegs));
    const totalPrice = calculatedPricePerSeat * Number(seatsRequested);

    const rideRequest = await RideRequest.create({
      ride: rideId,
      passenger: req.user._id,
      driver: ride.driver._id,
      pickupStop,
      dropStop,
      seatsRequested: Number(seatsRequested),
      totalPrice
    });

    await Notification.create({
      user: ride.driver._id,
      type: 'request',
      message: `${req.user.name} requested ${seatsRequested} seat(s) from ${pickupStop} to ${dropStop} (₹${totalPrice} total)`
    });

    res.status(201).json({
      success: true,
      data: rideRequest
    });
  } catch (error) {
    next(error);
  }
};

const updateRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const request = await RideRequest.findById(req.params.id).populate('ride');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Ride request not found' });
    }

    if (request.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the driver can update request status' });
    }

    if (status === 'accepted' && request.status !== 'accepted') {
      const ride = await RidePost.findById(request.ride._id);
      if (ride.availableSeats < request.seatsRequested) {
        return res.status(400).json({ success: false, message: 'Not enough seats remaining to accept' });
      }

      ride.availableSeats -= request.seatsRequested;
      if (ride.availableSeats === 0) {
        ride.status = 'filled';
      }
      await ride.save();

      await Notification.create({
        user: request.passenger,
        type: 'accepted',
        message: `Your ride request for ${request.pickupStop} → ${request.dropStop} has been ACCEPTED by the driver!`
      });
    }

    request.status = status;
    await request.save();

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    next(error);
  }
};

const completeRideRequest = async (req, res, next) => {
  try {
    const request = await RideRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Ride request not found' });
    }

    const isDriver = request.driver.toString() === req.user._id.toString();
    const isPassenger = request.passenger.toString() === req.user._id.toString();

    if (!isDriver && !isPassenger) {
      return res.status(403).json({ success: false, message: 'Not authorized to complete this ride' });
    }

    request.status = 'completed';
    await request.save();

    // Mark the RidePost as 'completed' so it NO LONGER APPEARS in Find Rides or search listings!
    const ridePost = await RidePost.findById(request.ride);
    if (ridePost) {
      ridePost.status = 'completed';
      await ridePost.save();
    }

    const CARBON_SAVED_PER_RIDE = 2.5;
    const REWARD_POINTS_AWARDED = 25;

    // Update Driver Metrics
    const driver = await User.findById(request.driver);
    if (driver) {
      driver.completedRides += 1;
      driver.totalRides += 1;
      driver.carbonSaved += CARBON_SAVED_PER_RIDE;
      driver.rewardPoints += REWARD_POINTS_AWARDED;
      driver.trustScore = calculateTrustScore({
        averageRating: driver.averageRating,
        totalRides: driver.totalRides,
        completedRides: driver.completedRides,
        cancelledRides: driver.cancelledRides,
        reviewsCount: driver.reviewsCount
      });
      driver.badges = evaluateBadges(driver);
      await driver.save();
    }

    // Update Passenger Metrics
    const passenger = await User.findById(request.passenger);
    if (passenger) {
      passenger.completedRides += 1;
      passenger.totalRides += 1;
      passenger.carbonSaved += CARBON_SAVED_PER_RIDE;
      passenger.rewardPoints += REWARD_POINTS_AWARDED;
      passenger.trustScore = calculateTrustScore({
        averageRating: passenger.averageRating,
        totalRides: passenger.totalRides,
        completedRides: passenger.completedRides,
        cancelledRides: passenger.cancelledRides,
        reviewsCount: passenger.reviewsCount
      });
      passenger.badges = evaluateBadges(passenger);
      await passenger.save();
    }

    res.json({
      success: true,
      message: 'Ride marked as completed! Removed from available search listings.',
      data: request
    });
  } catch (error) {
    next(error);
  }
};

const getMyBookedRequests = async (req, res, next) => {
  try {
    const requests = await RideRequest.find({ passenger: req.user._id })
      .populate({
        path: 'ride',
        populate: { path: 'driver', select: 'name email avatar organization trustScore averageRating' }
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

const getMyDriverRequests = async (req, res, next) => {
  try {
    const requests = await RideRequest.find({ driver: req.user._id })
      .populate('passenger', 'name email avatar organization trustScore gender')
      .populate('ride', 'source destination date time vehicleName')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRideRequest,
  updateRequestStatus,
  completeRideRequest,
  getMyBookedRequests,
  getMyDriverRequests
};
