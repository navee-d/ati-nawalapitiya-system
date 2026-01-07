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
  try {
    const {
      username, email, password, firstName, lastName, nic, phone, address,
      studentId, registrationNumber, course, department, batch, yearOfStudy,
      semester, enrollmentDate, guardianName, guardianPhone, emergencyContact
    } = req.body;

    // Create user account
    const user = await User.create({
      username,
      email,
      password,
      role: 'student',
      firstName,
      lastName,
      nic,
      phone,
      address,
    });

    // Create student profile
    const student = await Student.create({
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
    });

    const populatedStudent = await Student.findById(student._id)
      .populate('user', '-password')
      .populate('course')
      .populate('department');

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: populatedStudent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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

    student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('user', '-password')
      .populate('course')
      .populate('department');

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
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Delete associated user account
    await User.findByIdAndDelete(student.user);
    await student.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
      data: {},
    });
  } catch (error) {
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
