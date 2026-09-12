const mongoose = require('mongoose');
const slugify = require('slugify');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a property title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    slug: {
      type: String,
      unique: true
    },
    description: {
      type: String,
      required: [true, 'Please add a detailed description'],
      maxlength: [5000, 'Description cannot exceed 5000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [1, 'Price must be greater than 0']
    },
    propertyType: {
      type: String,
      required: [true, 'Please specify property type'],
      enum: ['Apartment', 'Villa', 'Independent House', 'Commercial', 'Penthouse', 'Studio', 'Plot']
    },
    listingType: {
      type: String,
      required: [true, 'Please specify listing type (BUY or RENT)'],
      enum: ['BUY', 'RENT']
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING'
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    bedrooms: {
      type: Number,
      required: function () {
        return this.propertyType !== 'Plot' && this.propertyType !== 'Commercial';
      },
      min: 0,
      default: 1
    },
    bathrooms: {
      type: Number,
      required: function () {
        return this.propertyType !== 'Plot';
      },
      min: 0,
      default: 1
    },
    area: {
      type: Number,
      required: [true, 'Please specify total area in sqft'],
      min: [1, 'Area must be at least 1 sqft']
    },
    floors: {
      type: Number,
      default: 1
    },
    parking: {
      type: Number,
      default: 1
    },
    furnishing: {
      type: String,
      enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
      default: 'Semi-Furnished'
    },
    constructionYear: {
      type: Number,
      default: new Date().getFullYear()
    },
    location: {
      country: { type: String, default: 'India' },
      state: { type: String, required: true },
      city: { type: String, required: true },
      locality: { type: String, required: true },
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true, default: 28.5355 },
        lng: { type: Number, required: true, default: 77.3910 }
      }
    },
    amenities: {
      type: [String],
      default: []
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: '' },
        isPrimary: { type: Boolean, default: false }
      }
    ],
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    viewsCount: {
      type: Number,
      default: 0
    },
    favoritesCount: {
      type: Number,
      default: 0
    },
    enquiriesCount: {
      type: Number,
      default: 0
    },
    appointmentsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Create slug before saving
propertySchema.pre('save', function () {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Math.floor(1000 + Math.random() * 9000);
  }
});

// Indexes for fast multi-filter search and geospatial map queries
propertySchema.index({ status: 1, listingType: 1, propertyType: 1, price: 1 });
propertySchema.index({ 'location.city': 1, status: 1 });
propertySchema.index({ agent: 1, status: 1 });
propertySchema.index({ isFeatured: 1, status: 1 });
propertySchema.index({
  title: 'text',
  description: 'text',
  'location.city': 'text',
  'location.locality': 'text'
});

module.exports = mongoose.model('Property', propertySchema);
