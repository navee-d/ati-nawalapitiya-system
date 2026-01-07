import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function HODs() {
  const navigate = useNavigate();
  const [hods, setHods] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    email: '', password: '', firstName: '', lastName: '', nic: '', phone: '', address: '',
    hodId: '', department: '', qualification: '', specialization: '', appointmentDate: new Date().toISOString().split('T')[0], officeRoom: ''
  });

  useEffect(() => { fetchHODs(); fetchDepartments(); }, []);

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
      if (editingId) { await api.put(`/hods/${editingId}`, formData); alert('Updated'); }
      else { await api.post('/hods', formData); alert('Created'); }
      resetForm(); fetchHODs();
    } catch (err) { setError(err.response?.data?.message || 'Failed'); }
  };

  const handleEdit = (h) => {
    setEditingId(h._id);
    setFormData({
      email: h.user?.email || '', password: '',
      firstName: h.user?.firstName || '', lastName: h.user?.lastName || '',
      nic: h.user?.nic || '', phone: h.user?.phone || '', address: h.user?.address || '',
      hodId: h.hodId || '', department: h.department?._id || '',
      qualification: h.qualification || '', specialization: h.specialization?.join(', ') || '',
      appointmentDate: h.appointmentDate ? new Date(h.appointmentDate).toISOString().split('T')[0] : '',
      officeRoom: h.officeRoom || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    try { await api.delete(`/hods/${id}`); alert('Deleted'); fetchHODs(); }
    catch (err) { setError(err.response?.data?.message || 'Failed'); }
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', firstName: '', lastName: '', nic: '', phone: '', address: '', hodId: '', department: '', qualification: '', specialization: '', appointmentDate: new Date().toISOString().split('T')[0], officeRoom: '' });
    setEditingId(null); setShowForm(false);
  };

  return (
    <div className="card">
      <h2>Head of Department Management</h2>
      {error && <div className="alert alert-error">{error}</div>}
      <button className="btn btn-primary" style={{ marginBottom: '20px' }} onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : 'Add HOD'}</button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <div className="form-group"><label>Email *</label><input type="email" name="email" value={formData.email} onChange={handleChange} required /></div>
          {!editingId && <div className="form-group"><label>Password *</label><input type="password" name="password" value={formData.password} onChange={handleChange} required={!editingId} /></div>}
          <div className="form-group"><label>First Name *</label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required /></div>
          <div className="form-group"><label>Last Name *</label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required /></div>
          <div className="form-group"><label>NIC *</label><input type="text" name="nic" value={formData.nic} onChange={handleChange} required /></div>
          <div className="form-group"><label>Phone *</label><input type="text" name="phone" value={formData.phone} onChange={handleChange} required /></div>
          <div className="form-group"><label>Address *</label><textarea name="address" value={formData.address} onChange={handleChange} required rows="2" /></div>
          <div className="form-group"><label>HOD ID *</label><input type="text" name="hodId" value={formData.hodId} onChange={handleChange} required /></div>
          <div className="form-group"><label>Department *</label><select name="department" value={formData.department} onChange={handleChange} required><option value="">Select</option>{departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}</select></div>
          <div className="form-group"><label>Qualification *</label><input type="text" name="qualification" value={formData.qualification} onChange={handleChange} required placeholder="e.g., PhD" /></div>
          <div className="form-group"><label>Specialization</label><input type="text" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="Comma separated" /></div>
          <div className="form-group"><label>Appointment Date</label><input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} /></div>
          <div className="form-group"><label>Office Room</label><input type="text" name="officeRoom" value={formData.officeRoom} onChange={handleChange} placeholder="e.g., A-101" /></div>
          <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Create'}</button>
          {editingId && <button type="button" className="btn" onClick={resetForm} style={{ marginLeft: '10px' }}>Cancel</button>}
        </form>
      )}

      {loading ? <div className="loading">Loading...</div> : hods.length === 0 ? <p>No HODs found.</p> : (
        <table className="table">
          <thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Qualification</th><th>Appointed</th><th>Office</th><th>Actions</th></tr></thead>
          <tbody>
            {hods.map(h => (<tr key={h._id} onClick={(e) => { if (!e.target.closest('button')) navigate(`/hods/${h._id}`); }}><td>{h.hodId}</td><td>{h.user?.firstName} {h.user?.lastName}</td><td>{h.department?.name || 'N/A'}</td><td>{h.qualification}</td><td>{new Date(h.appointmentDate).toLocaleDateString()}</td><td>{h.officeRoom || 'N/A'}</td><td><button className="btn btn-primary" style={{ marginRight: '5px', padding: '5px 10px' }} onClick={(e) => { e.stopPropagation(); handleEdit(h); }}>Edit</button><button className="btn btn-danger" style={{ padding: '5px 10px' }} onClick={(e) => { e.stopPropagation(); handleDelete(h._id); }}>Delete</button></td></tr>))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default HODs;
