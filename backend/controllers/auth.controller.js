const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User.model');

// Generate JWT Token with session ID
const generateToken = (id, sessionId) => {
  return jwt.sign({ id, sessionId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// Generate unique session ID
const generateSessionId = () => {
  return crypto.randomBytes(32).toString('hex');
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { username, email, password, role, firstName, lastName, nic, phone, address } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role,
      firstName,
      lastName,
      nic,
      phone,
      address,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive',
      });
    }

    // Generate new session ID
    const sessionId = generateSessionId();
    
    // Get client IP
    const clientIP = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
    
    // Check if user is admin or director - enforce single session
    const hadActiveSession = user.activeSession !== null;
    
    // Update user with new session info
    user.activeSession = sessionId;
    user.lastLoginAt = new Date();
    user.lastLoginIP = clientIP;
    await user.save();

    const token = generateToken(user._id, sessionId);

    res.status(200).json({
      success: true,
      message: hadActiveSession && ['admin', 'director'].includes(user.role) 
        ? 'Login successful. Previous session has been terminated.' 
        : 'Login successful',
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        token,
        sessionTerminated: hadActiveSession && ['admin', 'director'].includes(user.role),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
