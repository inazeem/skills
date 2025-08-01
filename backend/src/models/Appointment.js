const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  barber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Barber',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'partially-paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'cash', 'other'],
    default: 'stripe'
  },
  stripePaymentIntentId: String,
  stripeRefundId: String,
  notes: {
    client: {
      type: String,
      maxlength: [500, 'Client notes cannot exceed 500 characters']
    },
    barber: {
      type: String,
      maxlength: [500, 'Barber notes cannot exceed 500 characters']
    }
  },
  specialRequests: [{
    type: String,
    trim: true
  }],
  cancellationReason: {
    type: String,
    maxlength: [200, 'Cancellation reason cannot exceed 200 characters']
  },
  cancelledBy: {
    type: String,
    enum: ['client', 'barber', 'system'],
    default: 'client'
  },
  cancellationTime: Date,
  reminderSent: {
    type: Boolean,
    default: false
  },
  reminderSentAt: Date,
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      maxlength: [1000, 'Review cannot exceed 1000 characters']
    },
    createdAt: Date
  },
  checkInTime: Date,
  checkOutTime: Date,
  duration: {
    type: Number,
    required: true,
    min: [5, 'Duration must be at least 5 minutes']
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    frequency: {
      type: String,
      enum: ['weekly', 'bi-weekly', 'monthly'],
      default: 'weekly'
    },
    endDate: Date,
    nextAppointment: Date
  },
  originalAppointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for appointment date and time
appointmentSchema.virtual('appointmentDateTime').get(function() {
  return new Date(`${this.date.toDateString()} ${this.startTime}`);
});

// Virtual for formatted date
appointmentSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for formatted time
appointmentSchema.virtual('formattedTime').get(function() {
  return `${this.startTime} - ${this.endTime}`;
});

// Virtual for formatted amount
appointmentSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: this.currency
  }).format(this.totalAmount);
});

// Virtual for is past appointment
appointmentSchema.virtual('isPast').get(function() {
  return new Date() > new Date(`${this.date.toDateString()} ${this.endTime}`);
});

// Virtual for is today
appointmentSchema.virtual('isToday').get(function() {
  const today = new Date().toDateString();
  return this.date.toDateString() === today;
});

// Virtual for is upcoming
appointmentSchema.virtual('isUpcoming').get(function() {
  return new Date() < new Date(`${this.date.toDateString()} ${this.startTime}`);
});

// Virtual for can be cancelled
appointmentSchema.virtual('canBeCancelled').get(function() {
  if (this.status === 'cancelled' || this.status === 'completed' || this.status === 'no-show') {
    return false;
  }
  
  const appointmentTime = new Date(`${this.date.toDateString()} ${this.startTime}`);
  const now = new Date();
  const hoursUntilAppointment = (appointmentTime - now) / (1000 * 60 * 60);
  
  return hoursUntilAppointment > 24; // Can cancel if more than 24 hours away
});

// Index for better query performance
appointmentSchema.index({ client: 1, date: -1 });
appointmentSchema.index({ barber: 1, date: -1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ date: 1, startTime: 1 });
appointmentSchema.index({ paymentStatus: 1 });
appointmentSchema.index({ 'recurringPattern.nextAppointment': 1 });

// Method to check if appointment conflicts with existing appointments
appointmentSchema.statics.checkConflict = async function(barberId, date, startTime, endTime, excludeId = null) {
  const query = {
    barber: barberId,
    date: date,
    status: { $nin: ['cancelled', 'no-show'] },
    $or: [
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
      }
    ]
  };
  
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  
  const conflictingAppointment = await this.findOne(query);
  return conflictingAppointment;
};

// Method to get available time slots for a barber on a specific date
appointmentSchema.statics.getAvailableSlots = async function(barberId, date, duration = 30) {
  const barber = await mongoose.model('Barber').findById(barberId);
  if (!barber) return [];
  
  // Get barber's working hours for the day
  const dayOfWeek = date.toLocaleLowerCase().slice(0, 3);
  const dayHours = barber.workingHours[dayOfWeek];
  
  if (!dayHours || !dayHours.isOpen) return [];
  
  // Get all booked appointments for the day
  const bookedAppointments = await this.find({
    barber: barberId,
    date: date,
    status: { $nin: ['cancelled', 'no-show'] }
  }).select('startTime endTime');
  
  // Generate all possible time slots
  const slots = [];
  let currentTime = new Date(`2000-01-01T${dayHours.openTime}:00`);
  const closeTime = new Date(`2000-01-01T${dayHours.closeTime}:00`);
  
  while (currentTime < closeTime) {
    const timeString = currentTime.toTimeString().slice(0, 5);
    const slotEndTime = new Date(currentTime.getTime() + duration * 60000);
    const slotEndString = slotEndTime.toTimeString().slice(0, 5);
    
    // Check if slot is within working hours
    if (slotEndTime <= closeTime) {
      // Check if slot conflicts with break time
      const isDuringBreak = dayHours.breakStart && dayHours.breakEnd &&
        timeString < dayHours.breakEnd && slotEndString > dayHours.breakStart;
      
      if (!isDuringBreak) {
        // Check if slot conflicts with booked appointments
        const isBooked = bookedAppointments.some(appointment => 
          timeString < appointment.endTime && slotEndString > appointment.startTime
        );
        
        if (!isBooked) {
          slots.push(timeString);
        }
      }
    }
    
    currentTime.setMinutes(currentTime.getMinutes() + 30); // 30-minute intervals
  }
  
  return slots;
};

// Method to calculate end time based on service duration
appointmentSchema.methods.calculateEndTime = function() {
  const startTime = new Date(`2000-01-01T${this.startTime}:00`);
  const endTime = new Date(startTime.getTime() + this.duration * 60000);
  return endTime.toTimeString().slice(0, 5);
};

// Method to update appointment status
appointmentSchema.methods.updateStatus = function(newStatus, notes = '') {
  this.status = newStatus;
  
  if (newStatus === 'cancelled') {
    this.cancellationTime = new Date();
  } else if (newStatus === 'in-progress') {
    this.checkInTime = new Date();
  } else if (newStatus === 'completed') {
    this.checkOutTime = new Date();
  }
  
  if (notes) {
    this.notes.barber = notes;
  }
  
  return this.save();
};

// Method to add rating
appointmentSchema.methods.addRating = function(score, review = '') {
  this.rating = {
    score,
    review,
    createdAt: new Date()
  };
  
  // Update service and barber statistics
  this.populate('service barber').then(() => {
    if (this.service) {
      this.service.updateRating(score);
    }
    if (this.barber) {
      this.barber.updateRating(score);
    }
  });
  
  return this.save();
};

module.exports = mongoose.model('Appointment', appointmentSchema);