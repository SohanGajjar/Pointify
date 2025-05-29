const jwt = require('jsonwebtoken');
const config = require('../config/env');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ 
      success: false,
      message: 'Access denied. No token provided.' 
    });
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Access denied. Invalid token format.' 
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false,
      message: 'Invalid token.' 
    });
  }
};

module.exports = { verifyToken }; 