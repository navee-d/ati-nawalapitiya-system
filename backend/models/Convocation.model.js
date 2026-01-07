const mongoose = require('mongoose');

const convocationSchema = new mongoose.Schema({
  serialNo: {
    type: Number,
    required: true,
    unique: true
  },
  yearCompleted: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  nameWithInitials: {
    type: String,
    required: true
  },
  studyMode: {
    type: String,
    enum: ['Full Time', 'Part Time'],
    default: 'Full Time'
  },
  address: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Partial', 'Waived'],
    default: 'Pending'
  },
  examIndexNo: {
    type: String,
    required: true,
    unique: true
  },
  courseCode: {
    type: String,
    required: true
  },
  convocationYear: {
    type: Number,
    default: 2020
  },
  email: {
    type: String
  },
  remarks: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient querying
convocationSchema.index({ yearCompleted: 1, courseCode: 1 });
convocationSchema.index({ examIndexNo: 1 });
convocationSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Convocation', convocationSchema);
