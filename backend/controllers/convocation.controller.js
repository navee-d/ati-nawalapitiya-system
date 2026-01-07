const Convocation = require('../models/Convocation.model');

// Get all convocation records
exports.getAllConvocations = async (req, res) => {
  try {
    const { yearCompleted, courseCode, paymentStatus, studyMode, convocationYear } = req.query;
    
    let filter = {};
    
    if (yearCompleted) filter.yearCompleted = parseInt(yearCompleted);
    if (courseCode) filter.courseCode = courseCode;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (studyMode) filter.studyMode = studyMode;
    if (convocationYear) filter.convocationYear = parseInt(convocationYear);

    const convocations = await Convocation.find(filter)
      .sort({ serialNo: 1 });

    res.status(200).json({
      success: true,
      count: convocations.length,
      data: convocations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching convocation records',
      error: error.message
    });
  }
};

// Get convocation record by ID
exports.getConvocationById = async (req, res) => {
  try {
    const convocation = await Convocation.findById(req.params.id);

    if (!convocation) {
      return res.status(404).json({
        success: false,
        message: 'Convocation record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: convocation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching convocation record',
      error: error.message
    });
  }
};

// Create new convocation record
exports.createConvocation = async (req, res) => {
  try {
    const convocation = await Convocation.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Convocation record created successfully',
      data: convocation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating convocation record',
      error: error.message
    });
  }
};

// Update convocation record
exports.updateConvocation = async (req, res) => {
  try {
    const convocation = await Convocation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!convocation) {
      return res.status(404).json({
        success: false,
        message: 'Convocation record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Convocation record updated successfully',
      data: convocation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating convocation record',
      error: error.message
    });
  }
};

// Delete convocation record
exports.deleteConvocation = async (req, res) => {
  try {
    const convocation = await Convocation.findByIdAndDelete(req.params.id);

    if (!convocation) {
      return res.status(404).json({
        success: false,
        message: 'Convocation record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Convocation record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting convocation record',
      error: error.message
    });
  }
};

// Get statistics
exports.getConvocationStats = async (req, res) => {
  try {
    const { convocationYear } = req.params;
    
    const filter = convocationYear ? { convocationYear: parseInt(convocationYear) } : {};

    const stats = await Convocation.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          totalPaid: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'Paid'] }, 1, 0] }
          },
          totalPending: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'Pending'] }, 1, 0] }
          },
          fullTime: {
            $sum: { $cond: [{ $eq: ['$studyMode', 'Full Time'] }, 1, 0] }
          },
          partTime: {
            $sum: { $cond: [{ $eq: ['$studyMode', 'Part Time'] }, 1, 0] }
          }
        }
      }
    ]);

    const courseStats = await Convocation.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$courseCode',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overall: stats[0] || {
          total: 0,
          totalPaid: 0,
          totalPending: 0,
          fullTime: 0,
          partTime: 0
        },
        byCourse: courseStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

// Bulk upload
exports.bulkUpload = async (req, res) => {
  try {
    const { records } = req.body;
    
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of records'
      });
    }

    const convocations = await Convocation.insertMany(records, { ordered: false });

    res.status(201).json({
      success: true,
      message: `${convocations.length} records uploaded successfully`,
      data: convocations
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error uploading records',
      error: error.message
    });
  }
};
