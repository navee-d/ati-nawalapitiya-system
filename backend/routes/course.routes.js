const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getCoursesByDepartment
} = require('../controllers/course.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/')
  .get(getAllCourses)
  .post(authorize('admin', 'hod'), createCourse);

router.route('/:id')
  .get(getCourse)
  .put(authorize('admin', 'hod'), updateCourse)
  .delete(authorize('admin'), deleteCourse);

router.get('/department/:departmentId', getCoursesByDepartment);

module.exports = router;
