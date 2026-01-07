import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    students: 0,
    lecturers: 0,
    departments: 0,
    courses: 0,
    staff: 0,
    hods: 0
  });
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.name || 'User';

  useEffect(() => {
    // Fetch statistics
    const fetchStats = async () => {
      try {
        const [studentsRes, lecturersRes, deptRes, coursesRes, staffRes, hodsRes] = await Promise.all([
          api.get('/students').then(r => r.data),
          api.get('/lecturers').then(r => r.data),
          api.get('/departments').then(r => r.data),
          api.get('/courses').then(r => r.data),
          api.get('/staff').then(r => r.data),
          api.get('/hods').then(r => r.data),
        ]);
        
        setStats({
          students: studentsRes?.count || 0,
          lecturers: lecturersRes?.count || 0,
          departments: deptRes?.count || 0,
          courses: coursesRes?.count || 0,
          staff: staffRes?.count || 0,
          hods: hodsRes?.count || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="dashboard">
      <h1>Dashboard Overview</h1>
      
      {/* Quick Links */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '15px' }}>Quick Access</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <button className="btn btn-primary" onClick={() => navigate('/students')} style={{ padding: '15px' }}>👨‍🎓 Students</button>
          <button className="btn btn-primary" onClick={() => navigate('/courses')} style={{ padding: '15px' }}>📖 Courses</button>
          <button className="btn btn-primary" onClick={() => navigate('/lecturers')} style={{ padding: '15px' }}>👨‍🏫 Lecturers</button>
          <button className="btn btn-primary" onClick={() => navigate('/staff')} style={{ padding: '15px' }}>👥 Staff</button>
          <button className="btn btn-primary" onClick={() => navigate('/hods')} style={{ padding: '15px' }}>🎯 HODs</button>
        </div>
      </div>

      {/* Stats Cards */}
      <h3 style={{ marginBottom: '15px' }}>Statistics</h3>
      <div className="stats-grid">
        <div className="stat-card stat-card-blue" onClick={() => navigate('/students')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon">👨‍🎓</div>
          <div className="stat-info">
            <p className="stat-label">Total Students</p>
            <h3 className="stat-value">{stats.students}</h3>
            <span className="stat-change positive">+12% from last month</span>
          </div>
        </div>

        <div className="stat-card stat-card-purple" onClick={() => navigate('/lecturers')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon">👨‍🏫</div>
          <div className="stat-info">
            <p className="stat-label">Total Lecturers</p>
            <h3 className="stat-value">{stats.lecturers}</h3>
            <span className="stat-change positive">+5% from last month</span>
          </div>
        </div>

        <div className="stat-card stat-card-green" onClick={() => navigate('/students-by-department')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon">🏢</div>
          <div className="stat-info">
            <p className="stat-label">Departments</p>
            <h3 className="stat-value">{stats.departments}</h3>
            <span className="stat-change neutral">No change</span>
          </div>
        </div>

        <div className="stat-card stat-card-orange" onClick={() => navigate('/courses')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <p className="stat-label">Active Courses</p>
            <h3 className="stat-value">{stats.courses}</h3>
            <span className="stat-change positive">+8% from last month</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Welcome Card */}
        <div className="dashboard-card welcome-card">
          <div className="welcome-content">
            <h2 className="welcome-title">Welcome back, {userName}!</h2>
            <p className="welcome-subtitle">
              Here's what's happening with your campus management system today.
            </p>
          </div>
          <div className="welcome-illustration">
            <div className="brain-animation"></div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <h3 className="card-title">Quick Actions</h3>
          <div className="quick-actions">
            <div className="action-btn" onClick={() => navigate('/students')} style={{ cursor: 'pointer' }}>
              <span className="action-icon">👨‍🎓</span>
              <span>Manage Students</span>
            </div>
            <div className="action-btn" onClick={() => navigate('/lecturers')} style={{ cursor: 'pointer' }}>
              <span className="action-icon">👨‍🏫</span>
              <span>Manage Lecturers</span>
            </div>
            <div className="action-btn" onClick={() => navigate('/courses')} style={{ cursor: 'pointer' }}>
              <span className="action-icon">📚</span>
              <span>Manage Courses</span>
            </div>
            <div className="action-btn" onClick={() => navigate('/students-by-department')} style={{ cursor: 'pointer' }}>
              <span className="action-icon">🏢</span>
              <span>Manage Departments</span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="dashboard-card">
          <h3 className="card-title">Campus Performance</h3>
          <div className="performance-metric">
            <div className="metric-header">
              <span>Student Satisfaction</span>
              <span className="metric-percentage">95%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '95%' }}></div>
            </div>
          </div>
          <div className="performance-metric">
            <div className="metric-header">
              <span>Course Completion</span>
              <span className="metric-percentage">87%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '87%' }}></div>
            </div>
          </div>
          <div className="performance-metric">
            <div className="metric-header">
              <span>Attendance Rate</span>
              <span className="metric-percentage">92%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '92%' }}></div>
            </div>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="dashboard-card chart-card">
          <h3 className="card-title">Activity Overview</h3>
          <div className="chart-container">
            <div className="bar-chart">
              <div className="bar" style={{ height: '60%' }}><span className="bar-label">Mon</span></div>
              <div className="bar" style={{ height: '45%' }}><span className="bar-label">Tue</span></div>
              <div className="bar" style={{ height: '80%' }}><span className="bar-label">Wed</span></div>
              <div className="bar" style={{ height: '70%' }}><span className="bar-label">Thu</span></div>
              <div className="bar" style={{ height: '90%' }}><span className="bar-label">Fri</span></div>
              <div className="bar" style={{ height: '55%' }}><span className="bar-label">Sat</span></div>
              <div className="bar" style={{ height: '35%' }}><span className="bar-label">Sun</span></div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {/* Recent Activity */}
        <div className="dashboard-card">
          <h3 className="card-title">Recent Activity</h3>
          <ul className="activity-list">
            <li>✓ 5 new students registered today</li>
            <li>✓ 3 courses updated this week</li>
            <li>✓ 2 lecturers added to IT department</li>
            <li>✓ Attendance records updated</li>
            <li>✓ GPA calculations completed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
