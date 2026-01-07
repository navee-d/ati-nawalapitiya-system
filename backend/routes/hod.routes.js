const express = require('express');
const router = express.Router();
const {
  getAllHODs,
  getHOD,
  createHOD,
  updateHOD,
  deleteHOD
} = require('../controllers/hod.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/')
  .get(getAllHODs)
  .post(authorize('admin'), createHOD);

router.route('/:id')
  .get(getHOD)
  .put(authorize('admin'), updateHOD)
  .delete(authorize('admin'), deleteHOD);

module.exports = router;
