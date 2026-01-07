# 🎓 SLIATE ATI Nawalapitiya - Campus Management System

A secure, full-stack web application for managing campus operations at SLIATE Advanced Technological Institute, Nawalapitiya. Built with the MERN stack featuring JWT authentication, role-based access control, and comprehensive CRUD operations for all campus entities.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 👥 User Management & Authentication
- **5 User Roles**: Admin, Student, Lecturer, HOD, Staff
- **JWT Authentication**: Secure token-based authentication system
- **Role-Based Access Control**: Granular permissions per user role
- **Secure Login**: Unified login page with automatic role-based dashboard redirection
- **Password Security**: bcryptjs encryption for all passwords

### 📊 Core Modules
- **👨‍🎓 Student Management**
  - Complete student profiles with registration numbers
  - GPA and attendance tracking
  - Course enrollment management
  - Academic status monitoring
  
- **👨‍🏫 Lecturer Management**
  - Lecturer profiles with qualifications
  - Department assignments
  - Course teaching assignments
  - Employment type tracking
  
- **👔 HOD Management**
  - Department head profiles
  - Appointment information
  - Office and contact details
  - Responsibility tracking
  
- **👥 Staff Management**
  - Administrative staff profiles
  - Staff type categorization
  - Department assignments
  - Duty management
  
- **🏢 Department Management**
  - Department creation and organization
  - Building and location tracking
  - Contact information
  - Status management
  
- **📚 Course Management**
  - Course catalog with course codes
  - Credit and semester information
  - Department linking
  - Course type classification

## 🛠 Tech Stack

**Frontend:**
- React 18.2.0
- React Router DOM 6.20.0
- Axios 1.6.2
- CSS3

**Backend:**
- Node.js
- Express.js 4.18.2
- MongoDB (Atlas) + Mongoose 8.0.0
- JWT (jsonwebtoken 9.0.2)
- bcryptjs 2.4.3
- express-validator 7.0.1

**DevOps & Tools:**
- Nodemon (development)
- Concurrently (run both servers)
- Git & GitHub

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/navee-d/ati-nawalapitiya-system.git
cd ati-nawalapitiya-system

# Install all dependencies
npm install
cd frontend && npm install && cd ..

# Create .env file and configure MongoDB URI
cp .env.example .env

# Seed the database with sample data
node backend/scripts/seed.js

# Start both servers (backend + frontend)
npm run dev-all
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

**Default Admin Login:**
```
Email: admin@ati.lk
Password: admin123
```

## 🔧 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Git

### Step-by-Step Installation

**1. Clone the Repository**
```bash
git clone https://github.com/navee-d/ati-nawalapitiya-system.git
cd ati-nawalapitiya-system
```

**2. Install Backend Dependencies**
```bash
npm install
```

**3. Install Frontend Dependencies**
```bash
cd frontend
npm install
cd ..
```

**4. Configure Environment Variables**

Create a `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ati-campus
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
```

**MongoDB Atlas Setup:**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Add your IP address to whitelist (or allow from anywhere for development)
4. Create database user credentials
5. Get connection string and update MONGODB_URI in .env

**5. Seed the Database**
```bash
node backend/scripts/seed.js
```

This creates:
- ✅ Admin user (admin@ati.lk / admin123)
- ✅ 3 Departments (IT, Engineering, Business Management)
- ✅ 3 Sample Courses

**6. Start the Application**

**Option A: Run both servers concurrently (Recommended)**
```bash
npm run dev-all
```

**Option B: Run servers separately**
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm start
```

**7. Access the Application**

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📱 Usage

### Available Scripts

```bash
npm start          # Start backend in production mode
npm run dev        # Start backend with nodemon
npm run client     # Start frontend only
npm run dev-all    # Start both backend and frontend concurrently
npm run install-all # Install both backend and frontend dependencies
```

### User Roles & Permissions

| Role | Can View | Can Create | Can Update | Can Delete |
|------|----------|------------|------------|------------|
| **Admin** | All entities | All entities | All entities | All entities |
| **HOD** | All entities | Students, Courses | Students, Courses | None |
| **Lecturer** | Own profile, Students | None | Own profile | None |
| **Staff** | Own profile | None | Own profile | None |
| **Student** | Own profile | None | Own profile | None |

### Testing the API

See [API_TESTING.md](./API_TESTING.md) for detailed API testing examples.

**Quick Test:**
```bash
# Login and get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ati.lk","password":"admin123"}'

