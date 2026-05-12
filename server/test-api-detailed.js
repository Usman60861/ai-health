import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function testAPIDetailed() {
  console.log('🔍 Detailed Gemini API Test');
  console.log('🔑 API Key:', process.env.GEMINI_API_KEY?.substring(0, 10) + '...');
  console.log('🔑 API Key Length:', process.env.GEMINI_API_KEY?.length);
  
  try {
    // Initialize the client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('✅ GoogleGenerativeAI client created');
    
    // Try different models
    const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
    
    for (const modelName of models) {
      try {
        console.log(`\n🤖 Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const result = await model.generateContent("Say hello in one word");
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ ${modelName} works! Response:`, text);
        break; // If one works, we're good
        
      } catch (error) {
        console.log(`❌ ${modelName} failed:`, error.message.substring(0, 100) + '...');
      }
    }
    
  } catch (error) {
    console.error('❌ Client creation failed:', error.message);
    
    // Check common issues
    if (error.message.includes('API key not valid')) {
      console.log('\n🔧 Troubleshooting steps:');
      console.log('1. Make sure you created the API key at: https://aistudio.google.com/app/apikey');
      console.log('2. Check if the API key has proper permissions');
      console.log('3. Wait a few minutes for the key to activate');
      console.log('4. Make sure billing is enabled if required');
    }
  }
}

testAPIDetailed();