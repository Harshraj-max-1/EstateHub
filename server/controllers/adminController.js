const User = require('../models/User');
const Property = require('../models/Property');
const Enquiry = require('../models/Enquiry');
const Appointment = require('../models/Appointment');
const Report = require('../models/Report');
const { createAndSendNotification } = require('../services/notificationService');

// @desc    Get complete admin dashboard analytics and statistics
// @route   GET /api/admin/stats
// @access  Private (ADMIN)
exports.getAdminDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalAgents,
      totalBuyers,
      totalProperties,
      pendingProperties,
      approvedProperties,
      rejectedProperties,
      totalEnquiries,
      totalAppointments,
      pendingReports
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'AGENT' }),
      User.countDocuments({ role: 'BUYER' }),
      Property.countDocuments(),
      Property.countDocuments({ status: 'PENDING' }),
      Property.countDocuments({ status: 'APPROVED' }),
      Property.countDocuments({ status: 'REJECTED' }),
      Enquiry.countDocuments(),
      Appointment.countDocuments(),
      Report.countDocuments({ status: 'PENDING' })
    ]);

    // Properties by category/type
    const propertyTypeCounts = await Property.aggregate([
      { $group: { _id: '$propertyType', count: { $sum: 1 } } }
    ]);

    // Listing types (BUY vs RENT)
    const listingTypeCounts = await Property.aggregate([
      { $group: { _id: '$listingType', count: { $sum: 1 } } }
    ]);

    // Top cities by property count
    const topCities = await Property.aggregate([
      { $group: { _id: '$location.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalAgents,
        totalBuyers,
        totalProperties,
        pendingProperties,
        approvedProperties,
        rejectedProperties,
        totalEnquiries,
        totalAppointments,
        pendingReports
      },
      charts: {
        propertyTypeCounts: propertyTypeCounts.map((item) => ({ name: item._id, value: item.count })),
        listingTypeCounts: listingTypeCounts.map((item) => ({ name: item._id, value: item.count })),
        topCities: topCities.map((item) => ({ city: item._id, count: item.count }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with search & filters (Admin)
// @route   GET /api/admin/users
// @access  Private (ADMIN)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { q, role, status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (q) {
      const regex = new RegExp(q.trim(), 'i');
      query.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    if (role && role !== 'ALL') {
      query.role = role;
    }

    if (status && status !== 'ALL') {
      query.status = status;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      User.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status / role (Admin)
// @route   PUT /api/admin/users/:id
// @access  Private (ADMIN)
exports.updateUser = async (req, res, next) => {
  try {
    const { role, status } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (role) user.role = role;
    if (status) user.status = status;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/admin/users/:id
// @access  Private (ADMIN)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Prevent deleting self
    if (user._id.toString() === req.user.id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own admin account.' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending property listings (Admin)
// @route   GET /api/admin/properties/pending
// @access  Private (ADMIN)
exports.getPendingProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ status: 'PENDING' })
      .populate('agent', 'name email phone avatar agencyName')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or Reject Property Listing (Admin)
// @route   PUT /api/admin/properties/:id/review
// @access  Private (ADMIN)
exports.reviewPropertyListing = async (req, res, next) => {
  try {
    const { action, rejectionReason } = req.body; // action: 'APPROVE' or 'REJECT'

    if (!action || !['APPROVE', 'REJECT'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Action must be either APPROVE or REJECT.' });
    }

    const property = await Property.findById(req.params.id).populate('agent', 'name email');
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    if (action === 'APPROVE') {
      property.status = 'APPROVED';
      property.rejectionReason = '';
    } else {
      property.status = 'REJECTED';
      property.rejectionReason = rejectionReason || 'Listing does not meet platform quality or verification standards.';
    }

    await property.save();

    // Send real-time notification to Agent
    await createAndSendNotification({
      recipient: property.agent._id,
      sender: req.user.id,
      type: action === 'APPROVE' ? 'PROPERTY_APPROVED' : 'PROPERTY_REJECTED',
      title: action === 'APPROVE' ? 'Property Listing Approved!' : 'Property Listing Needs Changes',
      message:
        action === 'APPROVE'
          ? `Your listing "${property.title}" has been approved and is now live on EstateHub.`
          : `Your listing "${property.title}" was not approved. Reason: ${property.rejectionReason}`,
      link: `/agent/properties`
    });

    res.status(200).json({
      success: true,
      message: `Property ${action === 'APPROVE' ? 'approved and published' : 'rejected'}.`,
      property
    });
  } catch (error) {
    next(error);
  }
};
