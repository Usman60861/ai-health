import dotenv from 'dotenv';
import { callGeminiAPIText, chatWithAI } from './services/aiService.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function testAI() {
  console.log('🧪 Testing Gemini AI Integration...');
  console.log('🔑 API Key configured:', !!process.env.GEMINI_API_KEY);
  
  try {
    // Test simple text generation
    console.log('\n📝 Testing simple text generation...');
    const response = await callGeminiAPIText('Say hello and confirm you are working correctly. Keep it brief.');
    
    if (response) {
      console.log('✅ AI Response:', response);
    } else {
      console.log('❌ No response received');
    }
    
    // Test chat function
    console.log('\n💬 Testing chat function...');
    const chatResponse = await chatWithAI({}, 'What is a healthy breakfast?');
    
    if (chatResponse) {
      console.log('✅ Chat Response:', chatResponse.substring(0, 200) + '...');
    } else {
      console.log('❌ No chat response received');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAI();