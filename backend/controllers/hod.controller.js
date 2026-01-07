const mongoose = require('mongoose');
const HOD = require('../models/HOD.model');
const User = require('../models/User.model');
const Department = require('../models/Department.model');

// @desc    Get all HODs
// @route   GET /api/hods
// @access  Private
exports.getAllHODs = async (req, res) => {
  try {
    const hods = await HOD.find()
      .populate('user', '-password')
      .populate('department')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: hods.length,
      data: hods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single HOD
// @route   GET /api/hods/:id
// @access  Private
exports.getHOD = async (req, res) => {
  try {
    const hod = await HOD.findById(req.params.id)
      .populate('user', '-password')
      .populate('department');

    if (!hod) {
      return res.status(404).json({
        success: false,
        message: 'HOD not found',
      });
    }

    res.status(200).json({
      success: true,
      data: hod,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new HOD
// @route   POST /api/hods
// @access  Private/Admin
exports.createHOD = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      username, email, password, firstName, lastName, nic, phone, address,
      hodId, department, qualification, specialization, appointmentDate,
      officeRoom, officeHours, responsibilities
    } = req.body;

    const existingHOD = await HOD.findOne({ department }).session(session);
    if (existingHOD) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'This department already has a HOD',
      });
    }

    const users = await User.create([{
      username,
      email,
      password,
      role: 'hod',
      firstName,
      lastName,
      nic,
      phone,
      address,
    }], { session });

    const user = users[0];

    const hods = await HOD.create([{
      user: user._id,
      hodId,
      department,
      qualification,
      specialization,
      appointmentDate,
      officeRoom,
      officeHours,
      responsibilities,
    }], { session });

    const hod = hods[0];

    // Update department with HOD reference
    await Department.findByIdAndUpdate(department, { hod: hod._id }, { session });

    await session.commitTransaction();
    session.endSession();

    const populatedHOD = await HOD.findById(hod._id)
      .populate('user', '-password')
      .populate('department');

    res.status(201).json({
      success: true,
      message: 'HOD created successfully',
      data: populatedHOD,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update HOD
// @route   PUT /api/hods/:id
// @access  Private/Admin
exports.updateHOD = async (req, res) => {
  try {
    let hod = await HOD.findById(req.params.id);

    if (!hod) {
      return res.status(404).json({
        success: false,
        message: 'HOD not found',
      });
    }

    hod = await HOD.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('user', '-password')
      .populate('department');
      
    if (req.body.firstName || req.body.lastName || req.body.email) {
       await User.findByIdAndUpdate(hod.user._id, req.body, { new: true });
    }

    res.status(200).json({
      success: true,
      message: 'HOD updated successfully',
      data: hod,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete HOD
// @route   DELETE /api/hods/:id
// @access  Private/Admin
exports.deleteHOD = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const hod = await HOD.findById(req.params.id).session(session);

    if (!hod) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'HOD not found',
      });
    }

    // Remove HOD reference from department
    await Department.findByIdAndUpdate(hod.department, { $unset: { hod: 1 } }, { session });

    await User.findByIdAndDelete(hod.user).session(session);
    await hod.deleteOne({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'HOD deleted successfully',
      data: {},
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};