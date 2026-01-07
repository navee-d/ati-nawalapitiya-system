const ExamResult = require('../models/ExamResult.model');
const Student = require('../models/Student.model');
const Course = require('../models/Course.model');
const XLSX = require('xlsx');

// Get all exam results
exports.getAllExamResults = async (req, res) => {
  try {
    const results = await ExamResult.find()
      .populate('student')
      .populate('course')
      .sort({ academicYear: -1, semester: -1, examDate: -1 });
    res.json(results);
  } catch (error) {
    console.error('Error fetching exam results:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get exam results by student ID
exports.getExamResultsByStudent = async (req, res) => {
  try {
    const results = await ExamResult.find({ student: req.params.studentId })
      .populate('course')
      .sort({ academicYear: -1, semester: -1, examDate: -1 });
    res.json(results);
  } catch (error) {
    console.error('Error fetching student exam results:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create exam result
exports.createExamResult = async (req, res) => {
  try {
    const { student, course, academicYear, semester, examDate, marks, grade, status, remarks } = req.body;

    // Verify student exists
    const studentExists = await Student.findById(student);
    if (!studentExists) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Verify course exists
    const courseExists = await Course.findById(course);
    if (!courseExists) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const result = new ExamResult({
      student,
      course,
      academicYear,
      semester,
      examDate,
      marks,
      grade,
      status,
      remarks
    });

    const savedResult = await result.save();
    const populatedResult = await ExamResult.findById(savedResult._id)
      .populate('student')
      .populate('course');

    res.status(201).json(populatedResult);
  } catch (error) {
    console.error('Error creating exam result:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update exam result
exports.updateExamResult = async (req, res) => {
  try {
    const { student, course, academicYear, semester, examDate, marks, grade, status, remarks } = req.body;

    // Verify references if they are being updated
    if (student) {
      const studentExists = await Student.findById(student);
      if (!studentExists) {
        return res.status(404).json({ message: 'Student not found' });
      }
    }

    if (course) {
      const courseExists = await Course.findById(course);
      if (!courseExists) {
        return res.status(404).json({ message: 'Course not found' });
      }
    }

    const updatedResult = await ExamResult.findByIdAndUpdate(
      req.params.id,
      { student, course, academicYear, semester, examDate, marks, grade, status, remarks },
      { new: true, runValidators: true }
    ).populate('student').populate('course');

    if (!updatedResult) {
      return res.status(404).json({ message: 'Exam result not found' });
    }

    res.json(updatedResult);
  } catch (error) {
    console.error('Error updating exam result:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete exam result
exports.deleteExamResult = async (req, res) => {
  try {
    const result = await ExamResult.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Exam result not found' });
    }
    res.json({ message: 'Exam result deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam result:', error);
    res.status(500).json({ message: error.message });
  }
};

// Helper function to calculate grade and status from marks
const calculateGradeAndStatus = (marks) => {
  let grade, status;
  
  if (marks >= 85) grade = 'A+';
  else if (marks >= 75) grade = 'A';
  else if (marks >= 70) grade = 'B+';
  else if (marks >= 65) grade = 'B';
  else if (marks >= 60) grade = 'C+';
  else if (marks >= 55) grade = 'C';
  else if (marks >= 40) grade = 'D';
  else grade = 'F';
  
  status = marks >= 40 ? 'Pass' : 'Fail';
  
  return { grade, status };
};

// Import exam results from Excel file
exports.importExamResults = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Parse Excel file
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (!data || data.length === 0) {
      return res.status(400).json({ message: 'Excel file is empty' });
    }

    const results = {
      success: [],
      errors: [],
      updated: [],
      created: []
    };

    // Process each row
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        // Expected columns: StudentID, CourseCode, AcademicYear, Semester, ExamDate, Marks, Remarks
        const studentId = row.StudentID || row['Student ID'] || row.studentId;
        const courseCode = row.CourseCode || row['Course Code'] || row.courseCode;
        const academicYear = row.AcademicYear || row['Academic Year'] || row.academicYear;
        const semester = row.Semester || row.semester;
        const examDate = row.ExamDate || row['Exam Date'] || row.examDate;
        const marks = parseFloat(row.Marks || row.marks);
        const remarks = row.Remarks || row.remarks || '';

        // Validate required fields
        if (!studentId) {
          results.errors.push({ row: i + 2, error: 'Student ID is required', data: row });
          continue;
        }
        if (!courseCode) {
          results.errors.push({ row: i + 2, error: 'Course Code is required', data: row });
          continue;
        }
        if (isNaN(marks) || marks < 0 || marks > 100) {
          results.errors.push({ row: i + 2, error: 'Invalid marks (must be 0-100)', data: row });
          continue;
        }

        // Find student by studentId field (not MongoDB _id)
        const student = await Student.findOne({ studentId: studentId }).populate('user');
        if (!student) {
          results.errors.push({ row: i + 2, error: `Student not found: ${studentId}`, data: row });
          continue;
        }

        // Find course by courseCode
        const course = await Course.findOne({ courseCode: courseCode });
        if (!course) {
          results.errors.push({ row: i + 2, error: `Course not found: ${courseCode}`, data: row });
          continue;
        }

        // Calculate grade and status
        const { grade, status } = calculateGradeAndStatus(marks);

        // Parse exam date
        let parsedExamDate = new Date();
        if (examDate) {
          // Handle Excel date serial number or string date
          if (typeof examDate === 'number') {
            // Excel serial date
            parsedExamDate = new Date((examDate - 25569) * 86400 * 1000);
          } else {
            parsedExamDate = new Date(examDate);
          }
        }

        // Check if result already exists for this student/course/year/semester
        const existingResult = await ExamResult.findOne({
          student: student._id,
          course: course._id,
          academicYear: academicYear || new Date().getFullYear().toString(),
          semester: semester || 1
        });

        if (existingResult) {
          // Update existing result
          existingResult.marks = marks;
          existingResult.grade = grade;
          existingResult.status = status;
          existingResult.examDate = parsedExamDate;
          if (remarks) existingResult.remarks = remarks;
          
          await existingResult.save();
          results.updated.push({
            studentId: studentId,
            courseCode: courseCode,
            marks: marks,
            grade: grade,
            status: status
          });
        } else {
          // Create new result
          const newResult = new ExamResult({
            student: student._id,
            course: course._id,
            academicYear: academicYear || new Date().getFullYear().toString(),
            semester: semester || 1,
            examDate: parsedExamDate,
            marks: marks,
            grade: grade,
            status: status,
            remarks: remarks
          });
          
          await newResult.save();
          results.created.push({
            studentId: studentId,
            courseCode: courseCode,
            marks: marks,
            grade: grade,
            status: status
          });
        }

        results.success.push({ row: i + 2, studentId, courseCode, marks, grade, status });
      } catch (error) {
        results.errors.push({ row: i + 2, error: error.message, data: row });
      }
    }

    res.json({
      message: 'Import completed',
      total: data.length,
      successful: results.success.length,
      updated: results.updated.length,
      created: results.created.length,
      failed: results.errors.length,
      details: results
    });
  } catch (error) {
    console.error('Error importing exam results:', error);
    res.status(500).json({ message: 'Failed to import exam results', error: error.message });
  }
};
