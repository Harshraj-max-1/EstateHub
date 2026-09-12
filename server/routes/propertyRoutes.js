const express = require('express');
const {
  getProperties,
  getPropertyById,
  getFeaturedProperties,
  getRecentProperties,
  getSimilarProperties,
  getRecommendations,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  uploadPropertyImages
} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Public routes
router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/recent', getRecentProperties);
router.get('/recommendations', getRecommendations);
router.get('/agent/my-properties', protect, authorize('AGENT', 'ADMIN'), getMyProperties);
router.get('/:id', getPropertyById);
router.get('/:id/similar', getSimilarProperties);

// Protected routes (Agent & Admin)
router.post('/', protect, authorize('AGENT', 'ADMIN'), createProperty);
router.put('/:id', protect, authorize('AGENT', 'ADMIN'), updateProperty);
router.delete('/:id', protect, authorize('AGENT', 'ADMIN'), deleteProperty);
router.post(
  '/upload-images',
  protect,
  authorize('AGENT', 'ADMIN'),
  upload.array('images', 10),
  uploadPropertyImages
);

module.exports = router;
