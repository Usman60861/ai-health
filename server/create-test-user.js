// Create test user
import mongoose from 'mongoose';
import User from './models/User.js';

async function createTestUser() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ai-health-fitness');
    
    // Delete existing user if exists
    await User.deleteOne({ email: 'user@test.com' });
    
    // Create new test user
    const testUser = new User({
      email: 'user@test.com',
      password: 'user123',
      role: 'user',
      isVerified: true,
      profile: {
        name: 'Test User'
      }
    });
    
    await testUser.save();
    console.log('✅ Test user created successfully!');
    console.log('Email: user@test.com');
    console.log('Password: user123');
    console.log('Role:', testUser.role);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser();