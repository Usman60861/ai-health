import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory name and load .env from root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

import { GoogleGenerativeAI } from "@google/generative-ai";

// Direct GoogleGenerativeAI usage - clean and simple

// Central API call function for JSON responses
const callGeminiAPI = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not configured');
    return null;
  }

  try {
    console.log('🤖 Calling Gemini API...');
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const result = await model.generateContent(prompt + '\n\nIMPORTANT: Return ONLY valid JSON, no markdown formatting or explanations.');
    const text = result.response.text();
    
    console.log('✅ Gemini API response received');
    
    // Better JSON extraction - find first { to last }
    try {
      const startIndex = text.indexOf('{');
      const endIndex = text.lastIndexOf('}');
      if (startIndex !== -1 && endIndex !== -1) {
        const jsonText = text.substring(startIndex, endIndex + 1);
        const parsed = JSON.parse(jsonText);
        console.log('✅ JSON parsed successfully');
        return parsed;
      }
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError.message);
      console.log('Raw response:', text.substring(0, 200) + '...');
    }
    
    return null;
  } catch (err) {
    console.error("❌ Gemini Error:", err.message);
    return null;
  }
};

// Central API call function for text responses (chat)
export const callGeminiAPIText = async (prompt) => {
  console.log("🔍 API KEY:", process.env.GEMINI_API_KEY ? "EXISTS" : "MISSING");
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not configured');
    return null;
  }

  try {
    console.log('🤖 Calling Gemini API for chat...');
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    console.log('✅ Gemini chat response received');
    return response;
  } catch (err) {
    console.error("❌ Gemini Error:", err.message);
    return null;
  }
};

export const generateDietPlan = async (userProfile, budgetPreference = 'medium') => {
  const budgetGuidelines = {
    low: 'Focus on budget-friendly foods under 50 PKR per serving: Rice, Lentils, Eggs, Seasonal vegetables, Local fruits, Basic proteins like chicken. Avoid expensive items.',
    medium: 'Include moderately priced foods 50-150 PKR per serving: Chicken breast, Greek yogurt, Fresh vegetables, Quality fruits, Dairy products. Balance cost and nutrition.',
    high: 'Include premium foods above 150 PKR per serving: Salmon, Avocado, Nuts, Organic foods, Superfoods, High-quality proteins. Focus on optimal nutrition.'
  };

  const prompt = `Generate a personalized daily diet plan for:
Age: ${userProfile.age}, Gender: ${userProfile.gender}
Weight: ${userProfile.weight}kg, Height: ${userProfile.height}cm
Activity: ${userProfile.activityLevel}
Medical Conditions: ${userProfile.medicalConditions?.join(', ') || 'None'}
Allergies: ${userProfile.allergies?.join(', ') || 'None'}
Dietary Preference: ${userProfile.dietaryPreference}
Goals: ${userProfile.fitnessGoals?.join(', ')}

BUDGET PREFERENCE: ${budgetPreference.toUpperCase()}
${budgetGuidelines[budgetPreference]}

Provide a JSON response with:
{
  "dailyCalories": number,
  "meals": {
    "breakfast": { "name": "", "items": [{"food": "", "quantity": "", "calories": 0, "protein": 0, "carbs": 0, "fats": 0}], "totalCalories": 0, "reason": "" },
    "lunch": {...},
    "dinner": {...},
    "snacks": [{...}]
  },
  "waterIntake": "liters per day",
  "supplements": [],
  "foodsToAvoid": []
}`;

  console.log('🤖 Calling Gemini AI for diet plan generation...');
  console.log('📋 User Profile:', { age: userProfile.age, weight: userProfile.weight, conditions: userProfile.medicalConditions });
  
  const result = await callGeminiAPI(prompt);
  
  if (result) {
    console.log('✅ Successfully parsed AI diet plan');
    return result;
  }
  
  console.log('⚠️ Using fallback diet plan');
  return generateFallbackDietPlan(userProfile);
};

