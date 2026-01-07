# ATI Nawalapitiya Campus Management System
## Client User Guide

---

## 📋 Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [System Features](#system-features)
4. [Import/Export Data](#importexport-data)
5. [Managing Students](#managing-students)
6. [Managing Staff](#managing-staff)
7. [Exam Management](#exam-management)
8. [Best Practices](#best-practices)
9. [Support](#support)

---

## 🎓 Introduction

Welcome to the **ATI Nawalapitiya Campus Management System** - a comprehensive solution for managing all aspects of your educational institution including students, staff, courses, exams, and administrative operations.

### Key Benefits
- ✅ **Centralized Data Management** - All information in one place
- ✅ **Bulk Import/Export** - Handle hundreds of records at once
- ✅ **Real-time Updates** - Instant data synchronization
- ✅ **Role-based Access** - Secure and organized permissions
- ✅ **Beautiful Interface** - Modern, intuitive design
- ✅ **Mobile Responsive** - Works on all devices

---

## 🚀 Getting Started

### First Login
1. Open the system URL in your web browser
2. Enter your credentials:
   - **Email**: Your assigned email address
   - **Password**: Your initial password
3. Click **Login**
4. **Important**: Change your password after first login!

### Dashboard Overview
After login, you'll see:
- **Left Sidebar**: Navigation menu
- **Main Area**: Content and forms
- **Top Bar**: User profile and settings

### Navigation Menu
- 🏠 **Dashboard** - Overview and quick stats
- 👨‍🎓 **Students** - Student management
- 👨‍🏫 **Lecturers** - Lecturer profiles
- 👔 **HODs** - Department heads
- 👥 **Staff** - Staff members
- 📚 **Courses** - Course catalog
- 📅 **Timetable** - Class schedules
- 📊 **Exam** - Exam results and applications
- 🔄 **Import/Export** - Bulk data operations

---

## ⚡ System Features

### 1. Student Management
- Add, edit, and delete student records
- View by department
- Track academic status
- Monitor attendance and GPA
- Store emergency contacts

### 2. Staff Management
- Manage lecturers, HODs, and administrative staff
- Track qualifications and experience
- Department assignments
- Contact information

### 3. Course Management
- Create and update courses
- Assign course codes
- Link to departments
- Set credit hours

### 4. Exam Management
- Record exam results
- Automatic grade calculation
- Department-wise filtering
- Bulk import results
- Generate reports

### 5. Import/Export System
- Bulk import from Excel files
- Export to Excel or PDF
- Support for all entity types
- Validation and error reporting

---

## 🔄 Import/Export Data

### Why Use Import/Export?

Instead of manually entering hundreds of records one by one, you can:
- 📥 **Import** entire datasets from Excel files
- 📤 **Export** data for reports, backup, or analysis
- 🔄 **Update** multiple records simultaneously
- ⚡ **Save time** - process hundreds of records in seconds

### Accessing Import/Export
1. Click **Import / Export** in the navigation menu
2. Select your data type from dropdown:
   - Students
   - Lecturers
   - Heads of Department
   - Staff Members

---

## 📥 Importing Data

### Step-by-Step Import Process

#### 1. Prepare Your Excel File

**For Students**, create an Excel file with these columns:

| StudentID | FirstName | LastName | Email | Phone | Department | Batch |
|-----------|-----------|----------|-------|-------|------------|-------|
| STU001 | John | Doe | john@example.com | 0771234567 | Computer Science | 2024 |
| STU002 | Jane | Smith | jane@example.com | 0771234568 | Engineering | 2024 |

**Required Columns** (must have data):
- StudentID
- FirstName
- LastName
- Email

**Optional Columns**:
- Phone, Department, CourseCode, Batch, YearOfStudy, Semester, EnrollmentDate, RegistrationNumber

#### 2. Upload the File
1. Go to **Import / Export** page
2. Select **Students** from dropdown
3. Click **"Choose Excel File"**
4. Select your prepared file
5. Wait for processing

#### 3. Review Results
You'll see a summary:
- ✅ **Successful**: Total records processed
- 🆕 **Created**: New records added
- 🔄 **Updated**: Existing records modified
- ❌ **Failed**: Errors with details

### Import Tips
- ✅ Column names are flexible (accepts "First Name", "FirstName", "first_name", etc.)
- ✅ System detects and shows you the columns it found
- ✅ Default passwords are set for new users (student123, lecturer123, etc.)
- ✅ Existing records are updated if ID matches
- ✅ Maximum file size: 10 MB

---

## 📤 Exporting Data

### Export to Excel
Perfect for:
- Data analysis
- Bulk editing
- Creating backups
- Sharing with team

**How to Export:**
1. Select entity type (Students, Lecturers, etc.)
2. Click **"Export to Excel"**
3. File downloads automatically
4. Open in Microsoft Excel or Google Sheets

### Export to PDF
Perfect for:
- Printing reports
- Professional presentations
- Read-only sharing
- Archive purposes

**How to Export:**
1. Select entity type
2. Click **"Export to PDF"**
3. PDF downloads automatically
4. Open with any PDF reader

---

## 👨‍🎓 Managing Students

### Adding a Single Student
1. Go to **Students** page
2. Click **Add Student**
3. Fill in the form:
   - Student ID (unique)
   - Personal information
   - Contact details
   - Department and course
   - Academic information
4. Click **Save Student**

### Editing Student Information
1. Find the student in the list
2. Click **Edit** button
3. Update the information
4. Click **Update Student**

### Viewing by Department
1. Go to **Students by Dept** page
2. Select department from dropdown
3. View filtered list
4. Export if needed

---

## 👥 Managing Staff

### Lecturers
Add and manage teaching staff:
- Employee ID
- Qualifications (BSc, MSc, PhD)
- Specialization
- Years of experience
- Department assignment
- Courses taught

### Heads of Department (HOD)
Manage department heads:
- Link to specific department
- Track appointment dates
- Administrative responsibilities

### Administrative Staff
Manage support staff:
- Position titles
- Staff type (Administrative, Technical, Support)
- Department assignments

---

## 📊 Exam Management

### Recording Exam Results

#### Method 1: Manual Entry
1. Go to **Exam** page
2. Click **Add Result**
3. Select student and course
4. Enter marks (0-100)
5. Grade and status calculate automatically
6. Click **Save Result**

#### Method 2: Bulk Import
1. Prepare Excel with columns:
   - StudentID, CourseCode, Marks, ExamDate
2. Go to **Exam** page
3. Click **Upload Excel/PDF**
4. Select your file
5. Review import results

### Grade Calculation
Grades are automatically assigned:
- **A+**: 85-100
- **A**: 75-84
- **B+**: 70-74
- **B**: 65-69
- **C+**: 60-64
- **C**: 55-59
- **D**: 40-54
- **F**: 0-39

Pass/Fail Status:
- **Pass**: Marks ≥ 40
- **Fail**: Marks < 40

### Filtering Results
- Filter by department
- View specific academic year
- Filter by semester
- Sort by marks, grade, or date

---

## ✅ Best Practices

### Data Entry
1. **Use Consistent Formats**
   - Student IDs: STU001, STU002, etc.
   - Dates: YYYY-MM-DD format
   - Phone: 10 digits without spaces

2. **Verify Before Import**
   - Check for duplicate IDs
   - Ensure required fields are filled
   - Validate department and course names

3. **Test First**
   - Import 5-10 records first
   - Verify they appear correctly
   - Then import larger datasets

### Data Management
1. **Regular Backups**
   - Export data weekly
   - Store in secure location
   - Keep version history

2. **Data Cleanup**
   - Remove duplicate entries
   - Update outdated information
   - Archive graduated students

3. **Security**
   - Change default passwords immediately
   - Don't share login credentials
   - Log out when finished

### Performance Tips
1. **For Large Imports**
   - Split files into batches of 500-1000 rows
   - Import during off-peak hours
   - Monitor for errors after each batch

2. **Browser Recommendations**
   - Use Chrome, Firefox, or Edge
   - Keep browser updated
   - Clear cache if experiencing issues

---

## 🔐 Security & Privacy

### User Roles
Different roles have different access levels:
- **Admin**: Full system access
- **HOD**: Department-level access
- **Lecturer**: Course and student access
- **Staff**: Limited administrative access
- **Student**: Personal information only

### Password Policy
- Change default password immediately
- Use strong passwords (mix of letters, numbers, symbols)
- Don't share passwords
- Contact admin if forgotten

### Data Privacy
- Student data is confidential
- Export files contain sensitive information
- Secure all exported files
- Follow institutional data policies

---

## 🆘 Troubleshooting

### Common Issues

**Problem**: Import fails with "Missing required fields"
**Solution**: Check that your Excel has StudentID, FirstName, LastName, and Email columns

**Problem**: "Department not found" error
**Solution**: Department name must exactly match existing departments. Create department first if needed.

**Problem**: Can't log in
**Solution**: Verify credentials, check caps lock, contact administrator

**Problem**: Excel export is empty
**Solution**: Ensure you have data in the system first, check filters aren't excluding all records

**Problem**: Upload button doesn't work
**Solution**: Check file size (max 10MB), ensure it's .xlsx or .xls format, try refreshing page

### Getting Help
1. Check this guide first
2. Review error messages carefully
3. Contact your system administrator
4. Provide screenshots when reporting issues

---

## 📞 Support

### Contact Information
- **System Administrator**: [Your IT Department]
- **Technical Support**: [Support Email/Phone]
- **Training**: [Training Coordinator]

### Documentation
- 📄 This User Guide
- 📄 Import/Export Guide (IMPORT_EXPORT_GUIDE.md)
- 📄 Excel Import Guide (EXCEL_IMPORT_GUIDE.md)

### Training
Request training sessions for:
- New users onboarding
- Import/Export workflows
- Advanced features
- System updates

---

## 🎯 Quick Reference

### Default Passwords
- Students: `student123`
- Lecturers: `lecturer123`
- HODs: `hod123`
- Staff: `staff123`

### File Formats
- Import: `.xlsx`, `.xls` (Excel)
- Export: `.xlsx` (Excel), `.pdf` (PDF)
- Max Size: 10 MB

### Required Fields
**Students**: StudentID, FirstName, LastName, Email
**Lecturers**: EmployeeID, FirstName, LastName, Email
**HODs**: EmployeeID, FirstName, LastName, Email, Department
**Staff**: EmployeeID, FirstName, LastName, Email

### Keyboard Shortcuts
- `Ctrl + S`: Save form (when editing)
- `Esc`: Close modal/cancel
- `Tab`: Navigate between fields

---

## 📈 Updates & Changelog

### Version 1.0 (Current)
- ✅ Student Management
- ✅ Staff Management (Lecturers, HOD, Staff)
- ✅ Course Management
- ✅ Exam Results with auto-grading
- ✅ Import/Export (Excel & PDF)
- ✅ Department filtering
- ✅ Timetable management
- ✅ Dark/Light theme

---

## 💡 Tips for Success

1. **Start Small**: Begin with one department or small batch
2. **Plan Your Data**: Organize before importing
3. **Train Your Team**: Ensure all users understand the system
4. **Regular Updates**: Keep data current
5. **Backup Often**: Export data regularly
6. **Report Issues**: Help improve the system

---

## ⭐ Conclusion

The ATI Nawalapitiya Campus Management System is designed to make your administrative tasks easier and more efficient. By using the bulk import/export features, you can save hours of manual data entry and maintain accurate, up-to-date records.

**Remember**: 
- Always backup before major changes
- Test imports with small datasets first
- Keep this guide handy for reference
- Contact support when needed

**Thank you for using our system!** 🎓

---

*For technical details and developer documentation, see the technical guides in the project repository.*
