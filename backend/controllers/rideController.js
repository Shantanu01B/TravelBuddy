const RidePost = require('../models/RidePost');
const User = require('../models/User');

// @desc    Create / Offer a new ride
// @route   POST /api/rides
// @access  Private
const createRide = async (req, res, next) => {
  try {
    const { vehicleType, vehicleName, source, destination, routeStops, date, time, totalSeats, pricePerSeat, community, rideType, description } = req.body;

    if (!routeStops || routeStops.length < 2) {
      return res.status(400).json({ success: false, message: 'Please provide at least 2 route stops' });
    }

    // Format route stops with stopOrder
    const formattedStops = routeStops.map((stop, index) => ({
      stopName: typeof stop === 'string' ? stop : stop.stopName,
      pickupPoint: typeof stop === 'object' && stop.pickupPoint ? stop.pickupPoint : '',
      stopOrder: index
    }));

    const ride = await RidePost.create({
      driver: req.user._id,
      vehicleType,
      vehicleName: vehicleName || req.user.vehicle?.makeModel || `${vehicleType} Ride`,
      source,
      destination,
      routeStops: formattedStops,
      date,
      time,
      totalSeats: Number(totalSeats),
      availableSeats: Number(totalSeats),
      pricePerSeat: Number(pricePerSeat),
      community: community || req.user.organization || 'General Commuter',
      rideType: rideType || 'One Time',
      description: description || ''
    });

    // Update driver total rides count and reward points (+15 points for offering ride)
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalRides: 1, rewardPoints: 15 }
    });

    res.status(201).json({
      success: true,
      data: ride
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search and filter rides based on route stops, date, community, vehicle type
// @route   GET /api/rides/search
// @access  Public
const searchRides = async (req, res, next) => {
  try {
    const { pickup, drop, date, community, vehicleType, sort } = req.query;

    let query = { status: 'active', availableSeats: { $gt: 0 } };

    if (date) {
      query.date = date;
    }

    if (community && community !== 'All') {
      query.community = community;
    }

    if (vehicleType && vehicleType !== 'All') {
      query.vehicleType = vehicleType;
    }

    // Populate driver info
    let rides = await RidePost.find(query).populate('driver', 'name email avatar organization averageRating trustScore badges vehicle');

    // Index-based Route Stop Matching
    if (pickup || drop) {
      rides = rides.filter(ride => {
        const stops = ride.routeStops.map(s => s.stopName.toLowerCase());
        
        let pickupIndex = 0;
        let dropIndex = stops.length - 1;

        if (pickup) {
          pickupIndex = stops.findIndex(s => s.includes(pickup.toLowerCase()));
        }

        if (drop) {
          dropIndex = stops.findIndex(s => s.includes(drop.toLowerCase()));
        }

        // Must find both (if specified) and pickupIndex < dropIndex
        if (pickup && pickupIndex === -1) return false;
        if (drop && dropIndex === -1) return false;
        return pickupIndex < dropIndex;
      });
    }

    // Sorting logic
    if (sort === 'price_low') {
      rides.sort((a, b) => a.pricePerSeat - b.pricePerSeat);
    } else if (sort === 'price_high') {
      rides.sort((a, b) => b.pricePerSeat - a.pricePerSeat);
    } else if (sort === 'rating') {
      rides.sort((a, b) => (b.driver?.trustScore || 0) - (a.driver?.trustScore || 0));
    }

    res.json({
      success: true,
      count: rides.length,
      data: rides
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single ride details
// @route   GET /api/rides/:id
// @access  Public
const getRideById = async (req, res, next) => {
  try {
    const ride = await RidePost.findById(req.params.id).populate('driver', 'name email avatar organization bio averageRating trustScore badges vehicle completedRides carbonSaved');

    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }

    res.json({
      success: true,
      data: ride
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get rides offered by logged in user
// @route   GET /api/rides/my-offered
// @access  Private
const getMyOfferedRides = async (req, res, next) => {
  try {
    const rides = await RidePost.find({ driver: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: rides
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete / Cancel ride
// @route   DELETE /api/rides/:id
// @access  Private
const deleteRide = async (req, res, next) => {
  try {
    const ride = await RidePost.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }

    if (ride.driver.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this ride' });
    }

    ride.status = 'cancelled';
    await ride.save();

    // Increment driver cancelled count
    await User.findByIdAndUpdate(req.user._id, { $inc: { cancelledRides: 1 } });

    res.json({
      success: true,
      message: 'Ride cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRide,
  searchRides,
  getRideById,
  getMyOfferedRides,
  deleteRide
};
