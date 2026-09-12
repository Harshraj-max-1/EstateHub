const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
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
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Please provide your phone number'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
      maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'IN_PROGRESS', 'CLOSED'],
      default: 'NEW'
    },
    agentResponse: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

enquirySchema.index({ agent: 1, createdAt: -1 });
enquirySchema.index({ user: 1, createdAt: -1 });
enquirySchema.index({ property: 1 });

module.exports = mongoose.model('Enquiry', enquirySchema);
