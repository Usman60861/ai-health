import { readFileSync } from 'fs';

// Read .env file manually
const envContent = readFileSync('.env', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=:#]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

console.log('\n🔍 Email Configuration Check\n');
console.log('='.repeat(50));

// Check EMAIL_USER
if (envVars.EMAIL_USER) {
  console.log('✅ EMAIL_USER:', envVars.EMAIL_USER);
} else {
  console.log('❌ EMAIL_USER: Not set');
}

// Check EMAIL_PASSWORD
if (envVars.EMAIL_PASSWORD) {
  console.log('✅ EMAIL_PASSWORD: Set (length:', envVars.EMAIL_PASSWORD.length, 'chars)');
  
  // Check if it looks like an app password (16 chars without spaces, or 19 with spaces)
  const cleanPassword = envVars.EMAIL_PASSWORD.replace(/\s/g, '');
  if (cleanPassword.length === 16) {
    console.log('   ✅ Looks like a valid App Password format');
  } else {
    console.log('   ⚠️  Warning: App Password should be 16 characters');
    console.log('   Current length (without spaces):', cleanPassword.length);
  }
} else {
  console.log('❌ EMAIL_PASSWORD: Not set');
}

// Check CLIENT_URL
if (envVars.CLIENT_URL) {
  console.log('✅ CLIENT_URL:', envVars.CLIENT_URL);
} else {
  console.log('⚠️  CLIENT_URL: Not set (will use default)');
}

console.log('='.repeat(50));

// Overall status
const allSet = envVars.EMAIL_USER && envVars.EMAIL_PASSWORD;

if (allSet) {
  console.log('\n✅ Email configuration looks good!');
  console.log('\n📝 Next steps:');
  console.log('   1. Run: cd server && npm run test-email');
  console.log('   2. Check your inbox (and spam folder)');
  console.log('   3. If test passes, restart server: npm start');
  console.log('   4. Try signup flow\n');
} else {
  console.log('\n❌ Email configuration incomplete!');
  console.log('\n📝 Setup steps:');
  console.log('   1. Go to: https://myaccount.google.com/security');
  console.log('   2. Enable 2-Step Verification');
  console.log('   3. Generate App Password');
  console.log('   4. Update .env file with credentials');
  console.log('   5. Run this check again\n');
  console.log('See EMAIL_SETUP_URDU.md for detailed instructions\n');
}
