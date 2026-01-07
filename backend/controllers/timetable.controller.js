const Timetable = require('../models/Timetable.model');

// Get all timetable entries
exports.getAllTimetables = async (req, res) => {
  try {
    const { department, lecturer, dayOfWeek, semester, academicYear } = req.query;
    
    let filter = { isActive: true };
    
    if (department) filter.department = department;
    if (lecturer) filter.lecturer = lecturer;
    if (dayOfWeek) filter.dayOfWeek = dayOfWeek;
    if (semester) filter.semester = parseInt(semester);
    if (academicYear) filter.academicYear = academicYear;

    const timetables = await Timetable.find(filter)
      .populate('course', 'courseCode courseName credits')
      .populate({
        path: 'lecturer',
        select: 'lecturerId designation',
        populate: { path: 'user', select: 'firstName lastName' }
      })
      .populate('department', 'name code')
      .sort({ dayOfWeek: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: timetables.length,
      data: timetables
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching timetables',
      error: error.message
    });
  }
};

// Get timetable by ID
exports.getTimetableById = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id)
      .populate('course', 'courseCode courseName credits description')
      .populate({
        path: 'lecturer',
        select: 'lecturerId designation',
        populate: { path: 'user', select: 'firstName lastName email phone' }
      })
      .populate('department', 'name code');

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable entry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: timetable
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching timetable',
      error: error.message
    });
  }
};

// Create new timetable entry
exports.createTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.create(req.body);
    
    const populatedTimetable = await Timetable.findById(timetable._id)
      .populate('course', 'courseCode courseName')
      .populate({
        path: 'lecturer',
        populate: { path: 'user', select: 'firstName lastName' }
      })
      .populate('department', 'name code');

    res.status(201).json({
      success: true,
      message: 'Timetable entry created successfully',
      data: populatedTimetable
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating timetable entry',
      error: error.message
    });
  }
};

// Update timetable entry
exports.updateTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('course', 'courseCode courseName')
      .populate({
        path: 'lecturer',
        populate: { path: 'user', select: 'firstName lastName' }
      })
      .populate('department', 'name code');

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable entry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Timetable entry updated successfully',
      data: timetable
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating timetable entry',
      error: error.message
    });
  }
};

// Delete timetable entry
exports.deleteTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndDelete(req.params.id);

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable entry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Timetable entry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting timetable entry',
      error: error.message
    });
  }
};

// Get weekly timetable for a department
exports.getWeeklyTimetable = async (req, res) => {
  try {
    const { departmentId, semester, academicYear } = req.params;
    
    const filter = {
      department: departmentId,
      semester: parseInt(semester),
      academicYear,
      isActive: true
    };

    const timetables = await Timetable.find(filter)
      .populate('course', 'courseCode courseName')
      .populate({
        path: 'lecturer',
        populate: { path: 'user', select: 'firstName lastName' }
      })
      .sort({ dayOfWeek: 1, startTime: 1 });

    // Group by day of week
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weeklySchedule = {};
    
    weekDays.forEach(day => {
      weeklySchedule[day] = timetables.filter(t => t.dayOfWeek === day);
    });

    res.status(200).json({
      success: true,
      data: weeklySchedule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching weekly timetable',
      error: error.message
    });
  }
};

// Get lecturer's timetable
exports.getLecturerTimetable = async (req, res) => {
  try {
    const { lecturerId } = req.params;
    
    const timetables = await Timetable.find({
      lecturer: lecturerId,
      isActive: true
    })
      .populate('course', 'courseCode courseName')
      .populate('department', 'name code')
      .sort({ dayOfWeek: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: timetables.length,
      data: timetables
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching lecturer timetable',
      error: error.message
    });
  }
};
