# Import/Export System Guide

## Overview
The Import/Export system allows you to bulk import and export data for Students, Lecturers, Heads of Department (HOD), and Staff members using Excel files and PDF reports.

## Features

### 📥 Import Functionality
- **Upload Excel files** (.xlsx, .xls) with bulk data
- **Automatic detection** of new vs existing records
- **Smart updates** - existing records are updated, new ones are created
- **Validation** of all data fields
- **Detailed error reporting** for failed imports
- **Default passwords** set for new users

### 📤 Export Functionality
- **Excel Export** - Full data export with all fields for editing and re-import
- **PDF Export** - Formatted report for printing and presentations
- **Filtered by entity type** - Students, Lecturers, HOD, or Staff

---

## Import Excel Templates

### 1. Students Template

| Column Name | Required | Type | Example | Description |
|-------------|----------|------|---------|-------------|
| StudentID | ✅ Yes | Text | STU001 | Unique student identifier |
| FirstName | ✅ Yes | Text | John | Student's first name |
| LastName | ✅ Yes | Text | Doe | Student's last name |
| Email | ✅ Yes | Email | john@example.com | Student's email address |
| Phone | ❌ Optional | Text | 0771234567 | Phone number |
| RegistrationNumber | ❌ Optional | Text | REG2024001 | Registration number |
| CourseCode | ❌ Optional | Text | CS101 | Must match existing course |
| Department | ❌ Optional | Text | Computer Science | Must match existing dept |
| Batch | ❌ Optional | Text | 2024 | Batch year |
| YearOfStudy | ❌ Optional | Number | 1 | 1-4 |
| Semester | ❌ Optional | Number | 1 | 1-8 |
| EnrollmentDate | ❌ Optional | Date | 2024-01-15 | Enrollment date |

**Sample Row:**
```
StudentID: STU001
FirstName: John
LastName: Doe
Email: john.doe@example.com
Phone: 0771234567
RegistrationNumber: REG2024001
CourseCode: CS101
Department: Computer Science
Batch: 2024
YearOfStudy: 1
Semester: 1
EnrollmentDate: 2024-01-15
```

---

### 2. Lecturers Template

| Column Name | Required | Type | Example | Description |
|-------------|----------|------|---------|-------------|
| EmployeeID | ✅ Yes | Text | LEC001 | Unique lecturer identifier |
| FirstName | ✅ Yes | Text | Jane | Lecturer's first name |
| LastName | ✅ Yes | Text | Smith | Lecturer's last name |
| Email | ✅ Yes | Email | jane@example.com | Lecturer's email |
| Phone | ❌ Optional | Text | 0771234568 | Phone number |
| Department | ❌ Optional | Text | Computer Science | Must match existing dept |
| Qualification | ❌ Optional | Text | PhD | Highest qualification |
| Specialization | ❌ Optional | Text | AI | Area of expertise |
| Experience | ❌ Optional | Number | 5 | Years of experience |

**Sample Row:**
```
EmployeeID: LEC001
FirstName: Jane
LastName: Smith
Email: jane.smith@example.com
Phone: 0771234568
Department: Computer Science
Qualification: PhD
Specialization: Artificial Intelligence
Experience: 5
```

---

### 3. HOD Template

| Column Name | Required | Type | Example | Description |
|-------------|----------|------|---------|-------------|
| EmployeeID | ✅ Yes | Text | HOD001 | Unique HOD identifier |
| FirstName | ✅ Yes | Text | Robert | HOD's first name |
| LastName | ✅ Yes | Text | Johnson | HOD's last name |
| Email | ✅ Yes | Email | robert@example.com | HOD's email |
| Phone | ❌ Optional | Text | 0771234569 | Phone number |
| Department | ✅ Yes | Text | Computer Science | Must match existing dept |
| Qualification | ❌ Optional | Text | PhD | Highest qualification |
| Specialization | ❌ Optional | Text | Data Science | Area of expertise |

**Sample Row:**
```
EmployeeID: HOD001
FirstName: Robert
LastName: Johnson
Email: robert.johnson@example.com
Phone: 0771234569
Department: Computer Science
Qualification: PhD
Specialization: Data Science
```

---

### 4. Staff Template

| Column Name | Required | Type | Example | Description |
|-------------|----------|------|---------|-------------|
| EmployeeID | ✅ Yes | Text | STF001 | Unique staff identifier |
| FirstName | ✅ Yes | Text | Mary | Staff member's first name |
| LastName | ✅ Yes | Text | Williams | Staff member's last name |
| Email | ✅ Yes | Email | mary@example.com | Staff email |
| Phone | ❌ Optional | Text | 0771234570 | Phone number |
| Department | ❌ Optional | Text | Administration | Must match existing dept |
| Position | ❌ Optional | Text | Assistant | Job position |
| StaffType | ❌ Optional | Text | Administrative | Type of staff |

**Valid StaffType values:** Administrative, Technical, Support

**Sample Row:**
```
EmployeeID: STF001
FirstName: Mary
LastName: Williams
Email: mary.williams@example.com
Phone: 0771234570
Department: Administration
Position: Assistant
StaffType: Administrative
```

---

## How to Import Data

### Step 1: Prepare Your Excel File
1. Create a new Excel file (.xlsx or .xls)
2. Add column headers exactly as shown in the templates above
3. Fill in your data rows
4. Save the file

