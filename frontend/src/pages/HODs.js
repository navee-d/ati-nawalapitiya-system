import React, { useState, useEffect } from 'react';
import api from '../services/api';

function HODs() {
  const [hods, setHods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHODs();
  }, []);

  const fetchHODs = async () => {
    try {
      const response = await api.get('/hods');
      setHods(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch HODs');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading HODs...</div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div className="card">
      <h2>Head of Department Management</h2>
      
      <button className="btn btn-primary" style={{ marginBottom: '20px' }}>
        Add New HOD
      </button>

      {hods.length === 0 ? (
        <p>No HODs found. Add your first HOD to get started.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>HOD ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Qualification</th>
              <th>Appointment Date</th>
              <th>Office Room</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hods.map((hod) => (
              <tr key={hod._id}>
                <td>{hod.hodId}</td>
                <td>{hod.user?.firstName} {hod.user?.lastName}</td>
                <td>{hod.department?.name || 'N/A'}</td>
                <td>{hod.qualification}</td>
                <td>{new Date(hod.appointmentDate).toLocaleDateString()}</td>
                <td>{hod.officeRoom || 'N/A'}</td>
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

export default HODs;
