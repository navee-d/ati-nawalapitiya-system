const express = require('express');
const router = express.Router();
const multer = require('multer');
const examResultController = require('../controllers/examResult.controller');
const { protect } = require('../middleware/auth.middleware');

// Configure multer for file upload (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept only Excel files
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel' ||
        file.originalname.endsWith('.xlsx') ||
        file.originalname.endsWith('.xls')) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx, .xls) are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// All routes require authentication
router.use(protect);

// Get all exam results
router.get('/', examResultController.getAllExamResults);

// Get exam results by student ID
router.get('/student/:studentId', examResultController.getExamResultsByStudent);

// Create exam result
router.post('/', examResultController.createExamResult);

// Update exam result
router.put('/:id', examResultController.updateExamResult);

// Delete exam result
router.delete('/:id', examResultController.deleteExamResult);

// Import exam results from Excel
router.post('/import', upload.single('file'), examResultController.importExamResults);

module.exports = router;
