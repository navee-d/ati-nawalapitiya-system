const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

// Import Models
const User = require('../models/User.model');
const Department = require('../models/Department.model');
const Course = require('../models/Course.model');
const Lecturer = require('../models/Lecturer.model');
const Student = require('../models/Student.model');
const HOD = require('../models/HOD.model');
const Staff = require('../models/Staff.model');
const Timetable = require('../models/Timetable.model');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

// --- 1. STATIC DATA CONFIGURATION ---

const departmentsData = [
  { name: 'Information Technology', code: 'IT', description: 'Department of IT', establishedYear: 2010, building: 'Block A', officePhone: '011-2223331', email: 'it@ati.lk' },
  { name: 'Engineering', code: 'ENG', description: 'Department of Engineering', establishedYear: 2008, building: 'Block B', officePhone: '011-2223332', email: 'eng@ati.lk' },
  { name: 'Business Management', code: 'BM', description: 'Department of Management', establishedYear: 2012, building: 'Block C', officePhone: '011-2223333', email: 'bm@ati.lk' },
  { name: 'English', code: 'EN', description: 'Department of English', establishedYear: 2011, building: 'Block D', officePhone: '011-2223334', email: 'english@ati.lk' },
  { name: 'Tourism & Hospitality', code: 'THM', description: 'Department of Tourism', establishedYear: 2013, building: 'Block E', officePhone: '011-2223335', email: 'thm@ati.lk' }
];

const coursesData = [
  // IT
  { courseCode: 'IT101', courseName: 'HND in Information Technology', credits: 4, semester: 1, year: 1, description: 'Full Time IT Course', courseType: 'Core', deptCode: 'IT' },
  // Management
  { courseCode: 'HNDM', courseName: 'HND in Management', credits: 4, semester: 1, year: 1, description: 'Management Studies', courseType: 'Core', deptCode: 'BM' },
  // English
  { courseCode: 'HNDE-FT', courseName: 'HND in English (Full Time)', credits: 4, semester: 1, year: 1, description: 'English Literature and Language', courseType: 'Core', deptCode: 'EN' },
  { courseCode: 'HNDE-PT', courseName: 'HND in English (Part Time)', credits: 4, semester: 1, year: 1, description: 'Weekend English Course', courseType: 'Core', deptCode: 'EN' },
  // Tourism
  { courseCode: 'HNDTHM', courseName: 'HND in Tourism & Hospitality', credits: 4, semester: 1, year: 1, description: 'Hospitality Management', courseType: 'Core', deptCode: 'THM' }
];

// Real data sample from your CSVs
const realStudentData = [
  // --- HNDM (Management) ---
  { name: 'Basnayake Mudiyanselage Diyamane Gedara Upamalika Nawarathna', gender: 'Female', address: 'No.28, Dawlagolla, Kalaganwatta', phone: '768737753', index: 'NAW/MG/2017/F/0011', course: 'HNDM', batch: '2017' },
  { name: 'Maharaba Waththe Gedara Dinusha Sajani', gender: 'Female', address: 'No.02, Nildandahinna, Walapane', phone: '761739706', index: 'NAW/MG/2017/F/0012', course: 'HNDM', batch: '2017' },
  { name: 'Mohamed Nawas Fathima Amaniya', gender: 'Female', address: '13/9, Deiyannewela, Kandy', phone: '776076550', index: 'NAW/MG/2017/F/0014', course: 'HNDM', batch: '2017' },
  { name: 'Supun Ravinath Eladuwage', gender: 'Male', address: 'No.140/1, Dolosbage Road, Nawalapitiya', phone: '775414557', index: 'NAW/MG/2017/F/0113', course: 'HNDM', batch: '2017' },
  
  // --- HNDTHM (Tourism) ---
  { name: 'Mohamed Musthafa Mohamed Irfan', gender: 'Male', address: '13/73 A.A.Dharmasena Mw, Kandy', phone: '715293998', index: 'NAW/TH/2017/F/0002', course: 'HNDTHM', batch: '2017' },
  { name: 'Pansale Vidanelage Sahan Isuru Bandara', gender: 'Male', address: 'Kethsiri, Hingurakgala, Hingurakgoda', phone: '766580728', index: 'NAW/TH/2017/F/0003', course: 'HNDTHM', batch: '2017' },
  { name: 'Herath Mudiyanselage Ruwini Awanthika Herath', gender: 'Female', address: 'Ma-Oya Road, Andiramada, Hiriwadunna, Kegalle', phone: '710962156', index: 'NAW/TH/2017/F/0006', course: 'HNDTHM', batch: '2017' },

  // --- HNDE (English Full Time) ---
  { name: 'Hewa Ranasinghelage Upeksha Hewa Ranasinghe', gender: 'Female', address: 'Mahapathana, Ambagamuwa, Udabulathgama', phone: '772161898', index: 'NAW/EN/2017/F/0003', course: 'HNDE-FT', batch: '2017' },
  { name: 'Jayasekara Mudiyanselage Lakmini Yashoda Jayasekara', gender: 'Female', address: '32, Samagipura, Nawalapitiya', phone: '769190829', index: 'NAW/EN/2017/F/0006', course: 'HNDE-FT', batch: '2017' },
  { name: 'Mohamed Rajab Fatima Yusra', gender: 'Female', address: 'No.391/A, Sellakanda Road, Negombo', phone: '752076252', index: 'NAW/EN/2017/F/0015', course: 'HNDE-FT', batch: '2017' },

  // --- HNDE (English Part Time) ---
  { name: 'Rathnayaka Mudiyanselage Upeksha Swarnamali Rathnayaka', gender: 'Female', address: 'Peragolla, Habbakanda, Ginigathhena', phone: '771349272', index: 'NAW/EN/2017/P/0001', course: 'HNDE-PT', batch: '2017' },
  { name: 'Yalagalage Geetha Malani Kumari Peiris', gender: 'Female', address: 'No.20/2, Galatha, Yatipiyangala', phone: '775310288', index: 'NAW/EN/2017/P/0002', course: 'HNDE-PT', batch: '2017' },
  { name: 'Mariyadas Shayana Evangelin', gender: 'Female', address: 'No.4/1, Upali Mawatha, Meepitiya, Nawalapitiya', phone: '774083325', index: 'NAW/EN/2017/P/0014', course: 'HNDE-PT', batch: '2017' }
];

const lecturersData = [
  { username: 'lec_it', name: 'Nimal Perera', dept: 'IT', role: 'Senior Lecturer', email: 'nimal@ati.lk' },
  { username: 'lec_eng', name: 'Sanduni Silva', dept: 'EN', role: 'Lecturer', email: 'sanduni@ati.lk' },
  { username: 'lec_thm', name: 'Kasun Fernando', dept: 'THM', role: 'Assistant Lecturer', email: 'kasun@ati.lk' }
];

