const Destination = require('../models/Destination');

// @desc    Get all curated destinations
// @route   GET /api/destinations
// @access  Public
const getDestinations = async (req, res, next) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    const destinations = await Destination.find(query).sort({ name: 1 });

    res.json({
      success: true,
      count: destinations.length,
      data: destinations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new destination (Admin / Curated)
// @route   POST /api/destinations
// @access  Private (Admin / Protected)
const createDestination = async (req, res, next) => {
  try {
    const { name, image, description, bestTime, estimatedBudget, popularAttractions, category } = req.body;

    const destination = await Destination.create({
      name,
      image,
      description,
      bestTime,
      estimatedBudget: Number(estimatedBudget) || 3000,
      popularAttractions: Array.isArray(popularAttractions) ? popularAttractions : [],
      category: category || 'Hill Station'
    });

    res.status(201).json({
      success: true,
      data: destination
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete destination
// @route   DELETE /api/destinations/:id
// @access  Private Admin
const deleteDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    await destination.deleteOne();

    res.json({
      success: true,
      message: 'Destination deleted'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDestinations,
  createDestination,
  deleteDestination
};
