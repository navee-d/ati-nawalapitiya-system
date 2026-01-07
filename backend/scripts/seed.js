const mongoose = require('mongoose');
const User = require('../models/User.model');
const Department = require('../models/Department.model');
const Course = require('../models/Course.model');
const dotenv = require('dotenv');

dotenv.config();

// Sample data for seeding
const departments = [
  {
    name: 'Information Technology',
    code: 'IT',
    description: 'Department of Information Technology',
    establishedYear: 2010,
    building: 'Building A',
    officePhone: '0352222111',
    email: 'it@ati.lk'
  },
  {
    name: 'Engineering',
    code: 'ENG',
    description: 'Department of Engineering',
    establishedYear: 2008,
    building: 'Building B',
    officePhone: '0352222112',
    email: 'eng@ati.lk'
  },
  {
    name: 'Business Management',
    code: 'BM',
    description: 'Department of Business Management',
    establishedYear: 2012,
    building: 'Building C',
    officePhone: '0352222113',
    email: 'bm@ati.lk'
  }
];

const courses = [
  {
    courseCode: 'IT101',
    courseName: 'Introduction to Programming',
    credits: 3,
    semester: 1,
    year: 1,
    description: 'Fundamentals of programming using Python',
    courseType: 'Core'
  },
  {
    courseCode: 'IT102',
    courseName: 'Database Management Systems',
    credits: 3,
    semester: 1,
    year: 1,
    description: 'Introduction to database design and SQL',
    courseType: 'Core'
  },
  {
    courseCode: 'IT201',
    courseName: 'Web Development',
    credits: 4,
    semester: 3,
    year: 2,
    description: 'Full-stack web development with modern frameworks',
    courseType: 'Core'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Department.deleteMany({});
    await Course.deleteMany({});

    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@ati.lk',
      password: 'admin123',
      role: 'admin',
      firstName: 'System',
      lastName: 'Administrator',
      nic: '199012345678',
      phone: '0771234567',
      address: 'ATI Nawalapitiya'
    });

    console.log('Admin user created:', admin.email);

    // Create departments
    const createdDepartments = await Department.insertMany(departments);
    console.log(`${createdDepartments.length} departments created`);

    // Create courses linked to IT department
    const itDept = createdDepartments.find(d => d.code === 'IT');
    const coursesWithDept = courses.map(course => ({
      ...course,
      department: itDept._id
    }));

    const createdCourses = await Course.insertMany(coursesWithDept);
    console.log(`${createdCourses.length} courses created`);

    console.log('\n=== Seed Data Summary ===');
    console.log('Admin credentials:');
    console.log('  Email: admin@ati.lk');
    console.log('  Password: admin123');
    console.log('\nDepartments:', createdDepartments.length);
    console.log('Courses:', createdCourses.length);
    console.log('\nDatabase seeding completed successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
