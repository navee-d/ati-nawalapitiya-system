const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const User = require('../models/User.model');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const DIRECTOR_EMAIL = process.env.DIRECTOR_EMAIL || 'director@ati.lk';
const DIRECTOR_PASSWORD = process.env.DIRECTOR_PASSWORD || 'director123';

async function main() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/ati_nawalapitiya'
    );

    const existing = await User.findOne({ email: DIRECTOR_EMAIL });

    if (existing) {
      // Ensure role is director
      if (existing.role !== 'director') {
        existing.role = 'director';
        await existing.save();
        console.log(`Updated existing user role to director: ${DIRECTOR_EMAIL}`);
      } else {
        console.log(`Director user already exists: ${DIRECTOR_EMAIL}`);
      }

      console.log('Login with:');
      console.log(`Email: ${DIRECTOR_EMAIL}`);
      console.log('Password: (unchanged)');
      console.log('To reset password, run with: set DIRECTOR_PASSWORD=... then node backend/scripts/create-director.js');
      process.exit(0);
    }

    // Create a new director user
    await User.create({
      username: 'director',
      email: DIRECTOR_EMAIL,
      password: DIRECTOR_PASSWORD,
      role: 'director',
      firstName: 'System',
      lastName: 'Director',
      nic: '888888888V',
      phone: '0770000001',
      address: 'ATI Office',
    });

    console.log('Director user created');
    console.log('Login with:');
    console.log(`Email: ${DIRECTOR_EMAIL}`);
    console.log(`Password: ${DIRECTOR_PASSWORD}`);

    process.exit(0);
  } catch (err) {
    console.error('Failed to create director user:', err.message);
    process.exit(1);
  }
}

main();
