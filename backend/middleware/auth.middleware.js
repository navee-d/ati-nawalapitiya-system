const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
      
      if (!req.user || !req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User not found or inactive',
        });
      }

      // Single-session enforcement: if token carries a session id, it must match
      // the user's currentSessionId (which is rotated on each login).
      if (decoded.sid && req.user.currentSessionId && decoded.sid !== req.user.currentSessionId) {
        return res.status(401).json({
          success: false,
          message: 'Session expired (logged in from another device). Please login again.',
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Authorize specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    const expandedRoles = new Set(roles);
    // Treat director as admin-equivalent wherever admin is allowed
    if (expandedRoles.has('admin')) {
      expandedRoles.add('director');
    }

    if (!expandedRoles.has(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};
