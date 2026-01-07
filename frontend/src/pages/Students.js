import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch students');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading students...</div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div className="card">
      <h2>Student Management</h2>
      
      <button className="btn btn-primary" style={{ marginBottom: '20px' }}>
        Add New Student
      </button>

      {students.length === 0 ? (
        <p>No students found. Add your first student to get started.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Registration No.</th>
              <th>Course</th>
              <th>Year</th>
              <th>GPA</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.studentId}</td>
                <td>{student.user?.firstName} {student.user?.lastName}</td>
                <td>{student.registrationNumber}</td>
                <td>{student.course?.courseName || 'N/A'}</td>
                <td>Year {student.yearOfStudy}</td>
                <td>{student.gpa.toFixed(2)}</td>
                <td>{student.academicStatus}</td>
                <td>
                  <button className="btn btn-primary" style={{ marginRight: '5px', padding: '5px 10px' }}>
                    Edit
                  </button>
                  <button className="btn btn-danger" style={{ padding: '5px 10px' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Students;
