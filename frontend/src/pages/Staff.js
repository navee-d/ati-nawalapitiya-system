import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Staff() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    email: '', password: '', firstName: '', lastName: '', nic: '', phone: '', address: '',
    staffId: '', department: '', designation: '', staffType: 'Administrative', employmentType: 'Full-Time', joinDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => { fetchStaff(); fetchDepartments(); }, []);

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

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments');
      setDepartments(response.data.data);
    } catch (err) { console.error('Failed'); }
  };

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(null);
    try {
      if (editingId) { await api.put(`/staff/${editingId}`, formData); alert('Updated'); }
      else { await api.post('/staff', formData); alert('Created'); }
      resetForm(); fetchStaff();
    } catch (err) { setError(err.response?.data?.message || 'Failed'); }
  };

  const handleEdit = (s) => {
    setEditingId(s._id);
    setFormData({
      email: s.user?.email || '', password: '',
      firstName: s.user?.firstName || '', lastName: s.user?.lastName || '',
      nic: s.user?.nic || '', phone: s.user?.phone || '', address: s.user?.address || '',
      staffId: s.staffId || '', department: s.department?._id || '',
      designation: s.designation || '', staffType: s.staffType || 'Administrative',
      employmentType: s.employmentType || 'Full-Time',
      joinDate: s.joinDate ? new Date(s.joinDate).toISOString().split('T')[0] : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    try { await api.delete(`/staff/${id}`); alert('Deleted'); fetchStaff(); }
    catch (err) { setError(err.response?.data?.message || 'Failed'); }
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', firstName: '', lastName: '', nic: '', phone: '', address: '', staffId: '', department: '', designation: '', staffType: 'Administrative', employmentType: 'Full-Time', joinDate: new Date().toISOString().split('T')[0] });
    setEditingId(null); setShowForm(false);
  };

  return (
    <div className="card">
      <h2>Staff Management</h2>
      {error && <div className="alert alert-error">{error}</div>}
      <button className="btn btn-primary" style={{ marginBottom: '20px' }} onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : 'Add Staff'}</button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <div className="form-group"><label>Email *</label><input type="email" name="email" value={formData.email} onChange={handleChange} required /></div>
          {!editingId && <div className="form-group"><label>Password *</label><input type="password" name="password" value={formData.password} onChange={handleChange} required={!editingId} /></div>}
          <div className="form-group"><label>First Name *</label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required /></div>
          <div className="form-group"><label>Last Name *</label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required /></div>
          <div className="form-group"><label>NIC *</label><input type="text" name="nic" value={formData.nic} onChange={handleChange} required /></div>
          <div className="form-group"><label>Phone *</label><input type="text" name="phone" value={formData.phone} onChange={handleChange} required /></div>
          <div className="form-group"><label>Address *</label><textarea name="address" value={formData.address} onChange={handleChange} required rows="2" /></div>
          <div className="form-group"><label>Staff ID *</label><input type="text" name="staffId" value={formData.staffId} onChange={handleChange} required /></div>
          <div className="form-group"><label>Department</label><select name="department" value={formData.department} onChange={handleChange}><option value="">Select</option>{departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}</select></div>
          <div className="form-group"><label>Designation *</label><input type="text" name="designation" value={formData.designation} onChange={handleChange} required /></div>
          <div className="form-group"><label>Staff Type *</label><select name="staffType" value={formData.staffType} onChange={handleChange} required><option value="Administrative">Administrative</option><option value="Technical">Technical</option><option value="Support">Support</option></select></div>
          <div className="form-group"><label>Employment Type *</label><select name="employmentType" value={formData.employmentType} onChange={handleChange} required><option value="Full-Time">Full-Time</option><option value="Part-Time">Part-Time</option><option value="Contract">Contract</option></select></div>
          <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Create'}</button>
          {editingId && <button type="button" className="btn" onClick={resetForm} style={{ marginLeft: '10px' }}>Cancel</button>}
        </form>
      )}

      {loading ? <div className="loading">Loading...</div> : staff.length === 0 ? <p>No staff found.</p> : (
        <table className="table">
          <thead><tr><th>ID</th><th>Name</th><th>Designation</th><th>Type</th><th>Department</th><th>Employment</th><th>Actions</th></tr></thead>
          <tbody>
            {staff.map(s => (<tr key={s._id} onClick={(e) => { if (!e.target.closest('button')) navigate(`/staff/${s._id}`); }}><td>{s.staffId}</td><td>{s.user?.firstName} {s.user?.lastName}</td><td>{s.designation}</td><td>{s.staffType}</td><td>{s.department?.name || 'N/A'}</td><td>{s.employmentType}</td><td><button className="btn btn-primary" style={{ marginRight: '5px', padding: '5px 10px' }} onClick={(e) => { e.stopPropagation(); handleEdit(s); }}>Edit</button><button className="btn btn-danger" style={{ padding: '5px 10px' }} onClick={(e) => { e.stopPropagation(); handleDelete(s._id); }}>Delete</button></td></tr>))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Staff;
