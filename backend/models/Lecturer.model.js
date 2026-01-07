const mongoose = require('mongoose');

const lecturerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lecturerId: {
    type: String,
    required: [true, 'Lecturer ID is required'],
    unique: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Department is required'],
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    enum: ['Lecturer', 'Senior Lecturer', 'Assistant Lecturer', 'Professor', 'Associate Professor'],
  },
  qualification: {
    type: String,
    required: [true, 'Qualification is required'],
  },
  specialization: [{
    type: String,
  }],
  joinDate: {
    type: Date,
    required: [true, 'Join date is required'],
  },
  officeRoom: {
    type: String,
  },
  officeHours: {
    type: String,
  },
  coursesTaught: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  }],
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Visiting'],
    default: 'Full-time',
  },
  profileImage: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Lecturer', lecturerSchema);
