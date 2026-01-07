import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Convocation.css';

const Convocation = () => {
  const [convocations, setConvocations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [filters, setFilters] = useState({
    yearCompleted: '',
    courseCode: '',
    paymentStatus: '',
    studyMode: '',
    convocationYear: '2020'
  });

  const [formData, setFormData] = useState({
    serialNo: '',
    yearCompleted: new Date().getFullYear(),
    gender: 'Male',
    fullName: '',
    nameWithInitials: '',
    studyMode: 'Full Time',
    address: '',
    contactNumber: '',
    paymentStatus: 'Pending',
    examIndexNo: '',
    courseCode: '',
    convocationYear: 2020,
    email: '',
    remarks: ''
  });

  const courseCodes = ['HNDTHM', 'HNDE', 'HNDIT', 'HNDMG', 'HNDBF', 'HNDENG'];
  const paymentStatuses = ['Pending', 'Paid', 'Partial', 'Waived'];
  const studyModes = ['Full Time', 'Part Time'];
  const genders = ['Male', 'Female', 'Other'];

  useEffect(() => {
    fetchConvocations();
    fetchStats();
  }, [filters]);

  const fetchConvocations = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const response = await api.get(`/convocations?${queryParams}`);
      setConvocations(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch convocation records');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const year = filters.convocationYear || '';
      const response = await api.get(`/convocations/stats/${year}`);
      setStats(response.data.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/convocations/${editingId}`, formData);
      } else {
        await api.post('/convocations', formData);
      }
      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchConvocations();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save convocation record');
    }
  };

  const handleEdit = (convocation) => {
    setFormData({
      serialNo: convocation.serialNo,
      yearCompleted: convocation.yearCompleted,
      gender: convocation.gender,
      fullName: convocation.fullName,
      nameWithInitials: convocation.nameWithInitials,
      studyMode: convocation.studyMode,
      address: convocation.address,
      contactNumber: convocation.contactNumber,
      paymentStatus: convocation.paymentStatus,
      examIndexNo: convocation.examIndexNo,
      courseCode: convocation.courseCode,
      convocationYear: convocation.convocationYear,
      email: convocation.email || '',
      remarks: convocation.remarks || ''
    });
    setEditingId(convocation._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await api.delete(`/convocations/${id}`);
        fetchConvocations();
        fetchStats();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete record');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      serialNo: '',
      yearCompleted: new Date().getFullYear(),
      gender: 'Male',
      fullName: '',
      nameWithInitials: '',
      studyMode: 'Full Time',
      address: '',
      contactNumber: '',
      paymentStatus: 'Pending',
      examIndexNo: '',
      courseCode: '',
      convocationYear: 2020,
      email: '',
      remarks: ''
    });
  };

  const exportToCSV = () => {
    const headers = ['Serial No', 'Year', 'Gender', 'Full Name', 'Initials', 'Study Mode', 'Address', 'Contact', 'Payment', 'Index No', 'Course'];
    const rows = convocations.map(c => [
      c.serialNo, c.yearCompleted, c.gender, c.fullName, c.nameWithInitials, 
      c.studyMode, c.address, c.contactNumber, c.paymentStatus, c.examIndexNo, c.courseCode
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `convocation_${filters.convocationYear || 'all'}.csv`;
    a.click();
  };

  return (
    <div className="convocation-container">
      <div className="convocation-header">
        <h1>Convocation Management</h1>
        <div className="header-actions">
          <button onClick={exportToCSV} className="btn-export">
            📥 Export CSV
          </button>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancel' : '+ Add Record'}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Statistics Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>{stats.overall.total}</h3>
              <p>Total Graduates</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{stats.overall.totalPaid}</h3>
              <p>Payment Completed</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>{stats.overall.totalPending}</h3>
              <p>Payment Pending</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <h3>{stats.overall.fullTime}</h3>
              <p>Full Time Students</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters">
        <select
          value={filters.convocationYear}
          onChange={(e) => setFilters({ ...filters, convocationYear: e.target.value })}
        >
          <option value="">All Years</option>
          {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map(year => (
            <option key={year} value={year}>Convocation {year}</option>
          ))}
        </select>

        <select
          value={filters.courseCode}
          onChange={(e) => setFilters({ ...filters, courseCode: e.target.value })}
        >
          <option value="">All Courses</option>
          {courseCodes.map(code => (
            <option key={code} value={code}>{code}</option>
          ))}
        </select>

        <select
          value={filters.paymentStatus}
          onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
        >
          <option value="">All Payment Status</option>
          {paymentStatuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <select
          value={filters.studyMode}
          onChange={(e) => setFilters({ ...filters, studyMode: e.target.value })}
        >
          <option value="">All Study Modes</option>
          {studyModes.map(mode => (
            <option key={mode} value={mode}>{mode}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Year Completed"
          value={filters.yearCompleted}
          onChange={(e) => setFilters({ ...filters, yearCompleted: e.target.value })}
        />
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="convocation-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Serial No *</label>
              <input
                type="number"
                value={formData.serialNo}
                onChange={(e) => setFormData({ ...formData, serialNo: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Year Completed *</label>
              <input
                type="number"
                value={formData.yearCompleted}
                onChange={(e) => setFormData({ ...formData, yearCompleted: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Gender *</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                required
              >
                {genders.map(gender => (
                  <option key={gender} value={gender}>{gender}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Name with Initials *</label>
              <input
                type="text"
                value={formData.nameWithInitials}
                onChange={(e) => setFormData({ ...formData, nameWithInitials: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Study Mode *</label>
              <select
                value={formData.studyMode}
                onChange={(e) => setFormData({ ...formData, studyMode: e.target.value })}
                required
              >
                {studyModes.map(mode => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label>Address *</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                rows="2"
              />
            </div>

            <div className="form-group">
              <label>Contact Number *</label>
              <input
                type="text"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Payment Status *</label>
              <select
                value={formData.paymentStatus}
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                required
              >
                {paymentStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Exam Index No *</label>
              <input
                type="text"
                value={formData.examIndexNo}
                onChange={(e) => setFormData({ ...formData, examIndexNo: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Course Code *</label>
              <select
                value={formData.courseCode}
                onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                required
              >
                <option value="">Select Course</option>
                {courseCodes.map(code => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Convocation Year *</label>
              <input
                type="number"
                value={formData.convocationYear}
                onChange={(e) => setFormData({ ...formData, convocationYear: e.target.value })}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Remarks</label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                rows="2"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingId ? 'Update' : 'Create'} Record
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                resetForm();
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      {loading ? (
        <div className="loading">Loading convocation records...</div>
      ) : (
        <div className="convocation-table">
          <table>
            <thead>
              <tr>
                <th>Serial</th>
                <th>Index No</th>
                <th>Name</th>
                <th>Course</th>
                <th>Year</th>
                <th>Study Mode</th>
                <th>Contact</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {convocations.length > 0 ? (
                convocations.map((convocation) => (
                  <tr key={convocation._id}>
                    <td>{convocation.serialNo}</td>
                    <td>{convocation.examIndexNo}</td>
                    <td>
                      <strong>{convocation.nameWithInitials}</strong><br />
                      <small>{convocation.fullName}</small>
                    </td>
                    <td>{convocation.courseCode}</td>
                    <td>{convocation.yearCompleted}</td>
                    <td>{convocation.studyMode}</td>
                    <td>{convocation.contactNumber}</td>
                    <td>
                      <span className={`status-badge status-${convocation.paymentStatus.toLowerCase()}`}>
                        {convocation.paymentStatus}
                      </span>
                    </td>
                    <td className="actions">
                      <button onClick={() => handleEdit(convocation)} className="btn-edit">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(convocation._id)} className="btn-delete">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-data">No convocation records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Convocation;
