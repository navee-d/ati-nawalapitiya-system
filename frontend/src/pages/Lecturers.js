import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Lecturers() {
  const navigate = useNavigate();
  const [lecturers, setLecturers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    email: '', password: '', firstName: '', lastName: '', nic: '', phone: '', address: '',
    lecturerId: '', department: '', designation: '', qualification: '', specialization: '', employmentType: 'Full-Time', joinDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => { fetchLecturers(); fetchDepartments(); }, []);

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

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments');
      setDepartments(response.data.data);
    } catch (err) { console.error('Failed to fetch departments'); }
  };

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(null);
    try {
      if (editingId) {
        await api.put(`/lecturers/${editingId}`, formData);
        alert('Lecturer updated');
      } else {
        await api.post('/lecturers', formData);
        alert('Lecturer created');
      }
      resetForm(); fetchLecturers();
    } catch (err) { setError(err.response?.data?.message || 'Operation failed'); }
  };

  const handleEdit = (lec) => {
    setEditingId(lec._id);
    setFormData({
      email: lec.user?.email || '', password: '',
      firstName: lec.user?.firstName || '', lastName: lec.user?.lastName || '',
      nic: lec.user?.nic || '', phone: lec.user?.phone || '', address: lec.user?.address || '',
      lecturerId: lec.lecturerId || '', department: lec.department?._id || '',
      designation: lec.designation || '', qualification: lec.qualification || '',
      specialization: lec.specialization?.join(', ') || '', employmentType: lec.employmentType || 'Full-Time',
      joinDate: lec.joinDate ? new Date(lec.joinDate).toISOString().split('T')[0] : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete lecturer and user account?')) return;
    try { await api.delete(`/lecturers/${id}`); alert('Deleted'); fetchLecturers(); }
    catch (err) { setError(err.response?.data?.message || 'Delete failed'); }
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', firstName: '', lastName: '', nic: '', phone: '', address: '', lecturerId: '', department: '', designation: '', qualification: '', specialization: '', employmentType: 'Full-Time', joinDate: new Date().toISOString().split('T')[0] });
    setEditingId(null); setShowForm(false);
  };

  return (
    <div className="card">
      <h2>Lecturer Management</h2>
      {error && <div className="alert alert-error">{error}</div>}
      <button className="btn btn-primary" style={{ marginBottom: '20px' }} onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : 'Add New Lecturer'}</button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <h3>User Account</h3>
          <div className="form-group"><label>Email *</label><input type="email" name="email" value={formData.email} onChange={handleChange} required /></div>
          {!editingId && <div className="form-group"><label>Password *</label><input type="password" name="password" value={formData.password} onChange={handleChange} required={!editingId} /></div>}
          <div className="form-group"><label>First Name *</label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required /></div>
          <div className="form-group"><label>Last Name *</label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required /></div>
          <div className="form-group"><label>NIC *</label><input type="text" name="nic" value={formData.nic} onChange={handleChange} required /></div>
          <div className="form-group"><label>Phone *</label><input type="text" name="phone" value={formData.phone} onChange={handleChange} required /></div>
          <div className="form-group"><label>Address *</label><textarea name="address" value={formData.address} onChange={handleChange} required rows="2" /></div>
          <h3>Lecturer Info</h3>
          <div className="form-group"><label>Lecturer ID *</label><input type="text" name="lecturerId" value={formData.lecturerId} onChange={handleChange} required /></div>
          <div className="form-group"><label>Department *</label><select name="department" value={formData.department} onChange={handleChange} required><option value="">Select</option>{departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}</select></div>
          <div className="form-group"><label>Designation *</label><input type="text" name="designation" value={formData.designation} onChange={handleChange} required placeholder="e.g., Senior Lecturer" /></div>
          <div className="form-group"><label>Qualification *</label><input type="text" name="qualification" value={formData.qualification} onChange={handleChange} required placeholder="e.g., MSc, PhD" /></div>
          <div className="form-group"><label>Specialization</label><input type="text" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="Comma separated" /></div>
          <div className="form-group"><label>Employment Type *</label><select name="employmentType" value={formData.employmentType} onChange={handleChange} required><option value="Full-Time">Full-Time</option><option value="Part-Time">Part-Time</option><option value="Visiting">Visiting</option></select></div>
          <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Create'}</button>
          {editingId && <button type="button" className="btn" onClick={resetForm} style={{ marginLeft: '10px' }}>Cancel</button>}
        </form>
      )}

      {loading ? <div className="loading">Loading...</div> : lecturers.length === 0 ? <p>No lecturers found.</p> : (
        <table className="table">
          <thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Designation</th><th>Qualification</th><th>Type</th><th>Actions</th></tr></thead>
          <tbody>
            {lecturers.map(l => (<tr key={l._id} onClick={(e) => { if (!e.target.closest('button')) navigate(`/lecturers/${l._id}`); }}><td>{l.lecturerId}</td><td>{l.user?.firstName} {l.user?.lastName}</td><td>{l.department?.name || 'N/A'}</td><td>{l.designation}</td><td>{l.qualification}</td><td>{l.employmentType}</td><td><button className="btn btn-primary" style={{ marginRight: '5px', padding: '5px 10px' }} onClick={(e) => { e.stopPropagation(); handleEdit(l); }}>Edit</button><button className="btn btn-danger" style={{ padding: '5px 10px' }} onClick={(e) => { e.stopPropagation(); handleDelete(l._id); }}>Delete</button></td></tr>))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Lecturers;
