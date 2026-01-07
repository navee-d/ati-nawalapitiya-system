const mongoose = require('mongoose');

const hodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  hodId: {
    type: String,
    required: [true, 'HOD ID is required'],
    unique: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Department is required'],
    unique: true, // One HOD per department
  },
  designation: {
    type: String,
    default: 'Head of Department',
  },
  qualification: {
    type: String,
    required: [true, 'Qualification is required'],
  },
  specialization: [{
    type: String,
  }],
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required'],
  },
  officeRoom: {
    type: String,
  },
  officeHours: {
    type: String,
  },
  responsibilities: [{
    type: String,
  }],
  profileImage: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('HOD', hodSchema);
