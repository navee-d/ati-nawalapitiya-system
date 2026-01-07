const Staff = require('../models/Staff.model');
const User = require('../models/User.model');

// @desc    Get all staff
// @route   GET /api/staff
// @access  Private
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find()
      .populate('user', '-password')
      .populate('department')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: staff.length,
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single staff member
// @route   GET /api/staff/:id
// @access  Private
exports.getStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id)
      .populate('user', '-password')
      .populate('department');

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found',
      });
    }

    res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new staff member
// @route   POST /api/staff
// @access  Private/Admin
exports.createStaff = async (req, res) => {
  try {
    const {
      username, email, password, firstName, lastName, nic, phone, address,
      staffId, department, designation, staffType, joinDate,
      officeRoom, workingHours, employmentType, responsibilities
    } = req.body;

    // Create user account
    const user = await User.create({
      username,
      email,
      password,
      role: 'staff',
      firstName,
      lastName,
      nic,
      phone,
      address,
    });

    // Create staff profile
    const staff = await Staff.create({
      user: user._id,
      staffId,
      department,
      designation,
      staffType,
      joinDate,
      officeRoom,
      workingHours,
      employmentType,
      responsibilities,
    });

    const populatedStaff = await Staff.findById(staff._id)
      .populate('user', '-password')
      .populate('department');

    res.status(201).json({
      success: true,
      message: 'Staff member created successfully',
      data: populatedStaff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update staff member
// @route   PUT /api/staff/:id
// @access  Private/Admin
exports.updateStaff = async (req, res) => {
  try {
    let staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found',
      });
    }

    staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('user', '-password')
      .populate('department');

    res.status(200).json({
      success: true,
      message: 'Staff member updated successfully',
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete staff member
// @route   DELETE /api/staff/:id
// @access  Private/Admin
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found',
      });
    }

    // Delete associated user account
    await User.findByIdAndDelete(staff.user);
    await staff.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Staff member deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get staff by type
// @route   GET /api/staff/type/:staffType
// @access  Private
exports.getStaffByType = async (req, res) => {
  try {
    const staff = await Staff.find({ staffType: req.params.staffType })
      .populate('user', '-password')
      .populate('department')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: staff.length,
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
