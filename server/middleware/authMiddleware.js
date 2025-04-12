const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes - verify user is authenticated
 */
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({
        message: 'You are not logged in. Please log in to access this resource.'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // Check if user still exists
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        message: 'The user belonging to this token no longer exists.'
      });
    }
    
    // Set user in request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Your token has expired. Please log in again.' });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Middleware to restrict routes to specific roles
 * @param {...string} roles - Allowed roles
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};
