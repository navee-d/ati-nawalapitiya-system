const mongoose = require('mongoose');

const examResultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  academicYear: { type: String, required: true }, // e.g., "2024"
  semester: { type: Number, required: true, min: 1, max: 8 }, // 1-8 semesters
  examDate: { type: Date, required: true },
  marks: { type: Number, required: true, min: 0, max: 100 },
  grade: { type: String, required: true }, // A+, A, B+, B, C+, C, D, F
  status: { type: String, enum: ['Pass', 'Fail', 'Absent'], default: 'Pass' },
  remarks: { type: String }
}, { timestamps: true });

// Index for efficient querying
examResultSchema.index({ student: 1, academicYear: 1, semester: 1 });

module.exports = mongoose.model('ExamResult', examResultSchema);
