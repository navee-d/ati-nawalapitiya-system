import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingDept, setViewingDept] = useState(null);
  const [deptStudents, setDeptStudents] = useState([]);
  const [deptDetails, setDeptDetails] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    establishedYear: '',
    building: '',
    officePhone: '',
    email: ''
  });

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        await api.put(`/departments/${editingId}`, formData);
        alert('Department updated successfully');
      } else {
        await api.post('/departments', formData);
        alert('Department created successfully');
      }
      resetForm();
      fetchDepartments();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (dept) => {
    setEditingId(dept._id);
    setFormData({
      name: dept.name,
      code: dept.code,
      description: dept.description || '',
      establishedYear: dept.establishedYear || '',
      building: dept.building || '',
      officePhone: dept.officePhone || '',
      email: dept.email || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) {
      return;
    }
    try {
      await api.delete(`/departments/${id}`);
      alert('Department deleted successfully');
      fetchDepartments();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      establishedYear: '',
      building: '',
      officePhone: '',
      email: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const viewDepartmentDetails = async (deptId) => {
    setLoading(true);
    setError(null);
    try {
      const [deptRes, studentsRes] = await Promise.all([
        api.get(`/departments/${deptId}`),
        api.get(`/students/department/${deptId}`)
      ]);
      setDeptDetails(deptRes.data.data);
      setDeptStudents(studentsRes.data.data || []);
      setViewingDept(deptId);
      setLoading(false);
    } catch (err) {
      console.error('Error loading department details:', err);
      setError(err.response?.data?.message || 'Failed to load department details');
      setLoading(false);
    }
  };

  const closeDetails = () => {
    setViewingDept(null);
    setDeptDetails(null);
    setDeptStudents([]);
    setError(null);
  };

  if (viewingDept) {
    return (
      <div className="card">
        <button className="btn" onClick={closeDetails} style={{ marginBottom: '20px' }}>← Back to Departments</button>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        {loading ? (
          <div className="loading">Loading department details...</div>
        ) : deptDetails ? (
          <>
            <h2>{deptDetails.name} ({deptDetails.code})</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div className="stat-card" style={{ padding: '20px', background: 'var(--bg-card)', borderRadius: '8px' }}>
                <h3 style={{ margin: 0, color: '#3b82f6' }}>{deptDetails.studentCount || 0}</h3>
                <p style={{ margin: '5px 0 0', color: 'var(--text-secondary)' }}>Students</p>
              </div>
              <div className="stat-card" style={{ padding: '20px', background: 'var(--bg-card)', borderRadius: '8px' }}>
                <h3 style={{ margin: 0, color: '#8b5cf6' }}>{deptDetails.courseCount || 0}</h3>
                <p style={{ margin: '5px 0 0', color: 'var(--text-secondary)' }}>Courses</p>
              </div>
              <div className="stat-card" style={{ padding: '20px', background: 'var(--bg-card)', borderRadius: '8px' }}>
                <h3 style={{ margin: 0, color: '#10b981' }}>{deptDetails.lecturerCount || 0}</h3>
                <p style={{ margin: '5px 0 0', color: 'var(--text-secondary)' }}>Lecturers</p>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p><strong>Building:</strong> {deptDetails.building || 'N/A'}</p>
              <p><strong>Established:</strong> {deptDetails.establishedYear || 'N/A'}</p>
              <p><strong>Phone:</strong> {deptDetails.officePhone || 'N/A'}</p>
              <p><strong>Email:</strong> {deptDetails.email || 'N/A'}</p>
              {deptDetails.description && <p><strong>Description:</strong> {deptDetails.description}</p>}
            </div>

            <h3>Students in {deptDetails.name}</h3>
            {deptStudents.length === 0 ? (
              <p>No students in this department.</p>
            ) : (
              <table>
                <thead>
                  <tr><th>Student ID</th><th>Name</th><th>Registration No</th><th>Course</th><th>Year/Sem</th><th>Batch</th></tr>
                </thead>
                <tbody>
                  {deptStudents.map(s => (
                    <tr key={s._id}>
                      <td>{s.studentId}</td>
                      <td>{s.user?.firstName} {s.user?.lastName}</td>
                      <td>{s.registrationNumber}</td>
                      <td>{s.course?.courseName || 'N/A'}</td>
                      <td>Y{s.yearOfStudy}/S{s.semester}</td>
                      <td>{s.batch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        ) : null}
      </div>
    );
  }

  return (
    <div className="card">
      {error && <div className="alert alert-error">{error}</div>}
      
      <button 
        className="btn btn-primary" 
        style={{ marginBottom: '20px' }}
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cancel' : 'Add New Department'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <div className="form-group">
            <label>Department Code *</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              placeholder="e.g., IT"
            />
          </div>
          <div className="form-group">
            <label>Department Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Information Technology"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Department description"
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Established Year</label>
            <input
              type="number"
              name="establishedYear"
              value={formData.establishedYear}
              onChange={handleChange}
              placeholder="e.g., 2010"
            />
          </div>
          <div className="form-group">
            <label>Building</label>
            <input
              type="text"
              name="building"
              value={formData.building}
              onChange={handleChange}
              placeholder="e.g., Block A"
            />
          </div>
          <div className="form-group">
            <label>Office Phone</label>
            <input
              type="text"
              name="officePhone"
              value={formData.officePhone}
              onChange={handleChange}
              placeholder="e.g., 0352222111"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g., dept@ati.lk"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Update Department' : 'Create Department'}
          </button>
          {editingId && (
            <button 
              type="button" 
              className="btn" 
              onClick={resetForm}
              style={{ marginLeft: '10px' }}
            >
              Cancel Edit
            </button>
          )}
        </form>
      )}

      {loading ? (
        <div className="loading">Loading departments...</div>
      ) : departments.length === 0 ? (
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept._id}>
                <td>{dept.code}</td>
                <td>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); viewDepartmentDetails(dept._id); }}
                    style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}
                  >
                    {dept.name}
                  </a>
                </td>
                <td>{dept.building || 'N/A'}</td>
                <td>{dept.establishedYear || 'N/A'}</td>
                <td>{dept.officePhone || 'N/A'}</td>
                <td>
                  <button 
                    className="btn btn-primary" 
                    style={{ marginRight: '5px', padding: '5px 10px' }}
                    onClick={() => viewDepartmentDetails(dept._id)}
                  >
                    View
                  </button>
                  <button 
                    className="btn btn-primary" 
                    style={{ marginRight: '5px', padding: '5px 10px' }}
                    onClick={() => handleEdit(dept)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger" 
                    style={{ padding: '5px 10px' }}
                    onClick={() => handleDelete(dept._id)}
                  >
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
