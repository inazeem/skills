const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  barber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Barber',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    maxlength: [100, 'Service name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    maxlength: [500, 'Service description cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Service category is required'],
    enum: [
      'haircut',
      'hair-styling',
      'hair-coloring',
      'beard-trimming',
      'shaving',
      'facial',
      'hair-treatment',
      'consultation',
      'other'
    ]
  },
  duration: {
    type: Number,
    required: [true, 'Service duration is required'],
    min: [5, 'Duration must be at least 5 minutes'],
    max: [480, 'Duration cannot exceed 8 hours']
  },
  price: {
    type: Number,
    required: [true, 'Service price is required'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
    default: ''
  },
  requirements: [{
    type: String,
    trim: true
  }],
  includes: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    maxlength: [200, 'Notes cannot be more than 200 characters']
  },
  maxAdvanceBooking: {
    type: Number,
    default: 30,
    min: 1,
    max: 365
  },
  minAdvanceBooking: {
    type: Number,
    default: 1,
    min: 0,
    max: 24
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
  requiresConsultation: {
    type: Boolean,
    default: false
  },
  consultationDuration: {
    type: Number,
    default: 15,
    min: 5,
    max: 60
  },
  consultationPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  statistics: {
    totalBookings: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    },
    ratingCount: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted price
serviceSchema.virtual('formattedPrice').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: this.currency
  }).format(this.price);
});

// Virtual for formatted duration
serviceSchema.virtual('formattedDuration').get(function() {
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`.trim();
  }
  return `${minutes}m`;
});

// Virtual for total price with consultation
serviceSchema.virtual('totalPrice').get(function() {
  return this.price + this.consultationPrice;
});

// Index for better query performance
serviceSchema.index({ barber: 1, isActive: 1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ isPopular: 1 });
serviceSchema.index({ price: 1 });

// Method to update booking statistics
serviceSchema.methods.updateBookingStats = function(amount) {
  this.statistics.totalBookings += 1;
  this.statistics.totalRevenue += amount;
  return this.save();
};

// Method to update rating
serviceSchema.methods.updateRating = function(newRating) {
  const oldRating = this.statistics.averageRating;
  const oldCount = this.statistics.ratingCount;
  
  this.statistics.ratingCount += 1;
  this.statistics.averageRating = ((oldRating * oldCount) + newRating) / this.statistics.ratingCount;
  
  return this.save();
};

// Static method to get popular services
serviceSchema.statics.getPopularServices = function(limit = 10) {
  return this.find({ isActive: true, isPopular: true })
    .populate('barber', 'businessName ratings.average')
    .sort({ 'statistics.totalBookings': -1 })
    .limit(limit);
};

// Static method to get services by category
serviceSchema.statics.getServicesByCategory = function(category, limit = 20) {
  return this.find({ category, isActive: true })
    .populate('barber', 'businessName ratings.average location.address')
    .sort({ 'statistics.averageRating': -1 })
    .limit(limit);
};

// Static method to search services
serviceSchema.statics.searchServices = function(query, limit = 20) {
  return this.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } }
        ]
      }
    ]
  })
    .populate('barber', 'businessName ratings.average location.address')
    .sort({ 'statistics.averageRating': -1 })
    .limit(limit);
};

module.exports = mongoose.model('Service', serviceSchema);