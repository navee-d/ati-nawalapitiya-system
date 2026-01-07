const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';
let createdIds = {
  department: null,
  course: null,
  student: null,
  lecturer: null,
  hod: null,
  staff: null,
  timetable: null,
  convocation: null
};

// Helper function to make API calls
async function apiCall(method, endpoint, data = null, token = null) {
  const config = {
    method,
    url: `${BASE_URL}${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    ...(data && { data })
  };

  try {
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      status: error.response?.status
    };
  }
}

// Test runner helper
function logTest(module, operation, result) {
  const status = result.success ? '✅' : '❌';
  console.log(`${status} ${module} - ${operation}: ${result.success ? 'SUCCESS' : result.error}`);
  return result.success;
}

async function runTests() {
  console.log('\n========================================');
  console.log('   ATI NAWALAPITIYA CRUD TESTS');
  console.log('========================================\n');

  // ==================== AUTHENTICATION ====================
  console.log('🔐 AUTHENTICATION TESTS\n');

  // Login
  const loginResult = await apiCall('POST', '/auth/login', {
    email: 'admin@ati.lk',
    password: 'admin123'
  });
  
  if (!logTest('Auth', 'Login', loginResult)) {
    console.log('\n❌ Authentication failed. Cannot proceed with tests.');
    console.log('Please make sure:');
    console.log('1. Server is running on port 5000');
    console.log('2. Database is seeded with admin user (run: node backend/scripts/seed.js)');
    return;
  }
  
  authToken = loginResult.data.token;
  console.log('Token acquired:', authToken.substring(0, 20) + '...\n');

  // Get current user
  const meResult = await apiCall('GET', '/auth/me', null, authToken);
  logTest('Auth', 'Get Current User', meResult);

  // ==================== DEPARTMENTS ====================
  console.log('\n📂 DEPARTMENT CRUD TESTS\n');

  // Create Department
  const createDeptResult = await apiCall('POST', '/departments', {
    name: 'Test Information Technology',
    code: 'TEST-IT',
    description: 'Test Department of Information Technology',
    establishedYear: 2024,
    building: 'Building A',
    officePhone: '0352222111',
    email: 'test-it@ati.lk'
  }, authToken);
  
  if (logTest('Department', 'Create', createDeptResult)) {
    createdIds.department = createDeptResult.data._id || createDeptResult.data.id;
  }

  // Read All Departments
  const readAllDeptResult = await apiCall('GET', '/departments', null, authToken);
  logTest('Department', 'Read All', readAllDeptResult);

  // Read Single Department
  if (createdIds.department) {
    const readOneDeptResult = await apiCall('GET', `/departments/${createdIds.department}`, null, authToken);
    logTest('Department', 'Read One', readOneDeptResult);
  }

  // Update Department
  if (createdIds.department) {
    const updateDeptResult = await apiCall('PUT', `/departments/${createdIds.department}`, {
      building: 'Building B',
      officePhone: '0352222999'
    }, authToken);
    logTest('Department', 'Update', updateDeptResult);
  }

  // ==================== COURSES ====================
  console.log('\n📚 COURSE CRUD TESTS\n');

  // Create Course
  if (createdIds.department) {
    const createCourseResult = await apiCall('POST', '/courses', {
      courseCode: 'TEST101',
      courseName: 'Test Introduction to Programming',
      department: createdIds.department,
      credits: 3,
      semester: 1,
      year: 1,
      description: 'Test course for CRUD operations',
      courseType: 'Core'
    }, authToken);
    
    if (logTest('Course', 'Create', createCourseResult)) {
      createdIds.course = createCourseResult.data._id || createCourseResult.data.id;
    }
  }

  // Read All Courses
  const readAllCoursesResult = await apiCall('GET', '/courses', null, authToken);
  logTest('Course', 'Read All', readAllCoursesResult);

  // Read Single Course
  if (createdIds.course) {
    const readOneCourseResult = await apiCall('GET', `/courses/${createdIds.course}`, null, authToken);
    logTest('Course', 'Read One', readOneCourseResult);
  }

  // Read Courses by Department
  if (createdIds.department) {
    const readCoursesByDeptResult = await apiCall('GET', `/courses/department/${createdIds.department}`, null, authToken);
    logTest('Course', 'Read by Department', readCoursesByDeptResult);
  }

  // Update Course
  if (createdIds.course) {
    const updateCourseResult = await apiCall('PUT', `/courses/${createdIds.course}`, {
      credits: 4,
      description: 'Updated test course description'
    }, authToken);
    logTest('Course', 'Update', updateCourseResult);
  }

  // ==================== STUDENTS ====================
  console.log('\n👨‍🎓 STUDENT CRUD TESTS\n');

  // Create Student
  if (createdIds.department && createdIds.course) {
    const createStudentResult = await apiCall('POST', '/students', {
      username: 'teststudent001',
      email: 'teststudent001@ati.lk',
      password: 'student123',
      firstName: 'Test',
      lastName: 'Student',
      nic: '199812345678',
      phone: '0771234567',
      address: 'Test Address, Sri Lanka',
      studentId: 'TESTSTU001',
      registrationNumber: '2024/TEST/001',
      course: createdIds.course,
      department: createdIds.department,
      batch: '2024',
      yearOfStudy: 1,
      semester: 1,
      enrollmentDate: '2024-01-15',
      guardianName: 'Test Guardian',
      guardianPhone: '0777654321',
      emergencyContact: '0777654321'
    }, authToken);
    
    if (logTest('Student', 'Create', createStudentResult)) {
      createdIds.student = createStudentResult.data._id || createStudentResult.data.id;
    }
  }

  // Read All Students
  const readAllStudentsResult = await apiCall('GET', '/students', null, authToken);
  logTest('Student', 'Read All', readAllStudentsResult);

  // Read Single Student
  if (createdIds.student) {
    const readOneStudentResult = await apiCall('GET', `/students/${createdIds.student}`, null, authToken);
    logTest('Student', 'Read One', readOneStudentResult);
  }

  // Read Students by Department
  if (createdIds.department) {
    const readStudentsByDeptResult = await apiCall('GET', `/students/department/${createdIds.department}`, null, authToken);
    logTest('Student', 'Read by Department', readStudentsByDeptResult);
  }

  // Update Student
  if (createdIds.student) {
    const updateStudentResult = await apiCall('PUT', `/students/${createdIds.student}`, {
      yearOfStudy: 2,
      semester: 3,
      gpa: 3.5
    }, authToken);
    logTest('Student', 'Update', updateStudentResult);
  }

  // ==================== LECTURERS ====================
  console.log('\n👨‍🏫 LECTURER CRUD TESTS\n');

  // Create Lecturer
  if (createdIds.department) {
    const createLecturerResult = await apiCall('POST', '/lecturers', {
      username: 'testlecturer001',
      email: 'testlecturer001@ati.lk',
      password: 'lecturer123',
      firstName: 'Test',
      lastName: 'Lecturer',
      nic: '198512345678',
      phone: '0771234567',
      address: 'Test Address, Sri Lanka',
      lecturerId: 'TESTLEC001',
      department: createdIds.department,
      designation: 'Senior Lecturer',
      qualification: 'PhD in Computer Science',
      specialization: ['Testing', 'Quality Assurance'],
      joinDate: '2024-01-15',
      officeRoom: 'TEST101',
      officeHours: 'Mon-Fri 2PM-4PM',
      employmentType: 'Full-time'
    }, authToken);
    
    if (logTest('Lecturer', 'Create', createLecturerResult)) {
      createdIds.lecturer = createLecturerResult.data._id || createLecturerResult.data.id;
    }
  }

  // Read All Lecturers
  const readAllLecturersResult = await apiCall('GET', '/lecturers', null, authToken);
  logTest('Lecturer', 'Read All', readAllLecturersResult);

  // Read Single Lecturer
  if (createdIds.lecturer) {
    const readOneLecturerResult = await apiCall('GET', `/lecturers/${createdIds.lecturer}`, null, authToken);
    logTest('Lecturer', 'Read One', readOneLecturerResult);
  }

  // Read Lecturers by Department
  if (createdIds.department) {
    const readLecturersByDeptResult = await apiCall('GET', `/lecturers/department/${createdIds.department}`, null, authToken);
    logTest('Lecturer', 'Read by Department', readLecturersByDeptResult);
  }

  // Update Lecturer
  if (createdIds.lecturer) {
    const updateLecturerResult = await apiCall('PUT', `/lecturers/${createdIds.lecturer}`, {
      designation: 'Professor',
      officeRoom: 'TEST201'
    }, authToken);
    logTest('Lecturer', 'Update', updateLecturerResult);
  }

  // ==================== HODs ====================
  console.log('\n👔 HOD CRUD TESTS\n');

  // Create HOD
  if (createdIds.department) {
    const createHODResult = await apiCall('POST', '/hods', {
      username: 'testhod001',
      email: 'testhod001@ati.lk',
      password: 'hod123',
      firstName: 'Test',
      lastName: 'HOD',
      nic: '197512345678',
      phone: '0771234567',
      address: 'Test Address, Sri Lanka',
      hodId: 'TESTHOD001',
      department: createdIds.department,
      qualification: 'PhD in Information Technology',
      specialization: ['Management', 'Leadership'],
      appointmentDate: '2024-01-15',
      previousPositions: ['Senior Lecturer'],
      officeRoom: 'TEST301',
      officeHours: 'Mon-Fri 9AM-11AM'
    }, authToken);
    
    if (logTest('HOD', 'Create', createHODResult)) {
      createdIds.hod = createHODResult.data._id || createHODResult.data.id;
    }
  }

  // Read All HODs
  const readAllHODsResult = await apiCall('GET', '/hods', null, authToken);
  logTest('HOD', 'Read All', readAllHODsResult);

  // Read Single HOD
  if (createdIds.hod) {
    const readOneHODResult = await apiCall('GET', `/hods/${createdIds.hod}`, null, authToken);
    logTest('HOD', 'Read One', readOneHODResult);
  }

  // Read HODs by Department
  if (createdIds.department) {
    const readHODsByDeptResult = await apiCall('GET', `/hods/department/${createdIds.department}`, null, authToken);
    logTest('HOD', 'Read by Department', readHODsByDeptResult);
  }

  // Update HOD
  if (createdIds.hod) {
    const updateHODResult = await apiCall('PUT', `/hods/${createdIds.hod}`, {
      officeRoom: 'TEST401'
    }, authToken);
    logTest('HOD', 'Update', updateHODResult);
  }

  // ==================== STAFF ====================
  console.log('\n👨‍💼 STAFF CRUD TESTS\n');

  // Create Staff
  if (createdIds.department) {
    const createStaffResult = await apiCall('POST', '/staff', {
      username: 'teststaff001',
      email: 'teststaff001@ati.lk',
      password: 'staff123',
      firstName: 'Test',
      lastName: 'Staff',
      nic: '199012345678',
      phone: '0771234567',
      address: 'Test Address, Sri Lanka',
      staffId: 'TESTSTAFF001',
      department: createdIds.department,
      designation: 'Administrative Officer',
      jobTitle: 'Test Administrator',
      joinDate: '2024-01-15',
      employmentType: 'Full-time',
      workingHours: 'Mon-Fri 8AM-5PM',
      responsibilities: ['Testing', 'Documentation']
    }, authToken);
    
    if (logTest('Staff', 'Create', createStaffResult)) {
      createdIds.staff = createStaffResult.data._id || createStaffResult.data.id;
    }
  }

  // Read All Staff
  const readAllStaffResult = await apiCall('GET', '/staff', null, authToken);
  logTest('Staff', 'Read All', readAllStaffResult);

  // Read Single Staff
  if (createdIds.staff) {
    const readOneStaffResult = await apiCall('GET', `/staff/${createdIds.staff}`, null, authToken);
    logTest('Staff', 'Read One', readOneStaffResult);
  }

  // Read Staff by Department
  if (createdIds.department) {
    const readStaffByDeptResult = await apiCall('GET', `/staff/department/${createdIds.department}`, null, authToken);
    logTest('Staff', 'Read by Department', readStaffByDeptResult);
  }

  // Update Staff
  if (createdIds.staff) {
    const updateStaffResult = await apiCall('PUT', `/staff/${createdIds.staff}`, {
      designation: 'Senior Administrative Officer'
    }, authToken);
    logTest('Staff', 'Update', updateStaffResult);
  }

  // ==================== TIMETABLE ====================
  console.log('\n📅 TIMETABLE CRUD TESTS\n');

  // Create Timetable
  if (createdIds.course && createdIds.lecturer && createdIds.department) {
    const createTimetableResult = await apiCall('POST', '/timetable', {
      course: createdIds.course,
      lecturer: createdIds.lecturer,
      department: createdIds.department,
      dayOfWeek: 'Monday',
      startTime: '09:00',
      endTime: '11:00',
      room: 'TEST-ROOM-101',
      semester: 1,
      year: 1,
      academicYear: '2024',
      sessionType: 'Lecture'
    }, authToken);
    
    if (logTest('Timetable', 'Create', createTimetableResult)) {
      createdIds.timetable = createTimetableResult.data._id || createTimetableResult.data.id;
    }
  }

  // Read All Timetables
  const readAllTimetablesResult = await apiCall('GET', '/timetable', null, authToken);
  logTest('Timetable', 'Read All', readAllTimetablesResult);

  // Read Single Timetable
  if (createdIds.timetable) {
    const readOneTimetableResult = await apiCall('GET', `/timetable/${createdIds.timetable}`, null, authToken);
    logTest('Timetable', 'Read One', readOneTimetableResult);
  }

  // Read Timetables by Department
  if (createdIds.department) {
    const readTimetablesByDeptResult = await apiCall('GET', `/timetable/department/${createdIds.department}`, null, authToken);
    logTest('Timetable', 'Read by Department', readTimetablesByDeptResult);
  }

  // Update Timetable
  if (createdIds.timetable) {
    const updateTimetableResult = await apiCall('PUT', `/timetable/${createdIds.timetable}`, {
      room: 'TEST-ROOM-201',
      startTime: '10:00'
    }, authToken);
    logTest('Timetable', 'Update', updateTimetableResult);
  }

  // ==================== CONVOCATION ====================
  console.log('\n🎓 CONVOCATION CRUD TESTS\n');

  // Create Convocation
  if (createdIds.department) {
    const createConvocationResult = await apiCall('POST', '/convocation', {
      title: 'Test Convocation 2024',
      date: '2024-12-15',
      time: '10:00',
      venue: 'Test Main Hall',
      description: 'Test Annual Convocation Ceremony',
      department: createdIds.department,
      batch: '2024',
      chiefGuest: 'Test Chief Guest',
      dresscode: 'Formal'
    }, authToken);
    
    if (logTest('Convocation', 'Create', createConvocationResult)) {
      createdIds.convocation = createConvocationResult.data._id || createConvocationResult.data.id;
    }
  }

  // Read All Convocations
  const readAllConvocationsResult = await apiCall('GET', '/convocation', null, authToken);
  logTest('Convocation', 'Read All', readAllConvocationsResult);

  // Read Single Convocation
  if (createdIds.convocation) {
    const readOneConvocationResult = await apiCall('GET', `/convocation/${createdIds.convocation}`, null, authToken);
    logTest('Convocation', 'Read One', readOneConvocationResult);
  }

  // Update Convocation
  if (createdIds.convocation) {
    const updateConvocationResult = await apiCall('PUT', `/convocation/${createdIds.convocation}`, {
      venue: 'Test Grand Hall',
      chiefGuest: 'Updated Chief Guest'
    }, authToken);
    logTest('Convocation', 'Update', updateConvocationResult);
  }

  // ==================== DELETE OPERATIONS ====================
  console.log('\n🗑️  DELETE OPERATIONS\n');

  // Delete Timetable
  if (createdIds.timetable) {
    const deleteTimetableResult = await apiCall('DELETE', `/timetable/${createdIds.timetable}`, null, authToken);
    logTest('Timetable', 'Delete', deleteTimetableResult);
  }

  // Delete Convocation
  if (createdIds.convocation) {
    const deleteConvocationResult = await apiCall('DELETE', `/convocation/${createdIds.convocation}`, null, authToken);
    logTest('Convocation', 'Delete', deleteConvocationResult);
  }

  // Delete Student
  if (createdIds.student) {
    const deleteStudentResult = await apiCall('DELETE', `/students/${createdIds.student}`, null, authToken);
    logTest('Student', 'Delete', deleteStudentResult);
  }

  // Delete Staff
  if (createdIds.staff) {
    const deleteStaffResult = await apiCall('DELETE', `/staff/${createdIds.staff}`, null, authToken);
    logTest('Staff', 'Delete', deleteStaffResult);
  }

  // Delete HOD
  if (createdIds.hod) {
    const deleteHODResult = await apiCall('DELETE', `/hods/${createdIds.hod}`, null, authToken);
    logTest('HOD', 'Delete', deleteHODResult);
  }

  // Delete Lecturer
  if (createdIds.lecturer) {
    const deleteLecturerResult = await apiCall('DELETE', `/lecturers/${createdIds.lecturer}`, null, authToken);
    logTest('Lecturer', 'Delete', deleteLecturerResult);
  }

  // Delete Course
  if (createdIds.course) {
    const deleteCourseResult = await apiCall('DELETE', `/courses/${createdIds.course}`, null, authToken);
    logTest('Course', 'Delete', deleteCourseResult);
  }

  // Delete Department
  if (createdIds.department) {
    const deleteDeptResult = await apiCall('DELETE', `/departments/${createdIds.department}`, null, authToken);
    logTest('Department', 'Delete', deleteDeptResult);
  }

  console.log('\n========================================');
  console.log('   ALL CRUD TESTS COMPLETED!');
  console.log('========================================\n');
}

// Run the tests
runTests().catch(error => {
  console.error('\n❌ Test execution failed:', error.message);
  process.exit(1);
});
