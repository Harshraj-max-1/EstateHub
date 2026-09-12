const express = require('express');
const { getAgentAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router.get('/agent', authorize('AGENT', 'ADMIN'), getAgentAnalytics);

module.exports = router;
