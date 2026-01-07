import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Exam() {
  const [activeTab, setActiveTab] = useState('results');
  const [activeSubTab, setActiveSubTab] = useState('new');
  const [examResults, setExamResults] = useState([]);
  const [applications, setApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedDept, setSelectedDept] = useState('all');
  const [uploadFile, setUploadFile] = useState(null);
  
  // Results form
  const [resultForm, setResultForm] = useState({
    student: '',
    course: '',
    academicYear: new Date().getFullYear().toString(),
    semester: '1',
    examDate: '',
    marks: '',
    grade: 'A+',
    status: 'Pass',
    remarks: ''
  });

  // Application form
  const [applicationForm, setApplicationForm] = useState({
    student: '',
    applicationType: 'new',
    examType: 'Regular',
    course: '',
    semester: '1',
    reason: '',
    documents: '',
    status: 'Pending'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resultsRes, studentsRes, coursesRes, deptsRes] = await Promise.all([
        api.get('/exam-results'),
        api.get('/students'),
        api.get('/courses'),
        api.get('/departments')
      ]);
      setExamResults(resultsRes.data || []);
      setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : studentsRes.data.data || []);
      setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : coursesRes.data.data || []);
      setDepartments(deptsRes.data.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setStudents([]);
      setCourses([]);
      setExamResults([]);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResultChange = (e) => {
    const { name, value } = e.target;
    setResultForm(prev => {
      const updated = { ...prev, [name]: value };
      
      if (name === 'marks') {
        const marks = parseFloat(value);
        if (!isNaN(marks)) {
          if (marks >= 85) updated.grade = 'A+';
          else if (marks >= 75) updated.grade = 'A';
          else if (marks >= 70) updated.grade = 'B+';
          else if (marks >= 65) updated.grade = 'B';
          else if (marks >= 60) updated.grade = 'C+';
          else if (marks >= 55) updated.grade = 'C';
          else if (marks >= 40) updated.grade = 'D';
          else updated.grade = 'F';
          
          updated.status = marks >= 40 ? 'Pass' : 'Fail';
        }
      }
      
      return updated;
    });
  };

  const handleApplicationChange = (e) => {
    const { name, value } = e.target;
    setApplicationForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert('Please upload only Excel files (.xlsx or .xls)');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await api.post('/exam-results/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const result = response.data;
      let message = `Import completed!\n\n`;
      message += `Total rows: ${result.total}\n`;
      message += `✅ Successful: ${result.successful}\n`;
      message += `🆕 Created: ${result.created}\n`;
      message += `🔄 Updated: ${result.updated}\n`;
      message += `❌ Failed: ${result.failed}\n`;
      
      if (result.details.errors.length > 0) {
        message += `\nErrors:\n`;
        result.details.errors.slice(0, 5).forEach(err => {
          message += `- Row ${err.row}: ${err.error}\n`;
        });
        if (result.details.errors.length > 5) {
          message += `... and ${result.details.errors.length - 5} more errors\n`;
        }
      }
      
      alert(message);
      fetchData();
      e.target.value = ''; // Reset file input
    } catch (err) {
      console.error('Upload error:', err);
      alert(err.response?.data?.message || 'Failed to upload file. Please check the file format and try again.');
      e.target.value = ''; // Reset file input
    } finally {
      setLoading(false);
    }
  };

  const submitResult = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/exam-results/${editingId}`, resultForm);
        alert('Exam result updated successfully');
      } else {
        await api.post('/exam-results', resultForm);
        alert('Exam result added successfully');
      }
      setResultForm({
        student: '',
        course: '',
        academicYear: new Date().getFullYear().toString(),
        semester: '1',
        examDate: '',
        marks: '',
        grade: 'A+',
        status: 'Pass',
        remarks: ''
      });
      setEditingId(null);
      setShowForm(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save result');
    }
  };

  const handleEditResult = (result) => {
    setResultForm({
      student: result.student._id,
      course: result.course._id,
      academicYear: result.academicYear,
      semester: result.semester.toString(),
      examDate: new Date(result.examDate).toISOString().split('T')[0],
      marks: result.marks.toString(),
      grade: result.grade,
      status: result.status,
      remarks: result.remarks || ''
    });
    setEditingId(result._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteResult = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exam result?')) return;
    try {
      await api.delete(`/exam-results/${id}`);
      alert('Exam result deleted successfully');
      fetchData();
    } catch (err) {
      alert('Failed to delete exam result');
    }
  };

  const resetForm = () => {
    setResultForm({
      student: '',
      course: '',
      academicYear: new Date().getFullYear().toString(),
      semester: '1',
      examDate: '',
      marks: '',
      grade: 'A+',
      status: 'Pass',
      remarks: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getFilteredResults = () => {
    if (selectedDept === 'all') return examResults;
    return examResults.filter(r => 
      r.student?.department?._id === selectedDept || 
      r.student?.course?.department?._id === selectedDept
    );
  };

  const getStudentName = (student) => {
    if (!student || !student.user) return 'Unknown';
    return `${student.user.firstName} ${student.user.lastName}`;
  };

  return (
    <div className="container">
      <h1 style={{ color: 'white' }}>Exam Management</h1>
      
      {/* Main Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid var(--border-color)' }}>
        <button 
          className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'results' ? 'var(--primary-color)' : 'transparent',
            color: activeTab === 'results' ? 'white' : 'var(--text-primary)',
            border: 'none',
            borderBottom: activeTab === 'results' ? '3px solid var(--primary-color)' : '3px solid transparent',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          📊 Exam Results
        </button>
        <button 
          className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'applications' ? 'var(--primary-color)' : 'transparent',
            color: activeTab === 'applications' ? 'white' : 'var(--text-primary)',
            border: 'none',
            borderBottom: activeTab === 'applications' ? '3px solid var(--primary-color)' : '3px solid transparent',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          📝 Exam Applications
        </button>
      </div>

      {/* Exam Results Tab */}
      {activeTab === 'results' && (
        <div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Hide Form' : '➕ Add Result'}
            </button>
            
            <div style={{ 
              flex: '1', 
              display: 'flex', 
              gap: '10px', 
              alignItems: 'center',
              background: 'var(--bg-card)',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <label style={{ 
                whiteSpace: 'nowrap', 
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}>📍 Filter by Department:</label>
              <select 
                value={selectedDept} 
                onChange={(e) => setSelectedDept(e.target.value)}
                style={{ 
                  flex: 1,
                  padding: '10px 12px', 
                  borderRadius: '6px', 
                  background: 'var(--bg-primary)', 
                  color: 'var(--text-primary)', 
                  border: '2px solid var(--border-color)',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                onMouseOut={(e) => e.target.style.borderColor = 'var(--border-color)'}
              >
                <option value="all">All Departments</option>
                {departments.map(d => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>

            <label 
              className="btn" 
              style={{ 
                cursor: 'pointer', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '10px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '15px',
                border: 'none',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }}
            >
              <span style={{ fontSize: '18px' }}>📤</span>
              <span>Upload Excel/PDF</span>
              <input 
                type="file" 
                accept=".xlsx,.xls" 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
              />
            </label>
          </div>

          {showForm && (
            <form onSubmit={submitResult} style={{ marginBottom: '20px', background: 'var(--bg-card)', padding: '20px', borderRadius: '8px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                <div className="form-group">
                  <label>Student *</label>
                  <select name="student" value={resultForm.student} onChange={handleResultChange} required>
                    <option value="">Select Student</option>
                    {students.map(s => (
                      <option key={s._id} value={s._id}>
                        {s.studentId} - {getStudentName(s)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Course *</label>
                  <select name="course" value={resultForm.course} onChange={handleResultChange} required>
                    <option value="">Select Course</option>
                    {courses.map(c => (
                      <option key={c._id} value={c._id}>{c.courseCode} - {c.courseName}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Academic Year *</label>
                  <input type="text" name="academicYear" value={resultForm.academicYear} onChange={handleResultChange} required />
                </div>

                <div className="form-group">
                  <label>Semester *</label>
                  <select name="semester" value={resultForm.semester} onChange={handleResultChange} required>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Exam Date *</label>
                  <input type="date" name="examDate" value={resultForm.examDate} onChange={handleResultChange} required />
                </div>

                <div className="form-group">
                  <label>Marks (0-100) *</label>
                  <input type="number" name="marks" value={resultForm.marks} onChange={handleResultChange} required min="0" max="100" step="0.01" />
                </div>

                <div className="form-group">
                  <label>Grade</label>
                  <input type="text" name="grade" value={resultForm.grade} readOnly style={{ background: 'var(--bg-hover)' }} />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <input type="text" name="status" value={resultForm.status} readOnly style={{ background: 'var(--bg-hover)' }} />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '15px' }}>
                <label>Remarks</label>
                <textarea name="remarks" value={resultForm.remarks} onChange={handleResultChange} rows="2" />
              </div>

              <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Result' : 'Save Result'}
                </button>
                {editingId && (
                  <button type="button" className="btn" onClick={resetForm}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}

          {loading ? (
            <div className="loading">Loading...</div>
          ) : getFilteredResults().length === 0 ? (
            <p>No exam results found.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student</th>
                  <th>Department</th>
                  <th>Course</th>
                  <th>Year</th>
                  <th>Sem</th>
                  <th>Exam Date</th>
                  <th>Marks</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredResults().map(result => (
                  <tr key={result._id}>
                    <td>{result.student?.studentId}</td>
                    <td>{getStudentName(result.student)}</td>
                    <td>{result.student?.department?.name || 'N/A'}</td>
                    <td>{result.course?.courseCode}</td>
                    <td>{result.academicYear}</td>
                    <td>{result.semester}</td>
                    <td>{new Date(result.examDate).toLocaleDateString()}</td>
                    <td>{result.marks}</td>
                    <td>
                      <span className={`badge ${
                        ['A+', 'A'].includes(result.grade) ? 'badge-success' : 
                        ['B+', 'B', 'C+', 'C'].includes(result.grade) ? 'badge-warning' : 
                        'badge-danger'
                      }`}>
                        {result.grade}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        result.status === 'Pass' ? 'badge-success' : 
                        result.status === 'Fail' ? 'badge-danger' : 
                        'badge-warning'
                      }`}>
                        {result.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-primary" 
                        style={{ marginRight: '5px', padding: '5px 10px' }}
                        onClick={() => handleEditResult(result)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-danger" 
                        style={{ padding: '5px 10px' }}
                        onClick={() => handleDeleteResult(result._id)}
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
      )}

      {/* Exam Applications Tab */}
      {activeTab === 'applications' && (
        <div>
          {/* Application Sub-tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button 
              className={`btn ${activeSubTab === 'new' ? 'btn-primary' : ''}`}
              onClick={() => setActiveSubTab('new')}
              style={{ padding: '8px 16px' }}
            >
              📄 New Applications
            </button>
            <button 
              className={`btn ${activeSubTab === 'repeat' ? 'btn-primary' : ''}`}
              onClick={() => setActiveSubTab('repeat')}
              style={{ padding: '8px 16px' }}
            >
              🔄 Repeat Applications
            </button>
            <button 
              className={`btn ${activeSubTab === 'assignment' ? 'btn-primary' : ''}`}
              onClick={() => setActiveSubTab('assignment')}
              style={{ padding: '8px 16px' }}
            >
              📝 Assignment Applications
            </button>
            <button 
              className={`btn ${activeSubTab === 'medical' ? 'btn-primary' : ''}`}
              onClick={() => setActiveSubTab('medical')}
              style={{ padding: '8px 16px' }}
            >
              🏥 Medical Exam Applications
            </button>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '8px', minHeight: '300px' }}>
            <h3 style={{ marginBottom: '15px' }}>
              {activeSubTab === 'new' && '📄 New Exam Applications'}
              {activeSubTab === 'repeat' && '🔄 Repeat Exam Applications'}
              {activeSubTab === 'assignment' && '📝 Assignment Applications'}
              {activeSubTab === 'medical' && '🏥 Medical Exam Applications'}
            </h3>
            
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
              {activeSubTab === 'new' && 'Manage applications for students taking exams for the first time.'}
              {activeSubTab === 'repeat' && 'Manage applications for students repeating exams due to failure or absence.'}
              {activeSubTab === 'assignment' && 'Manage applications for assignment submissions and evaluations.'}
              {activeSubTab === 'medical' && 'Manage applications for medical exam requests and special accommodations.'}
            </p>

            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <p>Application management system coming soon...</p>
              <p style={{ marginTop: '10px', fontSize: '0.9em' }}>
                Students will be able to submit {activeSubTab} applications here.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Exam;
