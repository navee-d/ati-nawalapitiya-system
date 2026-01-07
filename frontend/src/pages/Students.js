import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    email: '', password: '', firstName: '', lastName: '', nic: '', phone: '', address: '',
    studentId: '', course: '', department: '', batch: '', yearOfStudy: '1', semester: '1',
    enrollmentDate: new Date().toISOString().split('T')[0], guardianName: '', guardianPhone: '', emergencyContact: ''
  });

  useEffect(() => {
    fetchStudents();
    fetchCourses();
    fetchDepartments();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch students');
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data.data);
    } catch (err) { console.error('Failed to fetch courses'); }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments');
      setDepartments(response.data.data);
    } catch (err) { console.error('Failed to fetch departments'); }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        await api.put(`/students/${editingId}`, formData);
        alert('Student updated successfully');
      } else {
        await api.post('/students', formData);
        alert('Student created successfully');
      }
      resetForm();
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setFormData({
      email: student.user?.email || '', password: '',
      firstName: student.user?.firstName || '', lastName: student.user?.lastName || '',
      nic: student.user?.nic || '', phone: student.user?.phone || '', address: student.user?.address || '',
      studentId: student.studentId || student.registrationNumber || '',
      course: student.course?._id || '', department: student.department?._id || '',
      batch: student.batch || '', yearOfStudy: student.yearOfStudy || '1', semester: student.semester || '1',
      enrollmentDate: student.enrollmentDate ? new Date(student.enrollmentDate).toISOString().split('T')[0] : '',
      guardianName: student.guardianName || '', guardianPhone: student.guardianPhone || '',
      emergencyContact: student.emergencyContact || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This will delete the student and their user account.')) return;
    try {
      await api.delete(`/students/${id}`);
      alert('Student deleted successfully');
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({
      email: '', password: '', firstName: '', lastName: '', nic: '', phone: '', address: '',
      studentId: '', course: '', department: '', batch: '', yearOfStudy: '1', semester: '1',
      enrollmentDate: new Date().toISOString().split('T')[0], guardianName: '', guardianPhone: '', emergencyContact: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="card">
      <h2>Student Management</h2>
      {error && <div className="alert alert-error">{error}</div>}
      <button className="btn btn-primary" style={{ marginBottom: '20px' }} onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add New Student'}
      </button>

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
          <h3>Student Info</h3>
          <div className="form-group"><label>Student ID / Registration No *</label><input type="text" name="studentId" value={formData.studentId} onChange={handleChange} required /></div>
          <div className="form-group"><label>Department *</label><select name="department" value={formData.department} onChange={handleChange} required><option value="">Select Department</option>{departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}</select></div>
          <div className="form-group"><label>Course *</label><select name="course" value={formData.course} onChange={handleChange} required><option value="">Select Course</option>{courses.map(c => <option key={c._id} value={c._id}>{c.courseName}</option>)}</select></div>
          <div className="form-group"><label>Batch *</label><input type="text" name="batch" value={formData.batch} onChange={handleChange} required placeholder="e.g., 2024" /></div>
          <div className="form-group"><label>Year *</label><select name="yearOfStudy" value={formData.yearOfStudy} onChange={handleChange} required><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></div>
          <div className="form-group"><label>Semester *</label><select name="semester" value={formData.semester} onChange={handleChange} required><option value="1">1</option><option value="2">2</option></select></div>
          <button type="submit" className="btn btn-primary">{editingId ? 'Update Student' : 'Create Student'}</button>
          {editingId && <button type="button" className="btn" onClick={resetForm} style={{ marginLeft: '10px' }}>Cancel</button>}
        </form>
      )}

      {loading ? <div className="loading">Loading...</div> : students.length === 0 ? <p>No students found.</p> : (
        <table className="table">
          <thead><tr><th>ID</th><th>Name</th><th>Reg No</th><th>Course</th><th>Year/Sem</th><th>Batch</th><th>Actions</th></tr></thead>
          <tbody>
            {students.map(s => (
              <tr key={s._id} onClick={(e) => { if (!e.target.closest('button')) navigate(`/students/${s._id}`); }}>
                <td>{s.studentId}</td><td>{s.user?.firstName} {s.user?.lastName}</td><td>{s.registrationNumber}</td>
                <td>{s.course?.courseName || 'N/A'}</td><td>Y{s.yearOfStudy}/S{s.semester}</td><td>{s.batch}</td>
                <td><button className="btn btn-primary" style={{ marginRight: '5px', padding: '5px 10px' }} onClick={(e) => { e.stopPropagation(); handleEdit(s); }}>Edit</button>
                <button className="btn btn-danger" style={{ padding: '5px 10px' }} onClick={(e) => { e.stopPropagation(); handleDelete(s._id); }}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Students;
