import React from 'react';

function Home() {
  return (
    <div>
      <div className="card">
        <h2>Welcome to ATI Nawalapitiya Campus Management System</h2>
        <p>
          This comprehensive management system helps manage all aspects of campus operations
          including students, lecturers, HODs, staff, departments, and courses.
        </p>
      </div>

      <div className="grid">
        <div className="module-card">
          <h3>👨‍🎓 Students</h3>
          <p>Manage student records, enrollment, and academic information</p>
        </div>

        <div className="module-card">
          <h3>👨‍🏫 Lecturers</h3>
          <p>Manage lecturer profiles, courses taught, and schedules</p>
        </div>

        <div className="module-card">
          <h3>👔 HODs</h3>
          <p>Manage department heads and their responsibilities</p>
        </div>

        <div className="module-card">
          <h3>👥 Staff</h3>
          <p>Manage administrative and support staff members</p>
        </div>

        <div className="module-card">
          <h3>🏢 Departments</h3>
          <p>Manage academic and administrative departments</p>
        </div>

        <div className="module-card">
          <h3>📚 Courses</h3>
          <p>Manage course catalog, credits, and prerequisites</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '30px' }}>
        <h2>System Features</h2>
        <ul style={{ paddingLeft: '20px', lineHeight: '2' }}>
          <li>Complete user authentication and authorization</li>
          <li>Role-based access control (Student, Lecturer, HOD, Staff, Admin)</li>
          <li>CRUD operations for all modules</li>
          <li>Department-wise filtering and organization</li>
          <li>Course management with prerequisites</li>
          <li>Student academic tracking (GPA, attendance)</li>
          <li>Comprehensive reporting capabilities</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
