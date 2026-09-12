const Property = require('../models/Property');
const PropertyView = require('../models/PropertyView');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { getSimilarProperties, getUserRecommendations } = require('../services/recommendationService');
const { uploadToCloudinaryOrLocal } = require('../config/cloudinary');

// @desc    Get all properties with multi-filter, search, sort, and pagination
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res, next) => {
  try {
    const {
      q,
      city,
      locality,
      propertyType,
      listingType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      furnishing,
      minArea,
      maxArea,
      parking,
      amenities,
      sortBy = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    const query = { status: 'APPROVED' };

    // Search query (keyword matching)
    if (q) {
      const searchRegex = new RegExp(q.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { 'location.city': searchRegex },
        { 'location.locality': searchRegex },
        { 'location.address': searchRegex },
        { propertyType: searchRegex }
      ];
    }

    // Specific filters
    if (city) {
      query['location.city'] = new RegExp(`^${city.trim()}$`, 'i');
    }

    if (locality) {
      query['location.locality'] = new RegExp(locality.trim(), 'i');
    }

    if (propertyType && propertyType !== 'All') {
      const types = propertyType.split(',').map((t) => t.trim());
      query.propertyType = { $in: types };
    }

    if (listingType && (listingType === 'BUY' || listingType === 'RENT')) {
      query.listingType = listingType;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (bedrooms) {
      const beds = Number(bedrooms);
      if (beds >= 4) {
        query.bedrooms = { $gte: 4 };
      } else {
        query.bedrooms = beds;
      }
    }

    if (bathrooms) {
      const baths = Number(bathrooms);
      if (baths >= 3) {
        query.bathrooms = { $gte: 3 };
      } else {
        query.bathrooms = baths;
      }
    }

    if (furnishing && furnishing !== 'All') {
      query.furnishing = furnishing;
    }

    if (minArea || maxArea) {
      query.area = {};
      if (minArea) query.area.$gte = Number(minArea);
      if (maxArea) query.area.$lte = Number(maxArea);
    }

    if (parking) {
      query.parking = { $gte: Number(parking) };
    }

    if (amenities) {
      const amenitiesList = amenities.split(',').map((a) => a.trim());
      query.amenities = { $all: amenitiesList };
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    switch (sortBy) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'area_asc':
        sortOption = { area: 1 };
        break;
      case 'area_desc':
        sortOption = { area: -1 };
        break;
      case 'views_desc':
        sortOption = { viewsCount: -1 };
        break;
      case 'newest':
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [properties, total] = await Promise.all([
      Property.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .populate('agent', 'name avatar phone email agencyName')
        .lean(),
      Property.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      properties
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property by ID or Slug + track views
// @route   GET /api/properties/:id
// @access  Public
exports.getPropertyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let property;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      property = await Property.findById(id).populate('agent', 'name avatar phone email bio agencyName experienceYears');
    } else {
      property = await Property.findOne({ slug: id }).populate('agent', 'name avatar phone email bio agencyName experienceYears');
    }

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    // Track view asynchronously
    property.viewsCount += 1;
    await property.save({ validateBeforeSave: false });

    // Log PropertyView for agent analytics
    PropertyView.create({
      property: property._id,
      agent: property.agent._id,
      user: req.user ? req.user._id : null,
      ip: req.ip || req.headers['x-forwarded-for'] || ''
    }).catch((err) => console.error('[View Logger Error]:', err.message));

    res.status(200).json({
      success: true,
      property
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured properties for home page
// @route   GET /api/properties/featured
// @access  Public
exports.getFeaturedProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ status: 'APPROVED', isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('agent', 'name avatar phone agencyName')
      .lean();

    res.status(200).json({
      success: true,
      properties
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent properties for home page
// @route   GET /api/properties/recent
// @access  Public
exports.getRecentProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ status: 'APPROVED' })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('agent', 'name avatar phone agencyName')
      .lean();

    res.status(200).json({
      success: true,
      properties
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get similar property recommendations (rule-based)
// @route   GET /api/properties/:id/similar
// @access  Public
exports.getSimilarProperties = async (req, res, next) => {
  try {
    const similar = await getSimilarProperties(req.params.id, 4);
    res.status(200).json({
      success: true,
      properties: similar
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get personalized property recommendations
// @route   GET /api/properties/recommendations
// @access  Public / Private
exports.getRecommendations = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const recommendations = await getUserRecommendations(userId, 6);
    res.status(200).json({
      success: true,
      properties: recommendations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new property (Agent/Admin)
// @route   POST /api/properties
// @access  Private (AGENT / ADMIN)
exports.createProperty = async (req, res, next) => {
  try {
    const propertyData = {
      ...req.body,
      agent: req.user.id,
      // Admins auto-approve; Agents enter PENDING state
      status: req.user.role === 'ADMIN' ? 'APPROVED' : 'PENDING'
    };

    // Ensure images have at least one primary
    if (propertyData.images && propertyData.images.length > 0) {
      const hasPrimary = propertyData.images.some((img) => img.isPrimary);
      if (!hasPrimary) {
        propertyData.images[0].isPrimary = true;
      }
    }

    const property = await Property.create(propertyData);

    // Notify all admins if a pending listing was submitted
    if (property.status === 'PENDING') {
      const admins = await User.find({ role: 'ADMIN' });
      admins.forEach((admin) => {
        Notification.create({
          recipient: admin._id,
          sender: req.user.id,
          type: 'SYSTEM',
          title: 'New Property Listing Pending Approval',
          message: `${req.user.name} submitted "${property.title}" for review.`,
          link: `/admin/properties`
        }).catch((e) => console.error(e));
      });
    }

    res.status(201).json({
      success: true,
      message:
        req.user.role === 'ADMIN'
          ? 'Property listing created and published!'
          : 'Property submitted successfully! It is now pending admin approval before going live.',
      property
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Owner AGENT or ADMIN)
exports.updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    // Verify ownership or Admin role
    if (property.agent.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this property.'
      });
    }

    const updateData = { ...req.body };

    // If agent modifies price/title/details, keep or set to PENDING for review
    if (req.user.role !== 'ADMIN') {
      // Retain approval status unless rejected, where they resubmit as PENDING
      if (property.status === 'REJECTED') {
        updateData.status = 'PENDING';
        updateData.rejectionReason = '';
      }
    }

    property = await Property.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Property updated successfully.',
      property
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Owner AGENT or ADMIN)
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    if (property.agent.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this property.'
      });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Agent's properties
// @route   GET /api/properties/agent/my-properties
// @access  Private (AGENT)
exports.getMyProperties = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { agent: req.user.id };

    if (status && status !== 'ALL') {
      query.status = status;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [properties, total] = await Promise.all([
      Property.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Property.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      properties
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload multiple property images
// @route   POST /api/properties/upload-images
// @access  Private (AGENT / ADMIN)
exports.uploadPropertyImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload at least one image.' });
    }

    const uploadPromises = req.files.map((file, idx) =>
      uploadToCloudinaryOrLocal(file, 'estatehub/properties').then((result) => ({
        url: result.url,
        publicId: result.publicId,
        isPrimary: idx === 0
      }))
    );

    const uploadedImages = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully.',
      images: uploadedImages
    });
  } catch (error) {
    next(error);
  }
};
