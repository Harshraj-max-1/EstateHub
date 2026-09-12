const express = require('express');
const {
  createEnquiry,
  getAgentEnquiries,
  getBuyerEnquiries,
  updateEnquiryStatus
} = require('../controllers/enquiryController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', createEnquiry);
router.get('/my', getBuyerEnquiries);
router.get('/agent', authorize('AGENT', 'ADMIN'), getAgentEnquiries);
router.put('/:id/status', authorize('AGENT', 'ADMIN'), updateEnquiryStatus);

module.exports = router;
