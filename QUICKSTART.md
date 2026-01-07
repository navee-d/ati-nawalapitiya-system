# ATI Nawalapitiya Campus Management System - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 2: Set Up Environment
The `.env` file is already configured with development settings. For production, update:
- `JWT_SECRET` with a secure random string
- `MONGODB_URI` with your production MongoDB URL

### Step 3: Start MongoDB
```bash
# Make sure MongoDB is running
sudo systemctl start mongod
```

### Step 4: Seed the Database (Optional)
```bash
# This will create sample data including an admin user
node backend/scripts/seed.js
```

**Default Admin Credentials:**
- Email: `admin@ati.lk`
- Password: `admin123`

### Step 5: Run the Application

**Option A: Run both frontend and backend together**
```bash
npm run dev-all
```

**Option B: Run separately**

Terminal 1 (Backend):
```bash
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

### Step 6: Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📱 Testing the API

### 1. Login to get authentication token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ati.lk",
    "password": "admin123"
  }'
```

Save the returned `token` for subsequent requests.

### 2. Create a Department
```bash
curl -X POST http://localhost:5000/api/departments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Computer Science",
    "code": "CS",
    "description": "Department of Computer Science",
    "establishedYear": 2020,
    "building": "Building D",
    "officePhone": "0352222114",
    "email": "cs@ati.lk"
  }'
```

### 3. Create a Student
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "username": "student001",
    "email": "student001@ati.lk",
    "password": "student123",
    "firstName": "Nimal",
    "lastName": "Perera",
    "nic": "199812345678",
    "phone": "0771234567",
    "address": "Kandy, Sri Lanka",
    "studentId": "STU001",
    "registrationNumber": "2024/IT/001",
    "course": "COURSE_ID_HERE",
    "department": "DEPARTMENT_ID_HERE",
    "batch": "2024",
    "yearOfStudy": 1,
    "semester": 1,
    "enrollmentDate": "2024-01-15",
    "guardianName": "K. Perera",
    "guardianPhone": "0777654321",
    "emergencyContact": "0777654321"
  }'
```

## 🔧 Common Operations

### View all students
```bash
curl http://localhost:5000/api/students \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### View all departments
```bash
curl http://localhost:5000/api/departments \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### View all courses
```bash
curl http://localhost:5000/api/courses \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📊 System Features Overview

### For Students
- View personal profile and academic records
- Check course enrollments
- View GPA and attendance
- Update contact information

### For Lecturers
- View assigned courses
- Access student lists
- Update profile and office hours
- View department information

### For HODs
- Manage department students and lecturers
- Create and update courses
- View department statistics
- Approve student enrollments

### For Staff
- Access administrative functions
- View relevant department information
- Update personal profile
- Manage assigned responsibilities

### For Administrators
- Full system access
- User management across all roles
- Department and course management
- System configuration
- Generate reports

## 🎯 Next Steps

1. **Customize the System**
   - Add more departments specific to your institution
   - Create course curriculum for each department
   - Set up academic calendar

2. **Import Existing Data**
   - Create scripts to import existing student data
   - Import lecturer and staff information
   - Set up course prerequisites

3. **Enhance Security**
   - Change default admin password
   - Set up backup procedures
   - Configure SSL/TLS for production

4. **Deploy to Production**
   - Set up production MongoDB instance
   - Configure environment variables
   - Deploy to cloud hosting (AWS, Azure, Heroku, etc.)

## 💡 Tips

- Always backup your database before making major changes
- Use strong passwords in production
- Regularly update dependencies for security patches
- Monitor API performance and optimize queries
- Implement logging for debugging and auditing

## 🆘 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB if not running
sudo systemctl start mongod
```

### Port Already in Use
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in .env file
PORT=5001
```

### Frontend Not Loading
```bash
# Clear npm cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Documentation](https://react.dev/)
- [JWT Authentication](https://jwt.io/introduction)

---

**Happy Coding! 🎓**
