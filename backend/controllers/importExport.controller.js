const XLSX = require('xlsx');
const PDFDocument = require('pdfkit');
const Student = require('../models/Student.model');
const Lecturer = require('../models/Lecturer.model');
const HOD = require('../models/HOD.model');
const Staff = require('../models/Staff.model');
const User = require('../models/User.model');
const Department = require('../models/Department.model');
const Course = require('../models/Course.model');
const bcrypt = require('bcryptjs');

// Helper function to get model based on entity type
const getModel = (entityType) => {
  const models = {
    students: Student,
    lecturers: Lecturer,
    hod: HOD,
    staff: Staff
  };
  return models[entityType];
};

// Import data from Excel
exports.importData = async (req, res) => {
  try {
    const { entityType } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!entityType || !['students', 'lecturers', 'hod', 'staff'].includes(entityType)) {
      return res.status(400).json({ message: 'Invalid entity type' });
    }

    // Parse Excel file
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Parse with raw: false to get formatted values
    const data = XLSX.utils.sheet_to_json(worksheet, { 
      raw: false,
      defval: '',
      blankrows: false
    });

    if (!data || data.length === 0) {
      return res.status(400).json({ message: 'Excel file is empty or has no data rows' });
    }

    // Log the columns found in the Excel file for debugging
    const columns = Object.keys(data[0] || {});
    console.log('Columns found in Excel file:', columns);
    console.log('First row sample:', JSON.stringify(data[0]));

    const results = {
      success: [],
      errors: [],
      updated: [],
      created: [],
      columnsFound: columns // Include columns in response
    };

    // Process each row based on entity type
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        switch (entityType) {
          case 'students':
            await processStudentRow(row, i, results);
            break;
          case 'lecturers':
            await processLecturerRow(row, i, results);
            break;
          case 'hod':
            await processHODRow(row, i, results);
            break;
          case 'staff':
            await processStaffRow(row, i, results);
            break;
        }
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
    console.error('Error importing data:', error);
    res.status(500).json({ message: 'Failed to import data', error: error.message });
  }
};

// Helper function to get value from row with flexible column naming
function getRowValue(row, ...keys) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
      // Trim whitespace if it's a string
      return typeof row[key] === 'string' ? row[key].trim() : row[key];
    }
  }
  // Try case-insensitive match with special character removal
  const rowKeys = Object.keys(row);
  for (const key of keys) {
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    const found = rowKeys.find(k => {
      const normalizedRowKey = k.toLowerCase().replace(/[^a-z0-9]/g, '');
      return normalizedRowKey === normalizedKey;
    });
    if (found && row[found] !== undefined && row[found] !== null && row[found] !== '') {
      // Trim whitespace if it's a string
      return typeof row[found] === 'string' ? row[found].trim() : row[found];
    }
  }
  return undefined;
}

