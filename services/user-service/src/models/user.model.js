const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true, 
    unique: true   // unique tự động tạo index
  },
  fullName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,          // unique tự động tạo index
    lowercase: true, 
    trim: true 
  },
  phone: { 
    type: String, 
    sparse: true, 
    unique: true           // unique tự động tạo index
  },
  avatar: { 
    type: String, 
    default: 'https://example.com/default-avatar.png' 
  },
  gender: { 
    type: String, 
    enum: ['male', 'female', 'other'], 
    default: null 
  },
  dateOfBirth: { 
    type: Date 
  },
  preferences: {
    language: { 
      type: String, 
      default: 'vi' 
    },
    paymentMethod: { 
      type: String, 
      default: 'cash', 
      enum: ['cash', 'card', 'wallet'] 
    },
    notifications: { 
      type: Boolean, 
      default: true 
    },
  },
  favoriteLocations: [{
    _id: false,
    name: String,
    address: String,
    lat: Number,
    lng: Number,
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  }],
  loyalty: {
    points: { 
      type: Number, 
      default: 0 
    },
    tier: { 
      type: String, 
      enum: ['bronze', 'silver', 'gold'], 
      default: 'bronze' 
    },
    lastEarned: Date,
  },
  stats: {
    totalRides: { 
      type: Number, 
      default: 0 
    },
    totalSpent: { 
      type: Number, 
      default: 0 
    },
    canceledRides: { 
      type: Number, 
      default: 0 
    },
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true, 
    transform: (doc, ret) => { 
      delete ret.__v; 
      return ret; 
    } 
  }
});

// KHÔNG CÒN CÁC DÒNG userSchema.index(...) NÀY NỮA
// userSchema.index({ email: 1 });
// userSchema.index({ phone: 1 });
// userSchema.index({ userId: 1 });

module.exports = mongoose.model('User', userSchema);