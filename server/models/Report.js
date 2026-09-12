const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reason: {
      type: String,
      required: [true, 'Please select a reason for reporting'],
      enum: ['Fake listing', 'Incorrect information', 'Fraud', 'Duplicate listing', 'Inappropriate content', 'Other']
    },
    description: {
      type: String,
      required: [true, 'Please provide details for your report'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    status: {
      type: String,
      enum: ['PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'],
      default: 'PENDING'
    },
    adminNotes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ property: 1 });

module.exports = mongoose.model('Report', reportSchema);
