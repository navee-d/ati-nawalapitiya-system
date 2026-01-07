import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function StaffDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStaffDetails();
  }, [id]);

  const fetchStaffDetails = async () => {
    try {
      const response = await api.get(`/staff/${id}`);
      setStaff(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch staff details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading staff details...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!staff) return <div className="alert alert-error">Staff member not found</div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Staff Details</h2>
        <button onClick={() => navigate('/staff')} className="btn btn-secondary">← Back to Staff</button>
      </div>

      {/* Personal Information */}
      <div className="detail-section">
        <h3>Personal Information</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <label>Full Name</label>
            <p>{staff.user?.firstName} {staff.user?.lastName}</p>
          </div>
          <div className="detail-item">
            <label>Staff ID</label>
            <p>{staff.staffId}</p>
          </div>
          <div className="detail-item">
            <label>Email</label>
            <p>{staff.user?.email}</p>
          </div>
          <div className="detail-item">
            <label>Phone</label>
            <p>{staff.user?.phone}</p>
          </div>
          <div className="detail-item">
            <label>NIC</label>
            <p>{staff.user?.nic}</p>
          </div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
            <label>Address</label>
            <p>{staff.user?.address}</p>
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="detail-section">
        <h3>Professional Information</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <label>Department</label>
            <p>{staff.department?.name || 'N/A'}</p>
          </div>
          <div className="detail-item">
            <label>Designation</label>
            <p>{staff.designation}</p>
          </div>
          <div className="detail-item">
            <label>Staff Type</label>
            <p>{staff.staffType}</p>
          </div>
          <div className="detail-item">
            <label>Employment Type</label>
            <p>{staff.employmentType}</p>
          </div>
          <div className="detail-item">
            <label>Join Date</label>
            <p>{staff.joinDate ? new Date(staff.joinDate).toLocaleDateString() : 'N/A'}</p>
          </div>
          <div className="detail-item">
            <label>Office Room</label>
            <p>{staff.officeRoom || 'N/A'}</p>
          </div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
            <label>Working Hours</label>
            <p>{staff.workingHours || 'N/A'}</p>
          </div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
            <label>Responsibilities</label>
            <p>{staff.responsibilities || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffDetail;
