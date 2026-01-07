import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './StudentsByDepartment.css';

function StudentsByDepartment() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Department icons mapping
  const deptIcons = {
    'IT': '💻',
    'ICT': '💻',
    'THM': '🏨',
    'MG': '📊',
    'BF': '💼',
    'ENGLISH': '📚',
    'ENG': '📚'
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments');
      const depts = response.data.data;
      setDepartments(depts);
      setLoading(false);
      
      // Auto-select first department
      if (depts.length > 0) {
        selectDepartment(depts[0]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch departments');
      setLoading(false);
    }
  };

  const selectDepartment = async (dept) => {
    setSelectedDept(dept);
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/students/department/${dept._id}`);
      setStudents(response.data.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch students');
      setLoading(false);
    }
  };

  const getDeptIcon = (deptCode) => {
    const code = deptCode?.toUpperCase() || '';
    for (const key in deptIcons) {
      if (code.includes(key)) {
        return deptIcons[key];
      }
    }
    return '🎓';
  };

  return (
    <div className="students-by-dept-container">
      {/* Sidebar */}
      <div className="dept-sidebar">
        <h3 className="sidebar-title">STUDENTS BY DEPARTMENT</h3>
        <div className="dept-list">
          {departments.map((dept) => (
            <div
              key={dept._id}
              className={`dept-item ${selectedDept?._id === dept._id ? 'active' : ''}`}
              onClick={() => selectDepartment(dept)}
            >
              <span className="dept-icon">{getDeptIcon(dept.code)}</span>
              <span className="dept-name">{dept.name} Students</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="dept-content">
        {selectedDept && (
          <div className="dept-header">
            <h2>
              <span className="dept-header-icon">{getDeptIcon(selectedDept.code)}</span>
              {selectedDept.name} Department Students
            </h2>
            <p className="dept-description">{selectedDept.description || 'View all students enrolled in this department'}</p>
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="no-data">
            <p>No students found in this department.</p>
          </div>
        ) : (
          <>
            <div className="students-summary">
              <div className="summary-card">
                <h4>{students.length}</h4>
                <p>Total Students</p>
              </div>
              <div className="summary-card">
                <h4>{new Set(students.map(s => s.batch)).size}</h4>
                <p>Batches</p>
              </div>
              <div className="summary-card">
                <h4>{new Set(students.map(s => s.course?._id)).size}</h4>
                <p>Courses</p>
              </div>
              <div className="summary-card">
                <h4>{students.filter(s => s.status === 'active').length}</h4>
                <p>Active Students</p>
              </div>
            </div>

            <div className="students-table-container">
              <table className="students-table table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Registration No</th>
                    <th>Course</th>
                    <th>Year</th>
                    <th>Semester</th>
                    <th>Batch</th>
                    <th>Status</th>
                    <th>Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id} onClick={() => navigate(`/students/${student._id}`)} style={{ cursor: 'pointer' }}>
                      <td>{student.studentId}</td>
                      <td>
                        <div className="student-name">
                          <strong>{student.user?.firstName} {student.user?.lastName}</strong>
                          <small>{student.user?.email}</small>
                        </div>
                      </td>
                      <td>{student.registrationNumber}</td>
                      <td>{student.course?.courseName || 'N/A'}</td>
                      <td>{student.yearOfStudy}</td>
                      <td>{student.semester}</td>
                      <td>
                        <span className="batch-badge">{student.batch}</span>
                      </td>
                      <td>
                        <span className={`status-badge status-${student.status}`}>
                          {student.status || 'active'}
                        </span>
                      </td>
                      <td>{student.user?.phone || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StudentsByDepartment;