// --- 2. SEED FUNCTION ---

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ati_nawalapitiya', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');

    // --- CLEANUP ---
    await User.deleteMany({});
    await Department.deleteMany({});
    await Course.deleteMany({});
    await Lecturer.deleteMany({});
    await Student.deleteMany({});
    await HOD.deleteMany({});
    await Staff.deleteMany({});
    await Timetable.deleteMany({});
    console.log('Cleared existing data');

    // --- CREATE ADMIN ---
    await User.create({
      username: 'admin',
      email: 'admin@ati.lk',
      password: 'admin123',
      role: 'admin',
      firstName: 'System',
      lastName: 'Administrator',
      nic: '999999999V',
      phone: '0770000000',
      address: 'ATI Office'
    });
    console.log('Admin user created');

    // --- CREATE DEPARTMENTS ---
    const deptDocs = await Department.insertMany(departmentsData);
    console.log(`${deptDocs.length} departments created`);
    
    // Helper to get dept ID
    const getDeptId = (code) => deptDocs.find(d => d.code === code)?._id;

    // --- CREATE COURSES ---
    const coursesWithIds = coursesData.map(c => ({
      ...c,
      department: getDeptId(c.deptCode)
    }));
    const courseDocs = await Course.insertMany(coursesWithIds);
    console.log(`${courseDocs.length} courses created`);

    const getCourseId = (code) => courseDocs.find(c => c.courseCode === code)?._id;

    // --- CREATE LECTURERS & HODs ---
    const lecturerDocs = [];
    
    // Using a loop with index 'i' to guarantee unique NICs for lecturers
    for (let i = 0; i < lecturersData.length; i++) {
      const l = lecturersData[i];
      const nameParts = l.name.split(' ');
      
      const user = await User.create({
        username: l.username,
        email: l.email,
        password: 'password123',
        role: 'lecturer',
        firstName: nameParts[0],
        lastName: nameParts[1] || '',
        nic: `85100${i.toString().padStart(3, '0')}V`, // e.g. 85100000V, 85100001V
        phone: '0771234567',
        address: 'Staff Quarters'
      });

      const lecturer = await Lecturer.create({
        user: user._id,
        lecturerId: `LEC-${l.username.toUpperCase()}`,
        department: getDeptId(l.dept),
        designation: l.role,
        qualification: 'MSc',
        specialization: ['General'],
        joinDate: new Date('2018-01-01')
      });
      lecturerDocs.push(lecturer);

      // Create HOD if not exists
      const deptHOD = await HOD.findOne({ department: getDeptId(l.dept) });
      if (!deptHOD) {
        const hodUser = await User.create({
          username: `hod_${l.dept.toLowerCase()}`,
          email: `hod_${l.dept.toLowerCase()}@ati.lk`,
          password: 'password123',
          role: 'hod',
          firstName: 'Head',
          lastName: l.dept,
          nic: `75200${i.toString().padStart(3, '0')}V`, // Unique HOD NIC
          phone: '0777777777',
          address: 'HOD Office'
        });
        
        await HOD.create({
          user: hodUser._id,
          hodId: `HOD-${l.dept}`,
          department: getDeptId(l.dept),
          designation: 'Head of Department',
          qualification: 'PhD',
          appointmentDate: new Date()
        });
      }
    }
    console.log('Lecturers and HODs created');

    // --- CREATE STUDENTS (FROM CSV DATA) ---
    let studentCount = 0;
    for (const s of realStudentData) {
      const nameParts = s.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      const safeIndex = s.index.replace(/\//g, '_').toLowerCase();
      
      // FIX: Generate unique sequential NIC for students to avoid collisions 
      // between different departments that have overlapping index numbers (e.g. 0003)
      const studentNic = `2000${studentCount.toString().padStart(5, '0')}V`; // 200000000V, 200000001V, etc.

      const user = await User.create({
        username: safeIndex,
        email: `${safeIndex}@ati.lk`,
        password: 'password123',
        role: 'student',
        firstName: firstName,
        lastName: lastName || 'Student',
        nic: studentNic,
        phone: s.phone,
        address: s.address
      });

      let deptCode = 'IT';
      if (s.course.includes('HNDM')) deptCode = 'BM';
      if (s.course.includes('HNDE')) deptCode = 'EN';
      if (s.course.includes('HNDTHM')) deptCode = 'THM';

      await Student.create({
        user: user._id,
        studentId: s.index,
        registrationNumber: `REG-${s.index.split('/').pop()}-${studentCount}`, // Ensure unique RegNo too
        course: getCourseId(s.course),
        department: getDeptId(deptCode),
        batch: s.batch,
        yearOfStudy: 4,
        semester: 2,
        enrollmentDate: new Date(`${s.batch}-01-01`),
        academicStatus: 'graduated',
        gpa: 3.0,
        attendance: 85,
        guardianName: 'Parent',
        guardianPhone: '0770000000'
      });
      studentCount++;
    }
    console.log(`${studentCount} Students created from real data`);

    // --- CREATE TIMETABLES ---
    if (lecturerDocs.length > 0) {
       const timetables = [
        {
          course: getCourseId('HNDE-FT'),
          lecturer: lecturerDocs[1]._id, 
          department: getDeptId('EN'),
          dayOfWeek: 'Monday',
          startTime: '08:30',
          endTime: '10:30',
          room: 'Lec Hall 1',
          sessionType: 'Lecture',
          semester: 1,
          academicYear: '2025'
        },
        {
          course: getCourseId('HNDM'),
          lecturer: lecturerDocs[0]._id, 
          department: getDeptId('BM'),
          dayOfWeek: 'Tuesday',
          startTime: '10:30',
          endTime: '12:30',
          room: 'Lab 2',
          sessionType: 'Lecture',
          semester: 1,
          academicYear: '2025'
        }
      ];
      await Timetable.insertMany(timetables);
      console.log(`${timetables.length} Timetable entries created`);
    }

    console.log('\n=== SEEDING COMPLETE ===');
    console.log('Login with:');
    console.log('Admin: admin@ati.lk / admin123');
    console.log('Lecturer (IT): nimal@ati.lk / password123');
    console.log('Student (Sample): naw_mg_2017_f_0011@ati.lk / password123');
    
    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();