export const generateWorkoutPlan = async (userProfile, level, location, limitations) => {
  const prompt = `Generate a weekly workout plan for:
Level: ${level}
Location: ${location}
Age: ${userProfile.age}, Gender: ${userProfile.gender}
Goals: ${userProfile.fitnessGoals?.join(', ')}
Limitations: ${limitations?.join(', ') || 'None'}

Provide JSON:
{
  "weeklySchedule": [
    {
      "day": "Monday",
      "exercises": [{"name": "", "sets": 0, "reps": "", "restTime": "", "instructions": ""}],
      "duration": "",
      "focus": ""
    }
  ]
}`;

  console.log('🤖 Calling Gemini AI for workout plan generation...');
  console.log('📋 User Profile:', { age: userProfile.age, level, location, limitations });
  
  const result = await callGeminiAPI(prompt);
  
  if (result) {
    console.log('✅ Successfully parsed AI workout plan');
    return result;
  }
  
  console.log('⚠️ Using fallback workout plan');
  return generateFallbackWorkoutPlan(level);
};

export const chatWithAI = async (userProfile = {}, message, history = []) => {
  // Handle case where profile might be undefined or incomplete
  const age = userProfile?.age || 'Not specified';
  const conditions = userProfile?.medicalConditions?.join(', ') || 'None';
  const allergies = userProfile?.allergies?.join(', ') || 'None';
  const diet = userProfile?.dietaryPreference || 'Not specified';
  
  const systemPrompt = `You are a comprehensive HEALTH & FITNESS ASSISTANT. User profile:
Age: ${age}, Medical Conditions: ${conditions}
Allergies: ${allergies}
Dietary Preference: ${diet}

You provide FULL health guidance including:
✅ Complete diet plans and nutrition advice
✅ Exercise routines and workout plans  
✅ Weight loss/gain strategies
✅ Mental health and stress management
✅ Sleep optimization tips
✅ Supplement recommendations
✅ Lifestyle modifications
✅ Medical condition management
✅ Long-term health planning

You can have detailed conversations, remember context, and provide comprehensive guidance. Be friendly, supportive, and thorough in your responses.

Note: For quick food database queries, users can use the Food Database Assistant. You handle everything else related to health and fitness.`;

  const fullPrompt = `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`;

  console.log('🤖 Using Gemini for chat...');
  console.log('🤖 API Key exists:', !!process.env.GEMINI_API_KEY);
  
  const result = await callGeminiAPIText(fullPrompt);
  
  if (result) {
    console.log('✅ Gemini chat response received');
    return result;
  }
  
  return "I'm having trouble connecting to the AI service right now. Please try again in a moment, or rephrase your question.";
};

