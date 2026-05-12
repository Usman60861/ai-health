// Fix users with missing passwords
import mongoose from 'mongoose';
import User from './models/User.js';

async function fixUsers() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ai-health-fitness');
    
    // Find users with missing passwords
    const usersWithoutPassword = await User.find({
      $or: [
        { password: { $exists: false } },
        { password: null },
        { password: '' }
      ]
    });
    
    console.log('🔧 Found users with missing passwords:', usersWithoutPassword.length);
    
    for (const user of usersWithoutPassword) {
      console.log(`Fixing user: ${user.email}`);
      
      // Set a default password
      user.password = 'password123';
      await user.save();
      
      console.log(`✅ Fixed password for: ${user.email}`);
      console.log(`   New password: password123`);
    }
    
    // Also create a simple test for existing users
    console.log('\n📋 Login credentials for existing users:');
    console.log('1. usman1338734@gmail.com - (original password)');
    console.log('2. usman1627545@gmail.com - password123 (fixed)');
    console.log('3. usmanahmad60861@gmail.com - (original password)');
    console.log('4. usman2538734@gmail.com - (original password)');
    console.log('5. usman555487@gmail.com - (original password)');
    console.log('6. u25432740@gmail.com - (original password)');
    console.log('7. ua831855@gmail.com - (original password)');
    console.log('8. usman6086127@gmail.com - (original password)');
    console.log('9. moeezjamil55@gmail.com - password123 (fixed)');
    console.log('10. user@test.com - user123');
    console.log('11. admin@test.com - admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing users:', error);
    process.exit(1);
  }
}

fixUsers();