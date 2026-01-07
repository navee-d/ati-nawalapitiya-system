const mongoose = require('mongoose');
const Student = require('../models/Student.model');
const User = require('../models/User.model');

// @desc    Get all students
// @route   GET /api/students
// @access  Private
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('user', '-password')
      .populate('course')
      .populate('department')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user', '-password')
      .populate('course')
      .populate('department');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Private/Admin/HOD
exports.createStudent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      username, email, password, firstName, lastName, nic, phone, address,
      studentId, registrationNumber, course, department, batch, yearOfStudy,
      semester, enrollmentDate, guardianName, guardianPhone, emergencyContact
    } = req.body;

    // 1. Create user account (returns an array when using session)
    const users = await User.create([{
      username,
      email,
      password,
      role: 'student',
      firstName,
      lastName,
      nic,
      phone,
      address,
    }], { session });

    const user = users[0];

    // 2. Create student profile linked to user
    const students = await Student.create([{
      user: user._id,
      studentId,
      registrationNumber,
      course,
      department,
      batch,
      yearOfStudy,
      semester,
      enrollmentDate,
      guardianName,
      guardianPhone,
      emergencyContact,
    }], { session });

    await session.commitTransaction();
    session.endSession();

    // Fetch populated data to return
    const populatedStudent = await Student.findById(students[0]._id)
      .populate('user', '-password')
      .populate('course')
      .populate('department');

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: populatedStudent,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      success: false,
      message: error.message || 'Transaction failed',
    });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin/HOD
exports.updateStudent = async (req, res) => {
  try {
    let student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Update Profile
    student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('user', '-password')
      .populate('course')
      .populate('department');

    // Optional: Update User details if provided in body (firstName, etc.)
    if (req.body.firstName || req.body.lastName || req.body.email) {
       await User.findByIdAndUpdate(student.user._id, req.body, { new: true });
    }

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
exports.deleteStudent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const student = await Student.findById(req.params.id).session(session);

    if (!student) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Delete associated user account
    await User.findByIdAndDelete(student.user).session(session);
    // Delete student profile
    await student.deleteOne({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
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

// @desc    Get students by department
// @route   GET /api/students/department/:departmentId
// @access  Private
exports.getStudentsByDepartment = async (req, res) => {
  try {
    const students = await Student.find({ department: req.params.departmentId })
      .populate('user', '-password')
      .populate('course')
      .populate('department')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};