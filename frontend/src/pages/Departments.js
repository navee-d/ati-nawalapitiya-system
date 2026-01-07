import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments');
      setDepartments(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch departments');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading departments...</div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div className="card">
      <h2>Department Management</h2>
      
      <button className="btn btn-primary" style={{ marginBottom: '20px' }}>
        Add New Department
      </button>

      {departments.length === 0 ? (
        <p>No departments found. Add your first department to get started.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Building</th>
              <th>Established Year</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept._id}>
                <td>{dept.code}</td>
                <td>{dept.name}</td>
                <td>{dept.building || 'N/A'}</td>
                <td>{dept.establishedYear || 'N/A'}</td>
                <td>{dept.officePhone || 'N/A'}</td>
                <td>{dept.isActive ? 'Active' : 'Inactive'}</td>
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

export default Departments;
