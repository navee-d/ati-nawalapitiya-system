const mongoose = require('mongoose');
const Department = require('../models/Department.model');
require('dotenv').config();

const updateDepartments = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ati-nawalapitiya');
    console.log('Connected to MongoDB');

    // Update department names with correct spellings
    const updates = [
      {
        old: /information.*technology/i,
        new: { name: 'Information Technology', code: 'IT' }
      },
      {
        old: /business.*finance/i,
        new: { name: 'Business Finance', code: 'BF' }
      },
      {
        old: /tourism.*hospitality/i,
        new: { name: 'Tourism and Hospitality Management', code: 'THM' }
      },
      {
        old: /management/i,
        new: { name: 'Management', code: 'MG' }
      },
      {
        old: /english/i,
        new: { name: 'English', code: 'ENG' }
      }
    ];

    for (const update of updates) {
      const dept = await Department.findOne({ name: update.old });
      if (dept) {
        dept.name = update.new.name;
        dept.code = update.new.code;
        await dept.save();
        console.log(`✓ Updated: ${update.new.name}`);
      }
    }

    // Ensure departments exist in correct order
    const correctDepartments = [
      { name: 'Information Technology', code: 'IT', description: 'Information Technology Department', building: 'Main Building', establishedYear: 2000 },
      { name: 'Tourism and Hospitality Management', code: 'THM', description: 'Tourism and Hospitality Management Department', building: 'West Wing', establishedYear: 2005 },
      { name: 'Management', code: 'MG', description: 'Management Department', building: 'East Wing', establishedYear: 2003 },
      { name: 'Business Finance', code: 'BF', description: 'Business Finance Department', building: 'South Block', establishedYear: 2010 },
      { name: 'English', code: 'ENG', description: 'English Department', building: 'Language Center', establishedYear: 1998 }
    ];

    for (const deptData of correctDepartments) {
      const exists = await Department.findOne({ code: deptData.code });
      if (!exists) {
        await Department.create(deptData);
        console.log(`✓ Created: ${deptData.name}`);
      } else if (exists.name !== deptData.name) {
        exists.name = deptData.name;
        await exists.save();
        console.log(`✓ Updated: ${deptData.name}`);
      }
    }

    console.log('\n✅ Department names updated successfully!');
    console.log('\nCurrent departments:');
    const allDepts = await Department.find().sort({ code: 1 });
    allDepts.forEach(dept => {
      console.log(`  - ${dept.code}: ${dept.name}`);
    });

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

updateDepartments();
