# API Testing Guide for ATI Nawalapitiya Campus Management System

## Base URL
```
http://localhost:5000/api
```

## Getting Started

1. Start the server
2. Get an authentication token by logging in
3. Use the token in Authorization header for protected routes

---

## Authentication

### 1. Register New User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@ati.lk",
  "password": "test123",
  "role": "admin",
  "firstName": "Test",
  "lastName": "User",
  "nic": "199912345678",
  "phone": "0771234567",
  "address": "Nawalapitiya, Sri Lanka"
}
```

### 2. Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@ati.lk",
  "password": "admin123"
}

# Response will include a token - save it for other requests
```

### 3. Get Current User Profile
```bash
GET /api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## Departments

### 1. Create Department
```bash
POST /api/departments
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Information Technology",
  "code": "IT",
  "description": "Department of Information Technology",
  "establishedYear": 2010,
  "building": "Building A",
  "officePhone": "0352222111",
  "email": "it@ati.lk"
}
```

### 2. Get All Departments
```bash
GET /api/departments
Authorization: Bearer YOUR_TOKEN
```

### 3. Get Single Department
```bash
GET /api/departments/:id
Authorization: Bearer YOUR_TOKEN
```

### 4. Update Department
```bash
PUT /api/departments/:id
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "building": "New Building A",
  "officePhone": "0352222999"
}
```

### 5. Delete Department
```bash
DELETE /api/departments/:id
Authorization: Bearer YOUR_TOKEN
```

---

## Courses

### 1. Create Course
```bash
POST /api/courses
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "courseCode": "IT101",
  "courseName": "Introduction to Programming",
  "department": "DEPARTMENT_ID",
  "credits": 3,
  "semester": 1,
  "year": 1,
  "description": "Fundamentals of programming",
  "courseType": "Core"
}
```

### 2. Get All Courses
```bash
GET /api/courses
Authorization: Bearer YOUR_TOKEN
```

### 3. Get Courses by Department
```bash
GET /api/courses/department/:departmentId
Authorization: Bearer YOUR_TOKEN
```

### 4. Update Course
```bash
PUT /api/courses/:id
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "credits": 4,
  "description": "Updated description"
}
```

---

## Students

### 1. Create Student
```bash
POST /api/students
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
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
  "course": "COURSE_ID",
  "department": "DEPARTMENT_ID",
  "batch": "2024",
  "yearOfStudy": 1,
  "semester": 1,
  "enrollmentDate": "2024-01-15",
  "guardianName": "K. Perera",
  "guardianPhone": "0777654321",
  "emergencyContact": "0777654321"
}
```

### 2. Get All Students
```bash
GET /api/students
Authorization: Bearer YOUR_TOKEN
```

### 3. Get Single Student
```bash
GET /api/students/:id
Authorization: Bearer YOUR_TOKEN
```

### 4. Get Students by Department
```bash
GET /api/students/department/:departmentId
Authorization: Bearer YOUR_TOKEN
```

### 5. Update Student
```bash
PUT /api/students/:id
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "yearOfStudy": 2,
  "semester": 3,
  "gpa": 3.5,
  "attendance": 85
}
```

### 6. Delete Student
```bash
DELETE /api/students/:id
Authorization: Bearer YOUR_TOKEN
```

---

## Lecturers

### 1. Create Lecturer
```bash
POST /api/lecturers
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "username": "lecturer001",
  "email": "lecturer001@ati.lk",
  "password": "lecturer123",
  "firstName": "Kamal",
  "lastName": "Silva",
  "nic": "198512345678",
  "phone": "0771234567",
  "address": "Colombo, Sri Lanka",
  "lecturerId": "LEC001",
  "department": "DEPARTMENT_ID",
  "designation": "Senior Lecturer",
  "qualification": "PhD in Computer Science",
  "specialization": ["Machine Learning", "Data Science"],
  "joinDate": "2015-01-15",
  "officeRoom": "A101",
  "officeHours": "Mon-Fri 2PM-4PM",
  "employmentType": "Full-time"
}
```

### 2. Get All Lecturers
```bash
GET /api/lecturers
Authorization: Bearer YOUR_TOKEN
```

### 3. Get Lecturers by Department
```bash
GET /api/lecturers/department/:departmentId
Authorization: Bearer YOUR_TOKEN
```

### 4. Update Lecturer
```bash
PUT /api/lecturers/:id
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "designation": "Professor",
  "officeRoom": "A201"
}
```

---

## HODs

### 1. Create HOD
```bash
POST /api/hods
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "username": "hod001",
  "email": "hod001@ati.lk",
  "password": "hod123",
  "firstName": "Sunil",
  "lastName": "Fernando",
  "nic": "197512345678",
  "phone": "0771234567",
  "address": "Gampaha, Sri Lanka",
  "hodId": "HOD001",
  "department": "DEPARTMENT_ID",
  "qualification": "PhD in Information Technology",
  "specialization": ["Software Engineering", "Project Management"],
  "appointmentDate": "2018-01-01",
  "officeRoom": "A301",
  "officeHours": "Mon-Fri 9AM-12PM",
  "responsibilities": ["Department Management", "Curriculum Development", "Staff Supervision"]
}
```

### 2. Get All HODs
```bash
GET /api/hods
Authorization: Bearer YOUR_TOKEN
```

### 3. Update HOD
```bash
PUT /api/hods/:id
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "officeHours": "Mon-Fri 10AM-1PM"
}
```

---

## Staff

### 1. Create Staff Member
```bash
POST /api/staff
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "username": "staff001",
  "email": "staff001@ati.lk",
  "password": "staff123",
  "firstName": "Saman",
  "lastName": "Jayawardena",
  "nic": "198812345678",
  "phone": "0771234567",
  "address": "Kandy, Sri Lanka",
  "staffId": "STF001",
  "department": "DEPARTMENT_ID",
  "designation": "Lab Technician",
  "staffType": "Technical",
  "joinDate": "2019-03-01",
  "officeRoom": "Lab 1",
  "workingHours": "Mon-Fri 8AM-4PM",
  "employmentType": "Full-time",
  "responsibilities": ["Lab Maintenance", "Equipment Management"]
}
```

### 2. Get All Staff
```bash
GET /api/staff
Authorization: Bearer YOUR_TOKEN
```

### 3. Get Staff by Type
```bash
GET /api/staff/type/Technical
Authorization: Bearer YOUR_TOKEN

