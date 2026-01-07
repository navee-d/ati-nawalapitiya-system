# SLIATE ATI Campus Management System

## 📋 Project Overview

A comprehensive, secure role-based campus management system built with the MERN stack (MongoDB, Express.js, React, Node.js) for SLIATE Advanced Technological Institute.

## 🛠 Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Atlas)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Encryption**: bcryptjs
- **Validation**: express-validator

## 👥 User Roles

The system supports five distinct user roles with specific permissions:

1. **Admin** - Super-user with full system control
2. **Student** - View personal academic information
3. **Lecturer** - View teaching assignments and personal profile
4. **HOD** (Head of Department) - View department information and personal profile
5. **Staff** - View personal information and assignments

## 🔐 Authentication & Security

### Login System
- **Common Login Page**: All roles log in through a unified login interface
- **Credentials**: Email and Password
- **Token-Based**: JWT authentication for secure sessions
- **Role-Based Redirects**: Automatic redirection to role-specific dashboards upon successful login
  - Admin → `/admin/dashboard`
  - Student → `/student/dashboard`
  - Lecturer → `/lecturer/dashboard`
  - HOD → `/hod/dashboard`
  - Staff → `/staff/dashboard`

### Security Rules
- ✅ **Admin Creation**: Admins cannot be created through public registration
- ✅ **Admin Seeding**: Admins must be manually created or database-seeded
- ✅ **Default Role**: Public registration defaults to 'Student' role
- ✅ **Password Security**: All passwords hashed using bcryptjs
- ✅ **Protected Routes**: API endpoints protected with JWT middleware
- ✅ **Role Verification**: Middleware validates user roles before granting access

## 📊 Functional Requirements

### A. Admin Dashboard (Super-User)

**Capabilities:**
- ✅ Full CRUD operations on Students
- ✅ Full CRUD operations on Lecturers
- ✅ Full CRUD operations on HODs
- ✅ Full CRUD operations on Staff
- ✅ Full CRUD operations on Departments
- ✅ Full CRUD operations on Courses

**Transactional User Creation:**
When creating a user (e.g., Lecturer):
1. Create User document (login credentials: email, password, role)
2. Create Lecturer document (profile details: lecturerId, department, etc.)
3. Both operations must succeed or fail together (transactional integrity)

**Admin Control Panel Features:**
- View all system users
- Manage all entities in the system
- Assign roles and permissions
- Monitor system activities

### B. User Dashboards (Student, Lecturer, HOD, Staff)

**Capabilities:**
- ❌ **Cannot manage other users**
- ✅ **View Own Profile**: Access personal dashboard with role-specific information
- ✅ **View My Details**:
  - Student: GPA, Attendance, Enrolled Courses
  - Lecturer: Assigned Modules, Department, Schedule
  - HOD: Department Details, Appointment Information
  - Staff: Designation, Department Assignment
- ✅ **Update Profile**: Limited field updates
  - Allowed: Phone Number, Address, Personal Information
  - Restricted: Role, ID, System-Assigned Fields

## 🔌 API Endpoints Structure

### Authentication
```
POST   /api/auth/login          # Login for all roles
POST   /api/auth/register       # Public registration (Student role only)
GET    /api/auth/me             # Get current user's profile (protected)
```

### Students (Admin & Owner Access)
```
POST   /api/students            # Create student (Admin only)
GET    /api/students            # Get all students (Admin only)
GET    /api/students/:id        # Get specific student (Admin or Owner)
PUT    /api/students/:id        # Update student (Admin or Owner)
DELETE /api/students/:id        # Delete student (Admin only)
```

### Lecturers (Admin & Owner Access)
```
POST   /api/lecturers           # Create lecturer (Admin only)
GET    /api/lecturers           # Get all lecturers (Admin only)
GET    /api/lecturers/:id       # Get specific lecturer (Admin or Owner)
PUT    /api/lecturers/:id       # Update lecturer (Admin or Owner)
DELETE /api/lecturers/:id       # Delete lecturer (Admin only)
```

### HODs (Admin & Owner Access)
```
POST   /api/hods                # Create HOD (Admin only)
GET    /api/hods                # Get all HODs (Admin only)
GET    /api/hods/:id            # Get specific HOD (Admin or Owner)
PUT    /api/hods/:id            # Update HOD (Admin or Owner)
DELETE /api/hods/:id            # Delete HOD (Admin only)
```

### Staff (Admin & Owner Access)
```
POST   /api/staff               # Create staff (Admin only)
GET    /api/staff               # Get all staff (Admin only)
GET    /api/staff/:id           # Get specific staff (Admin or Owner)
PUT    /api/staff/:id           # Update staff (Admin or Owner)
DELETE /api/staff/:id           # Delete staff (Admin only)
```

### Departments (Admin Access)
```
POST   /api/departments         # Create department (Admin only)
GET    /api/departments         # Get all departments (Public)
GET    /api/departments/:id     # Get specific department (Public)
PUT    /api/departments/:id     # Update department (Admin only)
DELETE /api/departments/:id     # Delete department (Admin only)
```

