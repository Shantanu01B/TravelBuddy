const RidePost = require('../models/RidePost');
const User = require('../models/User');

// Helper to get today's local date in YYYY-MM-DD
const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Parse time strings ("08:30 AM", "6:00 PM", "14:30") into minutes from midnight
const parseTimeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return null;
  const clean = timeStr.trim().toUpperCase();
  const match = clean.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3];

  if (meridiem) {
    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
  }
  return hours * 60 + minutes;
};

// Returns true if the ride's scheduled date is in the past, or if today and departure time has passed
const isRideExpired = (rideDate, rideTime) => {
  if (!rideDate) return false;
  const todayStr = getTodayDateString();

  // If the ride's scheduled date is before today, it is strictly expired
  if (rideDate < todayStr) {
    return true;
  }

  // If the ride's scheduled date is in the future, it is active
  if (rideDate > todayStr) {
    return false;
  }

  // If the ride is scheduled for today, check if departure time has passed
  if (rideTime && typeof rideTime === 'string') {
    const timeMinutes = parseTimeToMinutes(rideTime);
    if (timeMinutes !== null) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      if (timeMinutes <= currentMinutes) {
        return true;
      }
    }
  }

  return false;
};

// @desc    Create / Offer a new ride
// @route   POST /api/rides
// @access  Private
const createRide = async (req, res, next) => {
  try {
    const { vehicleType, vehicleName, source, destination, routeStops, date, time, totalSeats, pricePerSeat, community, rideType, description } = req.body;

    if (!routeStops || routeStops.length < 2) {
      return res.status(400).json({ success: false, message: 'Please provide at least 2 route stops' });
    }

    const todayStr = getTodayDateString();
    if (date < todayStr) {
      return res.status(400).json({ success: false, message: 'Ride date cannot be in the past' });
    }

    if (date === todayStr && time) {
      const timeMinutes = parseTimeToMinutes(time);
      if (timeMinutes !== null) {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        if (timeMinutes <= currentMinutes) {
          return res.status(400).json({ success: false, message: 'Ride departure time has already passed for today' });
        }
      }
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
    const todayStr = getTodayDateString();

    // Automatically mark past rides as completed in the database
    RidePost.updateMany(
      { status: 'active', date: { $lt: todayStr } },
      { $set: { status: 'completed' } }
    ).catch(err => console.warn('[Auto-Expire]', err.message));

    // If searching for a specific date that has already passed, return 0 rides immediately
    if (date && date < todayStr) {
      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }

    let query = {
      status: 'active',
      availableSeats: { $gt: 0 },
      date: date ? date : { $gte: todayStr }
    };

    if (community && community !== 'All') {
      query.community = community;
    }

    if (vehicleType && vehicleType !== 'All') {
      query.vehicleType = vehicleType;
    }

    // Populate driver info
    let rides = await RidePost.find(query).populate('driver', 'name email avatar organization averageRating trustScore badges vehicle');

    // Filter out any ride that is expired (past date or past departure time today)
    rides = rides.filter(ride => !isRideExpired(ride.date, ride.time));

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

    if (isRideExpired(ride.date, ride.time) || ride.status === 'completed' || ride.status === 'cancelled') {
      return res.status(410).json({
        success: false,
        message: 'This ride has expired or is no longer available.',
        isExpired: true
      });
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
