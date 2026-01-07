const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  staffId: {
    type: String,
    required: [true, 'Staff ID is required'],
    unique: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
  },
  staffType: {
    type: String,
    enum: ['Administrative', 'Technical', 'Support', 'Maintenance', 'Library', 'IT'],
    required: [true, 'Staff type is required'],
  },
  joinDate: {
    type: Date,
    required: [true, 'Join date is required'],
  },
  officeRoom: {
    type: String,
  },
  workingHours: {
    type: String,
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract'],
    default: 'Full-time',
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

module.exports = mongoose.model('Staff', staffSchema);