### Courses (Admin Access)
```
POST   /api/courses             # Create course (Admin only)
GET    /api/courses             # Get all courses (Public)
GET    /api/courses/:id         # Get specific course (Public)
PUT    /api/courses/:id         # Update course (Admin only)
DELETE /api/courses/:id          # Delete course (Admin only)
```

## 📁 Database Schema

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['admin', 'student', 'lecturer', 'hod', 'staff']),
  firstName: String,
  lastName: String,
  nic: String (unique),
  phone: String,
  address: String,
  isActive: Boolean (default: true)
}
```

### Student Model
```javascript
{
  user: ObjectId (ref: 'User', required),
  studentId: String (required, unique),
  registrationNumber: String (required, unique),
  course: ObjectId (ref: 'Course'),
  yearOfStudy: Number,
  semester: Number,
  gpa: Number,
  attendancePercentage: Number,
  academicStatus: String
}
```

### Lecturer Model
```javascript
{
  user: ObjectId (ref: 'User', required),
  lecturerId: String (required, unique),
  department: ObjectId (ref: 'Department'),
  designation: String,
  qualification: String,
  specialization: String,
  employmentType: String,
  joinDate: Date,
  modules: [String]
}
```

### HOD Model
```javascript
{
  user: ObjectId (ref: 'User', required),
  hodId: String (required, unique),
  department: ObjectId (ref: 'Department', required),
  qualification: String,
  appointmentDate: Date,
  officeRoom: String,
  responsibilities: [String]
}
```

### Staff Model
```javascript
{
  user: ObjectId (ref: 'User', required),
  staffId: String (required, unique),
  designation: String,
  staffType: String,
  department: ObjectId (ref: 'Department'),
  employmentType: String,
  joinDate: Date,
  duties: [String]
}
```

### Department Model
```javascript
{
  name: String (required),
  code: String (required, unique),
  description: String,
  establishedYear: Number,
  building: String,
  officePhone: String,
  email: String,
  isActive: Boolean
}
```

### Course Model
```javascript
{
  courseCode: String (required, unique),
  courseName: String (required),
  department: ObjectId (ref: 'Department'),
  credits: Number,
  semester: Number,
  year: Number,
  description: String,
  courseType: String,
  prerequisites: [ObjectId]
}
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation Steps

1. **Clone the Repository**
```bash
git clone https://github.com/navee-d/ati-nawalapitiya-system.git
cd ati-nawalapitiya-system
```

2. **Install Dependencies**
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

3. **Environment Configuration**

Create a `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/ati-campus
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d
```

4. **Seed the Database**
```bash
node backend/scripts/seed.js
```

This creates:
- Admin user (admin@ati.lk / admin123)
- 3 Departments (IT, Engineering, Business Management)
- 3 Courses (IT101, IT102, IT201)

5. **Run the Application**

**Option 1: Run Both Servers Concurrently**
```bash
npm run dev-all
```

**Option 2: Run Separately**
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

6. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔑 Default Admin Credentials

```
Email: admin@ati.lk
Password: admin123
```

⚠️ **Important**: Change these credentials immediately in production!

## 📱 Features

### Implemented ✅
- ✅ JWT Authentication
- ✅ Role-based access control
- ✅ User management (CRUD)
- ✅ Student management
- ✅ Lecturer management
- ✅ HOD management
- ✅ Staff management
- ✅ Department management
- ✅ Course management
- ✅ Database seeding
- ✅ Login/Logout functionality
- ✅ Protected routes
- ✅ Responsive design

### Planned 🔄
- 🔄 Role-specific dashboards
- 🔄 Profile update functionality
- 🔄 File upload (profile pictures, documents)
- 🔄 Attendance tracking
- 🔄 Grade management
- 🔄 Timetable management
- 🔄 Notifications system
- 🔄 Reports generation
- 🔄 Search and filtering

## 🏗 Project Structure

```
ati-nawalapitiya-system/
├── backend/
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth & validation middleware
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── scripts/           # Utility scripts (seed, etc.)
│   └── server.js          # Express app setup
├── frontend/
│   ├── public/            # Static files
│   └── src/
│       ├── pages/         # React pages/components
│       ├── services/      # API service layer
│       ├── App.js         # Main React component
│       └── index.js       # React entry point
├── .env                   # Environment variables (not in repo)
├── .gitignore
├── package.json
└── README.md
```

## 🧪 Testing API Endpoints

See [API_TESTING.md](./API_TESTING.md) for detailed API testing examples using curl, Postman, or Thunder Client.

## 📚 Documentation

- [Quick Start Guide](./QUICKSTART.md)
- [Development Guide](./DEVELOPMENT.md)
- [API Testing Guide](./API_TESTING.md)
- [Project Summary](./PROJECT_SUMMARY.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**SLIATE ATI Nawalapitiya**

## 🙏 Acknowledgments

- SLIATE Sri Lanka
- Advanced Technological Institute, Nawalapitiya
- MERN Stack Community

---

**Status**: ✅ Active Development  
**Version**: 1.0.0  
**Last Updated**: January 7, 2026
