const Lecturer = require('../models/Lecturer.model');
const User = require('../models/User.model');

// @desc    Get all lecturers
// @route   GET /api/lecturers
// @access  Private
exports.getAllLecturers = async (req, res) => {
  try {
    const lecturers = await Lecturer.find()
      .populate('user', '-password')
      .populate('department')
      .populate('coursesTaught')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: lecturers.length,
      data: lecturers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single lecturer
// @route   GET /api/lecturers/:id
// @access  Private
exports.getLecturer = async (req, res) => {
  try {
    const lecturer = await Lecturer.findById(req.params.id)
      .populate('user', '-password')
      .populate('department')
      .populate('coursesTaught');

    if (!lecturer) {
      return res.status(404).json({
        success: false,
        message: 'Lecturer not found',
      });
    }

    res.status(200).json({
      success: true,
      data: lecturer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new lecturer
// @route   POST /api/lecturers
// @access  Private/Admin/HOD
exports.createLecturer = async (req, res) => {
  try {
    const {
      username, email, password, firstName, lastName, nic, phone, address,
      lecturerId, department, designation, qualification, specialization,
      joinDate, officeRoom, officeHours, employmentType
    } = req.body;

    // Create user account
    const user = await User.create({
      username,
      email,
      password,
      role: 'lecturer',
      firstName,
      lastName,
      nic,
      phone,
      address,
    });

    // Create lecturer profile
    const lecturer = await Lecturer.create({
      user: user._id,
      lecturerId,
      department,
      designation,
      qualification,
      specialization,
      joinDate,
      officeRoom,
      officeHours,
      employmentType,
    });

    const populatedLecturer = await Lecturer.findById(lecturer._id)
      .populate('user', '-password')
      .populate('department');

    res.status(201).json({
      success: true,
      message: 'Lecturer created successfully',
      data: populatedLecturer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update lecturer
// @route   PUT /api/lecturers/:id
// @access  Private/Admin/HOD
exports.updateLecturer = async (req, res) => {
  try {
    let lecturer = await Lecturer.findById(req.params.id);

    if (!lecturer) {
      return res.status(404).json({
        success: false,
        message: 'Lecturer not found',
      });
    }

    lecturer = await Lecturer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('user', '-password')
      .populate('department')
      .populate('coursesTaught');

    res.status(200).json({
      success: true,
      message: 'Lecturer updated successfully',
      data: lecturer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete lecturer
// @route   DELETE /api/lecturers/:id
// @access  Private/Admin
exports.deleteLecturer = async (req, res) => {
  try {
    const lecturer = await Lecturer.findById(req.params.id);

    if (!lecturer) {
      return res.status(404).json({
        success: false,
        message: 'Lecturer not found',
      });
    }

    // Delete associated user account
    await User.findByIdAndDelete(lecturer.user);
    await lecturer.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Lecturer deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get lecturers by department
// @route   GET /api/lecturers/department/:departmentId
// @access  Private
exports.getLecturersByDepartment = async (req, res) => {
  try {
    const lecturers = await Lecturer.find({ department: req.params.departmentId })
      .populate('user', '-password')
      .populate('department')
      .populate('coursesTaught')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: lecturers.length,
      data: lecturers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
