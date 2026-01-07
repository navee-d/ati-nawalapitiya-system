# SLIATE ATI Nawalapitiya - Campus Management System

A comprehensive web-based campus management system for SLIATE Advanced Technological Institute, Nawalapitiya. This system manages students, lecturers, HODs, staff, departments, and courses with complete CRUD operations and role-based access control.

## 🚀 Features

### Core Modules
- **👨‍🎓 Student Management** - Complete student lifecycle management including enrollment, academic records, GPA tracking, and attendance
- **👨‍🏫 Lecturer Management** - Manage lecturer profiles, courses taught, qualifications, and schedules
- **👔 HOD Management** - Department head management with responsibilities and department assignments
- **👥 Staff Management** - Administrative and support staff management with different staff types
- **🏢 Department Management** - Organize and manage academic and administrative departments
- **📚 Course Management** - Course catalog with prerequisites, credits, and lecturer assignments

### Security & Authentication
- JWT-based authentication
- Role-based access control (Student, Lecturer, HOD, Staff, Admin)
- Password hashing with bcrypt
- Protected routes with authorization middleware

### Technical Features
- RESTful API architecture
- MongoDB database with Mongoose ODM
- React frontend with React Router
- Responsive design
- Real-time data updates
- Comprehensive error handling

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/navee-d/ati-nawalapitiya-system.git
cd ati-nawalapitiya-system
```

### 2. Install dependencies

#### Install backend dependencies
```bash
npm install
```

#### Install frontend dependencies
```bash
cd frontend
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ati_nawalapitiya
JWT_SECRET=your_secure_jwt_secret_key_here
JWT_EXPIRE=30d
NODE_ENV=development
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:
```bash
# On Ubuntu/Debian
sudo systemctl start mongod

# On macOS with Homebrew
brew services start mongodb-community

# Or run manually
mongod
```

## 🚀 Running the Application

### Development Mode

#### Option 1: Run both servers concurrently
```bash
npm run dev-all
```

#### Option 2: Run servers separately

**Terminal 1 - Backend Server:**
```bash
npm run dev
```

**Terminal 2 - Frontend Development Server:**
```bash
cd frontend
npm start
```

### Production Mode

#### Build the frontend:
```bash
cd frontend
npm run build
cd ..
```

#### Start the backend server:
```bash
npm start
```

The application will be available at:
- Backend API: `http://localhost:5000`
- Frontend: `http://localhost:3000` (development) or served by backend (production)

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",
  "firstName": "John",
  "lastName": "Doe",
  "nic": "123456789V",
  "phone": "0771234567",
  "address": "123 Main St, Nawalapitiya"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

### Student Endpoints

| Method | Endpoint | Description | Authorization |
|--------|----------|-------------|---------------|
| GET | /api/students | Get all students | Any authenticated user |
| GET | /api/students/:id | Get single student | Any authenticated user |
| POST | /api/students | Create new student | Admin, HOD |
| PUT | /api/students/:id | Update student | Admin, HOD |
| DELETE | /api/students/:id | Delete student | Admin |
| GET | /api/students/department/:departmentId | Get students by department | Any authenticated user |

### Lecturer Endpoints

| Method | Endpoint | Description | Authorization |
|--------|----------|-------------|---------------|
| GET | /api/lecturers | Get all lecturers | Any authenticated user |
| GET | /api/lecturers/:id | Get single lecturer | Any authenticated user |
| POST | /api/lecturers | Create new lecturer | Admin, HOD |
| PUT | /api/lecturers/:id | Update lecturer | Admin, HOD |
| DELETE | /api/lecturers/:id | Delete lecturer | Admin |
| GET | /api/lecturers/department/:departmentId | Get lecturers by department | Any authenticated user |

### HOD Endpoints

| Method | Endpoint | Description | Authorization |
|--------|----------|-------------|---------------|
| GET | /api/hods | Get all HODs | Any authenticated user |
| GET | /api/hods/:id | Get single HOD | Any authenticated user |
| POST | /api/hods | Create new HOD | Admin |
| PUT | /api/hods/:id | Update HOD | Admin |
| DELETE | /api/hods/:id | Delete HOD | Admin |

### Staff Endpoints

| Method | Endpoint | Description | Authorization |
|--------|----------|-------------|---------------|
| GET | /api/staff | Get all staff | Any authenticated user |
| GET | /api/staff/:id | Get single staff member | Any authenticated user |
| POST | /api/staff | Create new staff member | Admin |
| PUT | /api/staff/:id | Update staff member | Admin |
| DELETE | /api/staff/:id | Delete staff member | Admin |
| GET | /api/staff/type/:staffType | Get staff by type | Any authenticated user |

### Department Endpoints

