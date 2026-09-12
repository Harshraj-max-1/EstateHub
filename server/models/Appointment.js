const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    visitDate: {
      type: Date,
      required: [true, 'Please select a visit date']
    },
    timeSlot: {
      type: String,
      required: [true, 'Please select a time slot'],
      enum: [
        '09:00 AM - 10:00 AM',
        '10:00 AM - 11:00 AM',
        '11:00 AM - 12:00 PM',
        '12:00 PM - 01:00 PM',
        '02:00 PM - 03:00 PM',
        '03:00 PM - 04:00 PM',
        '04:00 PM - 05:00 PM',
        '05:00 PM - 06:00 PM',
        '06:00 PM - 07:00 PM'
      ]
    },
    message: {
      type: String,
      maxlength: [500, 'Message cannot exceed 500 characters'],
      default: ''
    },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'REJECTED', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING'
    },
    agentNotes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

appointmentSchema.index({ agent: 1, visitDate: 1, timeSlot: 1 });
appointmentSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
