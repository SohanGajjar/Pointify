const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { redeemPoints, getUserPoints, updateUserPoints, addPoints, getCouponTypes } = require('../controllers/rewards.controller');

// Get user points
router.get('/points', verifyToken, getUserPoints);

// Update user points
router.put('/points', verifyToken, updateUserPoints);

// Add points (for testing)
router.post('/points/add', verifyToken, addPoints);

// Redeem points for a coupon
router.post('/redeem', verifyToken, redeemPoints);

// Get coupon types
router.get('/coupons', getCouponTypes);

module.exports = router; 