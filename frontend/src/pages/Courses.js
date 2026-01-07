import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    credits: '',
    semester: '',
    year: '',
    description: '',
    courseType: 'Core',
    department: ''
  });

  useEffect(() => {
    fetchCourses();
    fetchDepartments();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch courses');
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments');
      setDepartments(response.data.data);
    } catch (err) {
      console.error('Failed to fetch departments');
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
        await api.put(`/courses/${editingId}`, formData);
        alert('Course updated successfully');
      } else {
        await api.post('/courses', formData);
        alert('Course created successfully');
      }
      resetForm();
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (course) => {
    setEditingId(course._id);
    setFormData({
      courseCode: course.courseCode,
      courseName: course.courseName,
      credits: course.credits,
      semester: course.semester,
      year: course.year,
      description: course.description || '',
      courseType: course.courseType,
      department: course.department?._id || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }
    try {
      await api.delete(`/courses/${id}`);
      alert('Course deleted successfully');
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({
      courseCode: '',
      courseName: '',
      credits: '',
      semester: '',
      year: '',
      description: '',
      courseType: 'Core',
      department: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="card">
      <h2>Course Management</h2>
      
      {error && <div className="alert alert-error">{error}</div>}
      
      <button 
        className="btn btn-primary" 
        style={{ marginBottom: '20px' }}
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cancel' : 'Add New Course'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <div className="form-group">
            <label>Course Code *</label>
            <input type="text" name="courseCode" value={formData.courseCode} onChange={handleChange} required placeholder="e.g., IT101" />
          </div>
          <div className="form-group">
            <label>Course Name *</label>
            <input type="text" name="courseName" value={formData.courseName} onChange={handleChange} required placeholder="e.g., Programming" />
          </div>
          <div className="form-group">
            <label>Department *</label>
            <select name="department" value={formData.department} onChange={handleChange} required>
              <option value="">Select Department</option>
              {departments.map(dept => (<option key={dept._id} value={dept._id}>{dept.name}</option>))}
            </select>
          </div>
          <div className="form-group">
            <label>Credits *</label>
            <input type="number" name="credits" value={formData.credits} onChange={handleChange} required min="1" max="6" />
          </div>
          <div className="form-group">
            <label>Year *</label>
            <input type="number" name="year" value={formData.year} onChange={handleChange} required min="1" max="4" />
          </div>
          <div className="form-group">
            <label>Semester *</label>
            <input type="number" name="semester" value={formData.semester} onChange={handleChange} required min="1" max="2" />
          </div>
          <div className="form-group">
            <label>Course Type *</label>
            <select name="courseType" value={formData.courseType} onChange={handleChange} required>
              <option value="Core">Core</option>
              <option value="Elective">Elective</option>
              <option value="Optional">Optional</option>
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Course description" rows="3" />
          </div>
          <button type="submit" className="btn btn-primary">{editingId ? 'Update Course' : 'Create Course'}</button>
          {editingId && (<button type="button" className="btn" onClick={resetForm} style={{ marginLeft: '10px' }}>Cancel Edit</button>)}
        </form>
      )}

      {loading ? (
        <div className="loading">Loading courses...</div>
      ) : courses.length === 0 ? (
        <p>No courses found. Add your first course to get started.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Department</th>
              <th>Credits</th>
              <th>Year</th>
              <th>Semester</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td>{course.courseCode}</td>
                <td>{course.courseName}</td>
                <td>{course.department?.name || 'N/A'}</td>
                <td>{course.credits}</td>
                <td>Year {course.year}</td>
                <td>Sem {course.semester}</td>
                <td>{course.courseType}</td>
                <td>
                  <button className="btn btn-primary" style={{ marginRight: '5px', padding: '5px 10px' }} onClick={() => handleEdit(course)}>
                    Edit
                  </button>
                  <button className="btn btn-danger" style={{ padding: '5px 10px' }} onClick={() => handleDelete(course._id)}>
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

export default Courses;
