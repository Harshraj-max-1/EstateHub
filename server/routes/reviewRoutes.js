const express = require('express');
const { submitReview, getAgentReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/agent/:agentId', getAgentReviews);
router.post('/', protect, submitReview);

module.exports = router;
