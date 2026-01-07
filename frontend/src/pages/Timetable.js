import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Timetable.css';

const Timetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // list, weekly
  
  // Filter states
  const [filters, setFilters] = useState({
    department: '',
    lecturer: '',
    dayOfWeek: '',
    semester: '',
    academicYear: new Date().getFullYear().toString()
  });

  const [formData, setFormData] = useState({
    course: '',
    lecturer: '',
    department: '',
    dayOfWeek: 'Monday',
    startTime: '',
    endTime: '',
    room: '',
    sessionType: 'Lecture',
    semester: 1,
    academicYear: new Date().getFullYear().toString(),
    isActive: true,
    notes: ''
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const sessionTypes = ['Lecture', 'Lab', 'Tutorial', 'Practical', 'Exam'];

  useEffect(() => {
    fetchTimetables();
    fetchDepartments();
    fetchLecturers();
    fetchCourses();
  }, [filters]);

  const fetchTimetables = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const response = await api.get(`/timetables?${queryParams}`);
      setTimetables(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch timetables');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments');
      setDepartments(response.data.data);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };

  const fetchLecturers = async () => {
    try {
      const response = await api.get('/lecturers');
      setLecturers(response.data.data);
    } catch (err) {
      console.error('Failed to fetch lecturers:', err);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data.data);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/timetables/${editingId}`, formData);
      } else {
        await api.post('/timetables', formData);
      }
      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchTimetables();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save timetable entry');
    }
  };

  const handleEdit = (timetable) => {
    setFormData({
      course: timetable.course._id,
      lecturer: timetable.lecturer._id,
      department: timetable.department._id,
      dayOfWeek: timetable.dayOfWeek,
      startTime: timetable.startTime,
      endTime: timetable.endTime,
      room: timetable.room,
      sessionType: timetable.sessionType,
      semester: timetable.semester,
      academicYear: timetable.academicYear,
      isActive: timetable.isActive,
      notes: timetable.notes || ''
    });
    setEditingId(timetable._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this timetable entry?')) {
      try {
        await api.delete(`/timetables/${id}`);
        fetchTimetables();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete timetable entry');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      course: '',
      lecturer: '',
      department: '',
      dayOfWeek: 'Monday',
      startTime: '',
      endTime: '',
      room: '',
      sessionType: 'Lecture',
      semester: 1,
      academicYear: new Date().getFullYear().toString(),
      isActive: true,
      notes: ''
    });
  };

  const groupByDay = () => {
    const grouped = {};
    daysOfWeek.forEach(day => {
      grouped[day] = timetables.filter(t => t.dayOfWeek === day);
    });
    return grouped;
  };

  const renderWeeklyView = () => {
    const weeklyData = groupByDay();
    
    return (
      <div className="weekly-timetable">
        {daysOfWeek.map(day => (
          <div key={day} className="day-column">
            <h3>{day}</h3>
            <div className="day-sessions">
              {weeklyData[day].length > 0 ? (
                weeklyData[day].map(session => (
                  <div key={session._id} className="session-card">
                    <div className="session-time">{session.startTime} - {session.endTime}</div>
                    <div className="session-course">{session.course?.courseCode} - {session.course?.courseName}</div>
                    <div className="session-lecturer">{session.lecturer?.user?.firstName} {session.lecturer?.user?.lastName}</div>
                    <div className="session-room">Room: {session.room}</div>
                    <div className="session-type">{session.sessionType}</div>
                  </div>
                ))
              ) : (
                <div className="no-sessions">No sessions</div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="timetable-container">
      <div className="timetable-header">
        <h1>Timetable Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add New Entry'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Filters */}
      <div className="filters">
        <select
          value={filters.department}
          onChange={(e) => setFilters({ ...filters, department: e.target.value })}
        >
          <option value="">All Departments</option>
          {departments.map(dept => (
            <option key={dept._id} value={dept._id}>{dept.name}</option>
          ))}
        </select>

        <select
          value={filters.lecturer}
          onChange={(e) => setFilters({ ...filters, lecturer: e.target.value })}
        >
          <option value="">All Lecturers</option>
          {lecturers.map(lec => (
            <option key={lec._id} value={lec._id}>
              {lec.user?.firstName} {lec.user?.lastName}
            </option>
          ))}
        </select>

        <select
          value={filters.dayOfWeek}
          onChange={(e) => setFilters({ ...filters, dayOfWeek: e.target.value })}
        >
          <option value="">All Days</option>
          {daysOfWeek.map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>

        <select
          value={filters.semester}
          onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
        >
          <option value="">All Semesters</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
            <option key={sem} value={sem}>Semester {sem}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Academic Year"
          value={filters.academicYear}
          onChange={(e) => setFilters({ ...filters, academicYear: e.target.value })}
        />

        <div className="view-toggle">
          <button
            className={viewMode === 'list' ? 'active' : ''}
            onClick={() => setViewMode('list')}
          >
            List View
          </button>
          <button
            className={viewMode === 'weekly' ? 'active' : ''}
            onClick={() => setViewMode('weekly')}
          >
            Weekly View
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="timetable-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Course *</label>
              <select
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                required
              >
                <option value="">Select Course</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.courseCode} - {course.courseName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Lecturer *</label>
              <select
                value={formData.lecturer}
                onChange={(e) => setFormData({ ...formData, lecturer: e.target.value })}
                required
              >
                <option value="">Select Lecturer</option>
                {lecturers.map(lec => (
                  <option key={lec._id} value={lec._id}>
                    {lec.user?.firstName} {lec.user?.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Department *</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Day of Week *</label>
              <select
                value={formData.dayOfWeek}
                onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                required
              >
                {daysOfWeek.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Start Time *</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>End Time *</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Room *</label>
              <input
                type="text"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Session Type *</label>
              <select
                value={formData.sessionType}
                onChange={(e) => setFormData({ ...formData, sessionType: e.target.value })}
                required
              >
                {sessionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Semester *</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Academic Year *</label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                Active
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingId ? 'Update' : 'Create'} Timetable Entry
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

      {/* Timetable Display */}
      {loading ? (
        <div className="loading">Loading timetables...</div>
      ) : viewMode === 'weekly' ? (
        renderWeeklyView()
      ) : (
        <div className="timetable-table">
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Time</th>
                <th>Course</th>
                <th>Lecturer</th>
                <th>Room</th>
                <th>Type</th>
                <th>Semester</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {timetables.length > 0 ? (
                timetables.map((timetable) => (
                  <tr key={timetable._id}>
                    <td>{timetable.dayOfWeek}</td>
                    <td>{timetable.startTime} - {timetable.endTime}</td>
                    <td>
                      {timetable.course?.courseCode}<br />
                      <small>{timetable.course?.courseName}</small>
                    </td>
                    <td>{timetable.lecturer?.user?.firstName} {timetable.lecturer?.user?.lastName}</td>
                    <td>{timetable.room}</td>
                    <td>{timetable.sessionType}</td>
                    <td>{timetable.semester}</td>
                    <td>{timetable.department?.code}</td>
                    <td className="actions">
                      <button onClick={() => handleEdit(timetable)} className="btn-edit">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(timetable._id)} className="btn-delete">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-data">No timetable entries found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Timetable;
