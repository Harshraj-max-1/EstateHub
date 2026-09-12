const Property = require('../models/Property');
const Favorite = require('../models/Favorite');
const PropertyView = require('../models/PropertyView');

/**
 * Rule-based recommendation engine
 * Computes recommendation score based on:
 * - City match (40 pts)
 * - Property type match (30 pts)
 * - Bedrooms match (15 pts)
 * - Price similarity within +/- 30% (15 pts)
 */
const getSimilarProperties = async (propertyId, limit = 4) => {
  try {
    const targetProperty = await Property.findById(propertyId);
    if (!targetProperty) return [];

    const minPrice = targetProperty.price * 0.7;
    const maxPrice = targetProperty.price * 1.3;

    // Find candidates in the same city or matching property type
    const candidates = await Property.find({
      _id: { $ne: targetProperty._id },
      status: 'APPROVED',
      $or: [
        { 'location.city': new RegExp(`^${targetProperty.location.city}$`, 'i') },
        { propertyType: targetProperty.propertyType }
      ]
    })
      .populate('agent', 'name avatar phone agencyName')
      .limit(20)
      .lean();

    // Score each candidate
    const scoredCandidates = candidates.map((item) => {
      let score = 0;

      // City match
      if (item.location?.city?.toLowerCase() === targetProperty.location?.city?.toLowerCase()) {
        score += 40;
      }

      // Property type match
      if (item.propertyType === targetProperty.propertyType) {
        score += 30;
      }

      // Listing type match (BUY vs RENT)
      if (item.listingType === targetProperty.listingType) {
        score += 15;
      }

      // Bedrooms match
      if (item.bedrooms && targetProperty.bedrooms && item.bedrooms === targetProperty.bedrooms) {
        score += 15;
      }

      // Price proximity
      if (item.price >= minPrice && item.price <= maxPrice) {
        score += 15;
      }

      return { ...item, recommendationScore: score };
    });

    // Sort descending by score
    scoredCandidates.sort((a, b) => b.recommendationScore - a.recommendationScore);

    return scoredCandidates.slice(0, limit);
  } catch (error) {
    console.error('[Recommendation Error]:', error.message);
    return [];
  }
};

/**
 * Personalized user recommendations based on favorite & viewing history
 */
const getUserRecommendations = async (userId, limit = 6) => {
  try {
    if (!userId) {
      // Return top featured properties
      return await Property.find({ status: 'APPROVED', isFeatured: true })
        .populate('agent', 'name avatar phone agencyName')
        .limit(limit)
        .lean();
    }

    // Get user's favorites & recent views
    const [favorites, views] = await Promise.all([
      Favorite.find({ user: userId }).populate('property'),
      PropertyView.find({ user: userId }).sort({ viewedAt: -1 }).limit(10).populate('property')
    ]);

    const userInteractions = [
      ...favorites.map((f) => f.property).filter(Boolean),
      ...views.map((v) => v.property).filter(Boolean)
    ];

    if (userInteractions.length === 0) {
      return await Property.find({ status: 'APPROVED' })
        .sort({ viewsCount: -1, createdAt: -1 })
        .populate('agent', 'name avatar phone agencyName')
        .limit(limit)
        .lean();
    }

    // Extract preferred cities and types
    const cityCounts = {};
    const typeCounts = {};
    let totalPrice = 0;

    userInteractions.forEach((prop) => {
      if (prop.location?.city) {
        cityCounts[prop.location.city] = (cityCounts[prop.location.city] || 0) + 1;
      }
      if (prop.propertyType) {
        typeCounts[prop.propertyType] = (typeCounts[prop.propertyType] || 0) + 1;
      }
      if (prop.price) {
        totalPrice += prop.price;
      }
    });

    const preferredCity = Object.keys(cityCounts).sort((a, b) => cityCounts[b] - cityCounts[a])[0];
    const preferredType = Object.keys(typeCounts).sort((a, b) => typeCounts[b] - typeCounts[a])[0];
    const avgPrice = totalPrice / userInteractions.length;

    const interactedIds = userInteractions.map((p) => p._id.toString());

    // Query recommended properties matching preferences
    const recommendations = await Property.find({
      _id: { $nin: interactedIds },
      status: 'APPROVED',
      $or: [
        { 'location.city': preferredCity },
        { propertyType: preferredType },
        { price: { $gte: avgPrice * 0.6, $lte: avgPrice * 1.4 } }
      ]
    })
      .sort({ viewsCount: -1 })
      .populate('agent', 'name avatar phone agencyName')
      .limit(limit)
      .lean();

    return recommendations.length > 0
      ? recommendations
      : await Property.find({ status: 'APPROVED' })
          .sort({ isFeatured: -1, viewsCount: -1 })
          .populate('agent', 'name avatar phone agencyName')
          .limit(limit)
          .lean();
  } catch (error) {
    console.error('[User Recommendation Error]:', error.message);
    return [];
  }
};

module.exports = { getSimilarProperties, getUserRecommendations };
