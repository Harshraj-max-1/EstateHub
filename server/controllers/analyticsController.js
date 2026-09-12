const Property = require('../models/Property');
const PropertyView = require('../models/PropertyView');
const Enquiry = require('../models/Enquiry');
const Appointment = require('../models/Appointment');

// @desc    Get comprehensive agent dashboard analytics
// @route   GET /api/analytics/agent
// @access  Private (AGENT)
exports.getAgentAnalytics = async (req, res, next) => {
  try {
    const agentId = req.user.id;

    // Overview numbers
    const [
      totalProperties,
      activeListings,
      pendingListings,
      rejectedListings,
      totalEnquiries,
      totalAppointments,
      totalViewsCount
    ] = await Promise.all([
      Property.countDocuments({ agent: agentId }),
      Property.countDocuments({ agent: agentId, status: 'APPROVED' }),
      Property.countDocuments({ agent: agentId, status: 'PENDING' }),
      Property.countDocuments({ agent: agentId, status: 'REJECTED' }),
      Enquiry.countDocuments({ agent: agentId }),
      Appointment.countDocuments({ agent: agentId }),
      PropertyView.countDocuments({ agent: agentId })
    ]);

    // Daily Views over the last 7 days for Recharts
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const viewsAgg = await PropertyView.aggregate([
      {
        $match: {
          agent: req.user._id,
          viewedAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$viewedAt' } },
          views: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Build complete 7 days array (filling 0 for missing days)
    const viewsChartData = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const found = viewsAgg.find((item) => item._id === dateStr);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      viewsChartData.push({
        date: dateStr,
        day: dayName,
        views: found ? found.views : 0
      });
    }

    // Top performing properties
    const topProperties = await Property.find({ agent: agentId })
      .sort({ viewsCount: -1 })
      .limit(5)
      .select('title slug price viewsCount enquiriesCount appointmentsCount status images')
      .lean();

    res.status(200).json({
      success: true,
      stats: {
        totalProperties,
        activeListings,
        pendingListings,
        rejectedListings,
        totalEnquiries,
        totalAppointments,
        totalViews: totalViewsCount
      },
      charts: {
        viewsOverTime: viewsChartData,
        statusDistribution: [
          { name: 'Active', value: activeListings },
          { name: 'Pending', value: pendingListings },
          { name: 'Rejected', value: rejectedListings }
        ]
      },
      topProperties
    });
  } catch (error) {
    next(error);
  }
};
