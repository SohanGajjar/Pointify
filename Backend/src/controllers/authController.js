const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/env');
const { asyncHandler } = require('../utils/asyncHandler');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
};

// Check if MongoDB is available
const isMongoDBAvailable = () => {
  return config.database.url && User.db && User.db.readyState === 1;
};

// @desc    Register user
// @route   POST /api/v1/auth/signup
// @access  Public
const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  console.log('Signup attempt:', { name, email });

  if (isMongoDBAvailable()) {
    console.log('Using MongoDB storage');
    
    // Check if user exists in MongoDB
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists in MongoDB:', email);
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user in MongoDB
    const user = await User.create({
      name,
      email,
      password
    });

    console.log('User created in MongoDB:', { id: user._id, name: user.name, email: user.email });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points
      }
    });
  } else {
    console.log('Using in-memory storage (MongoDB not available)');
    
    // Fallback to in-memory storage
    const users = req.app.locals.users || [];
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      console.log('User already exists in memory:', email);
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
      points: 500,
      createdAt: new Date()
    };
    
    users.push(user);
    req.app.locals.users = users;

    console.log('User created in memory:', { id: user.id, name: user.name, email: user.email });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        points: user.points
      }
    });
  }
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt:', { email });

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  if (isMongoDBAvailable()) {
    console.log('Using MongoDB storage for login');
    
    // Find user in MongoDB
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('User not found in MongoDB:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('User found in MongoDB, checking password...');
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      console.log('Invalid password for MongoDB user:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    console.log('Login successful for MongoDB user:', email);
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points
      }
    });
  } else {
    console.log('Using in-memory storage for login');
    
    // Fallback to in-memory storage
    const users = req.app.locals.users || [];
    console.log('Total users in memory:', users.length);
    
    const user = users.find(u => u.email === email);
    
    if (!user) {
      console.log('User not found in memory:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('User found in memory, checking password...');
    const bcrypt = require('bcryptjs');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log('Invalid password for memory user:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('Login successful for memory user:', email);
    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        points: user.points
      }
    });
  }
});

// @desc    Verify token
// @route   GET /api/v1/auth/verify
// @access  Private
const verifyToken = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    isValid: true,
    user: req.user
  });
});

module.exports = {
  signup,
  login,
  verifyToken
}; 