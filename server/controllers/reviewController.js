const Review = require('../models/Review');
const User = require('../models/User');

// @desc    Submit review for an agent
// @route   POST /api/reviews
// @access  Private (BUYER)
exports.submitReview = async (req, res, next) => {
  try {
    const { agentId, propertyId, rating, comment } = req.body;

    if (!agentId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide agentId, rating (1-5), and a comment.' });
    }

    if (agentId.toString() === req.user.id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot review yourself.' });
    }

    const agent = await User.findById(agentId);
    if (!agent || agent.role !== 'AGENT') {
      return res.status(404).json({ success: false, message: 'Agent not found.' });
    }

    // Check for existing review
    const existingReview = await Review.findOne({ agent: agentId, user: req.user.id });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already submitted a review for this agent.' });
    }

    const review = await Review.create({
      agent: agentId,
      user: req.user.id,
      property: propertyId || null,
      rating: Number(rating),
      comment
    });

    await review.populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for an agent
// @route   GET /api/reviews/agent/:agentId
// @access  Public
exports.getAgentReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ agent: req.params.agentId })
      .populate('user', 'name avatar')
      .populate('property', 'title slug')
      .sort({ createdAt: -1 })
      .lean();

    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) : '5.0';

    res.status(200).json({
      success: true,
      avgRating: parseFloat(avgRating),
      totalReviews,
      reviews
    });
  } catch (error) {
    next(error);
  }
};