# Get all students (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/students \
  -H "Authorization: Bearer TOKEN"
```

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register       Register new user (Student role default)
POST   /api/auth/login          Login user and get JWT token
GET    /api/auth/me             Get current user profile (requires auth)
```

### Resource Endpoints

| Resource | Endpoints | Auth Required |
|----------|-----------|---------------|
| **Students** | GET, POST, PUT, DELETE /api/students | ✅ |
| **Lecturers** | GET, POST, PUT, DELETE /api/lecturers | ✅ |
| **HODs** | GET, POST, PUT, DELETE /api/hods | ✅ |
| **Staff** | GET, POST, PUT, DELETE /api/staff | ✅ |
| **Departments** | GET, POST, PUT, DELETE /api/departments | ✅ |
| **Courses** | GET, POST, PUT, DELETE /api/courses | ✅ |

**Example Request:**
```bash
POST /api/students
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "studentId": "STU001",
  "registrationNumber": "2024/IT/001",
  "yearOfStudy": 1,
  "semester": 1,
  "gpa": 3.5,
  "attendancePercentage": 95
}
```

For complete API documentation, see [API_TESTING.md](./API_TESTING.md)

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
│   ├── models/               # Mongoose schemas
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
│   ├── scripts/              # Utility scripts
│   │   └── seed.js
│   └── server.js             # Express app entry point
├── frontend/
│   ├── public/               # Static files
│   │   └── index.html
│   └── src/
│       ├── pages/            # React components
│       │   ├── Home.js
│       │   ├── Login.js
│       │   ├── Students.js
│       │   ├── Lecturers.js
│       │   ├── HODs.js
│       │   ├── Staff.js
│       │   ├── Departments.js
│       │   └── Courses.js
│       ├── services/         # API services
│       │   └── api.js
│       ├── App.js            # Main React component
│       ├── App.css           # Global styles
│       └── index.js          # React entry point
├── .env                      # Environment variables (not in repo)
├── .env.example              # Example environment file
├── .gitignore
├── package.json              # Backend dependencies
├── README.md                 # This file
└── start.sh                  # Quick start script
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password encryption
- **Protected Routes**: Middleware-based route protection
- **Role Validation**: Role-based access control on all endpoints
- **Input Validation**: express-validator for request validation
- **CORS**: Configured for secure cross-origin requests

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)

```bash
# Build command
npm install

# Start command
npm start

# Environment variables
PORT=5000
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
NODE_ENV=production
```

### Frontend Deployment (Vercel/Netlify)

```bash
# Build command
npm install && npm run build

# Publish directory
build/

# Environment variables
REACT_APP_API_URL=https://your-backend-api.com/api
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**SLIATE ATI Nawalapitiya Development Team**
- GitHub: [@navee-d](https://github.com/navee-d)

## 🙏 Acknowledgments

- SLIATE Sri Lanka
- Advanced Technological Institute, Nawalapitiya
- MERN Stack Community
- All contributors and supporters

## 📞 Support

For support, email: admin@ati.lk or open an issue in the GitHub repository.

## 🔗 Links

- [Project Repository](https://github.com/navee-d/ati-nawalapitiya-system)
- [API Testing Guide](./API_TESTING.md)
- [Development Guide](./DEVELOPMENT.md)
- [Project Requirements](./README_REQUIREMENTS.md)
- [Quick Start Guide](./QUICKSTART.md)

---

**Status**: ✅ Active Development  
**Version**: 1.0.0  
**Last Updated**: January 7, 2026

Made with ❤️ for SLIATE ATI Nawalapitiya
