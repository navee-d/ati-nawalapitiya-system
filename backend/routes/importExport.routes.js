const express = require('express');
const router = express.Router();
const multer = require('multer');
const importExportController = require('../controllers/importExport.controller');
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
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// All routes require authentication
router.use(protect);

// Import data from Excel
router.post('/import', upload.single('file'), importExportController.importData);

// Export data to Excel
router.get('/export/excel', importExportController.exportExcel);

// Export data to PDF
router.get('/export/pdf', importExportController.exportPDF);

module.exports = router;
