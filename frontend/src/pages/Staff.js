import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await api.get('/staff');
      setStaff(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch staff');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading staff...</div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div className="card">
      <h2>Staff Management</h2>
      
      <button className="btn btn-primary" style={{ marginBottom: '20px' }}>
        Add New Staff Member
      </button>

      {staff.length === 0 ? (
        <p>No staff members found. Add your first staff member to get started.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Staff ID</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Staff Type</th>
              <th>Department</th>
              <th>Employment Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr key={member._id}>
                <td>{member.staffId}</td>
                <td>{member.user?.firstName} {member.user?.lastName}</td>
                <td>{member.designation}</td>
                <td>{member.staffType}</td>
                <td>{member.department?.name || 'N/A'}</td>
                <td>{member.employmentType}</td>
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

export default Staff;
