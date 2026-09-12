const express = require('express');
const {
  getAdminDashboardStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getPendingProperties,
  reviewPropertyListing
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// All Admin routes require authentication and ADMIN role
router.use(protect, authorize('ADMIN'));

router.get('/stats', getAdminDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/properties/pending', getPendingProperties);
router.put('/properties/:id/review', reviewPropertyListing);

module.exports = router;