// Process Student Row
async function processStudentRow(row, index, results) {
  const studentId = getRowValue(row, 'StudentID', 'Student ID', 'studentId', 'student_id', 'STUDENT ID', 'Student Id');
  const firstName = getRowValue(row, 'FirstName', 'First Name', 'firstName', 'first_name', 'FIRST NAME', 'First name');
  const lastName = getRowValue(row, 'LastName', 'Last Name', 'lastName', 'last_name', 'LAST NAME', 'Last name');
  const email = getRowValue(row, 'Email', 'email', 'EMAIL', 'E-mail', 'e-mail');
  const phone = getRowValue(row, 'Phone', 'phone', 'PHONE', 'Phone Number', 'phone_number', 'Contact');
  const regNumber = getRowValue(row, 'RegistrationNumber', 'Registration Number', 'registrationNumber', 'registration_number', 'RegNumber', 'Reg Number', 'Registration No', 'Reg No');
  const courseCode = getRowValue(row, 'CourseCode', 'Course Code', 'courseCode', 'course_code', 'Course');
  const departmentName = getRowValue(row, 'Department', 'department', 'DEPARTMENT', 'Dept', 'dept');
  const batch = getRowValue(row, 'Batch', 'batch', 'BATCH', 'Year');
  const yearOfStudy = parseInt(getRowValue(row, 'YearOfStudy', 'Year of Study', 'yearOfStudy', 'year_of_study', 'Year', 'Level') || 1);
  const semester = parseInt(getRowValue(row, 'Semester', 'semester', 'SEMESTER', 'Sem') || 1);
  const enrollmentDate = getRowValue(row, 'EnrollmentDate', 'Enrollment Date', 'enrollmentDate', 'enrollment_date', 'Date of Enrollment', 'Enrollment') || new Date();

  // Validate required fields
  if (!studentId || !firstName || !lastName || !email) {
    const missing = [];
    if (!studentId) missing.push('StudentID');
    if (!firstName) missing.push('FirstName');
    if (!lastName) missing.push('LastName');
    if (!email) missing.push('Email');
    
    // Show what columns are available for debugging
    const availableColumns = Object.keys(row).join(', ');
    throw new Error(`Missing required fields: ${missing.join(', ')}. Available columns: ${availableColumns}`);
  }

  // Find course and department
  let course, department;
  
  if (courseCode) {
    course = await Course.findOne({ courseCode });
    if (!course) throw new Error(`Course not found: ${courseCode}`);
  }
  
  if (departmentName) {
    department = await Department.findOne({ name: departmentName });
    if (!department) throw new Error(`Department not found: ${departmentName}`);
  }

  // Check if student exists
  let student = await Student.findOne({ studentId });
  let user;

  if (student) {
    // Update existing student
    user = await User.findById(student.user);
    if (user) {
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      if (phone) user.phone = phone;
      await user.save();
    }

    student.registrationNumber = regNumber || student.registrationNumber;
    if (course) student.course = course._id;
    if (department) student.department = department._id;
    if (batch) student.batch = batch;
    student.yearOfStudy = yearOfStudy;
    student.semester = semester;
    
    await student.save();
    results.updated.push({ studentId, name: `${firstName} ${lastName}` });
  } else {
    // Create new student
    // Check if user with email exists
    user = await User.findOne({ email });
    
    if (!user) {
      const defaultPassword = await bcrypt.hash('student123', 10);
      user = new User({
        firstName,
        lastName,
        email,
        phone: phone || '',
        password: defaultPassword,
        role: 'student'
      });
      await user.save();
    }

    student = new Student({
      user: user._id,
      studentId,
      registrationNumber: regNumber || studentId,
      course: course ? course._id : undefined,
      department: department ? department._id : undefined,
      batch: batch || new Date().getFullYear().toString(),
      yearOfStudy,
      semester,
      enrollmentDate: new Date(enrollmentDate)
    });

    await student.save();
    results.created.push({ studentId, name: `${firstName} ${lastName}` });
  }

  results.success.push({ row: index + 2, studentId, name: `${firstName} ${lastName}` });
}

// Process Lecturer Row
async function processLecturerRow(row, index, results) {
  const lecturerId = getRowValue(row, 'LecturerID', 'Lecturer ID', 'lecturerId', 'lecturer_id', 'EmployeeID', 'Employee ID', 'employeeId');
  const firstName = getRowValue(row, 'FirstName', 'First Name', 'firstName', 'first_name', 'FIRST NAME');
  const lastName = getRowValue(row, 'LastName', 'Last Name', 'lastName', 'last_name', 'LAST NAME');
  const email = getRowValue(row, 'Email', 'email', 'EMAIL', 'E-mail');
  const phone = getRowValue(row, 'Phone', 'phone', 'PHONE', 'Phone Number', 'Contact');
  const employeeId = lecturerId || getRowValue(row, 'EmployeeID', 'Employee ID', 'employeeId', 'employee_id');
  const departmentName = getRowValue(row, 'Department', 'department', 'DEPARTMENT', 'Dept');
  const qualification = getRowValue(row, 'Qualification', 'qualification', 'QUALIFICATION', 'Degree');
  const specialization = getRowValue(row, 'Specialization', 'specialization', 'SPECIALIZATION', 'Specialty', 'Field');
  const experience = parseInt(getRowValue(row, 'Experience', 'experience', 'EXPERIENCE', 'Years of Experience', 'Exp') || 0);

  // Validate required fields
  if (!employeeId || !firstName || !lastName || !email) {
    throw new Error('Missing required fields: EmployeeID, FirstName, LastName, Email');
  }

  // Find department
  let department;
  if (departmentName) {
    department = await Department.findOne({ name: departmentName });
    if (!department) throw new Error(`Department not found: ${departmentName}`);
  }

  // Check if lecturer exists
  let lecturer = await Lecturer.findOne({ employeeId });
  let user;

  if (lecturer) {
    // Update existing lecturer
    user = await User.findById(lecturer.user);
    if (user) {
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      if (phone) user.phone = phone;
      await user.save();
    }

    if (department) lecturer.department = department._id;
    if (qualification) lecturer.qualification = qualification;
    if (specialization) lecturer.specialization = specialization;
    lecturer.yearsOfExperience = experience;
    
    await lecturer.save();
    results.updated.push({ employeeId, name: `${firstName} ${lastName}` });
  } else {
    // Create new lecturer
    user = await User.findOne({ email });
    
    if (!user) {
      const defaultPassword = await bcrypt.hash('lecturer123', 10);
      user = new User({
        firstName,
        lastName,
        email,
        phone: phone || '',
        password: defaultPassword,
        role: 'lecturer'
      });
      await user.save();
    }

    lecturer = new Lecturer({
      user: user._id,
      employeeId,
      department: department ? department._id : undefined,
      qualification: qualification || 'BSc',
      specialization: specialization || 'General',
      yearsOfExperience: experience
    });

    await lecturer.save();
    results.created.push({ employeeId, name: `${firstName} ${lastName}` });
  }

  results.success.push({ row: index + 2, employeeId, name: `${firstName} ${lastName}` });
}

