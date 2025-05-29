const mongoose = require('mongoose');
const User = mongoose.model('User');

const COUPON_POINTS = {
  zomato: {
    name: 'Zomato Coupon',
    points: 100,
    description: 'Get discount on your next order'
  },
  movie: {
    name: 'Movie Coupon',
    points: 500,
    description: 'Get discount on movie tickets'
  },
  flight: {
    name: 'Flight Coupon',
    points: 1000,
    description: 'Get discount on flight bookings'
  },
  travel: {
    name: 'Travel Coupon',
    points: 1500,
    description: 'Get discount on travel packages'
  }
};

const getCouponTypes = async (req, res) => {
  try {
    return res.json({
      success: true,
      coupons: Object.entries(COUPON_POINTS).map(([type, data]) => ({
        type,
        ...data
      }))
    });
  } catch (error) {
    console.error('Error getting coupon types:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getUserPoints = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('+points');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.json({
      success: true,
      points: user.points || 0
    });
  } catch (error) {
    console.error('Error getting user points:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const updateUserPoints = async (req, res) => {
  try {
    const userId = req.user.id;
    const { points } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.points = points;
    await user.save();

    return res.json({
      success: true,
      points: user.points
    });
  } catch (error) {
    console.error('Error updating user points:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const redeemPoints = async (req, res) => {
  try {
    const { couponType } = req.body;
    const userId = req.user.id;

    console.log('Redeem request:', { userId, couponType });

    // Validate coupon type
    if (!COUPON_POINTS[couponType]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coupon type'
      });
    }

    // Get user's current points
    const user = await User.findById(userId).select('+points');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If points is undefined or null, set it to 0
    if (user.points === undefined || user.points === null) {
      user.points = 0;
      await user.save();
    }

    console.log('User points:', { 
      userId: user._id,
      currentPoints: user.points,
      requiredPoints: COUPON_POINTS[couponType].points
    });

    const requiredPoints = COUPON_POINTS[couponType].points;

    // Check if user has enough points
    if (user.points < requiredPoints) {
      return res.status(400).json({
        success: false,
        message: `Insufficient points. You have ${user.points} points, but need ${requiredPoints} points for this coupon.`
      });
    }

    // Deduct points and generate coupon
    user.points -= requiredPoints;
    await user.save();

    console.log('Points deducted:', {
      userId: user._id,
      newPoints: user.points
    });

    // Generate a unique coupon code
    const couponCode = `${couponType.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

    return res.json({
      success: true,
      message: 'Points redeemed successfully',
      coupon: couponCode,
      remainingPoints: user.points
    });

  } catch (error) {
    console.error('Error redeeming points:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const addPoints = async (req, res) => {
  try {
    const userId = req.user.id;
    const { points } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Initialize points if undefined
    if (user.points === undefined || user.points === null) {
      user.points = 0;
    }

    user.points += points;
    await user.save();

    console.log('Points added:', {
      userId: user._id,
      pointsAdded: points,
      newTotal: user.points
    });

    return res.json({
      success: true,
      points: user.points,
      message: `${points} points added successfully`
    });
  } catch (error) {
    console.error('Error adding points:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  redeemPoints,
  getUserPoints,
  updateUserPoints,
  addPoints,
  getCouponTypes
}; 