import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function HODDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hod, setHod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHODDetails();
  }, [id]);

  const fetchHODDetails = async () => {
    try {
      const response = await api.get(`/hods/${id}`);
      setHod(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch HOD details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading HOD details...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!hod) return <div className="alert alert-error">HOD not found</div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>HOD Details</h2>
        <button onClick={() => navigate('/hods')} className="btn btn-secondary">← Back to HODs</button>
      </div>

      {/* Personal Information */}
      <div className="detail-section">
        <h3>Personal Information</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <label>Full Name</label>
            <p>{hod.user?.firstName} {hod.user?.lastName}</p>
          </div>
          <div className="detail-item">
            <label>HOD ID</label>
            <p>{hod.hodId}</p>
          </div>
          <div className="detail-item">
            <label>Email</label>
            <p>{hod.user?.email}</p>
          </div>
          <div className="detail-item">
            <label>Phone</label>
            <p>{hod.user?.phone}</p>
          </div>
          <div className="detail-item">
            <label>NIC</label>
            <p>{hod.user?.nic}</p>
          </div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
            <label>Address</label>
            <p>{hod.user?.address}</p>
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="detail-section">
        <h3>Professional Information</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <label>Department</label>
            <p>{hod.department?.name}</p>
          </div>
          <div className="detail-item">
            <label>Qualification</label>
            <p>{hod.qualification}</p>
          </div>
          <div className="detail-item">
            <label>Appointment Date</label>
            <p>{hod.appointmentDate ? new Date(hod.appointmentDate).toLocaleDateString() : 'N/A'}</p>
          </div>
          <div className="detail-item">
            <label>Office Room</label>
            <p>{hod.officeRoom || 'N/A'}</p>
          </div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
            <label>Specialization</label>
            <p>{Array.isArray(hod.specialization) ? hod.specialization.join(', ') : hod.specialization || 'N/A'}</p>
          </div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
            <label>Office Hours</label>
            <p>{hod.officeHours || 'N/A'}</p>
          </div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
            <label>Responsibilities</label>
            <p>{hod.responsibilities || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HODDetail;
