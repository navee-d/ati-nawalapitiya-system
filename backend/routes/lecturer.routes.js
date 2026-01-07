const express = require('express');
const router = express.Router();
const {
  getAllLecturers,
  getLecturer,
  createLecturer,
  updateLecturer,
  deleteLecturer,
  getLecturersByDepartment
} = require('../controllers/lecturer.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/')
  .get(getAllLecturers)
  .post(authorize('admin', 'hod'), createLecturer);

router.route('/:id')
  .get(getLecturer)
  .put(authorize('admin', 'hod'), updateLecturer)
  .delete(authorize('admin'), deleteLecturer);

router.get('/department/:departmentId', getLecturersByDepartment);

module.exports = router;
