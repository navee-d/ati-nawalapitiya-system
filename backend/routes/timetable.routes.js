const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetable.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Public routes (all authenticated users can view timetables)
router.get('/', protect, timetableController.getAllTimetables);
router.get('/:id', protect, timetableController.getTimetableById);
router.get('/weekly/:departmentId/:semester/:academicYear', protect, timetableController.getWeeklyTimetable);
router.get('/lecturer/:lecturerId', protect, timetableController.getLecturerTimetable);

// Protected routes (admin and HOD only)
router.post('/', protect, authorize('admin', 'hod'), timetableController.createTimetable);
router.put('/:id', protect, authorize('admin', 'hod'), timetableController.updateTimetable);
router.delete('/:id', protect, authorize('admin', 'hod'), timetableController.deleteTimetable);

module.exports = router;
