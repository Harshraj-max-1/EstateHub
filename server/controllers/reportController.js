const Report = require('../models/Report');
const Property = require('../models/Property');

// @desc    Submit property report
// @route   POST /api/reports
// @access  Private
exports.createReport = async (req, res, next) => {
  try {
    const { propertyId, reason, description } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    const report = await Report.create({
      property: propertyId,
      reporter: req.user.id,
      reason,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted. Our moderation team will investigate this listing.',
      report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reports (Admin)
// @route   GET /api/reports
// @access  Private (ADMIN)
exports.getReports = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status && status !== 'ALL') {
      query.status = status;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [reports, total] = await Promise.all([
      Report.find(query)
        .populate('property', 'title slug price location images status agent')
        .populate('reporter', 'name email phone avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Report.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: reports.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      reports
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update report status (Admin)
// @route   PUT /api/reports/:id
// @access  Private (ADMIN)
exports.updateReportStatus = async (req, res, next) => {
  try {
    const { status, adminNotes, removeProperty } = req.body;

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    if (status) report.status = status;
    if (adminNotes !== undefined) report.adminNotes = adminNotes;
    await report.save();

    // If requested, take down the property
    if (removeProperty) {
      await Property.findByIdAndUpdate(report.property, { status: 'REJECTED', rejectionReason: `Removed due to moderation report: ${report.reason}` });
    }

    res.status(200).json({
      success: true,
      message: 'Report status updated.',
      report
    });
  } catch (error) {
    next(error);
  }
};
