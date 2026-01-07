const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
  },
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required'],
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Department is required'],
  },
  batch: {
    type: String,
    required: [true, 'Batch is required'],
  },
  yearOfStudy: {
    type: Number,
    required: [true, 'Year of study is required'],
    min: 1,
    max: 4,
  },
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    min: 1,
    max: 8,
  },
  enrollmentDate: {
    type: Date,
    required: [true, 'Enrollment date is required'],
  },
  academicStatus: {
    type: String,
    enum: ['active', 'suspended', 'graduated', 'withdrawn'],
    default: 'active',
  },
  gpa: {
    type: Number,
    min: 0,
    max: 4,
    default: 0,
  },
  attendance: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  guardianName: {
    type: String,
  },
  guardianPhone: {
    type: String,
  },
  emergencyContact: {
    type: String,
  },
  profileImage: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Student', studentSchema);
