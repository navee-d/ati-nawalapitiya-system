import React, { useState, useEffect } from 'react';
import api from '../services/api';

function ExamResults() {
  const [examResults, setExamResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
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

  const gradeOptions = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'];
  const statusOptions = ['Pass', 'Fail', 'Absent'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resultsRes, studentsRes, coursesRes] = await Promise.all([
        api.get('/exam-results'),
        api.get('/students'),
        api.get('/courses')
      ]);
      setExamResults(resultsRes.data);
      setStudents(studentsRes.data);
      setCourses(coursesRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-calculate grade based on marks
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
          
          // Auto-update status
          updated.status = marks >= 40 ? 'Pass' : 'Fail';
        }
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/exam-results/${editingId}`, formData);
        alert('Exam result updated successfully');
      } else {
        await api.post('/exam-results', formData);
        alert('Exam result created successfully');
      }
      resetForm();
      fetchData();
    } catch (err) {
      console.error('Error saving exam result:', err);
      alert(err.response?.data?.message || 'Failed to save exam result');
    }
  };

  const handleEdit = (result) => {
    setFormData({
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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exam result?')) return;
    try {
      await api.delete(`/exam-results/${id}`);
      alert('Exam result deleted successfully');
      fetchData();
    } catch (err) {
      console.error('Error deleting exam result:', err);
      alert('Failed to delete exam result');
    }
  };

  const resetForm = () => {
    setFormData({
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

  const getStudentName = (student) => {
    if (!student || !student.user) return 'Unknown';
    return `${student.user.firstName} ${student.user.lastName}`;
  };

  return (
    <div className="container">
      <h1>Exam Results Management</h1>
      
      <button 
        className="btn btn-primary" 
        onClick={() => setShowForm(!showForm)}
        style={{ marginBottom: '20px' }}
      >
        {showForm ? 'Hide Form' : 'Add New Result'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <div className="form-group">
            <label>Student *</label>
            <select name="student" value={formData.student} onChange={handleChange} required>
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
            <select name="course" value={formData.course} onChange={handleChange} required>
              <option value="">Select Course</option>
              {courses.map(c => (
                <option key={c._id} value={c._id}>
                  {c.courseCode} - {c.courseName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Academic Year *</label>
            <input 
              type="text" 
              name="academicYear" 
              value={formData.academicYear} 
              onChange={handleChange} 
              required 
              placeholder="e.g., 2024"
            />
          </div>

          <div className="form-group">
            <label>Semester *</label>
            <select name="semester" value={formData.semester} onChange={handleChange} required>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Exam Date *</label>
            <input 
              type="date" 
              name="examDate" 
              value={formData.examDate} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Marks (0-100) *</label>
            <input 
              type="number" 
              name="marks" 
              value={formData.marks} 
              onChange={handleChange} 
              required 
              min="0" 
              max="100"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Grade *</label>
            <select name="grade" value={formData.grade} onChange={handleChange} required>
              {gradeOptions.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Status *</label>
            <select name="status" value={formData.status} onChange={handleChange} required>
              {statusOptions.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Remarks</label>
            <textarea 
              name="remarks" 
              value={formData.remarks} 
              onChange={handleChange}
              rows="2"
              placeholder="Optional remarks"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            {editingId ? 'Update' : 'Create'} Result
          </button>
          {editingId && (
            <button 
              type="button" 
              className="btn" 
              onClick={resetForm} 
              style={{ marginLeft: '10px' }}
            >
              Cancel
            </button>
          )}
        </form>
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : examResults.length === 0 ? (
        <p>No exam results found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Year</th>
              <th>Semester</th>
              <th>Exam Date</th>
              <th>Marks</th>
              <th>Grade</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {examResults.map(result => (
              <tr key={result._id}>
                <td>{getStudentName(result.student)}</td>
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
                    onClick={() => handleEdit(result)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger" 
                    style={{ padding: '5px 10px' }}
                    onClick={() => handleDelete(result._id)}
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

export default ExamResults;
