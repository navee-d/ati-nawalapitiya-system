const express = require('express');
const router = express.Router();
const convocationController = require('../controllers/convocation.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Public routes (all authenticated users can view)
router.get('/', protect, convocationController.getAllConvocations);
router.get('/stats/:convocationYear?', protect, convocationController.getConvocationStats);
router.get('/:id', protect, convocationController.getConvocationById);

// Protected routes (admin and staff only)
router.post('/', protect, authorize('admin', 'staff'), convocationController.createConvocation);
router.post('/bulk', protect, authorize('admin', 'staff'), convocationController.bulkUpload);
router.put('/:id', protect, authorize('admin', 'staff'), convocationController.updateConvocation);
router.delete('/:id', protect, authorize('admin'), convocationController.deleteConvocation);

module.exports = router;
