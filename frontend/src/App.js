import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Students from './pages/Students';
import Lecturers from './pages/Lecturers';
import HODs from './pages/HODs';
import Staff from './pages/Staff';
import Departments from './pages/Departments';
import Courses from './pages/Courses';
import Timetable from './pages/Timetable';
import Login from './pages/Login';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="App">
      {isLoggedIn ? (
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
              
              <Link to="/departments" className={location.pathname === '/departments' ? 'nav-item active' : 'nav-item'}>
                <span className="nav-icon">🏢</span>
                <span className="nav-text">Departments</span>
              </Link>

              <div className="nav-section-title">Students by Department</div>
              <Link to="/students/it" className={location.pathname === '/students/it' ? 'nav-item active' : 'nav-item'}>
                <span className="nav-icon">💻</span>
                <span className="nav-text">IT Students</span>
              </Link>
              <Link to="/students/thm" className={location.pathname === '/students/thm' ? 'nav-item active' : 'nav-item'}>
                <span className="nav-icon">🏨</span>
                <span className="nav-text">THM Students</span>
              </Link>
              <Link to="/students/mg" className={location.pathname === '/students/mg' ? 'nav-item active' : 'nav-item'}>
                <span className="nav-icon">📊</span>
                <span className="nav-text">MG Students</span>
              </Link>
              <Link to="/students/bf" className={location.pathname === '/students/bf' ? 'nav-item active' : 'nav-item'}>
                <span className="nav-icon">💼</span>
                <span className="nav-text">BF Students</span>
              </Link>
              <Link to="/students/english" className={location.pathname === '/students/english' ? 'nav-item active' : 'nav-item'}>
                <span className="nav-icon">📚</span>
                <span className="nav-text">English Students</span>
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
              <Route path="/" element={<Home />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/students" element={<Students />} />
              <Route path="/students/it" element={<Students department="IT" />} />
              <Route path="/students/thm" element={<Students department="THM" />} />
              <Route path="/students/mg" element={<Students department="MG" />} />
              <Route path="/students/bf" element={<Students department="BF" />} />
              <Route path="/students/english" element={<Students department="English" />} />
              <Route path="/lecturers" element={<Lecturers />} />
              <Route path="/hods" element={<HODs />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/timetable" element={<Timetable />} />
            </Routes>
          </main>
        </>
      ) : (
        <Routes>
          <Route path="*" element={<Login />} />
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
