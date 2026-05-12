// Check existing users in database
import mongoose from 'mongoose';
import User from './models/User.js';

async function checkUsers() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ai-health-fitness');
    
    const users = await User.find({});
    console.log('📋 All users in database:');
    console.log('Total users:', users.length);
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. User:`);
      console.log('   Email:', user.email);
      console.log('   Role:', user.role);
      console.log('   Verified:', user.isVerified);
      console.log('   Created:', user.createdAt);
      console.log('   Password Hash:', user.password ? 'Set' : 'Missing');
      console.log('   Profile Name:', user.profile?.name || 'Not set');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking users:', error);
    process.exit(1);
  }
}

checkUsers();