# Available types: Administrative, Technical, Support, Maintenance, Library, IT
```

### 4. Update Staff
```bash
PUT /api/staff/:id
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "designation": "Senior Lab Technician",
  "workingHours": "Mon-Fri 9AM-5PM"
}
```

---

## Sample Test Workflow

### Step 1: Login and Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ati.lk","password":"admin123"}'
```

### Step 2: Create a Department
```bash
curl -X POST http://localhost:5000/api/departments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Computer Science",
    "code": "CS",
    "description": "Computer Science Department",
    "establishedYear": 2020
  }'
```

### Step 3: Create a Course
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "courseCode": "CS101",
    "courseName": "Programming Fundamentals",
    "department": "DEPT_ID_FROM_STEP_2",
    "credits": 3,
    "semester": 1,
    "year": 1,
    "courseType": "Core"
  }'
```

### Step 4: Create a Student
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "username": "student001",
    "email": "student001@ati.lk",
    "password": "student123",
    "firstName": "John",
    "lastName": "Doe",
    "nic": "199912345678",
    "phone": "0771234567",
    "address": "Colombo",
    "studentId": "STU001",
    "registrationNumber": "2024/CS/001",
    "course": "COURSE_ID_FROM_STEP_3",
    "department": "DEPT_ID_FROM_STEP_2",
    "batch": "2024",
    "yearOfStudy": 1,
    "semester": 1,
    "enrollmentDate": "2024-01-15"
  }'
```

### Step 5: View All Students
```bash
curl -X GET http://localhost:5000/api/students \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Response Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Notes

- Replace `YOUR_TOKEN` with the actual JWT token received from login
- Replace `DEPARTMENT_ID`, `COURSE_ID`, etc. with actual MongoDB ObjectIds
- All timestamps are in ISO 8601 format
- Passwords are automatically hashed before storage
- All dates should be in YYYY-MM-DD format
