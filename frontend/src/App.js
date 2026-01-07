import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Students from './pages/Students';
import Lecturers from './pages/Lecturers';
import HODs from './pages/HODs';
import Staff from './pages/Staff';
import Courses from './pages/Courses';
import Timetable from './pages/Timetable';
import Login from './pages/Login';
import StudentsByDepartment from './pages/StudentsByDepartment';
import StudentDetail from './pages/StudentDetail';
import LecturerDetail from './pages/LecturerDetail';
import HODDetail from './pages/HODDetail';
import StaffDetail from './pages/StaffDetail';
import Exam from './pages/Exam';
import ImportExport from './pages/ImportExport';

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount and location change
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        navigate('/login');
      }
    } else {
      setIsAuthenticated(false);
      if (location.pathname !== '/login') {
        navigate('/login');
      }
    }
  }, [location.pathname, navigate]);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        <>
          {/* Left Sidebar Navigation */}
          <aside className="sidebar">
            <div className="sidebar-header">
              <h2>🎓 ATI</h2>
              <p>Nawalapitiya</p>
            </div>

            <nav className="sidebar-nav">
              <Link to="/" className={location.pathname === '/' ? 'nav-item active' : 'nav-item'}>
                <span className="nav-icon">🏠</span>
                <span className="nav-text">Dashboard</span>
              </Link>

              <Link to="/students-by-department" className={location.pathname === '/students-by-department' ? 'nav-item active' : 'nav-item'}>
                <span className="nav-icon">📋</span>
                <span className="nav-text">Students by Dept</span>
              </Link>

              <div className="nav-section-title">Staff Management</div>
              <Link to="/lecturers" className={location.pathname === '/lecturers' ? 'nav-item active' : 'nav-item'}>
                <span className="nav-icon">👨‍🏫</span>
                <span className="nav-text">Lecturers</span>
              </Link>
              <Link to="/hods" className={location.pathname === '/hods' ? 'nav-item active' : 'nav-item'}>
                <span className="nav-icon">👔</span>
                <span className="nav-text">HODs</span>
              </Link>
              <Link to="/staff" className={location.pathname === '/staff' ? 'nav-item active' : 'nav-item'}>
                <span className="nav-icon">👥</span>
                <span className="nav-text">Staff</span>
              </Link>

              <div className="nav-section-title">Academic</div>
              <Link to="/courses" className={location.pathname === '/courses' ? 'nav-item active' : 'nav-item'}>
                <span className="nav-icon">📚</span>
                <span className="nav-text">Courses</span>
              </Link>
              <Link to="/timetable" className={location.pathname === '/timetable' ? 'nav-item active' : 'nav-item'}>
                <span className="nav-icon">📅</span>
                <span className="nav-text">Timetable</span>
              </Link>
              <Link to="/exam" className={location.pathname.startsWith('/exam') ? 'nav-item active' : 'nav-item'}>
                <span className="nav-icon">📊</span>
                <span className="nav-text">Exam</span>
              </Link>

              <div className="nav-section-title">Data Management</div>
              <Link to="/import-export" className={location.pathname === '/import-export' ? 'nav-item active' : 'nav-item'}>
                <span className="nav-icon">🔄</span>
                <span className="nav-text">Import / Export</span>
              </Link>
            </nav>

            {user && (
              <div className="sidebar-footer">
                <div className="user-info">
                  <div className="user-avatar">{user.firstName?.[0]}{user.lastName?.[0]}</div>
                  <div className="user-details">
                    <p className="user-name">{user.firstName} {user.lastName}</p>
                    <p className="user-role">{user.role}</p>
                  </div>
                </div>
                <button onClick={toggleTheme} className="theme-toggle-btn">
                  <span>{theme === 'light' ? '🌙' : '☀️'}</span>
                  <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
                <button onClick={handleLogout} className="logout-btn">
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </aside>

          {/* Main Content Area */}
          <main className="main-content">
            <Routes>
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
              <Route path="/students/:id" element={<ProtectedRoute><StudentDetail /></ProtectedRoute>} />
              <Route path="/students-by-department" element={<ProtectedRoute><StudentsByDepartment /></ProtectedRoute>} />
              <Route path="/lecturers" element={<ProtectedRoute><Lecturers /></ProtectedRoute>} />
              <Route path="/lecturers/:id" element={<ProtectedRoute><LecturerDetail /></ProtectedRoute>} />
              <Route path="/hods" element={<ProtectedRoute><HODs /></ProtectedRoute>} />
              <Route path="/hods/:id" element={<ProtectedRoute><HODDetail /></ProtectedRoute>} />
              <Route path="/staff" element={<ProtectedRoute><Staff /></ProtectedRoute>} />
              <Route path="/staff/:id" element={<ProtectedRoute><StaffDetail /></ProtectedRoute>} />
              <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
              <Route path="/timetable" element={<ProtectedRoute><Timetable /></ProtectedRoute>} />
              <Route path="/exam" element={<ProtectedRoute><Exam /></ProtectedRoute>} />
              <Route path="/import-export" element={<ProtectedRoute><ImportExport /></ProtectedRoute>} />
              <Route path="/login" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
