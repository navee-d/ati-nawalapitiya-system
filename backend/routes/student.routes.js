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

router.route('/:id')
  .get(getStudent)
  .put(authorize('admin', 'hod'), updateStudent)
  .delete(authorize('admin'), deleteStudent);

router.get('/department/:departmentId', getStudentsByDepartment);

module.exports = router;