// Process HOD Row
async function processHODRow(row, index, results) {
  const employeeId = getRowValue(row, 'EmployeeID', 'Employee ID', 'employeeId', 'employee_id', 'EMPLOYEE ID');
  const firstName = getRowValue(row, 'FirstName', 'First Name', 'firstName', 'first_name', 'FIRST NAME');
  const lastName = getRowValue(row, 'LastName', 'Last Name', 'lastName', 'last_name', 'LAST NAME');
  const email = getRowValue(row, 'Email', 'email', 'EMAIL', 'E-mail');
  const phone = getRowValue(row, 'Phone', 'phone', 'PHONE', 'Phone Number', 'Contact');
  const departmentName = getRowValue(row, 'Department', 'department', 'DEPARTMENT', 'Dept');
  const qualification = getRowValue(row, 'Qualification', 'qualification', 'QUALIFICATION', 'Degree');
  const specialization = getRowValue(row, 'Specialization', 'specialization', 'SPECIALIZATION', 'Specialty');

  // Validate required fields
  if (!employeeId || !firstName || !lastName || !email || !departmentName) {
    throw new Error('Missing required fields: EmployeeID, FirstName, LastName, Email, Department');
  }

  // Find department
  const department = await Department.findOne({ name: departmentName });
  if (!department) throw new Error(`Department not found: ${departmentName}`);

  // Check if HOD exists
  let hod = await HOD.findOne({ employeeId });
  let user;

  if (hod) {
    // Update existing HOD
    user = await User.findById(hod.user);
    if (user) {
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      if (phone) user.phone = phone;
      await user.save();
    }

    hod.department = department._id;
    if (qualification) hod.qualification = qualification;
    if (specialization) hod.specialization = specialization;
    
    await hod.save();
    results.updated.push({ employeeId, name: `${firstName} ${lastName}` });
  } else {
    // Create new HOD
    user = await User.findOne({ email });
    
    if (!user) {
      const defaultPassword = await bcrypt.hash('hod123', 10);
      user = new User({
        firstName,
        lastName,
        email,
        phone: phone || '',
        password: defaultPassword,
        role: 'hod'
      });
      await user.save();
    }

    hod = new HOD({
      user: user._id,
      employeeId,
      department: department._id,
      qualification: qualification || 'MSc',
      specialization: specialization || 'General'
    });

    await hod.save();
    results.created.push({ employeeId, name: `${firstName} ${lastName}` });
  }

  results.success.push({ row: index + 2, employeeId, name: `${firstName} ${lastName}` });
}

