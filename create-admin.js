// Temporary script to create admin user
import mongoose from 'mongoose';
import User from './server/models/User.js';

async function createAdmin() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ai-health-fitness');
    
    // Delete existing user if exists
    await User.deleteOne({ email: 'admin@test.com' });
    
    // Create new admin user
    const admin = new User({
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true,
      profile: {
        name: 'Admin User'
      }
    });
    
    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@test.com');
    console.log('Password: admin123');
    console.log('Role:', admin.role);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();