const generateFallbackDietPlan = (profile) => ({
  dailyCalories: 2000,
  meals: {
    breakfast: {
      name: 'Healthy Breakfast',
      items: [
        { food: 'Oatmeal', quantity: '1 cup', calories: 150, protein: 5, carbs: 27, fats: 3 },
        { food: 'Banana', quantity: '1 medium', calories: 105, protein: 1, carbs: 27, fats: 0 },
        { food: 'Almonds', quantity: '28g', calories: 160, protein: 6, carbs: 6, fats: 14 },
        { food: 'Greek Yogurt', quantity: '1 cup', calories: 100, protein: 17, carbs: 6, fats: 0 }
      ],
      totalCalories: 515,
      reason: 'High fiber and protein start to keep you energized'
    },
    lunch: {
      name: 'Balanced Lunch',
      items: [
        { food: 'Grilled Chicken Breast', quantity: '150g', calories: 250, protein: 30, carbs: 0, fats: 10 },
        { food: 'Brown Rice', quantity: '1 cup', calories: 215, protein: 5, carbs: 45, fats: 2 },
        { food: 'Spinach Salad', quantity: '2 cups', calories: 14, protein: 2, carbs: 2, fats: 0 },
        { food: 'Olive Oil Dressing', quantity: '1 tbsp', calories: 120, protein: 0, carbs: 0, fats: 14 }
      ],
      totalCalories: 599,
      reason: 'Protein and complex carbs for sustained energy'
    },
    dinner: {
      name: 'Light Dinner',
      items: [
        { food: 'Grilled Salmon', quantity: '150g', calories: 280, protein: 25, carbs: 0, fats: 20 },
        { food: 'Steamed Vegetables', quantity: '2 cups', calories: 80, protein: 4, carbs: 16, fats: 1 },
        { food: 'Quinoa', quantity: '1/2 cup', calories: 111, protein: 4, carbs: 20, fats: 2 }
      ],
      totalCalories: 471,
      reason: 'Light but nutritious dinner with omega-3 fatty acids'
    },
    snacks: [
      {
        name: 'Evening Snack',
        items: [
          { food: 'Apple', quantity: '1 medium', calories: 95, protein: 0, carbs: 25, fats: 0 },
          { food: 'Peanut Butter', quantity: '2 tbsp', calories: 190, protein: 8, carbs: 7, fats: 16 }
        ],
        totalCalories: 285,
        reason: 'Healthy fats and natural sugars for energy'
      }
    ]
  },
  waterIntake: '2-3 liters',
  supplements: ['Multivitamin', 'Vitamin D (if needed)'],
  foodsToAvoid: ['Processed foods', 'Sugary drinks', 'Deep fried items', 'Excessive salt']
});

const generateFallbackWorkoutPlan = (level) => ({
  weeklySchedule: [
    {
      day: 'Monday',
      exercises: [
        { name: 'Push-ups', sets: 3, reps: '10-15', restTime: '60s', instructions: 'Keep back straight, core engaged' },
        { name: 'Squats', sets: 3, reps: '15-20', restTime: '60s', instructions: 'Keep knees behind toes' }
      ],
      duration: '30 mins',
      focus: 'Upper body & Legs'
    },
    {
      day: 'Tuesday',
      exercises: [
        { name: 'Jogging', sets: 1, reps: '20 mins', restTime: '0s', instructions: 'Moderate pace' }
      ],
      duration: '20 mins',
      focus: 'Cardio'
    },
    {
      day: 'Wednesday',
      exercises: [
        { name: 'Plank', sets: 3, reps: '30-60s', restTime: '60s', instructions: 'Keep body straight' },
        { name: 'Lunges', sets: 3, reps: '10 each leg', restTime: '60s', instructions: 'Alternate legs' }
      ],
      duration: '25 mins',
      focus: 'Core & Legs'
    },
    {
      day: 'Thursday',
      exercises: [
        { name: 'Rest Day', sets: 0, reps: 'N/A', restTime: 'N/A', instructions: 'Light stretching or yoga' }
      ],
      duration: '15 mins',
      focus: 'Recovery'
    },
    {
      day: 'Friday',
      exercises: [
        { name: 'Burpees', sets: 3, reps: '8-12', restTime: '90s', instructions: 'Full body movement' },
        { name: 'Mountain Climbers', sets: 3, reps: '20', restTime: '60s', instructions: 'Fast pace' }
      ],
      duration: '30 mins',
      focus: 'Full Body'
    },
    {
      day: 'Saturday',
      exercises: [
        { name: 'Cycling or Swimming', sets: 1, reps: '30 mins', restTime: '0s', instructions: 'Steady pace' }
      ],
      duration: '30 mins',
      focus: 'Cardio'
    },
    {
      day: 'Sunday',
      exercises: [
        { name: 'Rest Day', sets: 0, reps: 'N/A', restTime: 'N/A', instructions: 'Complete rest or light walk' }
      ],
      duration: '0 mins',
      focus: 'Recovery'
    }
  ]
});
