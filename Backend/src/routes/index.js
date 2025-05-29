const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const rewardsRoutes = require('./rewards.routes');

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  });
});

// Register routes
router.use('/auth', authRoutes);
router.use('/rewards', rewardsRoutes);

// Debug route to check users in memory and MongoDB
router.get('/debug/users', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const User = require('../models/User');
    
    let mongoUsers = [];
    let memoryUsers = req.app.locals.users || [];
    
    // Try to get MongoDB users if connected
    if (mongoose.connection.readyState === 1) {
      try {
        mongoUsers = await User.find({}).select('-password');
      } catch (error) {
        console.error('Error fetching MongoDB users:', error);
      }
    }
    
    res.json({
      success: true,
      storage: {
        mongodb: {
          connected: mongoose.connection.readyState === 1,
          totalUsers: mongoUsers.length,
          users: mongoUsers.map(u => ({ 
            id: u._id, 
            name: u.name, 
            email: u.email, 
            points: u.points,
            createdAt: u.createdAt 
          }))
        },
        memory: {
          totalUsers: memoryUsers.length,
          users: memoryUsers.map(u => ({ 
            id: u.id, 
            name: u.name, 
            email: u.email, 
            points: u.points,
            createdAt: u.createdAt 
          }))
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching debug information',
      error: error.message
    });
  }
});

module.exports = router; 