// Process Staff Row
async function processStaffRow(row, index, results) {
  const employeeId = getRowValue(row, 'EmployeeID', 'Employee ID', 'employeeId', 'employee_id', 'EMPLOYEE ID', 'StaffID', 'Staff ID');
  const firstName = getRowValue(row, 'FirstName', 'First Name', 'firstName', 'first_name', 'FIRST NAME');
  const lastName = getRowValue(row, 'LastName', 'Last Name', 'lastName', 'last_name', 'LAST NAME');
  const email = getRowValue(row, 'Email', 'email', 'EMAIL', 'E-mail');
  const phone = getRowValue(row, 'Phone', 'phone', 'PHONE', 'Phone Number', 'Contact');
  const departmentName = getRowValue(row, 'Department', 'department', 'DEPARTMENT', 'Dept');
  const position = getRowValue(row, 'Position', 'position', 'POSITION', 'Job Title', 'Title');
  const staffType = getRowValue(row, 'StaffType', 'Staff Type', 'staffType', 'staff_type', 'Type') || 'Administrative';

  // Validate required fields
  if (!employeeId || !firstName || !lastName || !email) {
    throw new Error('Missing required fields: EmployeeID, FirstName, LastName, Email');
  }

  // Find department
  let department;
  if (departmentName) {
    department = await Department.findOne({ name: departmentName });
    if (!department) throw new Error(`Department not found: ${departmentName}`);
  }

  // Check if staff exists
  let staff = await Staff.findOne({ employeeId });
  let user;

  if (staff) {
    // Update existing staff
    user = await User.findById(staff.user);
    if (user) {
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      if (phone) user.phone = phone;
      await user.save();
    }

    if (department) staff.department = department._id;
    if (position) staff.position = position;
    staff.staffType = staffType;
    
    await staff.save();
    results.updated.push({ employeeId, name: `${firstName} ${lastName}` });
  } else {
    // Create new staff
    user = await User.findOne({ email });
    
    if (!user) {
      const defaultPassword = await bcrypt.hash('staff123', 10);
      user = new User({
        firstName,
        lastName,
        email,
        phone: phone || '',
        password: defaultPassword,
        role: 'staff'
      });
      await user.save();
    }

    staff = new Staff({
      user: user._id,
      employeeId,
      department: department ? department._id : undefined,
      position: position || 'Staff Member',
      staffType
    });

    await staff.save();
    results.created.push({ employeeId, name: `${firstName} ${lastName}` });
  }

  results.success.push({ row: index + 2, employeeId, name: `${firstName} ${lastName}` });
}

