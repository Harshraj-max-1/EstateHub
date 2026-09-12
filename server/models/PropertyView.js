const mongoose = require('mongoose');

const propertyViewSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    ip: {
      type: String,
      default: ''
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

propertyViewSchema.index({ property: 1, viewedAt: -1 });
propertyViewSchema.index({ agent: 1, viewedAt: -1 });

module.exports = mongoose.model('PropertyView', propertyViewSchema);
