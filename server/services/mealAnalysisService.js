import { callGeminiAPIText } from './aiService.js';

export const analyzeMeal = async (meal, userProfile) => {
  const { totalNutrition, items } = meal;
  const { medicalConditions, dietaryPreference, fitnessGoals, allergies } = userProfile;

  const foodList = items.map(item => 
    `${item.foodItem.name} (${item.quantity} ${item.servingSize})`
  ).join(', ');

  const prompt = `Analyze this meal for health and nutrition:

Meal Items: ${foodList}

Total Nutrition:
- Calories: ${totalNutrition.calories}
- Protein: ${totalNutrition.protein}g
- Carbs: ${totalNutrition.carbs}g
- Fats: ${totalNutrition.fats}g
- Sugar: ${totalNutrition.sugar}g

User Profile:
- Medical Conditions: ${medicalConditions?.join(', ') || 'None'}
- Dietary Preference: ${dietaryPreference || 'None'}
- Fitness Goals: ${fitnessGoals?.join(', ') || 'None'}
- Allergies: ${allergies?.join(', ') || 'None'}

Provide analysis in JSON format:
{
  "isHealthy": true/false,
  "score": 0-100,
  "warnings": ["warning1", "warning2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "alternatives": [
    {
      "originalItem": "white rice",
      "suggestedItem": "brown rice",
      "reason": "Better for blood sugar control"
    }
  ]
}`;

  try {
    const result = await callGeminiAPIText(prompt);
    if (!result) {
      return generateFallbackAnalysis(meal, userProfile);
    }

    // Parse JSON from response
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return generateFallbackAnalysis(meal, userProfile);
  } catch (error) {
    console.error('❌ Meal analysis error:', error.message);
    return generateFallbackAnalysis(meal, userProfile);
  }
};

const generateFallbackAnalysis = (meal, userProfile) => {
  const { totalNutrition } = meal;
  const warnings = [];
  const suggestions = [];
  let score = 80;

  // Check for high sugar
  if (totalNutrition.sugar > 30) {
    warnings.push('High sugar content detected');
    suggestions.push('Reduce sugar intake or choose sugar-free alternatives');
    score -= 15;
  }

  // Check for high calories
  if (totalNutrition.calories > 800) {
    warnings.push('High calorie meal');
    suggestions.push('Consider reducing portion sizes');
    score -= 10;
  }

  // Check for diabetes
  if (userProfile.medicalConditions?.includes('diabetes')) {
    if (totalNutrition.carbs > 60) {
      warnings.push('High carbohydrate content - risky for diabetes');
      suggestions.push('Replace refined carbs with whole grains');
      score -= 20;
    }
  }

  // Check for low protein
  if (totalNutrition.protein < 15) {
    warnings.push('Low protein content');
    suggestions.push('Add protein-rich foods like chicken, fish, or legumes');
    score -= 10;
  }

  return {
    isHealthy: score >= 60,
    score: Math.max(0, score),
    warnings,
    suggestions,
    alternatives: []
  };
};


