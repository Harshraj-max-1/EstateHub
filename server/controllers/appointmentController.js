const Appointment = require('../models/Appointment');
const Property = require('../models/Property');
const { createAndSendNotification } = require('../services/notificationService');
const { sendEmail } = require('../services/emailService');

// @desc    Schedule a property visit
// @route   POST /api/appointments
// @access  Private
exports.bookAppointment = async (req, res, next) => {
  try {
    const { propertyId, visitDate, timeSlot, message } = req.body;

    const property = await Property.findById(propertyId).populate('agent', 'name email');
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    // Check if appointment is in the past
    const selectedDate = new Date(visitDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({ success: false, message: 'Visit date cannot be in the past.' });
    }

    // Check for conflicting appointment with the same agent on the same day and slot
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingConflict = await Appointment.findOne({
      agent: property.agent._id,
      visitDate: { $gte: startOfDay, $lte: endOfDay },
      timeSlot: timeSlot,
      status: { $in: ['CONFIRMED', 'PENDING'] }
    });

    if (existingConflict) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked. Please choose another time or date.'
      });
    }

    const appointment = await Appointment.create({
      property: propertyId,
      user: req.user.id,
      agent: property.agent._id,
      visitDate: selectedDate,
      timeSlot,
      message: message || ''
    });

    // Increment property appointment counter
    property.appointmentsCount += 1;
    await property.save({ validateBeforeSave: false });

    // Send notification to agent
    await createAndSendNotification({
      recipient: property.agent._id,
      sender: req.user.id,
      type: 'APPOINTMENT_REQUESTED',
      title: 'New Property Visit Requested',
      message: `${req.user.name} requested a visit for "${property.title}" on ${selectedDate.toLocaleDateString('en-IN')}, slot: ${timeSlot}.`,
      link: `/agent/appointments`
    });

    // Send email alert to agent
    sendEmail({
      email: property.agent.email,
      subject: `Property Visit Request: "${property.title}"`,
      message: `Hello ${property.agent.name},\n\n${req.user.name} has requested a property visit for "${property.title}".\nDate: ${selectedDate.toLocaleDateString('en-IN')}\nSlot: ${timeSlot}\n\nPlease review the request in your EstateHub Agent Dashboard.`
    }).catch((e) => console.error(e));

    res.status(201).json({
      success: true,
      message: 'Property visit scheduled successfully! Waiting for agent confirmation.',
      appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get agent's scheduled appointments
// @route   GET /api/appointments/agent
// @access  Private (AGENT)
exports.getAgentAppointments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { agent: req.user.id };

    if (status && status !== 'ALL') {
      query.status = status;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .populate('property', 'title slug price location images')
        .populate('user', 'name email phone avatar')
        .sort({ visitDate: 1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Appointment.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: appointments.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      appointments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get buyer's scheduled visits
// @route   GET /api/appointments/my
// @access  Private (BUYER)
exports.getBuyerAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id })
      .populate('property', 'title slug price location images')
      .populate('agent', 'name email phone avatar agencyName')
      .sort({ visitDate: 1, createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status (Agent or Buyer cancel)
// @route   PUT /api/appointments/:id/status
// @access  Private
exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status, agentNotes } = req.body;

    const appointment = await Appointment.findById(req.params.id)
      .populate('property', 'title')
      .populate('user', 'name email')
      .populate('agent', 'name');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    const isAgent = appointment.agent._id.toString() === req.user.id;
    const isBuyer = appointment.user._id.toString() === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isAgent && !isBuyer && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this appointment.' });
    }

    // Buyer can only cancel
    if (isBuyer && !isAgent && !isAdmin) {
      if (status !== 'CANCELLED') {
        return res.status(400).json({ success: false, message: 'Buyers can only cancel scheduled appointments.' });
      }
    }

    if (status) appointment.status = status;
    if (agentNotes !== undefined) appointment.agentNotes = agentNotes;

    await appointment.save();

    // Determine recipient of notification
    const notificationRecipient = isAgent ? appointment.user._id : appointment.agent._id;
    const actionSenderName = req.user.name;

    await createAndSendNotification({
      recipient: notificationRecipient,
      sender: req.user.id,
      type: 'APPOINTMENT_STATUS',
      title: `Visit Request ${status}`,
      message: `${actionSenderName} updated the visit request for "${appointment.property.title}" to ${status}.`,
      link: isAgent ? `/my-appointments` : `/agent/appointments`
    });

    res.status(200).json({
      success: true,
      message: `Appointment ${status.toLowerCase()} successfully.`,
      appointment
    });
  } catch (error) {
    next(error);
  }
};
