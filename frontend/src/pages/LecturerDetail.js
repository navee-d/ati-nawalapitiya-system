import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function LecturerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lecturer, setLecturer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLecturerDetails();
  }, [id]);

  const fetchLecturerDetails = async () => {
    try {
      const response = await api.get(`/lecturers/${id}`);
      setLecturer(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch lecturer details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading lecturer details...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!lecturer) return <div className="alert alert-error">Lecturer not found</div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Lecturer Details</h2>
        <button onClick={() => navigate('/lecturers')} className="btn btn-secondary">← Back to Lecturers</button>
      </div>

      {/* Personal Information */}
      <div className="detail-section">
        <h3>Personal Information</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <label>Full Name</label>
            <p>{lecturer.user?.firstName} {lecturer.user?.lastName}</p>
          </div>
          <div className="detail-item">
            <label>Lecturer ID</label>
            <p>{lecturer.lecturerId}</p>
          </div>
          <div className="detail-item">
            <label>Email</label>
            <p>{lecturer.user?.email}</p>
          </div>
          <div className="detail-item">
            <label>Phone</label>
            <p>{lecturer.user?.phone}</p>
          </div>
          <div className="detail-item">
            <label>NIC</label>
            <p>{lecturer.user?.nic}</p>
          </div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
            <label>Address</label>
            <p>{lecturer.user?.address}</p>
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="detail-section">
        <h3>Professional Information</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <label>Department</label>
            <p>{lecturer.department?.name}</p>
          </div>
          <div className="detail-item">
            <label>Designation</label>
            <p>{lecturer.designation}</p>
          </div>
          <div className="detail-item">
            <label>Qualification</label>
            <p>{lecturer.qualification}</p>
          </div>
          <div className="detail-item">
            <label>Employment Type</label>
            <p>{lecturer.employmentType}</p>
          </div>
          <div className="detail-item">
            <label>Join Date</label>
            <p>{lecturer.joinDate ? new Date(lecturer.joinDate).toLocaleDateString() : 'N/A'}</p>
          </div>
          <div className="detail-item">
            <label>Office Room</label>
            <p>{lecturer.officeRoom || 'N/A'}</p>
          </div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
            <label>Specialization</label>
            <p>{Array.isArray(lecturer.specialization) ? lecturer.specialization.join(', ') : lecturer.specialization || 'N/A'}</p>
          </div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
            <label>Office Hours</label>
            <p>{lecturer.officeHours || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Courses Taught */}
      {lecturer.coursesTaught && lecturer.coursesTaught.length > 0 && (
        <div className="detail-section">
          <h3>Courses Taught</h3>
          <div className="courses-list">
            {lecturer.coursesTaught.map(course => (
              <div key={course._id} className="course-badge">
                {course.courseCode} - {course.courseName}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LecturerDetail;
