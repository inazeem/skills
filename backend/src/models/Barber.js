const mongoose = require('mongoose');

const barberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
    maxlength: [100, 'Business name cannot be more than 100 characters']
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  specialties: [{
    type: String,
    trim: true
  }],
  experience: {
    type: Number,
    min: [0, 'Experience cannot be negative'],
    max: [50, 'Experience cannot be more than 50 years']
  },
  education: [{
    institution: String,
    degree: String,
    year: Number,
    description: String
  }],
  certifications: [{
    name: String,
    issuingOrganization: String,
    issueDate: Date,
    expiryDate: Date,
    certificateNumber: String
  }],
  location: {
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contact: {
    phone: String,
    email: String,
    website: String,
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String
    }
  },
  workingHours: {
    monday: {
      isOpen: { type: Boolean, default: false },
      openTime: String,
      closeTime: String,
      breakStart: String,
      breakEnd: String
    },
    tuesday: {
      isOpen: { type: Boolean, default: false },
      openTime: String,
      closeTime: String,
      breakStart: String,
      breakEnd: String
    },
    wednesday: {
      isOpen: { type: Boolean, default: false },
      openTime: String,
      closeTime: String,
      breakStart: String,
      breakEnd: String
    },
    thursday: {
      isOpen: { type: Boolean, default: false },
      openTime: String,
      closeTime: String,
      breakStart: String,
      breakEnd: String
    },
    friday: {
      isOpen: { type: Boolean, default: false },
      openTime: String,
      closeTime: String,
      breakStart: String,
      breakEnd: String
    },
    saturday: {
      isOpen: { type: Boolean, default: false },
      openTime: String,
      closeTime: String,
      breakStart: String,
      breakEnd: String
    },
    sunday: {
      isOpen: { type: Boolean, default: false },
      openTime: String,
      closeTime: String,
      breakStart: String,
      breakEnd: String
    }
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  photos: [{
    url: String,
    caption: String,
    isPrimary: { type: Boolean, default: false }
  }],
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    },
    distribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    }
  },
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    customAvailability: [{
      date: Date,
      isAvailable: Boolean,
      openTime: String,
      closeTime: String,
      reason: String
    }],
    vacationDays: [{
      startDate: Date,
      endDate: Date,
      reason: String
    }]
  },
  settings: {
    bookingAdvanceDays: {
      type: Number,
      default: 30,
      min: 1,
      max: 365
    },
    cancellationPolicy: {
      type: String,
      enum: ['flexible', 'moderate', 'strict'],
      default: 'moderate'
    },
    cancellationHours: {
      type: Number,
      default: 24,
      min: 1,
      max: 168
    },
    autoConfirm: {
      type: Boolean,
      default: false
    },
    requireDeposit: {
      type: Boolean,
      default: false
    },
    depositPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  statistics: {
    totalBookings: {
      type: Number,
      default: 0
    },
    completedBookings: {
      type: Number,
      default: 0
    },
    cancelledBookings: {
      type: Number,
      default: 0
    },
    totalEarnings: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  stripeAccountId: String,
  stripeCustomerId: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full address
barberSchema.virtual('fullAddress').get(function() {
  const addr = this.location.address;
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}, ${addr.country}`;
});

// Virtual for is currently open
barberSchema.virtual('isCurrentlyOpen').get(function() {
  const now = new Date();
  const dayOfWeek = now.toLocaleLowerCase().slice(0, 3);
  const currentTime = now.toTimeString().slice(0, 5);
  
  const todayHours = this.workingHours[dayOfWeek];
  if (!todayHours || !todayHours.isOpen) return false;
  
  return currentTime >= todayHours.openTime && currentTime <= todayHours.closeTime;
});

// Index for better query performance
barberSchema.index({ 'location.coordinates': '2dsphere' });
barberSchema.index({ isActive: 1 });
barberSchema.index({ isVerified: 1 });
barberSchema.index({ 'ratings.average': -1 });

// Method to check if barber is available on a specific date and time
barberSchema.methods.isAvailableOn = function(date, time) {
  const dayOfWeek = date.toLocaleLowerCase().slice(0, 3);
  const dayHours = this.workingHours[dayOfWeek];
  
  if (!dayHours || !dayHours.isOpen) return false;
  
  // Check if time is within working hours
  if (time < dayHours.openTime || time > dayHours.closeTime) return false;
  
  // Check for break time
  if (dayHours.breakStart && dayHours.breakEnd) {
    if (time >= dayHours.breakStart && time <= dayHours.breakEnd) return false;
  }
  
  // Check custom availability
  const customAvail = this.availability.customAvailability.find(
    ca => ca.date.toDateString() === date.toDateString()
  );
  if (customAvail && !customAvail.isAvailable) return false;
  
  // Check vacation days
  const isOnVacation = this.availability.vacationDays.some(
    vd => date >= vd.startDate && date <= vd.endDate
  );
  if (isOnVacation) return false;
  
  return true;
};

// Method to update rating
barberSchema.methods.updateRating = function(newRating) {
  const oldRating = this.ratings.average;
  const oldCount = this.ratings.count;
  
  this.ratings.count += 1;
  this.ratings.average = ((oldRating * oldCount) + newRating) / this.ratings.count;
  this.ratings.distribution[newRating] += 1;
  
  return this.save();
};

// Method to get available time slots for a date
barberSchema.methods.getAvailableTimeSlots = function(date, duration = 30) {
  const dayOfWeek = date.toLocaleLowerCase().slice(0, 3);
  const dayHours = this.workingHours[dayOfWeek];
  
  if (!dayHours || !dayHours.isOpen) return [];
  
  const slots = [];
  let currentTime = new Date(`2000-01-01T${dayHours.openTime}:00`);
  const closeTime = new Date(`2000-01-01T${dayHours.closeTime}:00`);
  
  while (currentTime < closeTime) {
    const timeString = currentTime.toTimeString().slice(0, 5);
    
    // Check if this time slot is available (not during break)
    if (!dayHours.breakStart || !dayHours.breakEnd || 
        timeString < dayHours.breakStart || timeString > dayHours.breakEnd) {
      slots.push(timeString);
    }
    
    currentTime.setMinutes(currentTime.getMinutes() + duration);
  }
  
  return slots;
};

module.exports = mongoose.model('Barber', barberSchema);