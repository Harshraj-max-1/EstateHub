const Favorite = require('../models/Favorite');
const Property = require('../models/Property');

// @desc    Toggle favorite (Add or Remove)
// @route   POST /api/favorites/:propertyId
// @access  Private
exports.toggleFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user.id;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    const existingFav = await Favorite.findOne({ user: userId, property: propertyId });

    if (existingFav) {
      await Favorite.findByIdAndDelete(existingFav._id);
      property.favoritesCount = Math.max(0, property.favoritesCount - 1);
      await property.save({ validateBeforeSave: false });

      return res.status(200).json({
        success: true,
        isFavorite: false,
        message: 'Removed from favorites.'
      });
    } else {
      await Favorite.create({ user: userId, property: propertyId });
      property.favoritesCount += 1;
      await property.save({ validateBeforeSave: false });

      return res.status(201).json({
        success: true,
        isFavorite: true,
        message: 'Added to favorites!'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all favorites of logged-in user
// @route   GET /api/favorites
// @access  Private
exports.getMyFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id })
      .populate({
        path: 'property',
        populate: { path: 'agent', select: 'name avatar phone agencyName' }
      })
      .sort({ createdAt: -1 });

    const validProperties = favorites.map((f) => f.property).filter(Boolean);

    res.status(200).json({
      success: true,
      count: validProperties.length,
      properties: validProperties
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if property is favorited by logged-in user
// @route   GET /api/favorites/check/:propertyId
// @access  Private
exports.checkIsFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findOne({ user: req.user.id, property: req.params.propertyId });
    res.status(200).json({
      success: true,
      isFavorite: !!favorite
    });
  } catch (error) {
    next(error);
  }
};
