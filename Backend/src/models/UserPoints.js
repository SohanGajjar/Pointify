const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['dailyLogin', 'referral', 'task', 'achievement'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const userPointsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  transactions: [transactionSchema],
  monthlyData: [{
    month: String,
    points: Number
  }],
  categoryData: [{
    category: String,
    points: Number,
    percentage: Number,
    color: String
  }]
}, {
  timestamps: true
});

// Add index for faster queries
userPointsSchema.index({ userId: 1 });

module.exports = mongoose.model('UserPoints', userPointsSchema); 