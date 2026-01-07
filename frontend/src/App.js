import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Students from './pages/Students';
import Lecturers from './pages/Lecturers';
import HODs from './pages/HODs';
import Staff from './pages/Staff';
import Departments from './pages/Departments';
import Courses from './pages/Courses';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="header">
          <div className="container">
            <h1>SLIATE ATI Nawalapitiya</h1>
            <p>Campus Management System</p>
          </div>
        </header>

        <nav className="nav">
          <div className="container">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/students">Students</Link></li>
              <li><Link to="/lecturers">Lecturers</Link></li>
              <li><Link to="/hods">HODs</Link></li>
              <li><Link to="/staff">Staff</Link></li>
              <li><Link to="/departments">Departments</Link></li>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/students" element={<Students />} />
            <Route path="/lecturers" element={<Lecturers />} />
            <Route path="/hods" element={<HODs />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
