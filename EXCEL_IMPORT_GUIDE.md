# Excel Import Guide for Exam Results

## Overview
The system allows you to import exam results from Excel files (.xlsx or .xls) to update multiple student results at once using their Student IDs.

## Excel File Format

### Required Columns
Your Excel file should have the following columns (column names are case-insensitive):

| Column Name | Required | Description | Example |
|-------------|----------|-------------|---------|
| StudentID | ✅ Yes | Student's unique ID | STU001, 2023/CS/001 |
| CourseCode | ✅ Yes | Course code | CS101, ENG201 |
| Marks | ✅ Yes | Marks obtained (0-100) | 85, 67.5 |
| AcademicYear | ❌ Optional | Academic year | 2024, 2023/2024 |
| Semester | ❌ Optional | Semester number (1-8) | 1, 2 |
| ExamDate | ❌ Optional | Date of exam | 2024-01-15 |
| Remarks | ❌ Optional | Additional notes | Excellent performance |

### Alternative Column Names
The system accepts these variations:
- **StudentID**: StudentID, Student ID, studentId
- **CourseCode**: CourseCode, Course Code, courseCode
- **AcademicYear**: AcademicYear, Academic Year, academicYear
- **ExamDate**: ExamDate, Exam Date, examDate

### Sample Excel Data

```
StudentID    | CourseCode | AcademicYear | Semester | ExamDate   | Marks | Remarks
-------------|------------|--------------|----------|------------|-------|------------------
STU001       | CS101      | 2024         | 1        | 2024-01-15 | 85    | Excellent
STU002       | CS101      | 2024         | 1        | 2024-01-15 | 72    | Good performance
STU003       | CS101      | 2024         | 1        | 2024-01-15 | 45    | Pass
STU004       | ENG201     | 2024         | 1        | 2024-01-15 | 35    | Needs improvement
```

## How It Works

### 1. Automatic Grade Calculation
The system automatically calculates grades based on marks:
- **A+**: 85-100
- **A**: 75-84
- **B+**: 70-74
- **B**: 65-69
- **C+**: 60-64
- **C**: 55-59
- **D**: 40-54
- **F**: 0-39

### 2. Pass/Fail Status
- **Pass**: Marks >= 40
- **Fail**: Marks < 40

### 3. Student Matching
- The system uses **Student ID** (not database ID) to match students
- Make sure the Student ID in your Excel file exactly matches the Student ID in the system

### 4. Update or Create
- If a result already exists for a student/course/year/semester combination, it will be **updated**
- If no result exists, a new record will be **created**

## Import Process

1. **Prepare Your Excel File**
   - Use the template format above
   - Ensure Student IDs match your system records
   - Verify course codes are correct
   - Marks should be between 0-100

2. **Upload the File**
   - Go to Exam Management page
   - Click "📤 Upload Excel/PDF" button
   - Select your Excel file (.xlsx or .xls)
   - The system will process the file

3. **Review Results**
   - After upload, you'll see a summary showing:
     - Total rows processed
     - ✅ Successful imports
     - 🆕 New records created
     - 🔄 Existing records updated
     - ❌ Failed imports with error details

## Common Errors and Solutions

### Error: "Student not found"
- **Cause**: The Student ID in Excel doesn't match any student in the system
- **Solution**: Verify the Student ID is correct and exists in the Students database

### Error: "Course not found"
- **Cause**: The Course Code doesn't match any course in the system
- **Solution**: Check the course code spelling and ensure the course exists

### Error: "Invalid marks"
- **Cause**: Marks are not a number or outside 0-100 range
- **Solution**: Ensure marks are numeric values between 0 and 100

### Error: "Student ID is required"
- **Cause**: The StudentID column is empty for that row
- **Solution**: Fill in the Student ID for all rows

### Error: "Course Code is required"
- **Cause**: The CourseCode column is empty for that row
- **Solution**: Fill in the Course Code for all rows

## Best Practices

1. **Test with Small Batches**
   - Start by importing a few records to verify the format
   - Once confirmed, import larger batches

2. **Backup Before Import**
   - Export existing results before doing large imports
   - This allows you to restore if needed

3. **Check Data Quality**
   - Remove empty rows
   - Ensure no special characters in Student IDs
   - Verify dates are in a recognizable format

4. **Review Error Report**
   - After import, check the error report carefully
   - Fix errors in Excel and re-import failed rows

## File Size Limit
- Maximum file size: **5 MB**
- For larger datasets, split into multiple files

## Tips for Success
- Use the exact Student ID format from your system
- Double-check course codes before importing
- Keep your Excel file clean and properly formatted
- Use Excel's data validation to prevent entry errors
- Save a copy of your Excel template for future imports
