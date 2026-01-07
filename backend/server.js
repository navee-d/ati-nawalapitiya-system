const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ati_nawalapitiya', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/students', require('./routes/student.routes'));
app.use('/api/lecturers', require('./routes/lecturer.routes'));
app.use('/api/hods', require('./routes/hod.routes'));
app.use('/api/staff', require('./routes/staff.routes'));
app.use('/api/courses', require('./routes/course.routes'));
app.use('/api/departments', require('./routes/department.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to SLIATE ATI Nawalapitiya Campus Management System',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      students: '/api/students',
      lecturers: '/api/lecturers',
      hods: '/api/hods',
      staff: '/api/staff',
      courses: '/api/courses',
      departments: '/api/departments'
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
