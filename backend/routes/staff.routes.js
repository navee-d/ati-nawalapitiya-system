const express = require('express');
const router = express.Router();
const {
  getAllStaff,
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffByType
} = require('../controllers/staff.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/')
  .get(getAllStaff)
  .post(authorize('admin'), createStaff);

router.route('/:id')
  .get(getStaff)
  .put(authorize('admin'), updateStaff)
  .delete(authorize('admin'), deleteStaff);

router.get('/type/:staffType', getStaffByType);

module.exports = router;
