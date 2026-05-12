import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

import { sendVerificationEmail } from './services/emailService.js';

const testEmail = async () => {
  console.log('🧪 Testing Email Service...\n');
  
  console.log('Configuration:');
  console.log('  EMAIL_USER:', process.env.EMAIL_USER || '❌ Not set');
  console.log('  EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Not set');
  console.log('  CLIENT_URL:', process.env.CLIENT_URL || 'http://localhost:5173');
  console.log('');

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('❌ Email configuration missing!');
    console.log('Please add EMAIL_USER and EMAIL_PASSWORD to .env file');
    console.log('See EMAIL_SETUP_URDU.md for setup instructions');
    process.exit(1);
  }

  const testEmailAddress = process.env.EMAIL_USER; // Send to yourself
  const testCode = '123456';

  console.log(`📧 Sending test email to: ${testEmailAddress}`);
  console.log(`🔢 Test code: ${testCode}\n`);

  try {
    const result = await sendVerificationEmail(testEmailAddress, testCode);
    
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('📬 Check your inbox (and spam folder)');
      console.log(`📨 Message ID: ${result.messageId}`);
    } else {
      console.log('❌ Email sending failed!');
      console.log('Error:', result.error);
    }
  } catch (error) {
    console.log('❌ Test failed!');
    console.log('Error:', error.message);
  }
};

testEmail();
