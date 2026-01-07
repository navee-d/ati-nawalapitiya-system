import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [examResults, setExamResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudentDetails();
    fetchExamResults();
  }, [id]);

  const fetchStudentDetails = async () => {
    try {
      const response = await api.get(`/students/${id}`);
      setStudent(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch student details');
    } finally {
      setLoading(false);
    }
  };

  const fetchExamResults = async () => {
    try {
      const response = await api.get(`/exam-results/student/${id}`);
      setExamResults(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch exam results:', err);
    }
  };

  if (loading) return <div className="loading">Loading student details...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!student) return <div className="alert alert-error">Student not found</div>;

  const calculateGPA = (results) => {
    if (!results.length) return 'N/A';
    const total = results.reduce((sum, r) => sum + (r.grade || 0), 0);
    return (total / results.length).toFixed(2);
  };

  const groupedResults = examResults.reduce((acc, result) => {
    const key = `${result.academicYear}-${result.semester}`;
    if (!acc[key]) {
      acc[key] = {
        academicYear: result.academicYear,
        semester: result.semester,
        results: []
      };
    }
    acc[key].results.push(result);
    return acc;
  }, {});

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Student Details</h2>
        <button onClick={() => navigate('/students')} className="btn btn-secondary">← Back to Students</button>
      </div>

      {/* Personal Information */}
      <div className="detail-section">
        <h3>Personal Information</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <label>Full Name</label>
            <p>{student.user?.firstName} {student.user?.lastName}</p>
          </div>
          <div className="detail-item">
            <label>Student ID</label>
            <p>{student.studentId}</p>
          </div>
          <div className="detail-item">
            <label>Registration Number</label>
            <p>{student.registrationNumber}</p>
          </div>
          <div className="detail-item">
            <label>Email</label>
            <p>{student.user?.email}</p>
          </div>
          <div className="detail-item">
            <label>NIC</label>
            <p>{student.user?.nic}</p>
          </div>
          <div className="detail-item">
            <label>Phone</label>
            <p>{student.user?.phone}</p>
          </div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
            <label>Address</label>
            <p>{student.user?.address}</p>
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className="detail-section">
        <h3>Academic Information</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <label>Department</label>
            <p>{student.department?.name}</p>
          </div>
          <div className="detail-item">
            <label>Course</label>
            <p>{student.course?.courseName}</p>
          </div>
          <div className="detail-item">
            <label>Batch</label>
            <p>{student.batch}</p>
          </div>
          <div className="detail-item">
            <label>Year of Study</label>
            <p>Year {student.yearOfStudy}</p>
          </div>
          <div className="detail-item">
            <label>Current Semester</label>
            <p>Semester {student.semester}</p>
          </div>
          <div className="detail-item">
            <label>Enrollment Date</label>
            <p>{new Date(student.enrollmentDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Guardian Information */}
      <div className="detail-section">
        <h3>Guardian Information</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <label>Guardian Name</label>
            <p>{student.guardianName || 'N/A'}</p>
          </div>
          <div className="detail-item">
            <label>Guardian Phone</label>
            <p>{student.guardianPhone || 'N/A'}</p>
          </div>
          <div className="detail-item">
            <label>Emergency Contact</label>
            <p>{student.emergencyContact || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Exam Results */}
      <div className="detail-section">
        <h3>Exam Results</h3>
        {Object.keys(groupedResults).length > 0 ? (
          Object.keys(groupedResults).sort().map(key => {
            const semesterData = groupedResults[key];
            return (
              <div key={key} style={{ marginBottom: '30px' }}>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '15px' }}>
                  Academic Year {semesterData.academicYear} - Semester {semesterData.semester}
                </h4>
                <table style={{ width: '100%', marginBottom: '10px' }}>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Grade</th>
                      <th>Marks</th>
                      <th>Status</th>
                      <th>Exam Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semesterData.results.map(result => (
                      <tr key={result._id}>
                        <td>{result.course?.courseName || result.course?.courseCode}</td>
                        <td><strong>{result.grade || 'N/A'}</strong></td>
                        <td>{result.marks !== undefined ? result.marks : 'N/A'}</td>
                        <td>
                          <span className={`badge ${result.status === 'Pass' ? 'badge-success' : result.status === 'Fail' ? 'badge-danger' : 'badge-warning'}`}>
                            {result.status || 'Pending'}
                          </span>
                        </td>
                        <td>{result.examDate ? new Date(result.examDate).toLocaleDateString() : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                  <strong>Semester GPA: {calculateGPA(semesterData.results)}</strong>
                </div>
              </div>
            );
          })
        ) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
            No exam results available yet
          </p>
        )}
      </div>
    </div>
  );
}

export default StudentDetail;
