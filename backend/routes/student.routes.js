const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentsByDepartment
} = require('../controllers/student.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/')
  .get(getAllStudents)
  .post(authorize('admin', 'hod'), createStudent);

// Department route must come before /:id to avoid matching 'department' as an ID
router.route('/department/:departmentId')
  .get(getStudentsByDepartment);

router.route('/:id')
  .get(getStudent)
  .put(authorize('admin', 'hod'), updateStudent)
  .delete(authorize('admin'), deleteStudent);

module.exports = router;
