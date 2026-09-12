const express = require('express');
const { createReport, getReports, updateReportStatus } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', createReport);
router.get('/', authorize('ADMIN'), getReports);
router.put('/:id', authorize('ADMIN'), updateReportStatus);

module.exports = router;
