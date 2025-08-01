const express = require('express');
const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user appointments
// @route   GET /api/appointments
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ client: req.user.id })
      .populate('barber', 'businessName')
      .populate('service', 'name price')
      .sort({ date: -1 });
    
    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments'
    });
  }
});

module.exports = router;