import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Lecturers() {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLecturers();
  }, []);

  const fetchLecturers = async () => {
    try {
      const response = await api.get('/lecturers');
      setLecturers(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch lecturers');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading lecturers...</div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div className="card">
      <h2>Lecturer Management</h2>
      
      <button className="btn btn-primary" style={{ marginBottom: '20px' }}>
        Add New Lecturer
      </button>

      {lecturers.length === 0 ? (
        <p>No lecturers found. Add your first lecturer to get started.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Lecturer ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Qualification</th>
              <th>Employment Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {lecturers.map((lecturer) => (
              <tr key={lecturer._id}>
                <td>{lecturer.lecturerId}</td>
                <td>{lecturer.user?.firstName} {lecturer.user?.lastName}</td>
                <td>{lecturer.department?.name || 'N/A'}</td>
                <td>{lecturer.designation}</td>
                <td>{lecturer.qualification}</td>
                <td>{lecturer.employmentType}</td>
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

export default Lecturers;
