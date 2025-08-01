const express = require('express');
const { body, validationResult } = require('express-validator');
const Barber = require('../models/Barber');
const Service = require('../models/Service');
const { protect, isBarber, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// @desc    Get all barbers
// @route   GET /api/barbers
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      rating,
      location,
      sort = 'ratings.average'
    } = req.query;

    const query = { isActive: true };

    // Search functionality
    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { specialties: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Filter by service category
    if (category) {
      const services = await Service.find({ category, isActive: true }).select('barber');
      const barberIds = services.map(service => service.barber);
      query._id = { $in: barberIds };
    }

    // Filter by rating
    if (rating) {
      query['ratings.average'] = { $gte: parseFloat(rating) };
    }

    // Filter by location
    if (location) {
      query['location.address.city'] = { $regex: location, $options: 'i' };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: [
        { path: 'user', select: 'firstName lastName avatar' },
        { path: 'services', select: 'name price duration category' }
      ],
      sort: { [sort]: -1 }
    };

    const barbers = await Barber.paginate(query, options);

    res.json({
      success: true,
      data: barbers
    });
  } catch (error) {
    console.error('Get barbers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching barbers'
    });
  }
});

// @desc    Get single barber
// @route   GET /api/barbers/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id)
      .populate('user', 'firstName lastName avatar')
      .populate({
        path: 'services',
        match: { isActive: true },
        select: 'name description price duration category image requirements includes'
      });

    if (!barber) {
      return res.status(404).json({
        success: false,
        message: 'Barber not found'
      });
    }

    res.json({
      success: true,
      data: { barber }
    });
  } catch (error) {
    console.error('Get barber error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching barber'
    });
  }
});

// @desc    Create barber profile
// @route   POST /api/barbers
// @access  Private (Barbers only)
router.post('/', protect, isBarber, [
  body('businessName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Business name must be between 2 and 100 characters'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('experience')
    .optional()
    .isInt({ min: 0, max: 50 })
    .withMessage('Experience must be between 0 and 50 years'),
  body('specialties')
    .optional()
    .isArray()
    .withMessage('Specialties must be an array')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Check if barber profile already exists
    const existingBarber = await Barber.findOne({ user: req.user.id });
    if (existingBarber) {
      return res.status(400).json({
        success: false,
        message: 'Barber profile already exists'
      });
    }

    const barberData = {
      user: req.user.id,
      ...req.body
    };

    const barber = await Barber.create(barberData);

    res.status(201).json({
      success: true,
      message: 'Barber profile created successfully',
      data: { barber }
    });
  } catch (error) {
    console.error('Create barber error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating barber profile'
    });
  }
});

// @desc    Update barber profile
// @route   PUT /api/barbers/:id
// @access  Private (Barber owner only)
router.put('/:id', protect, async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id);

    if (!barber) {
      return res.status(404).json({
        success: false,
        message: 'Barber not found'
      });
    }

    // Check if user owns this barber profile
    if (barber.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }

    const updatedBarber = await Barber.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName avatar');

    res.json({
      success: true,
      message: 'Barber profile updated successfully',
      data: { barber: updatedBarber }
    });
  } catch (error) {
    console.error('Update barber error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating barber profile'
    });
  }
});

// @desc    Upload barber photos
// @route   POST /api/barbers/:id/photos
// @access  Private (Barber owner only)
router.post('/:id/photos', protect, upload.array('photos', 5), async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id);

    if (!barber) {
      return res.status(404).json({
        success: false,
        message: 'Barber not found'
      });
    }

    if (barber.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to upload photos'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No photos uploaded'
      });
    }

    const photos = req.files.map((file, index) => ({
      url: `/uploads/${file.filename}`,
      caption: req.body.captions ? req.body.captions[index] : '',
      isPrimary: req.body.isPrimary === index.toString()
    }));

    // If setting a primary photo, unset others
    if (req.body.isPrimary !== undefined) {
      barber.photos.forEach(photo => photo.isPrimary = false);
    }

    barber.photos.push(...photos);
    await barber.save();

    res.json({
      success: true,
      message: 'Photos uploaded successfully',
      data: { photos: barber.photos }
    });
  } catch (error) {
    console.error('Upload photos error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading photos'
    });
  }
});

// @desc    Get barber availability
// @route   GET /api/barbers/:id/availability
// @access  Public
router.get('/:id/availability', async (req, res) => {
  try {
    const { date, duration = 30 } = req.query;
    const barber = await Barber.findById(req.params.id);

    if (!barber) {
      return res.status(404).json({
        success: false,
        message: 'Barber not found'
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date parameter is required'
      });
    }

    const availableSlots = await barber.getAvailableTimeSlots(new Date(date), duration);

    res.json({
      success: true,
      data: {
        availableSlots,
        workingHours: barber.workingHours,
        isAvailable: barber.availability.isAvailable
      }
    });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching availability'
    });
  }
});

// @desc    Update barber availability
// @route   PUT /api/barbers/:id/availability
// @access  Private (Barber owner only)
router.put('/:id/availability', protect, async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id);

    if (!barber) {
      return res.status(404).json({
        success: false,
        message: 'Barber not found'
      });
    }

    if (barber.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update availability'
      });
    }

    const { workingHours, customAvailability, vacationDays } = req.body;

    if (workingHours) {
      barber.workingHours = { ...barber.workingHours, ...workingHours };
    }

    if (customAvailability) {
      barber.availability.customAvailability = customAvailability;
    }

    if (vacationDays) {
      barber.availability.vacationDays = vacationDays;
    }

    await barber.save();

    res.json({
      success: true,
      message: 'Availability updated successfully',
      data: {
        workingHours: barber.workingHours,
        availability: barber.availability
      }
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating availability'
    });
  }
});

// @desc    Get barber services
// @route   GET /api/barbers/:id/services
// @access  Public
router.get('/:id/services', async (req, res) => {
  try {
    const services = await Service.find({
      barber: req.params.id,
      isActive: true
    }).sort({ name: 1 });

    res.json({
      success: true,
      data: { services }
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching services'
    });
  }
});

// @desc    Get barber statistics
// @route   GET /api/barbers/:id/statistics
// @access  Private (Barber owner only)
router.get('/:id/statistics', protect, async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id);

    if (!barber) {
      return res.status(404).json({
        success: false,
        message: 'Barber not found'
      });
    }

    if (barber.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view statistics'
      });
    }

    res.json({
      success: true,
      data: {
        statistics: barber.statistics,
        ratings: barber.ratings
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
});

module.exports = router;