| Method | Endpoint | Description | Authorization |
|--------|----------|-------------|---------------|
| GET | /api/departments | Get all departments | Any authenticated user |
| GET | /api/departments/:id | Get single department | Any authenticated user |
| POST | /api/departments | Create new department | Admin |
| PUT | /api/departments/:id | Update department | Admin |
| DELETE | /api/departments/:id | Delete department | Admin |

### Course Endpoints

| Method | Endpoint | Description | Authorization |
|--------|----------|-------------|---------------|
| GET | /api/courses | Get all courses | Any authenticated user |
| GET | /api/courses/:id | Get single course | Any authenticated user |
| POST | /api/courses | Create new course | Admin, HOD |
| PUT | /api/courses/:id | Update course | Admin, HOD |
| DELETE | /api/courses/:id | Delete course | Admin |
| GET | /api/courses/department/:departmentId | Get courses by department | Any authenticated user |

## 🗂️ Project Structure

```
ati-nawalapitiya-system/
├── backend/
│   ├── controllers/          # Request handlers
│   │   ├── auth.controller.js
│   │   ├── student.controller.js
│   │   ├── lecturer.controller.js
│   │   ├── hod.controller.js
│   │   ├── staff.controller.js
│   │   ├── department.controller.js
│   │   └── course.controller.js
│   ├── models/               # Database models
│   │   ├── User.model.js
│   │   ├── Student.model.js
│   │   ├── Lecturer.model.js
│   │   ├── HOD.model.js
│   │   ├── Staff.model.js
│   │   ├── Department.model.js
│   │   └── Course.model.js
│   ├── routes/               # API routes
│   │   ├── auth.routes.js
│   │   ├── student.routes.js
│   │   ├── lecturer.routes.js
│   │   ├── hod.routes.js
│   │   ├── staff.routes.js
│   │   ├── department.routes.js
│   │   └── course.routes.js
│   ├── middleware/           # Custom middleware
│   │   └── auth.middleware.js
│   └── server.js            # Express server setup
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/           # React page components
│   │   │   ├── Home.js
│   │   │   ├── Students.js
│   │   │   ├── Lecturers.js
│   │   │   ├── HODs.js
│   │   │   ├── Staff.js
│   │   │   ├── Departments.js
│   │   │   ├── Courses.js
│   │   │   └── Login.js
│   │   ├── services/        # API services
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 👥 User Roles

### Admin
- Full system access
- Create, read, update, delete all resources
- Manage all users and modules

### HOD (Head of Department)
- View all resources
- Create and manage students in their department
- Create and manage lecturers in their department
- Create and manage courses in their department

### Lecturer
- View all resources
- Update own profile
- View assigned courses and students

### Student
- View courses and lecturers
- Update own profile
- View academic records

### Staff
- View relevant resources based on staff type
- Update own profile

## 🔐 Security Best Practices

1. **Change JWT Secret**: Update `JWT_SECRET` in `.env` with a strong, unique secret
2. **Use HTTPS**: In production, always use HTTPS
3. **Regular Updates**: Keep dependencies updated
4. **Environment Variables**: Never commit `.env` file
5. **Password Policy**: Enforce strong password requirements
6. **Input Validation**: All inputs are validated before processing

## 🧪 Testing

### Manual API Testing with cURL

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ati.lk","password":"admin123"}'
```

#### Get All Students
```bash
curl -X GET http://localhost:5000/api/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📝 Database Schema

### User
- username, email, password (hashed)
- role (student, lecturer, hod, staff, admin)
- firstName, lastName, nic, phone, address
- isActive, timestamps

### Student
- studentId, registrationNumber
- course (ref: Course), department (ref: Department)
- batch, yearOfStudy, semester
- enrollmentDate, academicStatus
- gpa, attendance
- guardianName, guardianPhone, emergencyContact

### Lecturer
- lecturerId, department (ref: Department)
- designation, qualification, specialization
- joinDate, officeRoom, officeHours
- coursesTaught (ref: Course), employmentType

### HOD
- hodId, department (ref: Department)
- designation, qualification, specialization
- appointmentDate, officeRoom, officeHours
- responsibilities

### Staff
- staffId, department (ref: Department)
- designation, staffType
- joinDate, officeRoom, workingHours
- employmentType, responsibilities

### Department
- name, code, description
- hod (ref: HOD)
- establishedYear, building
- officePhone, email, isActive

### Course
- courseCode, courseName
- department (ref: Department)
- credits, semester, year
- description, lecturers (ref: Lecturer)
- prerequisites (ref: Course)
- courseType, isActive

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**SLIATE ATI Nawalapitiya**

## 🙏 Acknowledgments

- SLIATE (Sri Lanka Institute of Advanced Technological Education)
- ATI Nawalapitiya Campus
- All contributors and stakeholders

## 📞 Support

For support, email support@ati.lk or create an issue in the repository.

---

**Made with ❤️ for SLIATE ATI Nawalapitiya**