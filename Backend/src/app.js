const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const config = require('./config/env');
const connectDB = require('./config/database');
const { logger } = require('./middleware/logger');
const { errorHandler } = require('./middleware/errorHandler');
const routes = require('./routes');

// Initialize express app
const app = express();

// Connect to database (with fallback to in-memory)
connectDB();

// Initialize in-memory storage as fallback
app.locals.users = [];

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(logger);

// API routes
app.use(`/api/${config.api.version}`, routes);

// Root route
app.get('/', (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState === 1 ? 'MongoDB Connected' : 'In-Memory Storage';
  
  res.json({
    success: true,
    message: 'Pointify API Server',
    version: config.api.version,
    environment: config.nodeEnv,
    storage: dbStatus,
    database: config.database.url ? 'MongoDB Configured' : 'No Database URL'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app; 