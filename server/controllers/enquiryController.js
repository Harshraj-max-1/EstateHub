const Enquiry = require('../models/Enquiry');
const Property = require('../models/Property');
const { createAndSendNotification } = require('../services/notificationService');
const { sendEmail } = require('../services/emailService');

// @desc    Submit property enquiry
// @route   POST /api/enquiries
// @access  Private
exports.createEnquiry = async (req, res, next) => {
  try {
    const { propertyId, name, email, phone, message } = req.body;

    const property = await Property.findById(propertyId).populate('agent', 'name email');
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    const enquiry = await Enquiry.create({
      property: propertyId,
      user: req.user.id,
      agent: property.agent._id,
      name,
      email,
      phone,
      message
    });

    // Increment enquiries counter
    property.enquiriesCount += 1;
    await property.save({ validateBeforeSave: false });

    // Send notification to Agent
    await createAndSendNotification({
      recipient: property.agent._id,
      sender: req.user.id,
      type: 'ENQUIRY_RECEIVED',
      title: 'New Property Enquiry Received',
      message: `${name} enquired about "${property.title}".`,
      link: `/agent/enquiries`
    });

    // Send email alert to Agent
    sendEmail({
      email: property.agent.email,
      subject: `New Enquiry on EstateHub for "${property.title}"`,
      message: `Hello ${property.agent.name},\n\nYou have received a new enquiry from ${name} (${phone}, ${email}).\n\nMessage: "${message}"\n\nPlease log in to EstateHub to respond.`
    }).catch((e) => console.error(e));

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully! The agent has been notified.',
      enquiry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get enquiries received by Agent
// @route   GET /api/enquiries/agent
// @access  Private (AGENT)
exports.getAgentEnquiries = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { agent: req.user.id };

    if (status && status !== 'ALL') {
      query.status = status;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [enquiries, total] = await Promise.all([
      Enquiry.find(query)
        .populate('property', 'title slug price location images')
        .populate('user', 'name email avatar phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Enquiry.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: enquiries.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      enquiries
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get buyer's submitted enquiries
// @route   GET /api/enquiries/my
// @access  Private (BUYER)
exports.getBuyerEnquiries = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find({ user: req.user.id })
      .populate('property', 'title slug price location images')
      .populate('agent', 'name email phone avatar agencyName')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: enquiries.length,
      enquiries
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update enquiry status and response (Agent)
// @route   PUT /api/enquiries/:id/status
// @access  Private (AGENT)
exports.updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status, agentResponse } = req.body;

    const enquiry = await Enquiry.findById(req.params.id)
      .populate('property', 'title')
      .populate('user', 'name email');

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    if (enquiry.agent.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this enquiry.' });
    }

    if (status) enquiry.status = status;
    if (agentResponse !== undefined) enquiry.agentResponse = agentResponse;

    await enquiry.save();

    // Notify Buyer
    await createAndSendNotification({
      recipient: enquiry.user._id,
      sender: req.user.id,
      type: 'ENQUIRY_UPDATED',
      title: 'Update on Your Property Enquiry',
      message: `The agent updated your enquiry status for "${enquiry.property.title}" to ${enquiry.status}.`,
      link: `/my-enquiries`
    });

    res.status(200).json({
      success: true,
      message: 'Enquiry updated successfully.',
      enquiry
    });
  } catch (error) {
    next(error);
  }
};