// Export data to Excel
exports.exportExcel = async (req, res) => {
  try {
    const { entityType } = req.query;

    if (!entityType || !['students', 'lecturers', 'hod', 'staff'].includes(entityType)) {
      return res.status(400).json({ message: 'Invalid entity type' });
    }

    let data = [];
    
    switch (entityType) {
      case 'students':
        const students = await Student.find()
          .populate('user')
          .populate('course')
          .populate('department');
        data = students.map(s => ({
          'Student ID': s.studentId,
          'Registration Number': s.registrationNumber,
          'First Name': s.user?.firstName || '',
          'Last Name': s.user?.lastName || '',
          'Email': s.user?.email || '',
          'Phone': s.user?.phone || '',
          'Department': s.department?.name || '',
          'Course Code': s.course?.courseCode || '',
          'Course Name': s.course?.courseName || '',
          'Batch': s.batch,
          'Year of Study': s.yearOfStudy,
          'Semester': s.semester,
          'Academic Status': s.academicStatus,
          'GPA': s.gpa,
          'Attendance': s.attendance,
          'Enrollment Date': s.enrollmentDate ? new Date(s.enrollmentDate).toLocaleDateString() : ''
        }));
        break;

      case 'lecturers':
        const lecturers = await Lecturer.find()
          .populate('user')
          .populate('department');
        data = lecturers.map(l => ({
          'Employee ID': l.employeeId,
          'First Name': l.user?.firstName || '',
          'Last Name': l.user?.lastName || '',
          'Email': l.user?.email || '',
          'Phone': l.user?.phone || '',
          'Department': l.department?.name || '',
          'Qualification': l.qualification,
          'Specialization': l.specialization,
          'Experience (Years)': l.yearsOfExperience,
          'Office Location': l.officeLocation || ''
        }));
        break;

      case 'hod':
        const hods = await HOD.find()
          .populate('user')
          .populate('department');
        data = hods.map(h => ({
          'Employee ID': h.employeeId,
          'First Name': h.user?.firstName || '',
          'Last Name': h.user?.lastName || '',
          'Email': h.user?.email || '',
          'Phone': h.user?.phone || '',
          'Department': h.department?.name || '',
          'Qualification': h.qualification,
          'Specialization': h.specialization,
          'Appointment Date': h.appointmentDate ? new Date(h.appointmentDate).toLocaleDateString() : ''
        }));
        break;

      case 'staff':
        const staffMembers = await Staff.find()
          .populate('user')
          .populate('department');
        data = staffMembers.map(s => ({
          'Employee ID': s.employeeId,
          'First Name': s.user?.firstName || '',
          'Last Name': s.user?.lastName || '',
          'Email': s.user?.email || '',
          'Phone': s.user?.phone || '',
          'Department': s.department?.name || '',
          'Position': s.position,
          'Staff Type': s.staffType,
          'Join Date': s.joinDate ? new Date(s.joinDate).toLocaleDateString() : ''
        }));
        break;
    }

    // Create workbook
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, entityType);

    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Set headers
    res.setHeader('Content-Disposition', `attachment; filename=${entityType}_${Date.now()}.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    res.send(buffer);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    res.status(500).json({ message: 'Failed to export data', error: error.message });
  }
};

// Export data to PDF
exports.exportPDF = async (req, res) => {
  try {
    const { entityType } = req.query;

    if (!entityType || !['students', 'lecturers', 'hod', 'staff'].includes(entityType)) {
      return res.status(400).json({ message: 'Invalid entity type' });
    }

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${entityType}_${Date.now()}.pdf`);
    
    doc.pipe(res);

    // Add header
    doc.fontSize(20).text(`${entityType.toUpperCase()} REPORT`, { align: 'center' });
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown();

    let data = [];
    
    switch (entityType) {
      case 'students':
        const students = await Student.find()
          .populate('user')
          .populate('course')
          .populate('department')
          .limit(100); // Limit for PDF

        doc.fontSize(12).text('Students List', { underline: true });
        doc.moveDown(0.5);

        students.forEach((s, index) => {
          if (doc.y > 700) doc.addPage();
          
          doc.fontSize(10);
          doc.text(`${index + 1}. ${s.studentId} - ${s.user?.firstName} ${s.user?.lastName}`);
          doc.fontSize(8);
          doc.text(`   Email: ${s.user?.email} | Dept: ${s.department?.name || 'N/A'} | Batch: ${s.batch}`);
          doc.text(`   Course: ${s.course?.courseCode} - ${s.course?.courseName || 'N/A'}`);
          doc.moveDown(0.3);
        });
        break;

      case 'lecturers':
        const lecturers = await Lecturer.find()
          .populate('user')
          .populate('department')
          .limit(100);

        doc.fontSize(12).text('Lecturers List', { underline: true });
        doc.moveDown(0.5);

        lecturers.forEach((l, index) => {
          if (doc.y > 700) doc.addPage();
          
          doc.fontSize(10);
          doc.text(`${index + 1}. ${l.employeeId} - ${l.user?.firstName} ${l.user?.lastName}`);
          doc.fontSize(8);
          doc.text(`   Email: ${l.user?.email} | Dept: ${l.department?.name || 'N/A'}`);
          doc.text(`   Qualification: ${l.qualification} | Specialization: ${l.specialization}`);
          doc.moveDown(0.3);
        });
        break;

      case 'hod':
        const hods = await HOD.find()
          .populate('user')
          .populate('department');

        doc.fontSize(12).text('Heads of Department', { underline: true });
        doc.moveDown(0.5);

        hods.forEach((h, index) => {
          if (doc.y > 700) doc.addPage();
          
          doc.fontSize(10);
          doc.text(`${index + 1}. ${h.employeeId} - ${h.user?.firstName} ${h.user?.lastName}`);
          doc.fontSize(8);
          doc.text(`   Email: ${h.user?.email} | Department: ${h.department?.name || 'N/A'}`);
          doc.text(`   Qualification: ${h.qualification} | Specialization: ${h.specialization}`);
          doc.moveDown(0.3);
        });
        break;

      case 'staff':
        const staffMembers = await Staff.find()
          .populate('user')
          .populate('department')
          .limit(100);

        doc.fontSize(12).text('Staff Members List', { underline: true });
        doc.moveDown(0.5);

        staffMembers.forEach((s, index) => {
          if (doc.y > 700) doc.addPage();
          
          doc.fontSize(10);
          doc.text(`${index + 1}. ${s.employeeId} - ${s.user?.firstName} ${s.user?.lastName}`);
          doc.fontSize(8);
          doc.text(`   Email: ${s.user?.email} | Dept: ${s.department?.name || 'N/A'}`);
          doc.text(`   Position: ${s.position} | Type: ${s.staffType}`);
          doc.moveDown(0.3);
        });
        break;
    }

    doc.end();
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    res.status(500).json({ message: 'Failed to export PDF', error: error.message });
  }
};
