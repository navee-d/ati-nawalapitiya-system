# Manual CRUD Testing Checklist

## Prerequisites
- ✅ Backend server running on http://localhost:5000
- ✅ Frontend server running on http://localhost:3000
- ⚠️ MongoDB must be running (see MONGODB_SETUP.md)
- ✅ Database seeded with admin user (run: `node backend/scripts/seed.js`)

## Quick Test Commands

### Automated Testing (When MongoDB is running)
```bash
# Run all CRUD tests automatically
node test_all_cruds.js
```

### Manual Testing via Browser/Postman

## 1. Authentication Tests

### Login
- **URL**: http://localhost:3000/login
- **Credentials**: 
  - Email: `admin@ati.lk`
  - Password: `admin123`
- **Expected**: Should redirect to home page and store auth token

### API Login (Postman/cURL)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ati.lk","password":"admin123"}'
```

---

## 2. Department CRUD Tests

### ✅ Create Department
- Navigate to http://localhost:3000/departments
- Click "Add Department"
- Fill form:
  - Name: "Test IT Department"
  - Code: "TEST-IT"
  - Description: "Test Department"
  - Established Year: 2024
  - Building: "Building A"
  - Office Phone: "0352222111"
  - Email: "testit@ati.lk"
- Click Save

### ✅ Read Departments
- View departments list
- Check if test department appears

### ✅ Update Department
- Click Edit on test department
- Update building to "Building B"
- Save changes

### ✅ Delete Department
- Click Delete on test department
- Confirm deletion

---

## 3. Course CRUD Tests

### ✅ Create Course
- Navigate to http://localhost:3000/courses
- Click "Add Course"
- Fill form:
  - Course Code: "TEST101"
  - Course Name: "Test Programming"
  - Department: Select from dropdown
  - Credits: 3
  - Semester: 1
  - Year: 1
  - Description: "Test course"
  - Course Type: "Core"

### ✅ Read Courses
- View courses list
- Filter by department

### ✅ Update Course
- Edit test course
- Change credits to 4
- Save

### ✅ Delete Course
- Delete test course

---

## 4. Student CRUD Tests

### ✅ Create Student
- Navigate to http://localhost:3000/students
- Click "Add Student"
- Fill form:
  - Username: "teststudent"
  - Email: "teststudent@ati.lk"
  - Password: "student123"
  - First Name: "Test"
  - Last Name: "Student"
  - NIC: "199812345678"
  - Phone: "0771234567"
  - Student ID: "TESTSTU001"
  - Registration Number: "2024/TEST/001"
  - Department: Select
  - Course: Select
  - Batch: "2024"
  - Year of Study: 1
  - Semester: 1

### ✅ Read Students
- View students list
- Search/filter by department

### ✅ Update Student
- Edit test student
- Update year of study to 2
- Update GPA to 3.5

### ✅ Delete Student
- Delete test student

---

## 5. Lecturer CRUD Tests

### ✅ Create Lecturer
- Navigate to http://localhost:3000/lecturers
- Fill form:
  - Username: "testlecturer"
  - Email: "testlecturer@ati.lk"
  - First/Last Name
  - Lecturer ID: "TESTLEC001"
  - Department: Select
  - Designation: "Senior Lecturer"
  - Qualification: "PhD"
  - Specialization: Add items

### ✅ Read Lecturers
- View lecturers list
- Filter by department

### ✅ Update Lecturer
- Edit lecturer
- Change designation

### ✅ Delete Lecturer
- Delete test lecturer

---

## 6. HOD CRUD Tests

### ✅ Create HOD
- Navigate to http://localhost:3000/hods
- Fill form similar to lecturer
- HOD ID: "TESTHOD001"
- Appointment Date

### ✅ Read HODs
- View HODs list

### ✅ Update HOD
- Edit HOD
- Update office room

### ✅ Delete HOD
- Delete test HOD

---

## 7. Staff CRUD Tests

### ✅ Create Staff
- Navigate to http://localhost:3000/staff
- Fill form:
  - Staff ID: "TESTSTAFF001"
  - Job Title
  - Designation
  - Responsibilities

### ✅ Read Staff
- View staff list

### ✅ Update Staff
- Edit staff member

### ✅ Delete Staff
- Delete test staff

---

## 8. Timetable CRUD Tests

### ✅ Create Timetable Entry
- Navigate to http://localhost:3000/timetable
- Click "Add Entry"
- Fill form:
  - Course: Select
  - Lecturer: Select
  - Department: Select
  - Day: "Monday"
  - Start Time: "09:00"
  - End Time: "11:00"
  - Room: "TEST-101"
  - Academic Year: "2024"

### ✅ Read Timetable
- View timetable
- Filter by day/department

### ✅ Update Timetable
- Edit entry
- Change room/time

### ✅ Delete Timetable
- Delete entry

---

## 9. Convocation CRUD Tests

### ✅ Create Convocation
- Navigate to http://localhost:3000/convocation
- Fill form:
  - Title: "Test Convocation 2024"
  - Date: Select date
  - Time: "10:00"
  - Venue: "Main Hall"
  - Department: Select
  - Batch: "2024"
  - Chief Guest

### ✅ Read Convocations
- View convocations list

### ✅ Update Convocation
- Edit convocation
- Change venue/guest

### ✅ Delete Convocation
- Delete convocation

---

## API Testing with cURL/Postman

### Get Auth Token First
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ati.lk","password":"admin123"}'
```

Save the token from response, then use it in subsequent requests:

### Example: Create Department
```bash
curl -X POST http://localhost:5000/api/departments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Test IT",
    "code": "TEST-IT",
    "description": "Test Department",
    "establishedYear": 2024,
    "building": "Building A",
    "officePhone": "0352222111",
    "email": "testit@ati.lk"
  }'
```

### Example: Get All Departments
```bash
curl -X GET http://localhost:5000/api/departments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Example: Update Department
```bash
curl -X PUT http://localhost:5000/api/departments/DEPARTMENT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"building": "Building B"}'
```

### Example: Delete Department
```bash
curl -X DELETE http://localhost:5000/api/departments/DEPARTMENT_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Testing Status Checklist

- [ ] Authentication (Login/Register/Get Profile)
- [ ] Department CRUD (Create/Read/Update/Delete)
- [ ] Course CRUD
- [ ] Student CRUD
- [ ] Lecturer CRUD
- [ ] HOD CRUD
- [ ] Staff CRUD
- [ ] Timetable CRUD
- [ ] Convocation CRUD

---

## Expected Results

### Success Responses
- **Create (POST)**: Status 201, returns created object
- **Read (GET)**: Status 200, returns object(s)
- **Update (PUT)**: Status 200, returns updated object
- **Delete (DELETE)**: Status 200, returns success message

### Error Responses
- **401 Unauthorized**: No/invalid token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource doesn't exist
- **400 Bad Request**: Invalid data
- **500 Server Error**: Database/server issue

---

## Quick MongoDB Setup

If MongoDB is not running, follow one of these options:

### Option 1: Install MongoDB Locally
See [MONGODB_SETUP.md](MONGODB_SETUP.md) for detailed instructions

### Option 2: Use MongoDB Atlas (Free Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a free cluster
4. Get connection string
5. Update `.env` file with connection string

### Option 3: Use Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

After MongoDB is running:
```bash
# Seed database
node backend/scripts/seed.js

# Run automated tests
node test_all_cruds.js
```