### Step 2: Select Entity Type
1. Go to **Import / Export** page in the navigation menu
2. Select the data type from the dropdown:
   - 👨‍🎓 Students
   - 👨‍🏫 Lecturers
   - 👔 Heads of Department
   - 👥 Staff Members

### Step 3: Upload File
1. Click **"Choose Excel File"** button
2. Select your prepared Excel file
3. Wait for the import process to complete

### Step 4: Review Results
After import, you'll see a summary showing:
- ✅ **Total rows** processed
- 🆕 **Created** - New records added
- 🔄 **Updated** - Existing records modified
- ❌ **Failed** - Rows with errors

If there are errors, they will be listed with row numbers and specific error messages.

---

## How to Export Data

### Export to Excel
1. Select the data type you want to export
2. Click **"Export to Excel"** button
3. The file will download automatically
4. Open in Excel for viewing or editing

**Use Excel export when:**
- You need to edit data in bulk
- You want to re-import data later
- You need all data fields

### Export to PDF
1. Select the data type you want to export
2. Click **"Export to PDF"** button
3. The PDF will download automatically
4. Open for viewing or printing

**Use PDF export when:**
- You need a formatted report
- You want to print the data
- You need to share read-only information

---

## Import Rules and Validation

### Update vs Create Logic
- **If the ID exists** (StudentID, EmployeeID), the record is **updated**
- **If the ID doesn't exist**, a new record is **created**

### Department and Course Matching
- Department names must **exactly match** existing departments in the system
- Course codes must **exactly match** existing course codes
- Matching is case-sensitive

### Default Passwords
New users created through import will have these default passwords:
- **Students**: `student123`
- **Lecturers**: `lecturer123`
- **HODs**: `hod123`
- **Staff**: `staff123`

⚠️ **Important:** Users should change their password after first login!

### Data Validation
The system validates:
- ✅ Required fields are not empty
- ✅ Email addresses are valid format
- ✅ IDs are unique
- ✅ Referenced entities exist (departments, courses)
- ✅ Numeric fields contain valid numbers

---

## Common Errors and Solutions

### Error: "Department not found"
**Problem:** The department name doesn't exist in the system  
**Solution:** 
1. Check the exact spelling of the department
2. Go to Departments page to see available departments
3. Create the department first if it doesn't exist

### Error: "Course not found"
**Problem:** The course code doesn't exist in the system  
**Solution:** 
1. Verify the course code spelling
2. Check the Courses page for existing codes
3. Create the course first if needed

### Error: "Email already exists"
**Problem:** The email is already registered to another user  
**Solution:** 
1. Use a unique email for each user
2. Check if the person already has an account

### Error: "Invalid email format"
**Problem:** The email address is not properly formatted  
**Solution:** Ensure emails follow format: `name@domain.com`

### Error: "Missing required fields"
**Problem:** Required columns are empty  
**Solution:** Fill in all required fields (marked with ✅ in templates)

---

## Best Practices

### 📋 Before Import
1. **Backup your data** - Export current data before large imports
2. **Test with small batch** - Try 5-10 rows first
3. **Validate data** - Check all required fields are filled
4. **Check references** - Ensure departments and courses exist
5. **Review formatting** - Dates, numbers, emails are correct

### 📊 During Import
1. **Monitor the progress** - Watch for error messages
2. **Save error reports** - Note any failures for fixing
3. **Don't refresh** - Let the process complete

### ✅ After Import
1. **Review the summary** - Check success/failure counts
2. **Fix errors** - Correct failed rows and re-import
3. **Verify data** - Spot-check some imported records
4. **Notify users** - Tell new users their default passwords

---

## File Limits and Restrictions

- **Maximum file size:** 10 MB
- **Supported formats:** .xlsx, .xls
- **Recommended rows per file:** Up to 1000 rows for best performance
- **For larger datasets:** Split into multiple files

---

## Tips for Success

### Excel Tips
- Use Excel's **Data Validation** to prevent entry errors
- **Freeze the header row** for easier data entry
- Use **formulas** to auto-generate IDs (e.g., STU001, STU002...)
- **Remove empty rows** before importing

### Data Management
- Keep a **master Excel template** for each entity type
- **Version your import files** (e.g., students_2024_01_15.xlsx)
- **Document changes** - Note what was imported and when
- **Regular backups** - Export data monthly

### Troubleshooting
- If upload fails, check your **file size**
- Ensure you're **logged in** before importing
- Try **different browser** if issues persist
- **Contact support** if errors persist after corrections

---

## Security Notes

⚠️ **Important Security Information:**

1. **Default Passwords** - All new accounts get default passwords that should be changed immediately
2. **Access Control** - Only authorized staff should import/export data
3. **Data Privacy** - Exported files contain sensitive information - handle securely
4. **Audit Trail** - All imports are logged with user and timestamp
5. **Backup** - Always export current data before major imports

---

## Support

If you encounter issues:
1. Check this guide for solutions
2. Review error messages carefully
3. Try the suggested solutions
4. Contact your system administrator
5. Provide error messages and sample data when seeking help

---

## Version History

- **v1.0** - Initial release with Students, Lecturers, HOD, and Staff import/export
- Supports Excel (.xlsx, .xls) import
- Supports Excel and PDF export
- Automated validation and error reporting
